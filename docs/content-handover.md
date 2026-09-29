# Content / editorial implementation report

## Delivered (owned files only)
- Typed `src/lib/content.ts`: eight explicitly unbuilt concept studies; seven service records with clearly illustrative investment starting points; four substantively different neighbourhood guides; two complete planning/material articles. Exports `Project`, `Service`, `Locality`, `Article`, `SiteConfig`, `EditorialBlock` and their respective arrays.
- Work index and eight case studies. Integrates parent `WorkGallery`; case studies use parent `BeforeAfter` only between two concept studies with its honest material-study labels.
- Services index and seven detail pages with inclusions, considerations, native FAQs, relevant projects and enquiry links.
- Studio founder narrative without fictional biographies, portraits, qualifications, project totals or awards.
- Process: accessible SVG desktop overview and five native expandable phases with inputs/outputs; mobile uses the readable accordion instead of tiny timeline text. Native FAQs and illustrative timeline disclaimer.
- Journal index and two articles with contents links, related projects, services and neighbourhood links.
- Localities index and four distinct detail pages: Andheri West access/wet edges, Bandra existing character/services, Juhu coastal specification/family use, Powai work/storage/high-rise logistics.
- Privacy, terms, accessibility, receipt/thank-you and custom 404. Policies accurately distinguish demo processing from configured delivery and do not assert certified accessibility or a guaranteed reply time.
- Sitemap / robots: no crawlable preview; publish URLs only with `NEXT_PUBLIC_LAUNCH_READY=true` and a valid HTTPS non-local origin. Admin, API and receipt pages excluded.
- Sanity config, gated embedded `/admin/[[...tool]]`, six document schemas, safe portable text renderer. All image fields carry required alt text; testimonials require publishing permission.
- Added approved `/api/revalidate` endpoint with timing-safe Bearer secret comparison, tag and route invalidation.

## CMS operation
`getProjects`, `getServices`, `getArticles`, `getLocalities`, `getSiteConfig` query public published documents (no write token / drafts). New document slugs, images and rich body content replace the seeds rather than merely overlaying their text. CMS images use the parent-configured `cdn.sanity.io` image host. Rich-text links reject unsafe schemes and rich images require valid Sanity URLs and alt text. Unknown locality/category/service values have safe navigation fallbacks.

`concept` is boolean. A project is displayed as real only when explicitly set to false with a valid CMS asset and supplied alternative text. This guards against unlabeled demo fallback imagery becoming client proof. The schema defaults new entries to concept=true.

Preview/unconfigured mode can use reviewed seeds. **Launched and configured CMS** returns an empty collection for no published entries and throws an availability error on upstream failure: it never silently resurrects the demo portfolio. Root homepage should use the reader too (parent was notified). Root launch readiness/indexing gate remains parent-owned.

Config variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`; optional authenticated revalidation `SANITY_REVALIDATE_SECRET`. To invalidate, POST `/api/revalidate` with `Authorization: Bearer <secret>`. No secret in query strings or client config. Cache reads are tagged `sanity`, revalidated every 300 seconds or by endpoint.

## Integration contracts
- `Project.area` and `year` are strings. Required fields include slug/title/category/locality/description/image/alt/accent/investment/concept; optional story/body.
- `Service` includes title/slug/description/desc/price/investment/image/icon and editorial scope fields.
- All route roots are divs because parent owns main#main. `.button-outline` links also carry `.button` for shared styling.
- Dynamic route params use Promise<{slug:string}> and metadata loads the same published readers as page content.
- Per-route OG references parent `/api/og?title=...`; dynamic titles capped to44 characters before16-character parent template, descriptions to155.
- Case-study JSON-LD uses `CreativeWork` (not nonexistent Project), services use Service, articles Article, visible FAQs FAQPage. No invented address, ratings, founder qualifications or testimonials in structured data.
- `/thank-you?demo=1&receipt=<uuid>` clearly identifies simulation. `demo=0` does not claim that this page independently verifies delivery; only the form's result can establish transport status. Parent tools redirects must match `/thank-you`.

## Validation and boundaries
- `pnpm typecheck` passed after CMS/rich-text integration.
- Targeted ESLint over every owned source passed with no warnings.
- Process desktop snapshot was visually inspected at1440×1000: clear hierarchy, legible phases, no horizontal overflow. Mobile snapshot at390×844 exposed a tiny timeline; fixed by hiding desktop overview at mobile and retaining full native phases. Parent owns broad live all-route1440/390 axe/layout QA and final production build; no parallel builds/dev servers started by this agent.
- The first iframe capture was blocked by parent SAMEORIGIN headers; used an SSR static snapshot with original inline font/CSS instead. Snapshot helper's shell-overlay warnings concern parent-owned floating concierge/cookie controls, not page overflow. Reported as integration considerations, not claimed a whole-site visual audit.
- No live Sanity project, editor credentials, approved client work or external delivery credentials were available; live publication and delivery require operator configuration and review.
- No package/CSS/layout edits, installs or GitHub push performed.
