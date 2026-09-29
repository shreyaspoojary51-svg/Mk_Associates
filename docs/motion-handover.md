# Motion / gallery agent handoff

## Completed owned files
- `src/components/motion/MotionSystem.tsx`
- `src/components/motion/HeroEnhancement.tsx`
- `src/components/motion/MaterialReveal.tsx`
- `src/components/motion/motion.module.css`
- `src/components/motion/gallery.module.css`
- `src/components/motion/comparison.module.css`
- `src/components/WorkGallery.tsx`
- `src/components/BeforeAfter.tsx`

No layout, package, globals, routes, content data, or other agent-owned files edited. No installs and no GitHub push.

## Behavior / integration
- Default `MotionSystem()` mounts globally using the parent's `DeferredMotion`. GSAP dynamic loading, visible-source `.reveal` translate-only entry at 550ms, subtle desktop `.parallax` maximum 12px. No opacity-hidden reveal CSS, so static content survives JavaScript/network failure.
- Desktop ScrollTrigger dynamically imported, owns only `[data-draw-path]` or `svg[aria-labelledby='timeline-title'] path` strokes. Native SVG paths and native process details remain the source fallback; original inline stroke styles are restored on reduced-motion changes/unmount. Chose the parent's offered existing-SVG/native-details integration instead of duplicating the process UI in an additional component.
- Fine-pointer/no-touch/non-reduced decorative cursor supports VIEW / EXPLORE / DRAG through `[data-cursor]`. OS cursor is not hidden. Magnetic `.button` movement bounded to ±4px and reset on leave/blur/cleanup; keyboard-focused buttons excluded.
- Lenis desktop wheel-only smoothing, native touch, keyboard tween cancellation without preventing keyboard defaults, anchor support, dialog / `[data-lenis-prevent]` exclusion. All listeners, observers, RAFs and owned animations clean up.
- Reading progress rendered with inline fixed styles, passive listeners and ResizeObserver; decorative/aria-hidden.
- Opt-in Web Audio sound, off initially, no autoplay. Master gain .008 for three unit-amplitude sine voices gives max summed peak .024 (~−32.4dBFS). Visibility hides suspend and turn sound off; context closes on unmount. Control moved above desktop concierge and beside mobile concierge, clear of mobile action bar; hidden while privacy note is open.
- Default `HeroEnhancement()` has `next/dynamic`, SSR false and null placeholder. Three/R3F chunk is only requested after gate passes: no reduced motion, no touch/coarse pointer, >4 cores, >=4GB RAM when available, no saveData. Waits for load plus 1.4s quiet LCP window and idle; CPU and frame-cadence benchmark. Decorative shader draws perspective room/floor/wall/door outlines with subtle pointer influence; alpha, DPR1, low-power WebGL. Wrapper and Canvas both expire at 8s and unmount. Error boundary falls back to static hero. Parent hero must be positioned, with real hero image/content retained.
- `WorkGallery({ projects })` imports exported `Project` from `../lib/content`; project links `/work/${slug}`. Independent category + locality + search intersection, correct result counts, real empty state/reset, Framer layout reflow disabled with reduced motion. Accessible native quick dialog, autofocus close, Escape and backdrop close, focus restore, body-scroll cleanup. Uses `project.alt` and conditional `project.concept` labels (does not label real CMS commissions as concepts). Explicit labels provide precise accessible names. Module specificity overrides global `.meta` flex and `.gallery-controls` column leakage; captions block, titles 32px serif and ink colored.
- `BeforeAfter({ before?, after? })` defaults project-2.webp / project-3.webp; clearly titled “Material study — concept visualisations” and explicitly says different concepts, NOT real same-space before/after. Native draggable range supports arrows/Home/End, percentage valuetext, split view toggle and honest study annotations. Slider disabled in split view.

## Validation
- Repository-wide `tsc --noEmit`: passed after parent/sibling fixes, before dependency upgrade.
- Owned-file ESLint: passed with no output.
- Browser QA isolated harness outside repo (`/data/motion-qa`, port3105): no page errors; multidimensional filters produced real empty; reset worked; native lightbox focus contained and restored after Escape; slider ArrowRight changed 50→51; split disabled slider; 390px document had no overflow.
- Integrated `/work` and `/process` on parent's previous port3000, before it stopped for build: no page errors; `.meta` computed block; explicit search labels worked; contextual VIEW cursor appeared; dialog Escape worked; 390px no overflow; SVG dash length840 and intermediate offset350px proved active drawing; native PageDown scrolled; changing reduced-motion restored undashed source SVG.
- Isolated hero with synthetic eligible 8-core/8GB/fine pointer: Canvas mounted after gate and unmounted on expiry, zero page errors. Real low-tier devices intentionally skip it.
- Inspected generated desktop/mobile gallery, empty, dialog, overlay/split comparison and integrated work/process screenshots. No layout overflow or broken placement. Hero screenshot taken at Canvas mount shows intact static image/text before shader fade-in (not a full visual frame-by-frame shader audit).

QA result records outside repository: `/data/motion-qa-results.json`, `/data/motion-live-results.json`, `/data/motion-hero-results.json`. Screenshots prefixed `/data/motion-`.

## Parent-owned final checks
Dependency/security upgrade to Next15.5.24 and production build are parent-owned. Re-run final typecheck/build after upgrade. Final full-route accessibility/Lighthouse/security auditing is parent-owned; this report does not claim those ran here. Main3000 was not restarted. Isolated3105 QA server is stopped after handoff.
