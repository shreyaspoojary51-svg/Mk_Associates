import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticles,
  getProjects,
  getLocalities,
  getServices,
} from "@/lib/sanity";
import PortableContent, {
  headingText,
  headingId,
} from "@/sanity/PortableContent";
import {
  Intro,
  CTA,
  EditorialImage,
  ProjectCards,
  JsonLd,
  ogImage,
} from "../../work/_components/Editorial";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getArticles()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = (await getArticles()).find((item) => item.slug === slug);
  return {
    title: article ? article.title.slice(0, 44) : "Article not found",
    description: article?.description.slice(0, 155),
    alternates: { canonical: `/journal/${slug}` },
    openGraph: article
      ? {
          type: "article",
          publishedTime: article.date || undefined,
          images: [ogImage(article.title)],
        }
      : undefined,
  };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = (await getArticles()).find((item) => item.slug === slug);
  if (!article) notFound();
  const [projects, localities, services] = await Promise.all([
    getProjects(),
    getLocalities(),
    getServices(),
  ]);
  const locality = localities.find((item) => item.slug === article.locality);
  const service = services.find((item) => item.slug === article.service);
  const contents = article.sections.length
    ? article.sections.map((section, index) => ({
        title: section.heading,
        id: `section-${index + 1}`,
      }))
    : (article.body || [])
        .filter((block) => ["h1", "h2", "h3"].includes(String(block.style)))
        .map((block) => ({ title: headingText(block), id: headingId(block) }));
  return (
    <div>
      <Intro
        breadcrumb={{
          label: article.title,
          parent: { label: "Journal", href: "/journal" },
        }}
        eyebrow={`${article.category} / ${article.readTime}`}
        title={article.title}
        text={article.description}
      />
      <div className="container">
        <p className="meta" style={{ marginBottom: "2rem" }}>
          {article.author || "MK Associates editorial"} ·{" "}
          <time dateTime={article.date}>
            {new Date(
              `${article.date || "2026-09-01"}T00:00:00Z`,
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
        </p>
        <EditorialImage
          src={article.image}
          alt={
            article.alt ||
            "Illustrative interior concept accompanying this planning guide"
          }
          priority
        />
        <p className="note" style={{ marginTop: "1rem" }}>
          Illustrative concept image. General design guidance, not a record of
          client work.
        </p>
      </div>
      <section className="section">
        <div className="container split">
          <nav aria-label="Article contents">
            <p className="eyebrow">In this note</p>
            <ol style={{ paddingLeft: "1.25rem" }}>
              {contents.map((item) => (
                <li key={item.id} style={{ marginBottom: "1rem" }}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="prose">
            <PortableContent value={article.body} />
            {article.sections.map((section, index) => (
              <section
                key={section.heading}
                id={`section-${index + 1}`}
                style={{ marginBottom: "3rem", scrollMarginTop: "8rem" }}
              >
                <h2
                  className="section-heading"
                  style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}
                >
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    style={{ marginTop: "1.25rem", lineHeight: 1.8 }}
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <aside
              className="note"
              style={{
                padding: "1.5rem",
                border: "1px solid var(--line, #d8d3c9)",
              }}
            >
              Start closer to your space:{" "}
              <Link
                href={locality ? `/locations/${locality.slug}` : "/locations"}
              >
                designing in {locality?.name || "Mumbai"}
              </Link>
              , or explore{" "}
              <Link href={service ? `/services/${service.slug}` : "/services"}>
                {service?.title.toLowerCase() || "interior design services"}
              </Link>
              .
            </aside>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Related concept studies</p>
          <h2 className="section-heading">The ideas, in a room.</h2>
          <ProjectCards
            items={(article.relatedProjects.length
              ? projects.filter((project) =>
                  article.relatedProjects.includes(project.slug),
                )
              : projects
            ).slice(0, 2)}
          />
        </div>
      </section>
      <CTA />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.date || undefined,
          author: {
            "@type": "Organization",
            name: article.author || "MK Associates editorial",
          },
          publisher: { "@type": "Organization", name: "MK Associates" },
          articleSection: article.category,
        }}
      />
    </div>
  );
}
