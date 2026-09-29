import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Link href="/" className="footer-brand">
            MK Associates<span>INTERIOR ARCHITECTURE · MUMBAI</span>
          </Link>
          <p>
            Spaces with a sense of you.
            <br />
            Crafted with care, in Andheri West.
          </p>
        </div>
        <div>
          <span className="eyebrow">EXPLORE</span>
          <Link href="/work">Selected studies</Link>
          <Link href="/services">Our expertise</Link>
          <Link href="/studio">Meet the studio</Link>
          <Link href="/process">Our process</Link>
          <Link href="/journal">Journal</Link>
        </div>
        <div>
          <span className="eyebrow">MAKE A BEGINNING</span>
          <Link href="/contact">Book a free consultation ↗</Link>
          <Link href="/estimator">Plan your investment</Link>
          <Link href="/configure">Build a moodboard</Link>
          <a href="/design-brief-checklist.pdf" download>
            Design brief checklist ↓
          </a>
        </div>
        <div>
          <span className="eyebrow">OUR NEIGHBOURHOODS</span>
          {["Andheri West", "Bandra West", "Juhu", "Powai"].map((s) => (
            <Link
              key={s}
              href={`/locations/${s.toLowerCase().replaceAll(" ", "-")}`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} MK Associates. Crafted in Andheri West.
        </p>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
        </div>
      </div>
      <div className="container demo-disclosure">
        Design preview · Imagery and portfolio stories are illustrative
        concepts, not completed MK Associates commissions. Business contact
        details and client proof await approval.
      </div>
    </footer>
  );
}
