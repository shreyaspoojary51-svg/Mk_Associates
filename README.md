# MK Associates — digital flagship

A runnable Next.js 15 / React 19 architectural website, built around editorial photography, generous typography and a genuinely useful investment-to-consultation journey.

## Run locally

Requirements: Node 22+, pnpm 10.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Media and self-hosted font files are restored automatically from checksummed `assets/` source bundles by postinstall/predev/prebuild. No external media download is needed.

Visit http://localhost:3000. No paid credentials are required to explore the design preview. `/admin` shows configuration guidance until a Sanity project is connected.

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

`pnpm qa` runs the production app on port 3200 and audits all seed routes at 1440 and 390px with Playwright/axe. First run `pnpm exec playwright install chromium`. Screenshots and machine-readable findings are written under `qa-results/`. Browser-based QA does not certify real-device performance.

## Important: this is a client-approval preview

- The supplied ZIP contains planning briefs, not verified client photography, business contact details or customer reviews.
- The eight portfolio records are **unbuilt design studies**; areas, budgets and narratives are explicitly illustrative. AI-assisted images are not represented as MK’s completed work.
- There are no fabricated Google ratings, testimonials, completion counts, awards, portraits or street-address coordinates.
- The supplied video is an illustrative reference film. Playback is opt-in; it is not represented as an MK commission.
- Estimator rates and add-on assumptions are demo planning inputs, **not approved MK quotations**. Range, exclusions and programme assumptions remain visible.
- The preview is **noindex by default**. Do not set `NEXT_PUBLIC_LAUNCH_READY=true` before content, legal terms, contact details and service integrations are approved.

## Implemented routes

Home; Work with category/location/search and keyboard-accessible quick lightbox; eight case-study routes; seven service routes plus index; Studio; Process; Journal plus two articles; four distinct locality guides; Estimator; Configure; Contact; Thank-you; custom 404; Privacy; Terms; Accessibility; Sanity Studio.

## Interaction architecture

- Static, eager optimized hero photograph: no preload gate and no automatic film download.
- Optional WebGL room-line material reveal loads only after idle/LCP, a device/motion/data check and a cheap WebGL benchmark. Automatically unmounts after eight seconds.
- Desktop-only Lenis enhancement, bounded GSAP reveals/parallax, SVG process draw, native scrolling fallback and reduced-motion support.
- Keyboard-accessible concept comparison; do not treat different concept rooms as evidence of a real renovation.
- Session-persisted room/palette/material collage, animated layout, shareable enquiry context and one-page PDF download/email when configured.
- Area-aware investment planner, transparent range, selected add-ons, duration, milestone allocation and structured WhatsApp message.
- Native-dialog founder concierge. WhatsApp and call URLs activate only when approved numbers are configured; otherwise working enquiry routes remain available.
- Optional procedural Web Audio ambience. Off by default; no audio downloads.
- Native dialogs provide modal focus trapping; OS cursor remains usable; visible keyboard focus throughout.

## Connect the business services

Read `.env.example` and `docs/integrations.md`.

### Sanity

Create a Sanity project/dataset, configure the public project ID and dataset, add the site’s Vercel origin to the Sanity CORS list, and invite approved editors. Sanity handles editor authentication. Schema includes siteConfig, project, service, article, locality and testimonial. Image fields require alt text; portable text is rendered safely. Keep unapproved documents unpublished. No write token is bundled into the browser.

### Enquiries

Set a verified Resend sender, notification recipient and/or an HTTPS Google Sheets adapter. The adapter must persist the record and acknowledge `{ "ok": true }`; a generic successful HTTP status alone is not treated as storage proof. Keep keys server-side. Optional Turnstile is implemented, not a fake CAPTCHA success. A honeypot and per-instance rate limiter are included; multi-instance production needs a shared persistent rate limiter.

Unconfigured routes clearly return **demo receipts**, not “sent” claims. A partially successful multi-service delivery is reported as partial rather than silently succeeding or encouraging duplicate submissions. Email and Sheets delivery require live validation with your accounts before launch.

### Vercel

Import this GitHub repository into Vercel, use the Next.js framework preset and pnpm, set environment variables, and deploy a protected preview first. Update `NEXT_PUBLIC_SITE_URL` to the approved canonical domain. Do not deploy secrets in Git or enter the exposed chat token into the repository. Rotate the token pasted in the request.

## Design and licensing

The implementation is original. The reference sites inspired pacing and interaction principles; their source, images, logos and shaders were not copied. The verified official Oryzo repository contains MIT-licensed coaster OBJ models, **not its website source**. No official reusable site template was verified for the other references. See `docs/design-council.md` and `docs/asset-provenance.md`.

## What still requires real-world approval

Approved portfolio photography and project facts; founder portraits/biographies; legal review; service pricing; business phone/email/address/social profiles; authenticated production email/Sheets/WhatsApp tests; domain; Vercel deployment; real Moto G4/Slow-4G LCP, INP and CLS acceptance testing. No ranking, traction or enquiry-volume outcome is guaranteed by a codebase.

### Upload deployment limit

Attachments are capped at **4 MB combined** so the supplied Vercel-targeted server action works beneath the platform’s 4.5 MB request limit. The original brief allowed up to 10 MB; that larger limit requires a direct-to-private-storage uploader and is not claimed by this build. See `docs/integrations.md`.
