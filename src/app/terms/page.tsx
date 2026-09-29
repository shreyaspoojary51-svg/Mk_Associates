import type { Metadata } from "next";
import Link from "next/link";
import { Intro, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "Website terms & engagement notes",
  description:
    "Understand this launch preview, concept portfolio, indicative estimates and the written agreements required before an interior design engagement.",
  alternates: { canonical: "/terms" },
  openGraph: { images: [ogImage("Website terms & engagement notes")] },
};
export default function TermsPage() {
  return (
    <div>
      <Intro
        eyebrow="Before a project begins"
        title="Clarity, from the outset."
        text="These notes explain the website preview. An interior design engagement requires a separate written proposal and agreement."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <p className="note">
            Last reviewed: 29 September 2026 · Draft website terms for business
            and legal approval.
          </p>
          <h2>About this website</h2>
          <p>
            This website presents MK Associates’ proposed digital experience,
            design approach and planning resources. The launch portfolio
            contains eight clearly labelled concept studies with AI-assisted
            illustrative imagery. These are not client commissions, photographs
            of completed work, client endorsements or evidence of delivery.
          </p>
          <h2>Estimates are not quotations</h2>
          <p>
            Areas, budgets, craft-tier rates, timelines and payment
            illustrations in the demo are indicative planning assumptions. They
            do not constitute a binding quotation, professional site assessment,
            offer of availability or guarantee. Site conditions, quantities,
            selections, specialist work, taxes and agreed exclusions can change
            the investment.
          </p>
          <h2>Enquiries and bookings</h2>
          <p>
            Sending an enquiry does not reserve a consultation or enter into a
            design contract. Demo mode does not deliver the enquiry. A live
            delivery confirmation only describes the delivery service’s
            response; a separate acknowledgement is required to agree an
            appointment or engagement. No response time is guaranteed by this
            website.
          </p>
          <h2>A written agreement comes first</h2>
          <p>
            Before work begins, the parties should agree the scope, fees,
            programme, responsibilities, approvals, exclusions, payment
            milestones, variation process, warranties, cancellation terms and
            any dispute provisions. Website copy is not a replacement for that
            agreement.
          </p>
          <h2>Plans, references and intellectual property</h2>
          <p>
            Upload only files you own or have permission to share. Submitted
            references help communicate a direction; they are not permission to
            reproduce another designer’s work. The website’s content and
            generated planning documents are intended for personal project
            exploration, not redistribution as completed professional design
            work.
          </p>
          <h2>Practical guidance</h2>
          <p>
            Journal articles and locality notes provide general planning
            information. Structural concerns, water ingress, fire safety,
            electrical work and statutory approvals require appropriately
            qualified professionals and site-specific assessment. Do not use an
            article as a substitute for such advice.
          </p>
          <h2>External services and availability</h2>
          <p>
            Optional email, CMS, webhook and messaging services have their own
            terms and may be unavailable. The preview is supplied for
            evaluation, with configuration-dependent functionality clearly
            labelled. The operator must review and approve production terms
            appropriate to its business and applicable law.
          </p>
          <p>
            For questions about a proposed engagement, begin with the{" "}
            <Link href="/contact">contact page</Link>. For information handling,
            read the <Link href="/privacy">privacy notice</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
