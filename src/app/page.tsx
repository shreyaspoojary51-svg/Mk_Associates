import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import HeroEnhancement from "@/components/motion/HeroEnhancement";
import HeroFilm from "@/components/HeroFilm";
import { getProjects, getSiteConfig } from "@/lib/sanity";
export default async function Home() {
  const projects = await getProjects();
  const config = await getSiteConfig();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Image
          src={config.image || "/images/hero.webp"}
          alt={
            config.alt ||
            "Illustrative warm Mumbai apartment: linen sofa, teak table and a sculpted plaster arch"
          }
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-shade" />
        <HeroEnhancement />
        <div className="hero-top-note">
          <span>INTERIOR ARCHITECTURE</span>
          <span>ANDHERI WEST, MUMBAI</span>
        </div>
        <div className="hero-content">
          <p className="eyebrow">HOMES. WORKSPACES. A SENSE OF YOU.</p>
          <h1 id="hero-title">
            A home should
            <br />
            feel like <em>yours.</em>
          </h1>
          <div className="hero-bottom">
            <p>
              Mahindra & Kunal shape thoughtful spaces
              <br className="desktop-only" /> across Mumbai. With care that
              lives in the details.
            </p>
            <Button href="/contact" tone="light">
              Book a free consultation
            </Button>
          </div>
        </div>
        <div className="hero-foot">
          <a href="#philosophy">
            SCROLL TO DISCOVER <span aria-hidden="true">↓</span>
          </a>
          <span>01 / A SOFTER WAY TO LIVE</span>
          <span className="concept-label">ILLUSTRATIVE DESIGN CONCEPT</span>
        </div>
      </section>
      <div className="values-strip">
        <span>Founder-led, from first sketch to final detail</span>
        <i />
        <span>Designed for the way Mumbai lives</span>
        <i />
        <span>One considered, end-to-end approach</span>
      </div>
      <section id="philosophy" className="section philosophy">
        <div className="container split">
          <div className="philosophy-copy">
            <p className="eyebrow reveal">01 / THE WAY WE SEE IT</p>
            <h2 className="section-heading reveal">
              Not a showroom.
              <br />A place to <em>belong.</em>
            </h2>
            <p className="body-large reveal">
              Sunday chai by the window. A quiet corner for your father’s books.
              A kitchen that makes room for two.
            </p>
            <p className="reveal">
              The best spaces don’t ask you to live differently. They fit the
              life you already love. We bring light, honest materials and
              thoughtful planning together—then take care of the details, from
              first conversation to handover.
            </p>
            <div className="signature reveal">
              Mahindra <span>&</span> Kunal
              <small>THE PRINCIPALS · MK ASSOCIATES</small>
            </div>
            <Link href="/studio" className="text-link">
              A little about our studio <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <figure className="philosophy-image image-wrap parallax">
            <Image
              src="/images/project-2.webp"
              alt="Concept dining nook with olive upholstery, a brass pendant and warm plaster"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
            />
            <figcaption>
              A study in texture, light, and everyday rituals.
            </figcaption>
            <div className="image-stamp" aria-hidden="true">
              CRAFT FIRST
              <br />
              TREND LAST
            </div>
          </figure>
        </div>
      </section>
      <section className="section selected-section">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow reveal">02 / SPACES, CONSIDERED</p>
              <h2 className="section-heading reveal">
                Different lives.
                <br />
                The same <em>care.</em>
              </h2>
            </div>
            <div className="section-top-side">
              <p>
                A few directions a space can take.
                <br />
                An invitation to imagine your own.
              </p>
              <Button href="/work" tone="outline">
                Explore the collection
              </Button>
            </div>
          </div>
          <div className="selected-grid">
            {projects.slice(0, 3).map((p, i) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className={`selected-card selected-${i} reveal`}
                data-cursor="VIEW"
              >
                <div className="image-wrap">
                  <Image
                    src={p.image}
                    alt={`${p.title}: illustrative ${p.category.toLowerCase()} interior in ${p.locality}`}
                    fill
                    sizes={
                      i === 0
                        ? "(max-width:768px) 100vw, 60vw"
                        : "(max-width:768px) 100vw, 35vw"
                    }
                  />
                  <span className="project-number">0{i + 1}</span>
                  <span className="card-view" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="card-caption">
                  <div>
                    <h3>{p.title}</h3>
                    <span>
                      {p.locality} · {p.category}
                    </span>
                  </div>
                  <span className="study-tag">
                    {p.concept ? "DESIGN STUDY" : "PROJECT"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {projects.some((p) => p.concept) && (
            <p className="portfolio-note">
              Concept portfolio · AI-assisted imagery and illustrative briefs.
              Real commissions will replace these studies after client approval.
            </p>
          )}
        </div>
      </section>
      <section className="material-section">
        <div className="container material-layout">
          <div>
            <p className="eyebrow">03 / MATERIAL HONESTY</p>
            <h2 className="section-heading">
              Some things
              <br />
              should be <em>felt.</em>
            </h2>
            <p>
              Teak that warms with time. Stone that stays cool underfoot. Linen
              that softens the afternoon. A room is more than how it looks.
            </p>
            <Link href="/configure" className="text-link">
              Find your material story ↗
            </Link>
          </div>
          <div className="material-swatches">
            <Link
              href="/configure?palette=earth"
              className="material-swatch wood"
              aria-label="Explore warm teak moodboard"
            >
              <span>01</span>
              <b>Warm teak</b>
            </Link>
            <Link
              href="/configure?palette=stone"
              className="material-swatch stone"
              aria-label="Explore honed stone moodboard"
            >
              <span>02</span>
              <b>Honed stone</b>
            </Link>
            <Link
              href="/configure?palette=calm"
              className="material-swatch linen"
              aria-label="Explore soft linen moodboard"
            >
              <span>03</span>
              <b>Soft linen</b>
            </Link>
          </div>
        </div>
      </section>
      <section className="film-section">
        <HeroFilm />
        <div className="film-heading">
          <p className="eyebrow">LIGHT. ROOM. BREATH.</p>
          <h2>
            Luxury is the space
            <br />
            to feel <em>at ease.</em>
          </h2>
        </div>
      </section>
      <section className="section planning-section">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow reveal">04 / A CLEARER BEGINNING</p>
              <h2 className="section-heading reveal">
                Dream a little.
                <br />
                Plan <em>with clarity.</em>
              </h2>
            </div>
            <p className="section-top-side">
              Two small tools to turn “someday”
              <br />
              into a conversation worth having.
            </p>
          </div>
          <div className="planning-grid">
            <Link href="/estimator" className="planning-card reveal">
              <div className="planning-icon" aria-hidden="true">
                <span>₹</span>
                <div className="plan-line" />
                <div className="plan-line" />
              </div>
              <p className="eyebrow">01 / YOUR INVESTMENT</p>
              <h3>
                A considered budget.
                <br />
                Not a guessing game.
              </h3>
              <p>
                Explore craft tiers, Mumbai-specific additions and a transparent
                planning range. No email required.
              </p>
              <span className="text-link">
                Plan your investment <span aria-hidden="true">↗</span>
              </span>
            </Link>
            <Link href="/configure" className="planning-card mood-card reveal">
              <div className="mini-mood" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <p className="eyebrow">02 / YOUR MATERIAL STORY</p>
              <h3>
                A palette that
                <br />
                feels like you.
              </h3>
              <p>
                Choose a room, a mood and the materials you love. Leave with a
                personal moodboard to start the conversation.
              </p>
              <span className="text-link">
                Make your moodboard <span aria-hidden="true">↗</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section process-preview">
        <div className="container">
          <div className="section-top">
            <div>
              <p className="eyebrow">05 / IN GOOD HANDS</p>
              <h2 className="section-heading">
                From hello
                <br />
                to <em>home.</em>
              </h2>
            </div>
            <div className="section-top-side">
              <p>
                A typical full-home journey: 90–150 days.
                <br />
                Every site has its own rhythm.
              </p>
              <Link href="/process" className="text-link">
                Walk through the process ↗
              </Link>
            </div>
          </div>
          <ol className="process-steps">
            {[
              [
                "Listen",
                "Your routines, your hopes, the things you don’t want to compromise.",
              ],
              [
                "Imagine",
                "A considered plan, a material palette, a clear shared direction.",
              ],
              [
                "Make",
                "Coordinated trades, careful checks, and decisions made together.",
              ],
              [
                "Settle in",
                "The final details, a thorough walkthrough, and room to breathe.",
              ],
            ].map(([title, desc], i) => (
              <li key={title} className="reveal">
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mumbai-section section">
        <div className="container split">
          <div>
            <p className="eyebrow">06 / ROOTED HERE</p>
            <h2 className="section-heading">
              Made for Mumbai.
              <br />
              Not just a <em>postcode.</em>
            </h2>
          </div>
          <div>
            <p className="body-large">
              Monsoon mornings. Society lift bookings. Homes that do more with
              less.
            </p>
            <p>
              Beautiful design means knowing what happens outside the
              photograph. Waterproofing, noise permissions, service access and
              clever storage are part of the conversation from day one.
            </p>
            <div className="locality-links">
              {["Andheri West", "Bandra West", "Juhu", "Powai"].map((x) => (
                <Link
                  key={x}
                  href={`/locations/${x.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {x}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="container">
          <p className="eyebrow">
            EVERY GOOD SPACE STARTS WITH A CONVERSATION.
          </p>
          <h2>
            What does <em>home</em>
            <br />
            mean to you?
          </h2>
          <Button href="/contact" tone="light">
            Tell us about your space
          </Button>
          <p className="cta-reassurance">
            Free 30-minute consultation · No obligation
          </p>
        </div>
        <span className="cta-watermark" aria-hidden="true">
          MK
        </span>
      </section>
    </>
  );
}
