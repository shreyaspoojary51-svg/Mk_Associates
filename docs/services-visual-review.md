# Services — independent visual council review

## Verdict
**Editorial layout: PASS across all eight routes. Zero-overlap certification: FAIL on the supplied capture set, pending final floating-overlay recapture.** All 16 images were opened individually with `view_image`; no contact sheet was used. No application source was changed.

Scope: first-production full-page screenshots named `-services…-1440.png` and `-services…-390.png`. Actual PNG content widths are 1425 and 375 respectively (15px less than the named viewport). This is screenshot geometry, not evidence of page overflow. The parent says final contrast/floating-overlay/reduced-circle adjustments are rebuilding; this review does **not** certify unseen revisions.

## Per-image inspection
“FAIL” below refers to the visible captured overlap, not a claim that scrolling cannot reveal the content. Full-page screenshots composite fixed controls at their viewport positions.

| Route | Desktop 1440 | Mobile 390 |
|---|---|---|
| Services index | **FAIL — overlay.** Calm oversized introduction; clean seven-row hierarchy and generous aligned columns. Floating “Talk to the studio” covers the right end of the commercial service description. No text-column overflow elsewhere. | **FAIL — overlay.** Headline reflows cleanly to three lines, seven service rows remain within gutters, CTA/footer stack correctly. Fixed action bar crosses the first Residential row/title-to-description area; sound/round concierge cluster crowds its heading area. |
| Residential interiors | **PASS — captured layout.** Living-room light/wood crop is coherent; approach column fits; two related-study images align cleanly. Illustration notice directly below hero and concept labels below studies. | **FAIL — overlay.** Title wraps naturally, room crop retains window/sofa/table, both related studies stack without clipping. Bottom bar occludes the top of “Start with the way it needs to work”; sound/round control crowds the image-note region. |
| Commercial interiors | **PASS — captured layout.** Reception desk crop retains material and work setting; one full-width related image is properly framed. Service scope and investment paragraphs have clear breathing room. | **FAIL — overlay.** Heading and reception crop fit; no horizontal spill. Fixed bar overlaps the approach label/top heading. Sound/round controls sit beside the tiny image-note zone. |
| Hospitality interiors | **PASS — captured layout.** Warm café photograph-like concept clearly matches the service; diagonal light and seating survive both hero and related-study crops. Large final study feels editorial, not a thumbnail stretched into a card. | **FAIL — overlay.** Hero and café study remain readable within gutters; bottom bar obscures the first approach-heading line. Scope/FAQ/CTA flow is otherwise clean. |
| Turnkey execution | **PASS — captured layout.** Sculptural pendant/table/stair composition is intentional, not an accidental crop. Clear procurement/coordination scope; two related studies form a balanced lower pair. | **FAIL — overlay.** Pendant/table crop is retained and title fits on one line. Fixed bar crosses the approach heading; the lower content and stacked studies are free of overlaps. |
| Furniture & styling | **PASS — captured layout.** Curved banquette, pendant and arch are coherent with finish/furniture direction. Related image pair and scope typography sit cleanly. | **FAIL — overlay.** Title has sensible two-line wrap and banquette crop remains recognizable. Bar overlays approach-heading start; utility cluster crowds image-caption area. Pricing, scope and final CTA do not spill. |
| Renovation | **PASS — captured layout.** Hallway study is an appropriate spatial/reset image and central doorway survives both crops. Clean long heading and full-width related study, no clipping. | **FAIL — overlay.** Renovation heading and corridor composition fit. Bottom bar crosses approach-heading top; remainder of the long page is orderly and uncropped. |
| NRI remote design | **PASS — captured layout.** Bedroom/window/city-view study is coherent; title and remote-working explanation fit. Scope list and related images are cleanly separated. | **FAIL — overlay.** Two-line title and bedroom crop retain the useful exterior view. Bar overlaps beginning of approach heading; round concierge/sound controls crowd the note below the image. All later sections remain within the column. |

## Cross-route findings

### Blocking captured-view issue
The utility stack is the only systematic overlap finding. A fixed bottom bar will naturally cover document pixels in a full-page capture, so **these images alone cannot establish a permanent usability bug**. They do establish that the submitted views are not zero-occlusion evidence. The parent should inspect the final revision at ordinary viewport height, initially and after scrolling to an image note, approach heading, FAQ and final CTA. Verify that users can fully read/activate each item, especially focused items, without utility controls covering it. The desktop index collision is particularly direct: floating studio button and right-column sentence occupy the same area.

Recommended validation, not a source change: one discreet mobile bottom action surface; no second competing concierge over content; sound control outside text/notice areas; desktop utility tucked away from the index right text column. Do not certify the revision merely because its circle is smaller.

### Editorial quality: strong with one refinement opportunity
- Warm paper/ink, narrow serif display and terracotta ending are consistently architectural rather than SaaS-like. Image treatments are squared, quiet and coherent.
- No accidental header/title/footer overlaps or horizontal text overflow were seen beyond the fixed utility surfaces.
- Generous whitespace reads as intentional. Across all seven children, however, very large repeated gaps between scope → investment → FAQ and the repeated identical approach heading make the page family feel templated. This is a **non-blocking refinement**, not a layout defect; tighter rhythm or service-specific approach headings could improve editorial density later.
- Scope lists are visually plain but readable; final CTA contrast appears strong. Small labels/disclaimers cannot be numerically contrast-certified from scaled full-page image views. A rebuild may change those colors: retain automated contrast checks plus full-resolution/viewport inspection.

### Static imagery and truthful claims
Read-only verification of `src/lib/content.ts`, service template and `docs/asset-provenance.md` confirms:
- Service heroes use local static WebP files, not scraped reference-site media: residential `project-1`; commercial `project-5`; hospitality `project-6`; turnkey `project-7`; furniture `project-2`; renovation `project-8`; NRI `project-3`.
- Those assets are **AI-generated architectural concepts**, cropped from generated editorial sheets. They are not authenticated client photography. “Photograph-like” describes the appearance only.
- Heroes visibly say “Editorial imagery. Demo images are illustrative concepts, not completed client work.” Related images visibly carry “Concept study.” Investment bands visibly begin “Illustrative”; additional text states planning assumptions have not been surveyed/agreed. Index budget module says its range is not a quotation or promise.
- No fabricated Google ratings, press marks, delivery counts, client quotations, project completion years or founder credentials were visible in these 16 images.
- Mumbai locality names on related concepts should continue to be understood as **imagined study settings**, never completed commissions. Preserve adjacent concept labels in all card/navigation variants and during CMS replacement.
- Imagery is tasteful, consistent and free of visible pseudo-text, fake marks or obvious generative defects at the inspected scale. This is not provenance/licensing approval for eventual client publication; asset/client approval remains a launch gate.

## Sign-off boundary
**7 desktop child captured layouts pass; desktop index and all 8 mobile captured views fail strict no-overlap review because of utility overlays.** Underlying content composition passes all 16. This review did not test focus, menu/FAQ expansion, forms, route behavior, motion or final-build contrast. A successful static review must not be represented as those functional checks.

After overlay recapture, if ordinary viewport/scroll views show no text/control occlusion and contrast checks pass, these service routes need no substantial redesign. Preserve the tasteful crops, truth labels and restrained typography.
