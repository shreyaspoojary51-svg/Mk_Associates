# Independent project-page visual review

## Scope and method
Inspected all **16 requested project screenshots individually with `view_image`**, one at a time: eight case studies × desktop/mobile. No contact sheets, no source changes, no browser session or build. One additional single-image detail crop of the Quiet Apartment mobile intro was inspected to confirm fixed-control overlap.

The supplied files are the first-production-build captures, not the final contrast/overlay-circle build. Filename widths are 1440 and 390; actual PNG raster widths are 1425 and 375 respectively (a consistent 15px difference, plausibly the native scrollbar gutter). This does not by itself establish a viewport error. Parent capture diagnostics should remain authoritative for actual viewport and horizontal-overflow measurements.

**Overall:** all eight project page bodies have intact layouts, responsive reading order, coherent image framing and complete sections. No page-content collisions, missing images, clipped headings/buttons, broken grids or unexplained missing-content gaps were found. **There is a concrete shared-shell overlay issue in the old mobile Quiet Apartment capture**, so this is not an unconditional whole-page visual pass until the final mobile controls are recaptured.

## Findings requiring final-build confirmation

### 1. Mobile fixed controls obscure the honest concept-image disclaimer
- Evidence: `-work-the-quiet-apartment-390.png`, first viewport. Confirmed in `/data/projects-review-mobile-intro-detail.png`.
- The rectangular **Sound off** control covers the middle/right of the sentence beginning “Illustrative concept imagery. This is not a completed…”.
- The floating concierge overlaps its right end; the fixed bottom action bar covers the wrapped final “project” line around the original first-viewport bottom.
- The overline still clearly says CONCEPT STUDY, so this does not turn the page into fabricated client proof. However, the more explicit caption should remain readable.
- These controls belong to the parent/motion shell. Parent has already reported newer overlay-circle changes; **verify the new mobile screenshot** rather than applying fixes to this stale capture. Other mobile screenshots place the same controls in whitespace or near the image boundary, but the longer Quiet Apartment intro exposes the collision most clearly.
- Desktop fixed controls overlap the hero image only, not the story or headings. This is a deliberate overlay placement rather than a route-body collision, but consumes part of the imagery.

### 2. Bandra Courtyard: non-blocking image/story coherence
- Both captures show a bedroom with shelving and a water/city view, not a courtyard or a planted threshold.
- The body explicitly says the greenery is an intention and does not claim an actual courtyard on a real site; the project is repeatedly labelled an unbuilt concept. **No fabricated client proof found.**
- The title/lead concept would nevertheless be more immediately legible with imagery showing the stated planted-threshold intention, or copy more closely aligned with the bedroom study. This is editorial refinement, not a layout failure.

## Individual observations

| Project / capture | Route-body result | Concrete visual observation |
| --- | --- | --- |
| The Quiet Apartment / 1440 | Pass | Long title remains clear; sofa/window hero is well framed. Brief and metadata columns do not collide; two related cards align. |
| The Quiet Apartment / 390 | Pass body; shell overlap noted above | Title wraps naturally over two lines, brief/metadata stack correctly and comparison/related cards stay within the narrow width. Explicit image disclaimer is partially covered by fixed shell controls. |
| Juhu House / 1440 | Pass | Curved dining nook and pendant remain the hero focal points. Image caption, brief, metadata, comparison controls and CTA have deliberate separation. |
| Juhu House / 390 | Pass | Short title fits cleanly; the reading order moves from concept caption to brief to metadata. Related images stack without accidental crop or overlap. |
| Bandra Courtyard / 1440 | Pass layout; editorial note | Bedroom framing retains bed/window composition. Comparison separates the bedroom and café concepts and explicitly states they are independent directions. No missing section or overflow. |
| Bandra Courtyard / 390 | Pass layout; editorial note | The title and locality overline fit. Body and metadata remain separate, comparison labels stay inside the image and the café/bedroom cards retain their subjects. |
| Powai Residence / 1440 | Pass | Compact-apartment hero retains storage, chair and daylight, supporting the practical planning narrative. Story/metadata columns and locality CTA remain aligned. |
| Powai Residence / 390 | Pass | Storage/chair remain visible in the hero; metadata follows the narrative rather than floating beside it. Material comparison and locality link fit comfortably. |
| The Material Office / 1440 | Pass | Reception/joinery and meeting area remain recognisable. Commercial-service link is present; the comparison is honestly labelled independent concepts. |
| The Material Office / 390 | Pass | Title stays within the content width. Office image, brief, investment context, commercial CTA and stacked related projects remain intact. |
| A Table in Bandra / 1440 | Pass | Café furniture and warm textured wall form a coherent hospitality hero. Peripheral chair/table cropping is intentional, not an accidentally lost primary subject. |
| A Table in Bandra / 390 | Pass | Title/intro fit without collision; café tables remain visible. Hospitality service CTA and Bandra locality CTA are readable and distinct. |
| The Juhu Retreat / 1440 | Pass | Stair, pendant and dining table communicate the larger home study. Comparison crops preserve recognisable subjects; investment and unbuilt status remain explicit. |
| The Juhu Retreat / 390 | Pass | Larger-home image retains the stairs and pendant. The investment amount wraps inside its own metadata block; related cards and large CTA remain contained. |
| The Soft Reset / 1440 | Pass | Hallway/plant composition has a clear focal axis. Narrative explicitly avoids claiming documented before/after work; renovation service link appears correctly. |
| The Soft Reset / 390 | Pass | Hallway remains legible despite the smaller image. Story, metadata, comparison and renovation/locality links stack without overlap; footer remains complete. |

## Shared content and spacing checks
- Every case study has visible concept-study context, an explicit unbuilt/no-client-commission status and clearly illustrative investment wording. No client names, ratings, testimonials or claimed completed outcomes appear.
- Material comparison headings explicitly say “concept visualisations”; nearby copy states these are independent design directions, not photographs of the same space before and after.
- All hero images and related-card images render. No pseudo-text/logo artifacts were apparent in the inspected imagery.
- Whitespace is generous, especially between the brief, material narrative, comparison and related expertise. It follows the same editorial rhythm across pages; none of the blank regions appeared to be a failed or missing media component.
- Desktop split layouts become a sensible single-column mobile sequence. All visible page-body text remains inside its container; no unintended overlap between content blocks was observed.
- Large terracotta CTAs wrap intentionally on mobile, with the supporting sentence and button remaining separated. Related cards and footer columns stack correctly.

## Final acceptance boundary
This is an independent **visual review of the supplied first-build screenshots**, not a live functional/a11y audit and not proof of the final build. Parent should retain its final route/axe/overflow checks and inspect the corrected mobile fixed controls. No source files were modified during this review.
