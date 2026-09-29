import type { Metadata } from "next";
import WorkGallery from "@/components/WorkGallery";
import { getProjects } from "@/lib/sanity";
import { Intro, CTA, ogImage } from "./_components/Editorial";
export const metadata: Metadata = {
  title: "Work & concept studies",
  description:
    "Eight Mumbai interior concept studies: thoughtful homes, a boutique workspace and a neighbourhood café. Explore by space and locality.",
  alternates: { canonical: "/work" },
  openGraph: { images: [ogImage("Work & concept studies")] },
};
export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <div>
      <Intro
        eyebrow="A considered collection"
        title="Spaces with a point of view."
        text="Different lives. Different spaces. One belief: good design should feel deeply personal."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="note" style={{ marginBottom: "2rem" }}>
            {!projects.length
              ? "No projects are currently published. Please check back or contact the studio."
              : projects.every((project) => project.concept)
                ? "Portfolio preview — the launch projects are illustrative concept studies, not completed client work. Areas and investment bands are hypothetical, not quotations."
                : "Concept studies are labelled individually. Published commissions and images are approved by the editorial team; investment information is not a quotation."}
          </p>
          <WorkGallery projects={projects} />
        </div>
      </section>
      <CTA />
    </div>
  );
}
