# Independent adversarial council review — MK Associates

> Remediation update: the historical snapshot below predates the final fixes. Next.js / eslint-config-next are now 15.5.24; sharp, PostCSS, UUID and adm-zip were updated through locked overrides. The production dependency audit reports no known advisories. Proposal emails now require real Turnstile verification and stricter limits; storage parsing is bounded; blocked storage is handled; CTA deep links work; CMS production outages fail closed. Final live credentials, shared abuse protection and real-device performance remain launch prerequisites.

Review: 2026-09-29, approximately five-minute bounded review. Read-only source inspection; only this memo was written. Source was being edited concurrently, so references describe the inspected snapshot and must be rechecked after fixes. No browser authentication, live enquiry, email, webhook, or external test delivery. No secrets inspected. Parent owns build and route QA; neither is claimed passed here.

## Verdict

Suitable for a protected, explicitly illustrative preview only after dependency remediation. **Not approved for public production or live-delivery rollout.** Main technical blocker: currently installed Next 15.5.14 / sharp 0.34.5 have registry-reported security issues, including a critical AVIF image-optimization issue. Business approval, live delivery validation, and real-device performance remain separate launch blockers.

## Must fix before public deployment

### P0 — Known dependency advisories (confirmed registry audit, not exploit test)

Executed `pnpm audit --prod --json` read-only. Report: 34 advisories, 2 critical, 17 high, 13 moderate, 2 low. These are dependency findings, NOT 34 demonstrated exploitable bugs in this app.

- Installed Next **15.5.14**: critical **GHSA-2xp9-vwfh-vxw4**, unauthenticated RCE in image optimization when AVIF files are processed; affected `<15.5.24`, patched `15.5.24`. Independently loaded GitHub's advisory and confirmed range/description. `next.config.ts` permits Sanity CDN images and enables AVIF output. Output-format configuration alone does not establish crafted-input exploitability, but an exposed optimizer makes this a production blocker rather than a purely build-time issue. https://github.com/advisories/GHSA-2xp9-vwfh-vxw4
- Next **GHSA-m99w-x7hq-7vfj**, App Router Server Actions DoS, patched `>=15.5.21`; this application exposes two Server Actions. https://github.com/advisories/GHSA-m99w-x7hq-7vfj
- Installed sharp **0.34.5**: GHSA-rgj7-g3m4-5g8c/libheif issues, patched `>=0.35.4`; audit also reports libvips issues fixed `>=0.35.0`. https://github.com/advisories/GHSA-rgj7-g3m4-5g8c
- Audit also flags a Windows-only critical Next issue (not established relevant to Linux/Vercel), middleware/rewrites/CSP issues (features not seen in this app), PostCSS 8.4.31 and Sanity CLI's adm-zip. Triage reachable runtime paths separately; do not portray every package finding as exploitable.

Action: upgrade Next to current supported patched release, **at least 15.5.24 for listed Next findings**, align eslint-config-next, refresh lockfile, resolve sharp compatibly, rerun audit/build/QA. This minimum is not a future-proof assurance. No React2Shell RCE accusation based solely on `react:19.1.0`: the relevant RSC implementation is framework-controlled and older official React guidance already lists patched Next 15.5.10; fresh audit, not that stale minimum, is decisive here.

### P1 — Arbitrary-recipient PDF mail abuse and weak instance limits

`src/app/actions.ts:113–129`: any caller can provide an arbitrary valid recipient plus `consent:true`, render a PDF and send branded mail when Resend sender/key are enabled. Turnstile verification only runs in `submitLead`, not `downloadProposal`. Six-per-ten-minutes in-memory IP buckets reset across instances and trust the first forwarded-IP value (`actions.ts:14–22`). No verified recipient ownership, recipient/global quota, or PDF concurrency cap. This is a bounded-content mail relay rather than arbitrary-content relay, but still enables harassment, reputation damage, cost and rendering load.

Action: shared trusted-proxy-backed limiter, global/recipient quotas and concurrency bounds; apply verified challenge to emailed proposals or disable emailed copies until protected. Make client and server challenge behavior consistent. WAF/platform protections must be configured, not merely mentioned.

### P1 — CMS fail-open content resurrection in launch mode

