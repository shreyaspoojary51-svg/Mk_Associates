import type { Metadata } from "next";
import Link from "next/link";
import { Intro, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "Privacy & your information",
  description:
    "How this website handles enquiry details, uploaded plans, local preferences and optional delivery services. Understand the demo before sharing data.",
  alternates: { canonical: "/privacy" },
  openGraph: { images: [ogImage("Privacy & your information")] },
};
export default function PrivacyPage() {
  return (
    <div>
      <Intro
        eyebrow="A clear understanding"
        title="Your space. Your information."
        text="This website is a launch preview. The notes below describe the implemented experience; the business must approve its final privacy policy before public launch."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <p className="note">
            Last reviewed: 29 September 2026 · Launch-preview notice, not a
            representation that all external services are active.
          </p>
          <h2>What you choose to share</h2>
          <p>
            The enquiry form asks for contact details, project type, locality,
            approximate area, budget context, timing and a project note. You may
            optionally upload reference images or floor plans. Share only
            information you have permission to provide. Do not upload identity
            documents, financial records, private access codes or sensitive
            personal information.
          </p>
          <h2>Demo mode and live delivery</h2>
          <p>
            When no enquiry delivery integrations are configured, submitting the
            form produces a clearly labelled demo receipt. In that mode, no
            enquiry, email or uploaded file is delivered or saved by a
            configured delivery service. The server still processes the
            submission to validate it.
          </p>
          <p>
            When enabled by the site operator, the form can send enquiry details
            and attachments through Resend email and/or an authenticated webhook
            selected by the operator. The webhook recipient is responsible for
            its storage. Partial delivery and failure states are shown rather
            than presented as an unconditional success.
          </p>
          <h2>Planning tools and preferences</h2>
          <p>
            The moodboard and estimator store selections in your browser’s
            session storage so you can bring them into an enquiry. Session
            storage normally lasts for the browser-tab session. The theme
            preference is kept in local storage. Clearing the website’s browser
            data removes these preferences.
          </p>
          <p>
            Generating a planning PDF processes your selected brief on the
            server. If you request an emailed copy and email delivery is
            configured, the selected delivery provider receives the recipient
            address and document. The interface distinguishes an available
            download from an email that was not configured or could not be sent.
          </p>
          <h2>Technical processing</h2>
          <p>
            The enquiry endpoint uses a short-lived, per-server rate-limit
            record based on a hash of the requesting IP address. This protects
            against repeated submissions; it is not a substitute for production
            abuse monitoring. Hosting providers may also process technical
            request logs under their own policies.
          </p>
          <p>
            This build does not require advertising cookies. Published CMS text
            and images may be delivered from Sanity. Fonts and the launch
            concept images are served locally. Links to WhatsApp or other
            external websites are subject to those services’ policies once you
            open them.
          </p>
          <h2>Retention, access and requests</h2>
          <p>
            The final operator must confirm its retention periods, responsible
            contact and any international processing arrangements before launch.
            Those details are not invented here. For a privacy request, use the{" "}
            <Link href="/contact">contact page</Link> when its live delivery
            channel is available and clearly identified.
          </p>
          <h2>Your choices</h2>
          <p>
            You can explore the portfolio and use the planning tools without
            sending an enquiry. Optional uploads are not required. Enquiry
            consent concerns responding to your project; the demo does not add
            you to a marketing list. Do not use the form if you are not
            comfortable with the described processing.
          </p>
          <p className="note">
            Production checklist: verify the operator’s identity and contact,
            document active processors, set retention and deletion procedures,
            review legal obligations and approve the final notice before
            enabling public indexing.
          </p>
        </div>
      </section>
    </div>
  );
}
