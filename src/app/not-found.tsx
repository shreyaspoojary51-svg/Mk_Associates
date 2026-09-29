import Link from "next/link";
import { getProjects } from "@/lib/sanity";
import { ProjectCards } from "./work/_components/Editorial";
export default async function NotFound() {
  const projects = await getProjects();
  return (
    <div>
      <header className="page-intro">
        <div className="container">
          <p className="eyebrow">404 / A missing detail</p>
          <h1 className="display">
            This page has been redesigned out of existence.
          </h1>
          <p className="body-large">
            But a good idea never disappears. Explore the concept collection, or
            tell us about the space you have in mind.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            <Link href="/work" className="button">
              Explore the work <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/contact" className="button button-outline">
              Start a conversation <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container">
          <h2 className="section-heading">A few places to begin.</h2>
          <ProjectCards items={projects.slice(0, 3)} />
        </div>
      </section>
    </div>
  );
}
