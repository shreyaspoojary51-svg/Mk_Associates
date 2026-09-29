import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/sanity";
import { Intro, CTA, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "Interior design services",
  description:
    "Seven ways to shape your Mumbai space: residential, commercial, hospitality, turnkey execution, styling, renovation and remote design.",
  alternates: { canonical: "/services" },
  openGraph: { images: [ogImage("Interior design services")] },
};
export default async function ServicesPage() {
  const services = await getServices();
  return (
    <div>
      <Intro
        eyebrow="From the first sketch to the finishing layer"
        title="Good spaces. Thoughtfully made."
        text="A whole home, a considered renovation, a workplace with a clear purpose. Start with what you need; we will help you find the right scope."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {services.map((service) => (
            <article
              className="split rule"
              key={service.slug}
              style={{
                paddingBlock: "2.5rem",
                borderTop: "1px solid var(--line, #d8d3c9)",
              }}
            >
              <div>
                <p className="eyebrow">{service.number} / Service</p>
                <h2 className="section-heading">
                  <Link href={`/services/${service.slug}`}>
                    {service.title}
                  </Link>
                </h2>
              </div>
              <div>
                <p className="body-large">{service.description}</p>
                <p className="note">{service.price}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="button button-outline"
                >
                  Explore the service <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Begin with clarity</p>
            <h2 className="section-heading">An investment, not a guess.</h2>
          </div>
          <div>
            <p className="body-large">
              A useful budget begins with a clear scope. Our planning tools
              offer a starting range, never a quotation or a promise.
            </p>
            <Link href="/estimator" className="button button-outline">
              Explore the investment planner <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <CTA />
    </div>
  );
}
