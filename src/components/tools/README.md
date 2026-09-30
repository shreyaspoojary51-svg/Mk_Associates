# Conversion tools — production integration

These tools have no hardcoded contact address or number. All private credentials remain in `src/app/actions.ts` on the server. Never prefix private environment variables with `NEXT_PUBLIC_`.

## Environment

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: optional international number, digits only (or leading `+`), no spaces. If absent or invalid, WhatsApp links are omitted; contact form remains available.
- `RESEND_API_KEY`: private production Resend API key.
- `RESEND_FROM_EMAIL`: a sender on your verified Resend domain. Supply the real address; none is invented in code.
- `LEAD_NOTIFICATION_EMAIL`: actual studio recipient. All three email settings must be present to enable enquiry email. The sender/key pair enables optional PDF-copy email only when genuine Turnstile verification is also configured.
- `SHEETS_WEBHOOK_URL`: private HTTPS receiver endpoint. Must persist the record before acknowledging `{ "ok": true }`.
- `SHEETS_WEBHOOK_SECRET`: private shared authentication secret. Sent only server-to-server, as `Authorization: Bearer ...` and `webhookToken` in the JSON body (Apps Script cannot inspect arbitrary request headers). Never save this token into the sheet or return it.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: optional matched Cloudflare Turnstile keys. Register production/staging hostnames. If either is configured without the other, enquiries fail closed. Server verification checks the action `project_enquiry` (contact) or `proposal_email` (PDF email), matching origin hostname and success. Not a CAPTCHA stub. Update the site's privacy information to disclose Cloudflare if enabled.

Restart/redeploy after configuring env. Public variables are baked into the client build. Use staging credentials for staging; never run a real enquiry as an automated QA test.

### Delivery semantics

- No enquiry-delivery configuration: a **demo receipt**, no email, record or file persisted.
- Incomplete email/webhook configuration: clear error, not demo success.
- One or both complete integrations: actual production API requests. An email is "accepted" only after Resend returns an ID. This does not guarantee inbox delivery.
- Webhook success: HTTPS response **and** JSON `{ "ok": true }`; a 200 status by itself is not success.
- Partial acceptance: the form states that one service accepted and another failed; keeps a reference and disables another submission to reduce duplicates.
- PDF generation is real even in demo mode. Optional email copy is only reported as sent/accepted when Resend confirms it; otherwise the UI explicitly says email not configured, verification required, rate limited, or failed. PDF email never sends without valid Turnstile, and is limited to three messages per hour per IP and per email+IP pair.
- No local storage of personal contact values. Session storage contains design/estimate choices only, bounded to 16 KiB UTF-8 before JSON parsing. Contact query input has the same pre-use bound and is trimmed to a 2,000-character summary. Query strings contain planning choices, not contact credentials. Server logs never print lead payloads, file contents or keys.

## Google Sheets + private Drive receiver (Apps Script)

Create a spreadsheet and a **private** Drive folder for uploads. Create a bound Apps Script or standalone script; set Script Properties `SHEET_ID`, `WEBHOOK_SECRET`, and `UPLOAD_FOLDER_ID` (only needed when files are uploaded). `WEBHOOK_SECRET` must match `SHEETS_WEBHOOK_SECRET`. Paste this runnable handler, deploy as a Web App executed as the owner, and allow access to anyone **because the handler authenticates every request itself**. Store the deployment's `/exec` URL as `SHEETS_WEBHOOK_URL`. Do not share the Drive folder publicly. Workspace policies may prevent public Apps Script web apps; in that case use an authenticated HTTPS gateway implementing the same contract.

