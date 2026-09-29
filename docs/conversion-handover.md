> Final deployment adjustment: the multipart upload cap is now 4 MB combined for Vercel compatibility. Historical checks below used the previous 10 MB local-development cap. The final cap and native-input reset are covered in the release regression. See integrations.md.

# Conversion implementation report

## Completed owned files

- `src/app/estimator/page.tsx`
- `src/app/configure/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/contact/thank-you/page.tsx` (legacy redirect only)
- `src/app/actions.ts`
- `src/components/tools/{Estimator,Configurator,ContactForm,ProposalDownload,ProposalDocument,AntiSpam}.tsx`
- `src/components/tools/{tools.module.css,session.ts,README.md}`
- `src/lib/{estimate,lead-schema}.ts`
- `tests/estimate.test.ts`

No package, shared global CSS/layout/home, other agents' components or GitHub changes made. No invented production phone/email. All routes inherit parent main landmark and title template. Canonical contact completion route is `/thank-you?demo=1|0&receipt=UUID`; parent owns that page.

## Features

Estimator: pure exported calculateEstimate; property types; essential/signature/bespoke INR2,500/3,800/5,200 per sq ft; area150–25,000; explicit optional Mumbai allowances; ±15% range; exact-sum10/30/35/20/5 milestones; indicative90–140 execution days. Prices/timing clearly nonbinding, exclude taxes/appliances/loose furniture/deposits. WhatsApp only if valid NEXT_PUBLIC_WHATSAPP_NUMBER; otherwise contact CTA only.

Configurator: room/palette/material chips, reduced-motion-aware Framer Motion photographic collage with supplied project1–8 +hero, truthful inspiration-not-render label, sessionStorage restored and bounded16KiB UTF-8 before parse, contact-query summary and real downloadable PDF. Estimate also joins PDF if saved. No fake AI concierge.

Contact:4-step RHF/Zod, accessible validation/focus, explicit contact-only consent, honeypot, bounded fields, optional four JPG/PNG/WebP/PDF files <=10MB combined; server checks MIME and byte signatures/terminal markers. Server-side credentials, actual Resend API and actual Sheets/private Drive webhook, authenticated payload, explicit missing-configuration/demo and partial/error states. No email/notification delivery is claimed without a service confirmation. A receipt is not a booking. Demo explicitly sends/saves nothing. Partial delivery prevents immediate repeated submission.

Proposal email: **will not send arbitrary-recipient mail without genuine Turnstile**; action/hostname/success checked server-side. PDF download works regardless.3/hour IP and3/hour email+IP, plus general6/10min action limit. Optional-email field disabled if public CAPTCHA key absent. Resend-accepted email is not guaranteed inbox delivery. CAPTCHA token never persisted in Sheets or mailed lead records.

## Exact env contract (parent can copy into docs/integrations.md)

- NEXT_PUBLIC_WHATSAPP_NUMBER: international numeric number, optional leading+,7–14 digits after first digit (8–15 overall); no spaces. Invalid/missing => no WhatsApp link.
- RESEND_API_KEY: private key.
- RESEND_FROM_EMAIL: verified sender address/domain, no hardcoded default.
- LEAD_NOTIFICATION_EMAIL: real recipient for studio enquiries. For lead email all3 required. For PDF email key/from pair **plus** Turnstile key pair and successful verification required.
- SHEETS_WEBHOOK_URL: private HTTPS POST endpoint; bearer auth + server-only `webhookToken` JSON property.
- SHEETS_WEBHOOK_SECRET: private shared token. Receiver must NOT store or return it.
- NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY: real matched Cloudflare keys, registered deployment hostnames. Action `project_enquiry` for contact, `proposal_email` for PDF. Incomplete pair => contact fails closed; PDF still downloads but email is refused.

