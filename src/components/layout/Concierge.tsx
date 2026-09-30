"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
const intents = [
  "I’m planning a 2 / 3 BHK home",
  "I’d like to arrange a site visit",
  "Can we review my floor plan?",
];
const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
  /\D/g,
  "",
);
const phone = (process.env.NEXT_PUBLIC_PHONE || "").replace(/[^+\d]/g, "");
export default function Concierge() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [showCookie, setShowCookie] = useState(false);
  if (
    ["/privacy", "/terms", "/accessibility"].includes(pathname) ||
    pathname.startsWith("/admin")
  )
    return null;
  function open() {
    dialog.current?.showModal();
  }
  return (
    <>
      <button
        ref={trigger}
        className="concierge-trigger"
        aria-label="Talk to Mahindra and Kunal"
        aria-haspopup="dialog"
        onClick={open}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 18l-1 4 5-2a9 9 0 1 0-4-2Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 8c0 4 4 7 7 7l1-2-3-1-1 1-2-2 1-1-1-3-2 1Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
        <span>Talk to the studio</span>
        <i aria-hidden="true">↗</i>
      </button>
      <dialog
        ref={dialog}
        className="concierge-dialog"
        aria-labelledby="concierge-title"
        onClose={() => trigger.current?.focus()}
      >
        <div className="concierge-top">
          <span className="eyebrow">A CONVERSATION, NOT A SALES PITCH</span>
          <button
            aria-label="Close concierge"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        <div className="founder-initials" aria-hidden="true">
          M<span>&</span>K
        </div>
        <h2 id="concierge-title">
          Hello. Let’s make
          <br />
          room for your ideas.
        </h2>
        <p>
          Start a conversation with Mahindra & Kunal. Choose what’s on your
          mind.
        </p>
        <div className="intent-list">
          {intents.map((intent) => (
            <a
              key={intent}
              href={
                number
                  ? `https://wa.me/${number}?text=${encodeURIComponent(`Hello Mahindra & Kunal, ${intent}. I found MK Associates through your website.`)}`
                  : `/contact?intent=${encodeURIComponent(intent)}`
              }
              onClick={() => dialog.current?.close()}
              target={number ? "_blank" : undefined}
              rel={number ? "noopener noreferrer" : undefined}
            >
              {intent}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
        <small>
          {number
            ? "Opens WhatsApp. Your message is sent only when you choose to send it."
            : "Preview mode: WhatsApp opens the enquiry form until the studio number is confirmed."}
        </small>
      </dialog>
      <div className="mobile-action-bar">
        <a href={phone ? `tel:${phone}` : "/contact"}>
          {phone ? "Call now" : "Book a consultation"}
        </a>
        <button onClick={open}>
          {number ? "WhatsApp" : "Talk to the studio"} ↗
        </button>
      </div>
      <button
        className="cookie-link"
        onClick={() => setShowCookie(!showCookie)}
        aria-expanded={showCookie}
      >
        <span className="cookie-dot" aria-hidden="true" />
        <span>Privacy choices</span>
      </button>
      {showCookie && (
        <div className="cookie-note" role="region" aria-label="Privacy choices">
          <p>
            We use essential browser storage for your moodboard and theme. No
            advertising cookies or selling your data.
          </p>
          <Link href="/privacy">Read our privacy note</Link>
          <button
            onClick={() => setShowCookie(false)}
            aria-label="Close privacy note"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
