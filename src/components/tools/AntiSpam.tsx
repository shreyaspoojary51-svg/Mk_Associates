"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import s from "./tools.module.css";
type WidgetAPI = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      theme: string;
      size: string;
    },
  ) => string;
  remove: (id: string) => void;
};
export default function AntiSpam({
  onToken,
  action = "project_enquiry",
}: {
  onToken: (token: string) => void;
  action?: "project_enquiry" | "proposal_email";
}) {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const api = (window as Window & { turnstile?: WidgetAPI }).turnstile;
    if (!key || !ready || !api || !container.current) return;
    const id = api.render(container.current, {
      sitekey: key,
      action,
      callback: (token) => {
        callback.current(token);
        setError(false);
      },
      "expired-callback": () => callback.current(""),
      "error-callback": () => {
        callback.current("");
        setError(true);
      },
      theme: "light",
      size: "flexible",
    });
    return () => {
      api.remove(id);
      callback.current("");
    };
  }, [key, ready, action]);
  if (!key) return null;
  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => setError(true)}
      />
      <div ref={container} />
      <p className={s.note}>
        This form uses Cloudflare Turnstile to help prevent spam. Verification
        is required before sending.
      </p>
      {error && (
        <p role="alert" className={s.error}>
          Verification could not load. Please reload this page or try again
          later.
        </p>
      )}
    </div>
  );
}
