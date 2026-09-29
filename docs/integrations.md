# Production integration contract

All keys stay in environment variables on the server. An unset configuration returns an explicitly labelled **demo receipt** and does not store or transmit lead data. Partially configured services return an error, not a false success.

## Business channels

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: approved international digits only, e.g. country code plus number. Do not use a fabricated value. The user sends the encoded message themselves in WhatsApp.
- `NEXT_PUBLIC_PHONE`: approved number for the mobile call action. Until configured, the action opens contact.
- A WhatsApp **notification** is not sent by this build. The notification adapter is intentionally a future integration stub, not a delivered feature.

## Email (Resend)

Configure `RESEND_API_KEY`, a verified `RESEND_FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL`. The server sends the enquiry and validated optional reference attachments to that recipient. A Resend message ID confirms provider acceptance, not inbox delivery or a booked consultation. The acknowledgement page never promises a response time.

Proposal-copy emails are gated by real Turnstile verification with action `proposal_email`, consent, per-IP and per-email/IP limits. PDF downloads remain available without sending an email. Without the email and anti-spam service configured, the UI makes unavailability clear.

## Google Sheets / attachment storage

Configure `SHEETS_WEBHOOK_URL` (HTTPS) and `SHEETS_WEBHOOK_SECRET`. The request is a JSON POST:

- `Authorization: Bearer <server-only secret>`
- Body includes `webhookToken` for an Apps Script adapter, `receiptId`, UTC submission time, validated lead fields and optional attachments with filename/MIME/base64.
- **Persist first**, then return `{ "ok": true }`. A plain HTTP 200 is not treated as durable storage confirmation.
- Validate the secret, enforce receipt-id deduplication, use private storage and restrict the spreadsheet/attachment folder to authorised staff.
- Do not log tokens, full file bodies or contact details. Define retention/deletion periods with the business.
- Apps Script ContentService may issue a one-time Google-hosted GET redirect. The code permits only that documented hostname path and never forwards credentials or the POST body on the redirect.

A runnable Apps Script receiver and setup notes are in `src/components/tools/README.md` when provided by the conversion workstream. For another receiver, implement the same contract; do not expose a generic unauthenticated append endpoint.

## Spam and uploads

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` enable a real Cloudflare Turnstile flow. Add only your approved domain/preview domains in Cloudflare. Server verifies success, expected action and hostname. Client tokens are not placed in receipts, Sheets or email.

Uploads: up to four files, 10MB **combined**, JPG/PNG/WebP/PDF, MIME plus signature checks. Do not accept identity/financial documents. Do not render uploaded PDFs or HTML on your website. Production should add malware scanning/private storage and shared platform/WAF rate limits. The built-in memory rate limiter is per-instance and is not a distributed abuse-prevention guarantee.

## Sanity

Set the public project ID/dataset. Invite approved editors and configure CORS for deployed origins. Public reads use published documents only; no write token is bundled. Image alt text is required. Explicit real-project status alone is insufficient without published media+alt.

`POST /api/revalidate`: authenticate using `Authorization: Bearer SANITY_REVALIDATE_SECRET`; request a supported tag/path invalidation according to the route implementation. Use a server-side publishing automation, not a browser-exposed webhook secret. Configured production CMS outages fail closed rather than restoring fictional seed content.

## Launch checklist

1. Replace illustrative portfolio content with approved real work or keep concept labels.
2. Confirm business contacts/address/social profiles and get legal approval.
3. Test actual Resend receipt, Sheets persistence, attachment access and failure/partial paths with authorised test data.
4. Validate CAPTCHA on the real deployment origin and configure shared abuse limits.
5. Deploy to a protected Vercel preview; verify mobile, keyboard and real-device performance.
6. Set canonical HTTPS origin and only then `NEXT_PUBLIC_LAUNCH_READY=true`.

## Vercel upload constraint

The shipped multipart enquiry path intentionally caps attachments at **4 MB combined** (up to four files), leaving room for metadata beneath Vercel’s documented 4.5 MB function request limit. Setting Next’s Server Action body limit to 12 MB does not override the hosting limit. The original requested upper limit was 10 MB; accepting larger files on Vercel requires an authenticated direct-to-private-storage upload flow, not forwarding those bytes through this action. Do not raise the cap without implementing that storage path. Official source: https://vercel.com/docs/functions/limitations.