`src/lib/sanity.ts:17–49`: no client, successful empty published result, invalid rows, and fetch failure all collapse to `[]`; every reader then returns demo seeds. Deleting/unpublishing all projects or a CMS outage resurrects all eight illustrative records, plus demo service/article/locality content. Sitemap uses those same readers. Indexing flag does not prevent demo fallback once launch is enabled.

Action: allow seeds only in explicit preview/unconfigured mode. Distinguish successful empty result from outage. Production should honor an empty collection; serve approved last-known-good content on failure or controlled unavailable state and log sanitized diagnostics. Test unpublish-last-record and CMS outage before launch.

### P2 — Context parsing has no pre-parse length bound; malformed brief hides valid estimate

`ContactForm.tsx:23–30`, `Configurator.tsx:26`, `Estimator.tsx:13` read session storage and immediately `JSON.parse`. Zod field caps come **after parsing**. Same-origin script/storage manipulation can produce multi-megabyte payloads and main-thread work. This is local robustness, not demonstrated unauthenticated remote execution. In contact/configurator, brief and estimate share one try/catch, so malformed brief prevents independent valid estimate recovery. Query `summary` is capped to 2,000 after retrieval, which is good but different from bounding JSON parse input.

Action: centralized safe storage helper: reject raw length over a small bound (e.g. 4 KB), parse/schema-check each item independently, optionally clear corrupt values. Add tests for oversized, malformed, wrong enum and independently recoverable entries.

### P2 — Unguarded theme storage exceptions

`Header.tsx:9–10`: localStorage get/set not guarded, unlike the planning tools. Storage-blocked browsers can throw page errors on mount or theme click. Action: catch and keep theme in memory; validate stored value to light/dark only.

## Verified positive controls / do not invent these vulnerabilities

- **No default real delivery:** `actions.ts:69–79` returns explicit demo receipt when no enquiry channels configured. Incomplete email/webhook setup fails closed. PDF generation is real, but optional email distinguishes not-configured/failed/accepted.
- **No form-controlled webhook SSRF found:** webhook URL comes exclusively from server env, not parsed form values. Form fields cannot override it. HTTPS/no URL credentials validated. Redirect is manual; only configured script.google.com may follow an HTTPS *.googleusercontent.com GET, without forwarding secret/body. The arbitrary env hostname still requires trusted operator configuration/egress policy; do not label this attacker-controlled form SSRF.
- **Upload bounds present on server:** maximum four non-empty files and **10 MiB combined**, checked before buffers are read, plus 12 MB Server Action envelope. Exact-signature checks present for PNG, JPEG, WebP and PDF; filenames sanitized. They are **signature sniffing, not full-format validation/malware scanning**. A 12-byte RIFF....WEBP or header-only PNG can pass; PDF active content/polyglots are not eliminated. Private storage/scanning policy needed for live uploads. Do not promise “all uploaded files are safe.”
- **PDF error handling exists:** schema fails return error; render failures caught; mail error does not erase downloadable PDF; UI reports email failure/unconfigured separately. Built-in PDF fonts avoid rupee by writing INR. No arbitrary PDF image/font URL comes from submitted proposal fields. Render timeout/concurrency absent (see abuse issue); no PDF rendering/visual verification executed by this reviewer.
- Bounded lead strings and typed enums, explicit server consent, honeypot; server action CSRF delegated to Next. Turnstile checks success/action/origin hostname and incomplete config fails closed.
- Published-only Sanity reads, no browser write token, conservative slug filtering; portable rich text restricts href protocols and image hosts. Completed-project labeling requires `concept:false` plus Sanity image/alt, but this is editor attestation, not independently verified provenance.
- Default metadata/robots noindex behavior exists. During this review parent strengthened root metadata's HTTPS/non-localhost launch check. Admin and receipt page separately noindex. Noindex is **not authentication**: use protected preview access.

## Functional / documentation findings

