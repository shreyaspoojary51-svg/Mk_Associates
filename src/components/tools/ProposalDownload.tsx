"use client";
import { useState, useTransition } from "react";
import { downloadProposal } from "@/app/actions";
import { whatsappLink, type EstimateInput } from "@/lib/estimate";
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
        let blob: Blob | null = null;
        let emailMsg = "Your planning brief has been downloaded.";

        // If email was provided, run the server action which also handles Resend dispatch
        if (email) {
          const result = await downloadProposal({
            estimate,
            brief,
            email,
            consent,
            verificationToken,
          });
          setVerificationRevision((v) => v + 1);
          if (result.ok && result.data) {
            const bytes = Uint8Array.from(atob(result.data), (c) =>
              c.charCodeAt(0),
            );
            blob = new Blob([bytes], { type: "application/pdf" });
            emailMsg =
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
                        : "Your planning brief has been downloaded.";
          } else {
            setMessage(result.error || "Unable to create your PDF.");
            return;
          }
        } else {
          // Direct fast binary stream from /api/proposal-pdf
          const res = await fetch("/api/proposal-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ estimate, brief }),
          });

          if (res.ok) {
            blob = await res.blob();
          } else {
            // Fallback to server action
            const result = await downloadProposal({
              estimate,
              brief,
              email: "",
              consent: false,
            });
            if (result.ok && result.data) {
              const bytes = Uint8Array.from(atob(result.data), (c) =>
                c.charCodeAt(0),
              );
              blob = new Blob([bytes], { type: "application/pdf" });
            } else {
              setMessage(result.error || "Unable to create your PDF.");
              return;
            }
          }
        }

        if (!blob) {
          setMessage("Unable to generate your PDF. Please try again.");
          return;
        }

        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "mk-associates-planning-brief.pdf";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 30000);
        setMessage(emailMsg);
      } catch {
        // Fallback: direct GET link trigger
        try {
          const directUrl = `/api/proposal-pdf?room=${encodeURIComponent(brief?.room || "")}&palette=${encodeURIComponent(brief?.palette || "")}&material=${encodeURIComponent(brief?.material || "")}`;
          const anchor = document.createElement("a");
          anchor.href = directUrl;
          anchor.download = "mk-associates-planning-brief.pdf";
          anchor.target = "_blank";
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          setMessage("Your planning brief has been downloaded.");
        } catch {
          setMessage("The PDF service is unavailable. Please try again.");
        }
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
        <a
          className={`button-outline ${s.secondary}`}
          href={whatsappLink(
            brief
              ? `Hello MK Associates, I configured my interior planning brief on your website:\n• Room: ${brief.room}\n• Palette: ${brief.palette}\n• Material: ${brief.material}${estimate ? `\n• Area: ${estimate.area} sq ft (${estimate.tier.toUpperCase()})` : ""}\n\nI have the 1-page PDF ready. I'd love to discuss this with your team!`
              : `Hello MK Associates, I configured an interior planning estimate on your website${estimate ? ` for ${estimate.area} sq ft (${estimate.tier.toUpperCase()})` : ""}. I'd love to discuss this with your team!`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on WhatsApp ↗
        </a>
      </div>
      <p className={s.note} role="status" aria-live="polite">
        {message}
      </p>
    </details>
  );
}
