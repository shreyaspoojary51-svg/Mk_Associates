"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
const links = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["Studio", "/studio"],
  ["Process", "/process"],
  ["Journal", "/journal"],
];
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const tick = () => setScrolled(window.scrollY > 40);
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    return () => window.removeEventListener("scroll", tick);
  }, []);
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("mk-theme", next ? "dark" : "light");
    } catch {}
  }
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mk-theme");
      setDark(stored === "dark");
      if (stored) document.documentElement.dataset.theme = stored;
    } catch {}
  }, []);
  return (
    <>
      <header
        className={`site-header ${pathname === "/" && !scrolled ? "over-hero" : ""} ${scrolled ? "is-scrolled" : ""}`}
      >
        <Link href="/" className="wordmark" aria-label="MK Associates home">
          <svg aria-hidden="true" viewBox="0 0 44 44">
            <path d="M5 35V9l12 16L29 9v26M29 22L40 9M29 22l11 13" />
          </svg>
          <span>
            MK <span className="wordmark-small">ASSOCIATES</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
          >
            {dark ? "◐" : "◑"}
          </button>
          <Link className="header-cta" href="/contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </Link>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            onClick={() => dialog.current?.showModal()}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="mobile-menu"
        onClose={() => menuButton.current?.focus()}
        aria-labelledby="menu-title"
      >
        <div className="menu-top">
          <span id="menu-title" className="eyebrow">
            MK ASSOCIATES · MUMBAI
          </span>
          <button
            aria-label="Close navigation menu"
            onClick={() => dialog.current?.close()}
          >
            Close ×
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {[
            ...links,
            ["Contact", "/contact"],
            ["Investment estimator", "/estimator"],
            ["Your material story", "/configure"],
          ].map(([name, href], i) => (
            <Link key={href} href={href}>
              <small>0{i + 1}</small>
              {name}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        <p>
          Thoughtful homes. Considered workspaces.
          <br />
          Mahindra & Kunal · Andheri West
        </p>
      </dialog>
    </>
  );
}
