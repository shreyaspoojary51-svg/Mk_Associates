# Editorial visual review

Inspected source PNGs individually with `view_image`, plus five first-fold crops for close inspection. No browser use and no source changes. Scope: locality index + four locality pages, journal index + two articles, at 1440 and 390.

**Count correction:** the requested routes are eight routes × two widths = **16 images**, and exactly 16 matching files were available, not 18. No missing-image passes invented.

**Outcome:** all 16 pass intrinsic editorial structure: coherent typography, clean gutters, appropriately stacked mobile content, intact images, no apparent horizontal clipping, and well-separated sections. Four captures fail a strict zero-text-occlusion check because fixed UI covers text at the captured first fold. These are screenshot/viewport-overlay findings, not proof that the underlying text is unreachable after scrolling. Final overlay/contrast rebuild remains outside this review.

| Screenshot in `qa-results/` | Result | Concrete observation |
|---|---|---|
| `-locations-1440.png` | PASS | Three-column locality cards align; fourth card starts a clean second row. Large title fits its gutters. Refreshed first-fold crop shows compact floating icons clear of Juhu copy. |
| `-locations-390.png` | FAIL — capture overlap | Single-column cards and intro fit cleanly, but the fixed bottom action bar covers the first Andheri card title/part of its excerpt in this capture. |
| `-locations-andheri-west-1440.png` | PASS | Hero, three two-column priority rows, related-study pair and practical-next-step block are cleanly separated; concept caption remains visible. |
| `-locations-andheri-west-390.png` | PASS | Long heading wraps naturally; priority rows and both related studies stack without clipping. Fixed controls fall over hero imagery rather than reading copy in the reviewed capture. |
| `-locations-bandra-west-1440.png` | PASS | Headline remains within the container; related residence/café imagery is consistent and captions sit below rather than beside images. |
| `-locations-bandra-west-390.png` | PASS | Intro, three priority sections and related cards preserve reading order with generous vertical spacing; CTA text fits. |
| `-locations-juhu-1440.png` | PASS | Dining-room hero and paired concept studies render intact; priority headings and body columns have clear separation. |
| `-locations-juhu-390.png` | FAIL — capture overlap | Responsive typography and stacked content are sound, but the action bar clips the top of the “Concept imagery…” caption in the first-fold crop. |
| `-locations-powai-1440.png` | PASS | Hero crop and two related-study cards are balanced; practical next-step columns and closing CTA show no collisions. |
| `-locations-powai-390.png` | PASS | Both study images and all priority paragraphs fit the single column; headings and CTA wrap without horizontal spill. |
| `-journal-1440.png` | PASS | Article titles, excerpts and “Read the note” actions remain separated; floating icons occupy the unused right-hand space rather than covering articles. |
| `-journal-390.png` | FAIL — capture overlap | Both article cards stack correctly, but the fixed action bar covers the first card metadata and first title line at the captured fold. |
| `-journal-planning-your-mumbai-renovation-1440.png` | PASS | Long article title breaks coherently; TOC and prose columns are distinct, all six section headings fit, and related-study cards are intact. |
| `-journal-planning-your-mumbai-renovation-390.png` | FAIL — capture overlap | Long title, mobile TOC and article paragraphs fit, but the fixed “Privacy choices” label covers the beginning of the editorial byline in the first-fold crop. |
| `-journal-materials-for-mumbai-monsoons-1440.png` | PASS | Hero and related-study imagery are consistent; TOC, six prose sections and closing note are clearly structured, with no observed text collisions. |
| `-journal-materials-for-mumbai-monsoons-390.png` | PASS | TOC precedes prose in a readable single column; section headings, paragraphs, study cards and footer remain within gutters. |

## Visual notes and limits
- Interior imagery is tasteful, context-specific and free of visible fake logos/text; concept disclosures are present.
- Quiet cream/ink/terracotta palette and serif/sans hierarchy are consistent across the editorial routes. No numerical contrast or accessibility compliance claim is made from screenshots alone.
- Some source screenshots refreshed while this review was underway. Earlier locality captures showed larger sound/concierge labels; the later index crops show compact icons and sound hidden on mobile index pages. Review is therefore not a frozen post-rebuild release certification.
- Recheck the four flagged first-fold regions after final overlay changes, ideally using a normal viewport capture and a scrolled reading state. Fixed elements are composited once into full-page screenshots and can mask document content at that captured fold even when scrolling exposes it.
- Sixteen available files were reviewed. If two additional images were intended, their filenames/scope were not provided.
