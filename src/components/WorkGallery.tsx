"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Project } from "../lib/content";
import styles from "./motion/gallery.module.css";

type WorkGalleryProps = { projects: readonly Project[] };
export default function WorkGallery({ projects }: WorkGalleryProps) {
  const [category, setCategory] = useState("All");
  const [locality, setLocality] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const animate = reduced === false;
  const id = useId();
  const categories = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.category))).filter(
        Boolean,
      ),
    [projects],
  );
  const localities = useMemo(
    () =>
      Array.from(new Set(projects.map((project) => project.locality)))
        .filter(Boolean)
        .sort(),
    [projects],
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return projects.filter(
      (project) =>
        (category === "All" || project.category === category) &&
        (locality === "All" || project.locality === locality) &&
        (!query ||
          [
            project.title,
            project.category,
            project.locality,
            String(project.area ?? ""),
          ]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query)),
    );
  }, [projects, category, locality, search]);
  const reset = () => {
    setCategory("All");
    setLocality("All");
    setSearch("");
  };
  useEffect(() => {
    const element = dialog.current;
    if (!selected || !element) return;
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      if (element.open) element.close();
    };
  }, [selected]);
  const close = () => {
    setSelected(null);
    queueMicrotask(() => opener.current?.focus());
  };
  return (
    <div className={styles.gallery}>
      <div className={`gallery-controls ${styles.controls}`}>
        <fieldset className={styles.categories}>
          <legend className={styles.legend}>Filter by project type</legend>
          <div className={styles.chips}>
            {["All", ...categories].map((value) => (
              <button
                type="button"
                className={`chip ${category === value ? "active" : ""} ${styles.chip}`}
                key={value}
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
              >
                {value === "All" ? "All projects" : value}
              </button>
            ))}
          </div>
        </fieldset>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor={`${id}-locality`}>Location</label>
            <select
              id={`${id}-locality`}
              value={locality}
              onChange={(event) => setLocality(event.target.value)}
            >
              <option value="All">All locations</option>
              {localities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${id}-search`}>Search projects</label>
            <input
              id={`${id}-search`}
              type="search"
              value={search}
              placeholder="Name, place or material…"
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.results}>
        <p role="status" aria-live="polite" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          {filtered.length !== projects.length ? ` of ${projects.length}` : ""}
        </p>
        {(category !== "All" || locality !== "All" || search) && (
          <button type="button" className={styles.reset} onClick={reset}>
            Clear filters <span aria-hidden="true">↗</span>
          </button>
        )}
      </div>
      {filtered.length ? (
        <div className={`project-grid ${styles.grid}`}>
          {filtered.map((project) => (
            <motion.article
              key={project.slug}
              className={`project-card ${styles.card}`}
              layout={animate}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: animate ? 0.35 : 0 }}
            >
              <button
                className={`image-wrap ${styles.imageButton}`}
                type="button"
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setSelected(project);
                }}
                aria-label={`Open image preview: ${project.title}`}
                aria-haspopup="dialog"
                data-cursor="VIEW"
              >
                <Image
                  src={project.image}
                  alt={
                    project.alt ||
                    `${project.title} — ${project.category}${project.concept ? " concept visualisation" : ""}`
                  }
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  className={styles.image}
                />
                <span className={styles.preview}>
                  View image <span aria-hidden="true">↗</span>
                </span>
              </button>
              <div className={`meta ${styles.meta}`}>
                <p className={`eyebrow ${styles.category}`}>
                  {project.category}
                  {project.concept ? " · Concept study" : ""}
                </p>
                <h3>
                  <Link href={`/work/${project.slug}`}>
                    {project.title}
                    <span aria-hidden="true"> ↗</span>
                  </Link>
                </h3>
                <p className={styles.detail}>
                  {project.locality}
                  {project.area ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {project.area}
                    </>
                  ) : null}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h3>No projects match these filters.</h3>
          <p>Try another location, project type, or search term.</p>
          <button
            type="button"
            className={`button ${styles.emptyButton}`}
            onClick={reset}
          >
            Show all projects
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className={`lightbox ${styles.lightbox}`}
        aria-labelledby={`${id}-preview-title`}
        aria-describedby={`${id}-preview-description`}
        onClose={close}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            event.currentTarget.close();
        }}
      >
        {selected && (
          <>
            <div className={styles.dialogHeader}>
              <h2 id={`${id}-preview-title`}>{selected.title}</h2>
              <form method="dialog">
                <button
                  type="submit"
                  className={styles.close}
                  aria-label="Close image preview"
                  autoFocus
                >
                  Close <span aria-hidden="true">×</span>
                </button>
              </form>
            </div>
            <div className={styles.dialogImage}>
              <Image
                src={selected.image}
                alt={
                  selected.alt ||
                  `${selected.title}${selected.concept ? " concept visualisation" : ""}`
                }
                fill
                sizes="90vw"
                className={styles.containedImage}
              />
            </div>
            <p
              id={`${id}-preview-description`}
              className={styles.dialogCaption}
            >
              {selected.category} · {selected.locality}
              {selected.concept
                ? " — concept visualisation, not a completed-project photograph."
                : ""}
            </p>
          </>
        )}
      </dialog>
    </div>
  );
}