1. README points to **nonexistent `docs/integrations.md`**; actual guide is `src/components/tools/README.md`. Fix link or add canonical guide. `.env.example` advertises `WHATSAPP_NOTIFICATION_WEBHOOK_URL/SECRET`, but no implementation references exist; remove unsupported config or state not implemented. WhatsApp is a configured click-to-chat link, not background delivery.
2. Concierge fallback adds `/contact?intent=...`, but ContactForm only consumes `summary`. Selected “site visit/floor plan” intent is lost. Consume bounded intent into summary or generate supported summary param.
3. Home links `/configure?palette=earth|stone|calm` but configurator doesn't consume palette params; all are same initial/saved selection. Implement explicit enum mapping or remove misleading distinct deep links.
4. `getSiteConfig()` exposes CMS email/phone/address/founderNames, yet visible home/header/concierge contact/names rely on env/hardcoded text. Clarify source of truth; do not tell editor that setting CMS phone configures live call/WhatsApp.
5. `submitLead` creates a fresh UUID each attempt. Provider idempotency protects only same invocation key; uncertain network receipt followed by retry can duplicate mail/sheet entries. Use stable client-generated validated submission nonce/durable dedup if live delivery matters. Current partial success UI sensibly discourages repeats but does not cover all-reported-failure/unknown receipt.

## Accessibility and performance approval gaps (not demonstrated failures)

- Native dialogs have accessible names, close controls, Escape via native behavior and opener focus restoration. Labels, aria-pressed choices, progress list and step-heading focus are present. Do not claim keyboard/SR pass solely from static inspection.
- Contact number field always has `aria-describedby="area-form-error"` even when target absent; consent similarly references absent error. Optional textarea error lacks described-by; required fields not programmatically required. Add stable help/error targets, required/aria-required and error association. Verify invalid-step focus after React remount (heading focus currently competes with react-hook-form focus).
- QA script scans default pages at two widths with reduced motion, then clicks nav/gallery only. It does **not** cover contact steps/errors/file rejection/partial states, proposal error states, concierge focus trap, dark theme, touch targets, screen readers, normal-motion transitions or real performance. Add interaction assertions; no claim from this reviewer that any QA passed.
- README claims “cheap WebGL benchmark”, but HeroEnhancement benchmarks CPU sqrt loop plus four RAF samples, **not WebGL render capability**. Correct claim or add real low-cost GPU capability/render check. Eight-second mounting limit and deferred import are implemented, but not a measured performance budget. Global DeferredMotion loads after 1.8 seconds, not after measured LCP; reduced motion still incurs that chunk. Real Moto G4/Slow-4G LCP/INP/CLS approval remains outstanding.

## Non-code launch blockers

Verified real business contacts, approved portfolio/media provenance, legal/privacy retention and processor identity, pricing/consultation promises, domain/indexing, production WAF and hosted upload limits, and authenticated live Resend/Sheets/WhatsApp tests with owner approval. Do not run live transmissions as QA without permission. Keep preview protected/noindex and expressly label illustrative content meanwhile.

## Addendum — complete critical/high dependency list and exact remediation targets

Parent acknowledged the findings and is updating Next **15.5.24**, eslint-config-next **15.5.24**, and sharp **0.35.4** via override. Other agents are addressing proposal abuse/storage bounds and production CMS fail-closed behavior; parent is adding integration guide. These are **reported in-progress actions, not verified resolved findings**. Reaudit the final installed lockfile and rerun build/QA before closing blockers.

The following is the full critical/high set from the initial production audit. Advisory URLs are `https://github.com/advisories/` followed by the identifier. “Minimum patch” is the advisory's range boundary, not proof that deployment on that version is safe from every other issue.