Webhook JSON: `{ webhookToken, receiptId, submittedAt, name, email, phone, propertyType, location, area, budget, timeline, message, summary, consent:true, attachments:[{filename,contentType,base64}] }`. Authentication also `Authorization: Bearer SECRET`. Success must be HTTP2xx + parsedJSON `{ok:true}` **after durable persistence**, not just200. Non-Google redirects rejected. AppsScript302/303 content redirect is followed only to HTTPS `*.googleusercontent.com` with a separateGET and no forwarded credentials/body.

`src/components/tools/README.md` includes complete deployable AppsScript doPost receiver for Sheets + private Drive uploads with script-property auth, safe spreadsheet cell prefixing, file limits, idempotent receipt check/lock, private file links and failure cleanup. Parent can reuse this in integration docs. AppsScript requires allow-public webapp policy because handler handles shared-secret authentication. Credentials never browser-visible.

No configured delivery => demo. Incomplete config =>error. Configured calls all accepted =>sent. Some accepted=>partial clearly described and resubmit disabled. None accepted=>error, no success imitation.

## Operational requirements and limits

- Next Node runtime; parent already set serverActions12mb, required for10MB upload.
- Per-instance hashedIP limiter is best effort, NOT distributed/durable. Add platform/WAF rate limits across instances; trust forwardedIP headers only behind controlled proxy. Turnstile is required for PDF email and recommended for contact.
- File signatures are not antivirus scanning. Add receiver malware scanning and retention/access policy for sensitive deployments; never serve uploads inline as trusted content. Optional Turnstile introduces Cloudflare and should be reflected in privacy disclosure.
- Only choices in sessionStorage; PII fields not locally persisted. Contact summary query bounded16KiB then2000characters. Never log payloads/files/secrets.
- No live Resend, Sheets, Drive or Turnstile credential run was performed. Production credentials and verified-domain setup remain deployment-owner responsibility. This is real integration code, not a notification stub.

## Validation

