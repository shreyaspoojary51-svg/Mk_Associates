import type { Metadata } from "next";
import Link from "next/link";
import BeforeAfter from "@/components/BeforeAfter";
import { notFound } from "next/navigation";
import { getProjects, getServices, getLocalities } from "@/lib/sanity";
import PortableContent from "@/sanity/PortableContent";
import {
  Intro,
  EditorialImage,
  CTA,
  ProjectCards,
  JsonLd,
  ogImage,
} from "../_components/Editorial";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getProjects()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title.slice(0, 44),
    description: project.description.slice(0, 155),
    alternates: { canonical: `/work/${slug}` },
    openGraph: { images: [ogImage(project.title)] },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [collection, services, localities] = await Promise.all([
    getProjects(),
    getServices(),
    getLocalities(),
  ]);
  const project = collection.find((item) => item.slug === slug);
  if (!project) notFound();
  const locality = localities.find((item) => item.name === project.locality);
  const service =
    services.find(
      (item) =>
        item.slug ===
        (project.category === "Commercial"
          ? "commercial-interiors"
          : project.category === "Hospitality"
            ? "hospitality-interiors"
            : project.category === "Renovation"
              ? "renovation"
              : "residential-interiors"),
    ) || services[0];
  const related = collection
    .filter((item) => item.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.locality === project.locality) -
        Number(a.locality === project.locality),
    )
    .slice(0, 2);
  return (
    <div>
      <Intro
        breadcrumb={{
          label: project.title,
          parent: { label: "Work", href: "/work" },
        }}
        eyebrow={`${project.locality} / ${project.category} / ${project.concept ? "Concept study" : "Published project"}`}
        title={project.title}
        text={project.description}
      />
      <div className="container">
        <EditorialImage src={project.image} alt={project.alt} priority />
        {project.concept && (
          <p className="note" style={{ marginTop: "1rem" }}>
            Illustrative concept imagery. This is not a completed client
            project.
          </p>
        )}
      </div>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">
              {project.concept ? "The imagined brief" : "The project brief"}
            </p>
            <h2 className="section-heading">
              A quieter way to inhabit the city.
            </h2>
            <p className="body-large">{project.story || project.description}</p>
          </div>
          <dl className="prose">
            <div>
              <dt className="eyebrow">Location context</dt>
              <dd>{project.locality}, Mumbai</dd>
            </div>
            <div>
              <dt className="eyebrow">
                {project.concept ? "Illustrative area" : "Area"}
              </dt>
              <dd>{project.area}</dd>
            </div>
            <div>
              <dt className="eyebrow">
                {project.concept ? "Study year" : "Year"}
              </dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt className="eyebrow">Investment context</dt>
              <dd>{project.investment}</dd>
            </div>
            <div>
              <dt className="eyebrow">Status</dt>
              <dd>
                {project.concept
                  ? "Unbuilt concept · no client commission"
                  : "Published project · editor-approved"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <PortableContent value={project.body} />
          {project.concept && (
            <>
              <p className="eyebrow">Material study</p>
              <h2 className="section-heading">Texture before decoration.</h2>
              <div className="split">
                <p className="body-large">
                  A limited palette gives each material room to speak. Timber
                  brings warmth, matte surfaces soften reflected light, and
                  tactile fabrics help a room feel lived-in rather than arranged
                  for a photograph.
                </p>
                <p className="note">
                  The materials described are a concept direction. Actual
                  product selection, technical performance and cost require
                  samples, site assessment and an approved specification. There
                  is no claimed before-and-after transformation.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {project.concept && related.some((item) => item.concept) ? (
            <BeforeAfter
              before={project.image}
              after={related.find((item) => item.concept)!.image}
            />
          ) : null}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Related expertise</p>
            <h2 className="section-heading">
              From a direction to a detailed plan.
            </h2>
            <Link
              href={service ? `/services/${service.slug}` : "/services"}
              className="button button-outline"
            >
              {service?.title || "Explore our services"}{" "}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div>
            <p className="eyebrow">The neighbourhood matters</p>
            <p className="body-large">
              A good interior responds to the building around it. Explore the
              planning considerations for {project.locality}.
            </p>
            <Link
              href={locality ? `/locations/${locality.slug}` : "/locations"}
              className="button button-outline"
            >
              Designing in {project.locality} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Continue exploring</p>
          <h2 className="section-heading">Another way to feel at home.</h2>
          <ProjectCards items={related} />
        </div>
      </section>
      <CTA />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: `${project.concept ? "Unbuilt illustrative concept study. " : ""}${project.description}`,
          genre: project.concept
            ? "Interior design concept"
            : "Interior design",
          spatialCoverage: {
            "@type": "Place",
            name: `${project.locality}, Mumbai`,
          },
        }}
      />
    </div>
  );
}
