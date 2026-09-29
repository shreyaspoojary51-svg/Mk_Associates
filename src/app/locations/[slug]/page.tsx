import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocalities, getProjects } from "@/lib/sanity";
import PortableContent from "@/sanity/PortableContent";
import {
  Intro,
  CTA,
  EditorialImage,
  ProjectCards,
  ogImage,
} from "../../work/_components/Editorial";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getLocalities()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locality = (await getLocalities()).find((item) => item.slug === slug);
  return {
    title: locality
      ? `Interiors in ${locality.name}`.slice(0, 44)
      : "Locality not found",
    description: locality?.description.slice(0, 155),
    alternates: { canonical: `/locations/${slug}` },
    openGraph: { images: [ogImage(locality?.title || "MK Associates")] },
  };
}
export default async function LocalityPage({ params }: Props) {
  const { slug } = await params;
  const [localities, projects] = await Promise.all([
    getLocalities(),
    getProjects(),
  ]);
  const locality = localities.find((item) => item.slug === slug);
  if (!locality) notFound();
  return (
    <div>
      <Intro
        breadcrumb={{
          label: locality.name,
          parent: { label: "Locations", href: "/locations" },
        }}
        eyebrow={`Interior design / ${locality.name}, Mumbai`}
        title={locality.title}
        text={locality.introduction}
      />
      <div className="container">
        <EditorialImage
          src={locality.image}
          alt={
            locality.alt ||
            `Illustrative interior design concept for a ${locality.name} home`
          }
          priority
        />
        <p className="note" style={{ marginTop: "1rem" }}>
          Concept imagery. Not a photograph of a completed local commission.
        </p>
      </div>
      <section className="section">
        <div className="container">
          <p className="eyebrow">A neighbourhood-specific brief</p>
          <h2 className="section-heading">What deserves attention here.</h2>
          <PortableContent value={locality.body} />
          {locality.priorities.map((priority, index) => (
            <div
              className="split rule"
              key={priority.title}
              style={{
                borderTop: "1px solid var(--line, #d8d3c9)",
                paddingBlock: "2rem",
              }}
            >
              <div>
                <p className="eyebrow">0{index + 1}</p>
                <h3 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                  {priority.title}
                </h3>
              </div>
              <p className="body-large">{priority.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Imagining {locality.name}</p>
          <h2 className="section-heading">A few possible directions.</h2>
          <ProjectCards
            items={projects.filter(
              (project) => project.locality === locality.name,
            )}
          />
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Practical next steps</p>
            <h2 className="section-heading">
              Bring the plan. Bring the questions.
            </h2>
          </div>
          <div>
            <p className="body-large">
              A measured floor plan, the society’s current renovation rules and
              a short list of daily needs are the most useful starting
              materials.
            </p>
            <p>
              Site visits, service availability and schedules are confirmed
              individually. No local office, completed project count or client
              endorsement is implied by this locality guide.
            </p>
            <Link
              className="button button-outline"
              href="/services/residential-interiors"
            >
              Explore residential design <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <CTA title={`Let’s talk about your ${locality.name} home.`} />
    </div>
  );
}