- `pnpm exec tsc --noEmit`: passed at final owned-code check (parent's earlier unrelated admin import error was resolved).
- `pnpm exec eslint` owned paths `--max-warnings0`: passed.
- `pnpm exec tsx tests/estimate.test.ts`: passed. Covers tiers, +/-range, exactmilestone sums, addons/deduplication, bounds/nonfinite/decimal area, configured-only WhatsApp.
- First remote-CDP routeQA captured all3 desktop1440 and390 mobile, light/dark; desktop/lightmobile visually inspected all3. No nested main/title duplication/owned overflow seen. Dark selected chip white-on-white discovered and fixed via theme-paper text token; dark stepper/caption also tokenized.
- Photographic collage loaded in initial desktop/mobile captures. FinalQA helper forces allimages eager+decode before fullpage capture.
- Real PDF serveraction returned success and created browserdownload; remoteCDP download.saveAs failed because remote browserfile is not sandboxfile. QA helper changed to capture actual Blob bytes for extraction, not a product defect.
- Final multi-step UI/PDF/demo smoke was blocked when parent3000 preview stopped, before these flows completed. Do not claim final browser smoke passed yet. Script `/data/conversion-qa.cjs` supports isolated context/tab, localhostproxy, image decoding, PDFbytes, storage/query restoration, validation and **demo-only** submission; skips submission if envdelivery config present. Closes only created pages/context.
- Existing captures `/data/conversion-{estimator,configure,contact}-{desktop,mobile,dark-desktop,dark-mobile}.png`; final script writes requested `/data/tools-*.png` when preview is running.
- Own3106 preview descendants explicitly terminated; no parent preview/process intentionally stopped.

## Final requested deep-link/accessibility fixes

- `/configure?palette=earth|stone|calm` selects curated Earth & olive/Walnut, Monochrome/Stone, or Coastal calm/Textured plaster direction; unknown values are ignored rather than used as arbitrary state. Known URL presets intentionally override stored palette/material while retaining the room.
- `/contact?intent=` prefills the project note only for the three exact known concierge prompts. Input is bounded before use; no arbitrary injection/prefill occurs.
- Unconditional aria-describedby references now always have matching area/consent/upload/estimate note IDs. PDF money uses ASCII `INR`, never unsupported rupee glyph with built-in Helvetica.

## Actual PDF renderer verification

Native ESM renderer test generated `/data/conversion-test-brief.pdf`, extracted text with pdftotext and confirmed ASCII INR values, accurate range/milestone currency, and90–140day/+/-15% wording. Rendered and inspected the actual PDF. Found and fixed inherited line-height overlap and an orphan scope note; final normal brief is a clean single A4 page with readable11pt body and9pt note. PNG `/data/conversion-pdf-preview.png` inspected with no overlap. This test sends no email/webhook. TSX CJS test runner hit a dependency-export-mode error, so the renderer was tested using native ESM entry point, matching Next's ESM bundling.
Maximum-input PDF QA also passed:25,000sqft/Bespoke/allfiveaddons+fullbrief fits oneA4page; `/data/conversion-pdf-max-preview.png` inspected, no text/footer overlap, accurate INR crores/lakhs and milestone sums. Actual report/code is ready for parent's production rebuild and final route smoke.

## Final frozen seven-addon PDF result (supersedes earlier five-addon note)

Parent's final schema adds Smart lighting/Art & soft styling/Café/BHK labels and updated budget bands. Seven-addon extreme case was rendered and found a note-only second page; fixed via conditional2pt row padding for>5addons (normal4pt otherwise). Body remains11pt and scope note/footer are now10pt minimum as requested. Final25,000sqft+Bespoke+all7addons+Café brief fits **one A4 page**, rendered `/data/conversion-pdf-max7-fixed.png` inspected: no overlaps, clear footer separation, accurate INR range/milestones and truthful nonquotation note. This was the only final postfreeze bugfix; no API/schema behavior changed.

## Production smoke finding and mandatory contact fix

Physical Continue click after correcting an initially invalid phone could be lost: onTouched validation clears a blur error, removing the error row and shifting the button between mouse-down/up. Explicit React hook inspection showed step0/noerrors; a subsequent programmaticclick advanced, proving the layout/event race. Fixed ContactForm to validateonChange, use separate stable label/control associations and permanently reserved20px error lines for named fields (with compensating zero bottommargin, nearly unchanged layout). Every named aria-describedby now targets an always-present span; label names no longer include error messages. Parent rebuild is required for this mandatory final fix.

Production12screenshots (`/data/tools-{estimator,configure,contact}-{desktop,mobile,dark-desktop,dark-mobile}.png`) visually inspected all: refined studio theme, correct dark selectedchips/stepper/caption contrast, no owned overlap/overflow, and decoded reference photography. Actual browser PDF download produced4054bytes and pdftotext extracted INR53,25,250–72,04,750 for1200sqft/Bespoke+society, with accurate milestones. No email/webhook invoked. Demo flow remains to retest on rebuilt ContactForm, rather than falsely claiming this physicalclick failure passed.

## Corrected production smoke: PASS

Fresh production tested with physical clicks through all4steps including initial validation and corrected-phone Continue: passed. `/data/conversion-qa-results.json` records1main perroute, no duplicate title suffix, 0pageerrors/0brokenimages/0desktop-or390overflow, all3curatedURL presets selected, savedbriefrestored, knownintentprefilled, oversize/malformed sessionfallback, blockedStorage SecurityError fallback with0JSerrors and explicit configurator warning. Real production PDF Blob was **4028bytes** and downloaded with no email; receipt redirected to canonical `/thank-you?demo=1&receipt=...`, explicitly demo. No real external notification sent. All12newlight/dark desktop390captures saved, plus validation/steps2–4/demo-state captures.

Additional attachment QA (no submit) revealed nativefilecontrol stillheld1file after UI Remove, and oversizedoptionalfile offered no clear control. Final minimal ContactForm fix adds an uploadref, clears nativevalue and restoresfocus on Remove, and shows Remove for errors aswell as accepted files. This lets an optional oversized/wrong-type attachment be removed before continuing, and permits reselecting the same file. State/serverdelivery behavior unchanged. Parent rebuild/uploadregression required for this last necessaryfix; primaryflow alreadypasses.
