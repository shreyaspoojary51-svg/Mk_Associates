import type { Metadata } from "next";
import Link from "next/link";
import { Intro, CTA, JsonLd, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "The design process",
  description:
    "A clear route from brief to handover: site review, planning, design approvals, coordinated execution and final checks for your Mumbai interior.",
  alternates: { canonical: "/process" },
  openGraph: { images: [ogImage("The design process")] },
};
const phases = [
  {
    title: "Listen & understand",
    stage: "The first conversation",
    text: "Understand the people, the place and what needs to change. A site review identifies constraints before the brief becomes a plan.",
    tasks: [
      "Discuss routines, priorities and what should stay",
      "Review measured plans and visible site conditions",
      "Confirm society rules and access constraints",
    ],
    need: "Your floor plan, wish list, budget context and building rules.",
    receive:
      "A recorded brief, proposed scope and the questions that still need investigation.",
  },
  {
    title: "Plan the possibilities",
    stage: "Spatial planning",
    text: "Test how the space will work, before choosing how it will look. Circulation, furniture and storage form the backbone.",
    tasks: [
      "Explore layout options and service dependencies",
      "Review accessibility and day-to-day circulation",
      "Align the preferred plan with the investment context",
    ],
    need: "Clear feedback on the plan and a decision on the preferred direction.",
    receive:
      "A layout proposal, scope priorities and an initial investment discussion.",
  },
  {
    title: "Design the details",
    stage: "Materials & documentation",
    text: "Develop the approved plan into a material language and a buildable set of decisions.",
    tasks: [
      "Review finishes, lighting and joinery",
      "Coordinate relevant specialist inputs",
      "Record drawings, specifications and approvals",
    ],
    need: "Timely approvals, sample feedback and confirmation of long-lead selections.",
    receive:
      "An agreed design package, specification schedule and itemised execution proposal.",
  },
  {
    title: "Coordinate the making",
    stage: "Execution",
    text: "Sequence the work around the building and the approved details. Keep changes visible and decisions recorded.",
    tasks: [
      "Coordinate procurement and installation",
      "Review progress at agreed checkpoints",
      "Document variations before approval",
    ],
    need: "Reliable site access, milestone decisions and approvals for any scope changes.",
    receive:
      "Progress updates, quality checkpoints and a current record of the agreed scope.",
  },
  {
    title: "Check & hand over",
    stage: "The finishing line",
    text: "Walk through the space carefully. The details that remain are recorded, not brushed aside.",
    tasks: [
      "Compile and close the agreed snag list",
      "Review operation and maintenance needs",
      "Collect relevant warranty and product documents",
    ],
    need: "A final walkthrough with your authorised representative.",
    receive:
      "Handover documentation, an agreed snag record and care guidance for the specified materials.",
  },
];
const faqs = [
  {
    question: "How long will my project take?",
    answer:
      "A full-home programme may be discussed in the region of 90–150 days, but this is an illustrative planning window, not a commitment. Scope, site conditions, approvals, procurement and building access determine the actual schedule.",
  },
  {
    question: "How are payments and changes handled?",
    answer:
      "Payment milestones, inclusions and exclusions belong in the written proposal. Scope changes should be documented with their cost and schedule effect before approval. No standard payment split is promised by this demo.",
  },
  {
    question: "Can I remain in the home during work?",
    answer:
      "That depends on the extent of demolition, service interruptions and safe access. Phased work can sometimes help, but an occupied renovation requires a realistic assessment rather than a blanket yes.",
  },
  {
    question: "What warranties are included?",
    answer:
      "Execution responsibilities and manufacturer warranties are confirmed in the signed agreement. Ask which products are covered, for how long, by whom, and what maintenance conditions apply.",
  },
];
export default function ProcessPage() {
  return (
    <div>
      <Intro
        eyebrow="From a first hello to a thoughtful handover"
        title="A clear path. A considered pace."
        text="Good design has room for discovery. Good execution needs decisions in the right order. Here is how the conversation becomes a space."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <svg
            className="desktop-only"
            viewBox="0 0 1000 110"
            role="img"
            aria-labelledby="timeline-title"
            style={{ width: "100%", height: "auto", marginBottom: "2rem" }}
          >
            <title id="timeline-title">
              Five phases: Listen, Plan, Design, Coordinate, Handover
            </title>
            <path
              d="M80 35 H920"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              opacity=".25"
            />
            {["Listen", "Plan", "Design", "Coordinate", "Handover"].map(
              (label, index) => (
                <g key={label}>
                  <circle
                    cx={80 + index * 210}
                    cy="35"
                    r="10"
                    fill="var(--paper, #F5F2EB)"
                    stroke="currentColor"
                  />
                  <text
                    x={80 + index * 210}
                    y="80"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="20"
                  >
                    {label}
                  </text>
                </g>
              ),
            )}
          </svg>
          <p className="note" style={{ marginBottom: "2rem" }}>
            Open each phase for the decisions, inputs and outputs. This is a
            process framework; your proposal sets the actual scope and
            programme.
          </p>
          {phases.map((phase, index) => (
            <details
              key={phase.title}
              className="rule process-phase"
              open={index === 0}
              style={{
                borderTop: "1px solid var(--line, #d8d3c9)",
                paddingBlock: "1.5rem",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  minHeight: "44px",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                }}
              >
                <span className="eyebrow" style={{ marginRight: "1rem" }}>
                  0{index + 1}
                </span>
                {phase.title}
              </summary>
              <div
                className="split"
                style={{ marginTop: "2rem", paddingBottom: "1rem" }}
              >
                <div>
                  <p className="eyebrow">{phase.stage}</p>
                  <p className="body-large">{phase.text}</p>
                  <ul style={{ marginTop: "1.25rem", paddingLeft: "1.25rem" }}>
                    {phase.tasks.map((task) => (
                      <li style={{ marginBottom: ".75rem" }} key={task}>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="prose">
                  <h3>What we need from you</h3>
                  <p>{phase.need}</p>
                  <h3 style={{ marginTop: "1.5rem" }}>What you receive</h3>
                  <p>{phase.receive}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">The investment conversation</p>
            <h2 className="section-heading">Clarity is part of the craft.</h2>
          </div>
          <div>
            <p className="body-large">
              Know what is included, what is excluded and where an allowance is
              still an assumption. A detailed proposal is more useful than a
              reassuring headline number.
            </p>
            <Link className="button button-outline" href="/estimator">
              Try the investment planner <span aria-hidden="true">↗</span>
            </Link>
            <p className="note" style={{ marginTop: "1rem" }}>
              Estimator results are illustrative. They are not a quotation,
              contract or confirmed availability.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Questions worth asking</p>
          <h2 className="section-heading">Before the first day on site.</h2>
          {faqs.map((faq) => (
            <details
              key={faq.question}
              style={{
                borderTop: "1px solid var(--line, #d8d3c9)",
                paddingBlock: "1.25rem",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  minHeight: "44px",
                }}
              >
                {faq.question}
              </summary>
              <p
                className="body-large"
                style={{ marginTop: "1rem", maxWidth: "50rem" }}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
      <CTA />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
    </div>
  );
}
