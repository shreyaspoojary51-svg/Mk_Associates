"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./motion/comparison.module.css";

type BeforeAfterProps = { before?: string; after?: string };
/** These are two independent material concepts, never a claimed renovation before/after. */
export default function BeforeAfter({
  before = "/images/project-2.webp",
  after = "/images/project-3.webp",
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const [split, setSplit] = useState(false);
  const id = useId();
  return (
    <section
      className={`comparison ${styles.comparison}`}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.heading}>
        <div>
          <p className={`eyebrow ${styles.eyebrow}`}>
            A conversation in texture
          </p>
          <h2 id={`${id}-title`}>Material study — concept visualisations</h2>
        </div>
        <button
          type="button"
          className={`button ${styles.toggle}`}
          aria-pressed={split}
          onClick={() => setSplit((value) => !value)}
        >
          {split ? "Overlay view" : "Side-by-side view"}
          <span aria-hidden="true"> ↔</span>
        </button>
      </div>
      <p id={`${id}-description`} className={styles.description}>
        Two independent design directions, shown for inspiration. These are not
        before-and-after photographs of the same space.
      </p>
      <div className={`${styles.stage} ${split ? styles.split : ""}`}>
        {split ? (
          <>
            <div className={styles.panel}>
              <Image
                src={before}
                alt="Concept A: a material and spatial design study"
                fill
                sizes="(max-width: 650px) 100vw, 50vw"
                className={styles.image}
              />
              <span className={styles.label}>Concept A</span>
            </div>
            <div className={styles.panel}>
              <Image
                src={after}
                alt="Concept B: an independent material and spatial design study"
                fill
                sizes="(max-width: 650px) 100vw, 50vw"
                className={styles.image}
              />
              <span className={styles.label}>Concept B</span>
            </div>
          </>
        ) : (
          <>
            <Image
              src={after}
              alt="Concept B: an independent material and spatial design study"
              fill
              sizes="100vw"
              className={styles.image}
            />
            <div
              className={styles.overlay}
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={before}
                alt="Concept A: a material and spatial design study"
                fill
                sizes="100vw"
                className={styles.image}
              />
            </div>
            {position > 15 && <span className={styles.label}>Concept A</span>}
            {position < 85 && (
              <span className={`${styles.label} ${styles.right}`}>
                Concept B
              </span>
            )}
            <div
              className={styles.divider}
              style={{ left: `${position}%` }}
              aria-hidden="true"
            >
              <span>↔</span>
            </div>
          </>
        )}
      </div>
      <div className={styles.sliderControls}>
        <label htmlFor={`${id}-range`}>
          {split
            ? "Switch to overlay view to compare with the slider"
            : "Drag to explore the two concepts"}
        </label>
        <input
          id={`${id}-range`}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          disabled={split}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-describedby={`${id}-description`}
          aria-valuetext={`${position}% Concept A, ${100 - position}% Concept B`}
          data-cursor="DRAG"
        />
        <span className={styles.rangeNote}>
          Keyboard: arrow keys adjust; Home / End show one concept.
        </span>
      </div>
      <div className={styles.annotations}>
        <p>
          <span>01 / Material</span>Notice the relationship between tactile
          surfaces and quiet, architectural lines.
        </p>
        <p>
          <span>02 / Light</span>Consider how a different palette changes the
          way daylight is experienced.
        </p>
        <p>
          <span>Study note</span>Concept imagery is illustrative. Finishes and
          proportions are resolved for each individual brief.
        </p>
      </div>
    </section>
  );
}
