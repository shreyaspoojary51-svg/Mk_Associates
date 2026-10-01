import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

export function Intro({
  eyebrow,
  title,
  text,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  breadcrumb?: { label: string; parent: { label: string; href: string } };
}) {
  return (
    <header className="page-intro section">
      <div className="container">
        {breadcrumb && <Breadcrumbs {...breadcrumb} />}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display">{title}</h1>
        {text && (
          <p
            className="body-large"
            style={{ maxWidth: "46rem", marginTop: "1.5rem" }}
          >
            {text}
          </p>
        )}
      </div>
    </header>
  );
}
export function EditorialImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div
      className="image-wrap"
      style={{
        position: "relative",
        aspectRatio: "16 / 10",
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 800px) 100vw, 90vw"
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
export function ProjectCards({ items }: { items: Project[] }) {
  return (
    <div
      className="project-grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
      }}
    >
      {items.map((project) => (
        <article className="project-card" key={project.slug}>
          <Link href={`/work/${project.slug}`}>
            <div
              className="image-wrap"
              style={{
                position: "relative",
                aspectRatio: "4 / 3",
                overflow: "hidden",
              }}
            >
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="meta">
              <span>
                {project.locality}
                {project.area ? ` · ${project.area}` : ""}
              </span>
              <span>
                {project.investment
                  ? project.investment.replace("Illustrative scope · ", "")
                  : project.concept
                    ? "Concept study"
                    : "Published project"}
              </span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </Link>
        </article>
      ))}
    </div>
  );
}
export function CTA({
  title = "Let’s make room for your life.",
  text = "A floor plan, a few questions, a first conversation. That is a good place to start.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-band section">
      <div className="container">
        <p className="eyebrow">Your next chapter</p>
        <h2 className="section-heading">{title}</h2>
        <p className="body-large">{text}</p>
        <Link
          href="/contact"
          className="button"
          style={{ marginTop: "1.5rem" }}
        >
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
export function Breadcrumbs({
  label,
  parent,
}: {
  label: string;
  parent: { label: string; href: string };
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="breadcrumb"
      style={{ marginBottom: "2rem", flexWrap: "wrap" }}
    >
      <Link href="/">Home</Link>
      <span aria-hidden="true"> / </span>
      <Link href={parent.href}>{parent.label}</Link>
      <span aria-hidden="true"> / </span>
      <span aria-current="page">{label}</span>
    </nav>
  );
}
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function ogImage(title: string) {
  return {
    url: `/api/og?title=${encodeURIComponent(title)}`,
    width: 1200,
    height: 630,
    alt: title,
  };
}
