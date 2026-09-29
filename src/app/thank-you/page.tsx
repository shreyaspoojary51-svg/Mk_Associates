import type { Metadata } from "next";
import Link from "next/link";
import { Intro, ProjectCards } from "../work/_components/Editorial";
import { getProjects } from "@/lib/sanity";
export const metadata: Metadata = {
  title: "Your enquiry reference",
  description:
    "Review your enquiry reference and continue exploring the MK Associates concept portfolio.",
  robots: { index: false, follow: false },
};
type Props = { searchParams: Promise<{ demo?: string; receipt?: string }> };
export default async function ThankYouPage({ searchParams }: Props) {
  const projects = await getProjects();
  const query = await searchParams;
  const demo = query.demo !== "0";
  const receipt =
    query.receipt && /^[a-f0-9-]{36}$/i.test(query.receipt)
      ? query.receipt
      : undefined;
  return (
    <div>
      <Intro
        eyebrow={demo ? "Launch preview / Demo receipt" : "Your next chapter"}
        title={
          demo
            ? "A first step, thoughtfully taken."
            : "Thank you for the conversation."
        }
        text={
          demo
            ? "This was a demo submission. No enquiry, email or uploaded file was delivered or saved by a delivery service."
            : "If you arrived here after a successful enquiry submission, keep the reference below for your records. A consultation or appointment is agreed separately."
        }
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="prose" style={{ marginLeft: 0 }}>
            {receipt && (
              <p className="note">
                Reference:{" "}
                <code style={{ overflowWrap: "anywhere" }}>{receipt}</code>
              </p>
            )}
            <p className="note">
              This page does not independently verify delivery. Follow the
              status shown by the enquiry form; visiting this URL alone does not
              submit an enquiry.
            </p>
            <Link
              href="/contact"
              className="button button-outline"
              style={{ marginTop: "1.5rem" }}
            >
              {demo ? "Return to the enquiry demo" : "Back to contact"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <h2 className="section-heading" style={{ marginTop: "5rem" }}>
            While you imagine what comes next.
          </h2>
          <ProjectCards items={projects.slice(0, 2)} />
        </div>
      </section>
    </div>
  );
}
