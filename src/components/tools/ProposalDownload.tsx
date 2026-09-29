"use client";
import { useState, useTransition } from "react";
import { downloadProposal } from "@/app/actions";
import type { EstimateInput } from "@/lib/estimate";
import type { DesignBrief } from "@/lib/lead-schema";
import s from "./tools.module.css";
import AntiSpam from "./AntiSpam";
export default function ProposalDownload({
  estimate,
  brief,
}: {
  estimate?: EstimateInput;
  brief?: DesignBrief;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationRevision, setVerificationRevision] = useState(0);
  const verificationConfigured = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function download() {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await downloadProposal({
          estimate,
          brief,
          email,
          consent,
          verificationToken,
        });
        setVerificationRevision((v) => v + 1);
        if (!result.ok || !result.data) {
          setMessage(result.error || "Unable to create your PDF.");
          return;
        }
        const bytes = Uint8Array.from(atob(result.data), (c) =>
          c.charCodeAt(0),
        );
        const url = URL.createObjectURL(
          new Blob([bytes], { type: "application/pdf" }),
        );
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "mk-associates-planning-brief.pdf";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 30000);
        setMessage(
          result.emailStatus === "sent"
            ? "PDF downloaded. The email provider accepted your requested copy; inbox delivery is not guaranteed."
            : result.emailStatus === "verification-required"
              ? "PDF downloaded. Email was not sent: configured anti-spam verification is required."
              : result.emailStatus === "rate-limited"
                ? "PDF downloaded. Email limit reached; no email was sent. Please wait one hour."
                : result.emailStatus === "failed"
                  ? "PDF downloaded, but the email copy could not be sent."
                  : result.emailStatus === "not-configured"
                    ? "PDF downloaded. Email is not configured; no email was sent."
                    : "Your planning brief has been downloaded.",
        );
      } catch {
        setMessage("The PDF service is unavailable. Please try again.");
      }
    });
  }
  return (
    <details className={s.download}>
      <summary>Keep a copy of your brief ↗</summary>
      <p className={s.note}>
        Download a PDF. Optionally request an email copy—only available when
        both email and anti-spam services are configured.
      </p>
      <label className={`field ${s.field}`}>
        Email address (optional)
        <input
          type="email"
          disabled={!verificationConfigured}
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
        />
      </label>
      {!verificationConfigured && (
        <p className={s.note}>
          Email copies are disabled until genuine anti-spam verification is
          configured. Downloads still work.
        </p>
      )}
      {email && (
        <label className={s.consent}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          I consent to receive this planning brief at the email address above.
          This does not subscribe me to marketing.
        </label>
      )}
      {email && verificationConfigured && (
        <AntiSpam
          key={verificationRevision}
          action="proposal_email"
          onToken={setVerificationToken}
        />
      )}
      <div className={s.actions}>
        <button
          type="button"
          className={`button-outline ${s.secondary}`}
          disabled={pending || (!!email && (!consent || !verificationToken))}
          onClick={download}
        >
          {pending ? "Preparing your brief…" : "Download planning PDF ↓"}
        </button>
      </div>
      <p className={s.note} role="status" aria-live="polite">
        {message}
      </p>
    </details>
  );
}