```js
function doPost(e) {
  var created = [], lock = LockService.getScriptLock();
  function reply(ok) { return ContentService.createTextOutput(JSON.stringify({ok:ok})).setMimeType(ContentService.MimeType.JSON); }
  function safe(value) { var text=String(value == null ? '' : value); return /^[=+@\-]/.test(text) ? "'"+text : text; }
  try {
    if (!e || !e.postData || e.postData.contents.length > 6 * 1024 * 1024) return reply(false);
    var props=PropertiesService.getScriptProperties(), data=JSON.parse(e.postData.contents);
    if (!props.getProperty('WEBHOOK_SECRET') || data.webhookToken !== props.getProperty('WEBHOOK_SECRET')) return reply(false);
    if (!/^[a-f0-9-]{36}$/.test(data.receiptId) || data.consent !== true) return reply(false);
    if (!lock.tryLock(10000)) return reply(false);
    var book=SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
    var sheet=book.getSheetByName('Enquiries') || book.insertSheet('Enquiries');
    if (sheet.getLastRow()===0) sheet.appendRow(['Receipt','Submitted UTC','Name','Email','Phone','Property','Locality','Area sq ft','Budget','Timing','Note','Planning brief','Consent','Private files']);
    if (sheet.getLastRow()>1 && sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(data.receiptId).matchEntireCell(true).findNext()) return reply(true);
    var uploads=data.attachments || [], links=[], total=0;
    if (!Array.isArray(uploads) || uploads.length>4) return reply(false);
    var folder=uploads.length ? DriveApp.getFolderById(props.getProperty('UPLOAD_FOLDER_ID')) : null;
    uploads.forEach(function(file) {
      if (['image/jpeg','image/png','image/webp','application/pdf'].indexOf(file.contentType)<0 || !/^[a-zA-Z0-9_.-]{1,80}$/.test(file.filename)) throw new Error('Invalid file');
      var bytes=Utilities.base64Decode(file.base64); total+=bytes.length;
      if (total>4*1024*1024) throw new Error('Oversized upload');
      var saved=folder.createFile(Utilities.newBlob(bytes,file.contentType,data.receiptId+'-'+file.filename));
      created.push(saved); links.push(saved.getUrl());
    });
    sheet.appendRow([data.receiptId,data.submittedAt,data.name,data.email,data.phone,data.propertyType,data.location,data.area,data.budget,data.timeline,data.message,data.summary,'yes',links.join('\n')].map(safe));
    SpreadsheetApp.flush();
    return reply(true);
  } catch (error) {
    // Do not print the request, token, PII or file contents.
    created.forEach(function(file) { try { file.setTrashed(true); } catch (_) {} });
    return reply(false);
  } finally { try {lock.releaseLock();} catch (_) {} }
}
```

The server follows only Apps Script's HTTPS `*.googleusercontent.com` content response redirect using a GET with **no forwarded credentials/body**. Other redirects fail closed. The gateway approach should accept the bearer header and reject any invalid token. Receiver must not share uploaded files publicly. Secure the endpoint against abuse; keep retention and deletion policies appropriate to your jurisdiction.

## Safety / limitations

Next Server Actions provide first-party Origin/Host CSRF validation. The enquiry also uses a hidden honeypot, bounded Zod fields, a per-instance hashed-IP limit (6 requests per 10 minutes), aggregate upload limit 4 MB, maximum four files, MIME allowlist, and server-side byte signatures (plus PDF/JPEG terminal markers). This is **not malware scanning** or a distributed rate limiter. For production, enable Turnstile and platform/WAF rate limiting across instances. Trust forwarded IP headers only behind the deployment's trusted proxy. Add upload malware scanning to the receiver if your risk policy requires it; never serve uploads inline as trusted content.

Next config retains `experimental.serverActions.bodySizeLimit: '12mb'` as a soft parser ceiling (parent supplies it); it does not override hosted function request limits. The current client/server cap is **4 MB combined** to stay below the hosted function request limit; a 10 MB workflow requires a future direct-to-private-storage upload adapter and is not implemented here. Server actions and PDF routes use Node runtime, not Edge. PDF uses built-in Helvetica/Times and writes currency as INR to avoid missing rupee glyphs. No marketing opt-in is bundled into contact consent. No external email or webhook delivery was tested against live credentials during build.

## Testing

Run `pnpm test` (parent supplies `tsx`) and `pnpm typecheck`. The pure `calculateEstimate` tests verify tiers, deduplicated allowances, range bounds, exact milestone sum, invalid inputs, decimals and configured-only WhatsApp fallback. UI supports reduced motion, keyboard controls, session restoration and explicit validation states. Visual QA artifacts/reports are recorded in `/data/conversion-agent-report.md`.
