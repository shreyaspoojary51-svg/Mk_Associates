import type { Metadata } from "next";
import Link from "next/link";
import { Intro, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "Keyboard navigation, reduced motion, readable content and accessible planning tools. Learn about this website’s accessibility approach and limits.",
  alternates: { canonical: "/accessibility" },
  openGraph: { images: [ogImage("Accessibility statement")] },
};
export default function AccessibilityPage() {
  return (
    <div>
      <Intro
        eyebrow="Room for everyone"
        title="Thoughtful design should include you."
        text="The website is designed with accessibility in mind. That is an ongoing responsibility, not a claim of certified compliance."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <h2>Our approach</h2>
          <p>
            We aim to follow WCAG 2.2 Level AA principles: meaningful reading
            order, descriptive image alternatives, keyboard-operable controls,
            visible focus and enough contrast to read comfortably. This preview
            has not been independently certified.
          </p>
          <h2>Using the website</h2>
          <ul>
            <li>
              Use the skip-to-content link at the start of the page to move past
              navigation.
            </li>
            <li>
              Use Tab and Shift + Tab to move between interactive controls.
              Enter or Space activates buttons and native accordion summaries.
            </li>
            <li>
              The work gallery offers labelled filters, a text search and a
              keyboard-operable dialog. Escape closes the dialog.
            </li>
            <li>
              The material comparison uses a labelled slider. Arrow keys adjust
              it; Home and End select either edge. A side-by-side view avoids
              dragging.
            </li>
            <li>
              The process page uses native expandable sections. It does not
              require animation to understand the sequence.
            </li>
          </ul>
          <h2>Motion and preferences</h2>
          <p>
            The website respects your device’s reduced-motion preference.
            Decorative motion is not necessary to access the content. A
            light/dark preference control is available in the navigation. You
            can zoom the page using your browser’s built-in controls.
          </p>
          <h2>Forms and planning tools</h2>
          <p>
            Inputs have visible labels and validation feedback. The enquiry
            experience distinguishes demo, delivery, partial-delivery and error
            states. A planning PDF is supplemental; the core estimate and
            moodboard summary remain available in the webpage.
          </p>
          <h2>Known limits</h2>
          <p>
            CMS editors are responsible for accurate alternative text and a
            sensible heading hierarchy when publishing new material. External
            messaging sites and third-party editor interfaces are outside this
            website’s control. A downloadable PDF may not offer the same
            accessibility support as the HTML planning tools.
          </p>
          <h2>Report a barrier</h2>
          <p>
            If you encounter a problem, share the page, the action you were
            taking and your browser or assistive technology through the{" "}
            <Link href="/contact">contact page</Link> once a live contact
            channel is configured. Please do not include sensitive information.
            Accessibility checks should be repeated after every substantive
            content or interface change.
          </p>
          <p className="note">
            Statement last reviewed: 29 September 2026. It describes the build’s
            intended approach and does not assert that an independent audit has
            passed.
          </p>
        </div>
      </section>
    </div>
  );
}
