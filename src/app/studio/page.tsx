import type { Metadata } from "next";
import Link from "next/link";
import {
  Intro,
  CTA,
  EditorialImage,
  ogImage,
} from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "The studio — Mahindra & Kunal",
  description:
    "Meet the idea behind MK Associates: founder-led interior design in Mumbai, with thoughtful planning, material honesty and care for everyday life.",
  alternates: { canonical: "/studio" },
  openGraph: { images: [ogImage("The studio — Mahindra & Kunal")] },
};
export default function StudioPage() {
  return (
    <div>
      <Intro
        eyebrow="Mahindra & Kunal / Andheri West, Mumbai"
        title="Two perspectives. One considered space."
        text="MK Associates is a founder-led interior design studio. The work begins with a simple question: what would make this space feel more like your life?"
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <EditorialImage
              src="/images/hero.webp"
              alt="Illustrative interior expressing the studio’s warm, restrained design direction"
              priority
            />
            <p className="note">
              A design direction, not a founder portrait or a photograph of the
              studio.
            </p>
          </div>
          <div>
            <p className="eyebrow">The people behind the thinking</p>
            <h2 className="section-heading">Mahindra & Kunal.</h2>
            <p className="body-large">
              At the heart of MK Associates is the relationship between a plan
              and the people who will inhabit it. The founders’ shared point of
              view is that genuine craft and a coordinated delivery process
              should belong to the same conversation.
            </p>
            <p style={{ marginTop: "1.5rem" }}>
              That means asking about ordinary moments: where a school bag
              lands, where a parent prefers to read, how a home changes when
              guests arrive. A beautiful space earns its place by working just
              as well on an unremarkable Tuesday.
            </p>
            <p className="note" style={{ marginTop: "1.5rem" }}>
              This launch preview does not claim unverified qualifications,
              awards, years in practice or project counts. Founder biographies
              and portraits will be published after approval.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">A working philosophy</p>
          <h2 className="section-heading">Care, in the less obvious places.</h2>
          {[
            {
              title: "Life before the photograph.",
              text: "A room should be easy to inhabit. Circulation, useful storage and places to gather come before the finishing layers.",
            },
            {
              title: "Material honesty.",
              text: "A restrained palette can hold plenty of feeling. We value texture, proportion and the way a material changes with use.",
            },
            {
              title: "A legible process.",
              text: "Scope, approvals and responsibilities should be written clearly. Good communication is part of the design, not an administrative afterthought.",
            },
            {
              title: "Mumbai is part of the brief.",
              text: "Monsoon conditions, society rules and installation routes are not obstacles to be wished away. They are real design inputs.",
            },
          ].map((item, index) => (
            <div
              className="split rule"
              key={item.title}
              style={{
                paddingBlock: "2rem",
                borderTop: "1px solid var(--line, #d8d3c9)",
              }}
            >
              <div>
                <p className="eyebrow">0{index + 1}</p>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                  {item.title}
                </h3>
              </div>
              <p className="body-large">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Less mystery. More clarity.</p>
            <h2 className="section-heading">How a thought becomes a space.</h2>
          </div>
          <div>
            <p className="body-large">
              Explore the checkpoints from first conversation to handover—and
              what to ask before committing to a programme.
            </p>
            <Link className="button button-outline" href="/process">
              Meet the process <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <CTA />
    </div>
  );
}
