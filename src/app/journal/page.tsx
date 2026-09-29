import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/sanity";
import { Intro, CTA, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "Journal — notes on thoughtful spaces",
  description:
    "Practical interior design notes for Mumbai: planning a renovation, choosing durable materials and asking better questions before you build.",
  alternates: { canonical: "/journal" },
  openGraph: { images: [ogImage("Journal — notes on thoughtful spaces")] },
};
export default async function JournalPage() {
  const articles = await getArticles();
  return (
    <div>
      <Intro
        eyebrow="The studio journal"
        title="A little thought, before a lot of change."
        text="Notes on living well, building carefully and choosing things that last. Written to help you begin with better questions."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container project-grid">
          {articles.map((article) => (
            <article className="project-card" key={article.slug}>
              <Link href={`/journal/${article.slug}`}>
                <div
                  className="image-wrap"
                  style={{ position: "relative", aspectRatio: "4 / 3" }}
                >
                  <Image
                    src={article.image}
                    alt={`Illustrative interior for ${article.category.toLowerCase()} guidance`}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p className="meta">
                  {article.category} · {article.readTime}
                </p>
                <h2 className="section-heading">{article.title}</h2>
                <p>{article.description}</p>
                <span className="button button-outline">
                  Read the note <span aria-hidden="true">↗</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </div>
  );
}
