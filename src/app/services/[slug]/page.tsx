import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServices, getProjects } from "@/lib/sanity";
import PortableContent from "@/sanity/PortableContent";
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
  return (await getServices()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  return {
    title: service ? service.title.slice(0, 44) : "Service not found",
    description: service?.description.slice(0, 155),
    alternates: { canonical: `/services/${slug}` },
    openGraph: { images: [ogImage(service?.title || "MK Associates")] },
  };
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  if (!service) notFound();
  const category =
    slug === "commercial-interiors"
      ? "Commercial"
      : slug === "hospitality-interiors"
        ? "Hospitality"
        : slug === "renovation"
          ? "Renovation"
          : "Residential";
  const related = (await getProjects())
    .filter((item) => item.category === category)
    .slice(0, 2);
  const faqs = [
    {
      question: "Where do we begin?",
      answer:
        "Bring a floor plan, a few reference images and a list of what needs to change. A conversation establishes whether a site review and a detailed proposal are the right next steps.",
    },
    {
      question: "How is the investment agreed?",
      answer: service.considerations,
    },
    {
      question: "Can we work in stages?",
      answer:
        "Phasing can be considered after assessing access, service dependencies and your daily needs. It is not always practical to occupy a space during invasive work; the programme should make that clear.",
    },
  ];
  return (
    <div>
      <Intro
        breadcrumb={{
          label: service.title,
          parent: { label: "Services", href: "/services" },
        }}
        eyebrow={`Service ${service.number} / Mumbai`}
        title={service.title}
        text={service.description}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <EditorialImage
              src={service.image}
              alt={
                service.alt ||
                `Illustrative interior concept for ${service.title.toLowerCase()}`
              }
              priority
            />
            <p className="note">
              Editorial imagery. Demo images are illustrative concepts, not
              completed client work.
            </p>
          </div>
          <div>
            <p className="eyebrow">The approach</p>
            <h2 className="section-heading">
              Start with the way it needs to work.
            </h2>
            <p className="body-large">{service.introduction}</p>
            <PortableContent value={service.body} />
            <Link
              href="/contact"
              className="button"
              style={{ marginTop: "1.5rem" }}
            >
              Discuss your space <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">An agreed scope</p>
            <h2 className="section-heading">What we can help with.</h2>
          </div>
          <ul className="prose">
            {service.includes.map((item) => (
              <li key={item} style={{ paddingBlock: ".75rem" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Investment & planning</p>
            <h2 className="section-heading">{service.price}</h2>
            <p className="body-large">{service.considerations}</p>
          </div>
          <div>
            <p className="note">
              Your final scope, fee, programme and execution terms are confirmed
              in a written proposal. Demo investment ranges are planning
              illustrations only; they exclude assumptions that have not been
              surveyed or agreed.
            </p>
            <Link href="/process" className="button button-outline">
              How the process works <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Before we begin</p>
          <h2 className="section-heading">A few useful questions.</h2>
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rule"
              style={{
                borderTop: "1px solid var(--line, #d8d3c9)",
                paddingBlock: "1.25rem",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  minHeight: "44px",
                }}
              >
                {faq.question}
              </summary>
              <p
                className="body-large"
                style={{ maxWidth: "50rem", marginTop: "1rem" }}
              >
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <p className="eyebrow">A design direction</p>
          <h2 className="section-heading">Explore the possibilities.</h2>
          <ProjectCards items={related} />
        </div>
      </section>
      <CTA />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.description,
          areaServed: { "@type": "City", name: "Mumbai" },
          provider: { "@type": "Organization", name: "MK Associates" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
    </div>
  );
}
