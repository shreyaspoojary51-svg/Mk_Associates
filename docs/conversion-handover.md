# Conversion implementation — final handoff

## Outcome / owned files

Implemented estimator, room/palette/material configurator, four-step contact, actual PDF download, and production Resend + authenticated Sheets/private Drive delivery code. Source is frozen. No GitHub push; no package/global CSS/layout/home edits by this agent. Parent made final curated-label/room/allowance enhancements and production hosting cap decisions.

Owned paths completed:
- `src/app/{estimator,configure,contact}/**`, including legacy `/contact/thank-you` redirect.
- `src/app/actions.ts`.
- `src/components/tools/{Estimator,Configurator,ContactForm,ProposalDownload,ProposalDocument,AntiSpam}.tsx`.
- `src/components/tools/{tools.module.css,session.ts,README.md}`.
- `src/lib/{estimate,lead-schema}.ts`, `tests/estimate.test.ts`.

Routes inherit parent's main landmark and title template (no nested main or duplicate suffix). Contact uses parent's canonical `/thank-you?demo=1|0&receipt=UUID`.

## Features

Estimator: exported pure `calculateEstimate`; INR2,500/3,800/5,200 rates, BHK/commercial plus legacy property types, area150–25,000sqft; seven explicit Mumbai/project allowances; ±15% range; exact-sum10/30/35/20/5 milestones; indicative90–140execution days after sign-off/site readiness. Tax/appliance/loose furniture/deposit exclusions and nonquotation wording. WhatsApp URL only with valid configured number; otherwise contact fallback.

Configurator:5room choices including Café; palettes/materials; reduced-motion-aware Framer Motion photographic collage with supplied interiors/material imagery; honest reference-collage-not-render label. Choice sessionStorage restored, rawUTF8 bounded16KiB beforeJSON parse. URL presets `earth→Earth&olive/Walnut`, `stone→Monochrome/Stone`, `calm→Coastalcalm/Texturedplaster` override stored palette/material while retaining room. Unknown presets ignored. Contact-query summary bounded16KiB then2,000chars; exact known concierge intents prefill note only.

Contact:4-step RHF/Zod; stable control labels/descriptions/focus; explicit contact-only consent, honeypot, bounded input, optional4 JPG/PNG/WebP/PDF references. **CURRENT DEPLOYED CAP:4MB combined (also max4MB perfile)**. Parent reduced the originally requested10MB ceiling because hosted function request bodies have a lower hard limit; Next's12MB parser config does not override that. Larger10MB support requires a future direct-to-private-storage upload adapter; none is falsely claimed implemented. Client/server/errorcopy and receiver example align to4MB. Server validates MIME and byte signatures/terminal markers; not antivirus/deep content scanning.

PDF: actual serveraction/react-pdf file, ASCII INR currency (no unsupported rupee glyph), readable11ptbody and10ptnote/footer. All7addons+25,000sqft+Café/fullbrief fits oneA4page via compact2ptrowpadding only when>5addons. Normal rows4pt. Rendered and visually checked with accurate range/milestones and no overlap/orphan note. Optional email is genuinely Turnstile-gated; never reported as delivered without provider confirmation.

## Production env / exact receiver contract