| Severity | Installed dependency | Advisory | Finding | Minimum patch / scope |
| --- | --- | --- | --- | --- |
| Critical | next 15.5.14 | GHSA-2xp9-vwfh-vxw4 | AVIF Image Optimization RCE | next 15.5.24; exposed optimizer relevant; exact crafted-input reachability not tested |
| Critical | next 15.5.14 | GHSA-p293-qw3h-jr36 | Windows-hosted unauthenticated RCE | next 15.5.24; Windows condition not established here |
| High | next 15.5.14 | GHSA-q4gf-8mx6-v5v3 | Server Components DoS | next 15.5.15; App Router present |
| High | next 15.5.14 | GHSA-8h8q-6873-q5fj | Server Components DoS | next 15.5.16; App Router present |
| High | next 15.5.14 | GHSA-26hh-7cqf-hhc6 | Segment-prefetch middleware/proxy bypass, incomplete-fix follow-up | next 15.5.18; no app middleware auth observed |
| High | next 15.5.14 | GHSA-mg66-mrh9-m8jx | Connection exhaustion using Cache Components | next 15.5.16; applicable feature not established |
| High | next 15.5.14 | GHSA-c4j6-fc7j-m34r | WebSocket upgrade SSRF | next 15.5.16; deployment upgrade path not tested |
| High | next 15.5.14 | GHSA-492v-c6pp-mqqv | Dynamic route injection middleware/proxy bypass | next 15.5.16; no app middleware auth observed |
| High | next 15.5.14 | GHSA-267c-6grr-h53f | Segment-prefetch middleware/proxy bypass | next 15.5.16; no app middleware auth observed |
| High | next 15.5.14 | GHSA-36qx-fr4f-26g5 | Pages Router i18n middleware/proxy bypass | next 15.5.16; app is App Router, no relevant Pages i18n seen |
| High | next 15.5.14 | GHSA-m99w-x7hq-7vfj | App Router Server Actions DoS | next 15.5.21; actions present |
| High | next 15.5.14 | GHSA-89xv-2m56-2m9x | Server Action SSRF on custom servers | next 15.5.21; custom-server deployment not established |
| High | next 15.5.14 | GHSA-p9j2-gv94-2wf4 | Rewrites SSRF via controlled destination hostname | next 15.5.21; no app rewrites observed |
| High | sharp 0.34.5 | GHSA-f88m-g3jw-g9cj | Inherited libvips vulnerabilities | sharp 0.35.0; optimizer dependency |
| High | sharp 0.34.5 | GHSA-rgj7-g3m4-5g8c | Inherited libheif vulnerabilities | sharp 0.35.4; optimizer dependency |
| High | postcss 8.4.31 | GHSA-6g55-p6wh-862q | Arbitrary file read through CSS sourceMappingURL | postcss 8.5.12; attacker-controlled CSS build processing not seen |
| High | postcss 8.4.31 | GHSA-r28c-9q8g-f849 | Previous-source-map path traversal / .map disclosure | postcss 8.5.18; same build-input caveat |
| High | adm-zip 0.5.18 | GHSA-xcpc-8h2w-3j85 | Crafted ZIP triggers 4 GB allocation | adm-zip 0.6.0; dependency path sanity > @sanity/cli > @sanity/runtime-cli, not lead upload path |
| High | adm-zip 0.5.18 | GHSA-7q85-xj36-vmfc | Declared uncompressed size uncontrolled allocation | adm-zip 0.6.1; same CLI-path caveat |

### Recommended exact target versions for this audit snapshot

- `next@15.5.24` and `eslint-config-next@15.5.24`: exact matching patch target that clears all listed Next ranges. Recheck current audit afterward.
- `sharp@0.35.4`: clears both reported sharp ranges; verify platform native package and Next compatibility in build/runtime optimizer QA.
- `postcss@8.5.23`: clears both high items **and** later moderate incomplete source-map fix GHSA-fxqj-rqcc-2cmp. Audit also reported GHSA-qx2v-qp2m-jg93 fixed >=8.5.10. Resolve transitive instance compatibly, not only a top-level unused package.
- `adm-zip@0.6.1`: clears both high allocation issues. Audit also shows **moderate GHSA-vwc7-r8mq-g2x9, destination symlink arbitrary overwrite**, range >=0.5.9 <=0.6.0, reported patched range `<0.0.0` (no fix identified by that record). Therefore do **not** call 0.6.1 “fully safe” solely from allocation fixes; re-audit and inspect updated advisory or remove/isolate unneeded CLI extraction path. Prefer supported Sanity dependency update over blind major overrides.
- `uuid@11.1.1` is the moderate advisory's minimum for old 8.3.2 below @sanity/uuid; major compatibility must be checked rather than forcing it blindly. App receipt generation itself uses Node randomUUID, not that transitive uuid.

No claim of a universal safe dependency tree. Exact recommendations above are bounded to this initial audit; parent should preserve final machine-readable audit results and explicitly document any remaining reachability-based exceptions.
