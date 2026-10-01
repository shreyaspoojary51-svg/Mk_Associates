import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLocalities } from "@/lib/sanity";
import { Intro, CTA, ogImage } from "../work/_components/Editorial";
export const metadata: Metadata = {
  title: "Mumbai neighbourhoods",
  description:
    "Explore interior planning for Andheri West, Lokhandwala, Bandra West, Juhu and Powai. Five neighbourhoods, five distinct design considerations.",
  alternates: { canonical: "/locations" },
  openGraph: { images: [ogImage("Mumbai neighbourhoods")] },
};
export default async function LocationsPage() {
  const localities = await getLocalities();
  return (
    <div>
      <Intro
        eyebrow="Mumbai, room by room"
        title="A city of different homes."
        text="The building, the street and the way you live all shape the brief. Local context is a design consideration, not just an address."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container project-grid">
          {localities.map((locality) => (
            <article className="project-card" key={locality.slug}>
              <Link href={`/locations/${locality.slug}`}>
                <div
                  className="image-wrap"
                  style={{ position: "relative", aspectRatio: "4 / 3" }}
                >
                  <Image
                    src={locality.image}
                    alt={`Interior concept inspired by ${locality.name}`}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <p className="eyebrow">{locality.name} / Mumbai</p>
                <h2 className="section-heading">{locality.title}</h2>
                <p>{locality.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </div>
  );
}