Private credentials only in serveractions, never NEXT_PUBLIC or browser responses:
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: public optional international digits, optional leading+,8–15digits total. Invalid/missing means no WhatsApp URL.
- `RESEND_API_KEY`: private key.
- `RESEND_FROM_EMAIL`: real verified sender, no invented default.
- `LEAD_NOTIFICATION_EMAIL`: real studio enquiry recipient. All3 required for leadmail. PDFmail uses key/from plus genuine Turnstile verification; studio recipient not required for PDF.
- `SHEETS_WEBHOOK_URL`: private HTTPS endpoint.
- `SHEETS_WEBHOOK_SECRET`: shared private token.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`: matched actual Cloudflare keys and allowed deployment hostnames. Contact action=`project_enquiry`; PDFemail action=`proposal_email`. Server validates success/action/Origin hostname. Incomplete pair fails contact closed; PDF download remains available, email refused.

Webhook: POST JSON `{webhookToken,receiptId,submittedAt,name,email,phone,propertyType,location,area,budget,timeline,message,summary,consent:true,attachments:[{filename,contentType,base64}]}` plus `Authorization: Bearer SECRET`. Receiver must never store/return token. HTTP2xx alone is not success; parsedJSON `{ok:true}` required only after durable persistence. Other redirects rejected; AppsScript302/303 only to HTTPS `*.googleusercontent.com`, followed with a separateGET and no forwarded credentials/body.

`src/components/tools/README.md` contains complete runnable AppsScript handler: Script Properties `SHEET_ID`, `WEBHOOK_SECRET`, `UPLOAD_FOLDER_ID`; authenticated WebApp, safe spreadsheet cell prefixing, private Drive files,4MB limit, receipt idempotency/lock, failure cleanup. Deploy executed as owner and authenticated by shared token; allow-public WebApp may be blocked by workspace policy. Alternative authenticated gateway must implement same contract. Keep folder private. Parent may copy these exact env/contract notes into docs/integrations.md.

## Truthful modes / safety

- No delivery config→explicit demo receipt; no email/enquiry/file saved or sent.
- Incomplete config→error, not false demo-success.
- Complete configured service(s)→actual Resend/webhook calls. Mail success only after Resend ID; inbox delivery not guaranteed. Webhook success only durable acknowledgement.
- One service accepted and another failed→explicit partial receipt + repeat submission disabled. None confirmed→error, no fake notification claim.
- PDF generation is real without email. Email copies refused without valid Turnstile, limited3/hour/IP AND3/hour/email+IP, plus general6actions/10min. UI disables email entry when public verification key absent. Failed/unconfigured/rate-limited mail reported clearly; PDF still downloads.
- Next ServerActions provide Origin/Host CSRF protection. Honeypot and hashedIP in-memory limits are best effort, not distributed/durable. Use trusted proxy headers, production WAF/distributed limits and genuine Turnstile. Add receiver malware scanning/retention policy as needed; never serve uploaded content inline as trusted.
- No contact PII persistence in browser storage or server logs; only design/estimate choices stored. No secret/PII/file payload logs. Turnstile tokens omitted from mail/Sheet record.
- Node runtime; no live Resend/Sheets/Drive/Turnstile credentials were tested or provisioned. Deployment owner must supply real credentials/domain/receiver/privacy disclosures. Integration is working production code, not a delivery stub.

## Verification / real bug fixes

PASS: final strictTS, owned ESLint zero warnings, nodeassert/tsx estimate tests (tiers/range/addons/dedup/bounds/nonfinite/decimal/milestone sums/configured-onlyWhatsApp).

PASS: fresh production `/data/conversion-qa-results.json`:
- Physical clicks through all4steps, initial validation, correctedphone progression, explicit consent validation and canonical demo receipt.
- Real serveraction PDFBlob **4028bytes**, actual download, pdftotext INRvalues verified; zeroemail/webhook sends.
- All3curatedURLpresets, restoredbrief, knownintentprefill, oversized/malformed session fallback.
- Explicit blockedStorage(SecurityError) fallback notice, estimator default1000,0JSerrors.
- Three routes each1main/one title suffix,0pageerrors,0brokenimages,0desktop-or390overflow.
- All12light/dark desktop1440/mobile390 screenshots individually visually inspected; additional validation/steps2–4/demo receipts inspected. Files `/data/tools-*.png`. Real max7PDF `/data/conversion-pdf-max7-fixed.png` inspected onepage with no overlaps/footer collision.

Fixed actual production UX issue: onTouched blur cleared lastphone error and shifted Continue between mouse-down/up, losing firstclick. Changed validationonChange, stable separate label/id and permanent20px namederrorlines with margin compensation. Fresh physical smoke passed after fix.

Fixed actual attachment UX issue found by no-submit QA: Remove cleared Reactstate but nativefileinput stillheldfile; rejected optionalfile had noClear. Added uploadref/nativevalue reset/focus return; Remove also shown for errors. This enables samefile reselection and rejection recovery. **Final upload-only regression pending parent's rebuilt production startup**; script `/data/conversion-upload-qa.cjs` expects afterRemove0, oversizeClearButton1, cleared rejection/nativecontrol and physicalContinue to review. No submission/email in that regression. All source/static checks after resetfix passed. Do not claim this last runtime regression passed until its final log does.

QA uses isolated CDP contexts/tabs, real localhostproxy fetches (not mocked backend), closes only created pages/context and never alters parentserver. Own temporary3106 preview descendants terminated earlier. No more source changes planned.
