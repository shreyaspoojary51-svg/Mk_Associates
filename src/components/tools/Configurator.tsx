"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  briefSchema,
  estimateInputSchema,
  type DesignBrief,
} from "@/lib/lead-schema";
import { whatsappLink, type EstimateInput } from "@/lib/estimate";
import ProposalDownload from "./ProposalDownload";
import s from "./tools.module.css";
import { readSessionJSON } from "./session";
const rooms: DesignBrief["room"][] = [
  "Living room",
  "Bedroom",
  "Kitchen",
  "Workspace",
  "Café",
];
const palettes: {
  name: DesignBrief["palette"];
  colors: string[];
  description: string;
}[] = [
  {
    name: "Warm neutrals",
    colors: ["#d5c8b2", "#a99073", "#ede5d7"],
    description: "Soft light. Quiet warmth. An effortless everyday sanctuary.",
  },
  {
    name: "Earth & olive",
    colors: ["#7b8060", "#b39477", "#d7cfbd"],
    description: "Grounded textures and organic tones, with a touch of green.",
  },
  {
    name: "Monochrome",
    colors: ["#393b37", "#aaa99f", "#e6e4da"],
    description:
      "A measured contrast. Architectural lines. Timeless simplicity.",
  },
  {
    name: "Coastal calm",
    colors: ["#a3b9b5", "#ddceb6", "#f0ede4"],
    description: "Airy shades and a relaxed rhythm, inspired by the coast.",
  },
];
const materials: DesignBrief["material"][] = [
  "Natural oak",
  "Walnut",
  "Stone",
  "Textured plaster",
];
const initial: DesignBrief = {
  room: "Living room",
  palette: "Warm neutrals",
  material: "Natural oak",
};
const roomImages = {
  "Living room": [1, 2],
  Bedroom: [3, 4],
  Kitchen: [2, 6],
  Workspace: [5, 4],
  Café: [6, 2],
};
const curatedDirections = {
  earth: { palette: "Earth & olive", material: "Walnut" },
  stone: { palette: "Monochrome", material: "Stone" },
  calm: { palette: "Coastal calm", material: "Textured plaster" },
} satisfies Record<string, Pick<DesignBrief, "palette" | "material">>;
export default function Configurator({
  curated,
}: {
  curated?: keyof typeof curatedDirections;
}) {
  const [brief, setBrief] = useState<DesignBrief>(initial);
  const [estimate, setEstimate] = useState<EstimateInput>();
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(true);
  const reduce = useReducedMotion();
  useEffect(() => {
    try {
      const parsed = briefSchema.safeParse(readSessionJSON("mk-design-brief"));
      const restored = parsed.success ? parsed.data : initial;
      setBrief(
        curated ? { ...restored, ...curatedDirections[curated] } : restored,
      );
      const ep = estimateInputSchema.safeParse(readSessionJSON("mk-estimate"));
      if (ep.success) setEstimate(ep.data);
    } catch {}
    setHydrated(true);
  }, [curated]);
  useEffect(() => {
    if (hydrated)
      try {
        sessionStorage.setItem("mk-design-brief", JSON.stringify(brief));
        setSaved(true);
      } catch {
        setSaved(false);
      }
  }, [brief, hydrated]);
  const palette = palettes.find((p) => p.name === brief.palette)!;
  const images = roomImages[brief.room];
  const summary = `Design direction\nRoom: ${brief.room}\nPalette: ${brief.palette}\nMaterial: ${brief.material}\nInspiration only; finishes and availability to be confirmed.`;
  return (
    <div className={s.shell}>
      <div className="container">
        <header className={`page-intro ${s.intro}`}>
          <span className={`eyebrow ${s.overline}`}>
            Find your direction / 02
          </span>
          <h1 className="display">
            A space that
            <br />
            feels like you.
          </h1>
          <p className="body-large">
            Begin with a feeling. Pair a room, a palette and a material to shape
            a simple visual brief for our first conversation.
          </p>
        </header>
        <div className={`tool-layout ${s.grid}`}>
          <div>
            <div
              className={`moodboard ${s.collage}`}
              role="group"
              aria-label={`${brief.room} inspiration moodboard in ${brief.palette}`}
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={brief.room}
                  className={s.collageMain}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.45 }}
                >
                  <Image
                    fill
                    priority
                    src={
                      brief.room === "Kitchen"
                        ? "/images/kitchen.webp"
                        : `/images/project-${images[0]}.webp`
                    }
                    alt="Interior project inspiration, main view"
                    sizes="(max-width: 740px) 80vw, 40vw"
                  />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={`${brief.room}-${brief.material}`}
                  className={s.collageDetail}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.4 }}
                >
                  <Image
                    fill
                    src={`/images/project-${images[1]}.webp`}
                    alt="Interior project inspiration, detail view"
                    sizes="(max-width: 740px) 40vw, 24vw"
                  />
                </motion.div>
              </AnimatePresence>
              <div className={s.collageSmall}>
                <Image
                  fill
                  src={
                    brief.material === "Stone" ||
                    brief.material === "Textured plaster"
                      ? "/images/material-stone.webp"
                      : "/images/material-wood.webp"
                  }
                  alt="Illustrative surface texture reference, not a final specification"
                  sizes="(max-width: 740px) 35vw, 20vw"
                />
              </div>
              <div
                className={s.swatches}
                role="group"
                aria-label="Selected palette swatches"
              >
                {palette.colors.map((color, i) => (
                  <motion.div
                    className={`swatch ${s.swatch}`}
                    key={i}
                    animate={{ backgroundColor: color }}
                    transition={{ duration: reduce ? 0 : 0.35 }}
                    role="img"
                    aria-label={`Palette colour ${color}`}
                  />
                ))}
              </div>
              <span className={s.caption}>
                A study in {brief.palette.toLowerCase()}
                <br />
                {brief.material}
              </span>
            </div>
            <div className={s.designLabel}>
              <div>
                <h2>{brief.palette}</h2>
                <p>{palette.description}</p>
              </div>
              <span className={s.pill}>Your personal edit</span>
            </div>
            <p className={`note ${s.note}`}>
              A collage of reference imagery, not a generated room render. Your
              selections define the brief; the photographs do not change their
              actual finishes.
            </p>
          </div>
          <section
            className={`tool-panel ${s.panel}`}
            aria-labelledby="direction-title"
          >
            <span className={s.overline}>Three simple choices</span>
            <h2 id="direction-title">Set the tone.</h2>
            <div className={s.stack}>
              <fieldset className={s.fieldset}>
                <legend>01 / Choose your room</legend>
                <div className={`chip-grid ${s.chips}`}>
                  {rooms.map((room) => (
                    <button
                      type="button"
                      className={`chip ${s.chip}`}
                      key={room}
                      aria-pressed={brief.room === room}
                      onClick={() => setBrief((prev) => ({ ...prev, room }))}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className={s.fieldset}>
                <legend>02 / Find your palette</legend>
                <div className={`chip-grid ${s.chips}`}>
                  {palettes.map((p) => (
                    <button
                      type="button"
                      className={`chip ${s.chip}`}
                      key={p.name}
                      aria-pressed={brief.palette === p.name}
                      onClick={() =>
                        setBrief((prev) => ({ ...prev, palette: p.name }))
                      }
                    >
                      <span
                        className={s.paletteDot}
                        style={{ background: p.colors[0] }}
                        aria-hidden="true"
                      />
                      {p.name}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className={s.fieldset}>
                <legend>03 / Add a material</legend>
                <div className={`chip-grid ${s.chips}`}>
                  {materials.map((material) => (
                    <button
                      type="button"
                      className={`chip ${s.chip}`}
                      key={material}
                      aria-pressed={brief.material === material}
                      onClick={() =>
                        setBrief((prev) => ({ ...prev, material }))
                      }
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <h3>Your design direction</h3>
                <dl className={s.review} aria-live="polite">
                  <div>
                    <dt>Room</dt>
                    <dd>{brief.room}</dd>
                  </div>
                  <div>
                    <dt>Palette</dt>
                    <dd>{brief.palette}</dd>
                  </div>
                  <div>
                    <dt>Material</dt>
                    <dd>{brief.material}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className={s.actions}>
              <Link
                className={`button ${s.primary}`}
                href={`/contact?summary=${encodeURIComponent(summary)}`}
              >
                Bring this idea to life ↗
              </Link>
              <Link
                className={`button-outline ${s.secondary}`}
                href="/estimator"
              >
                Explore a budget ↗
              </Link>
              <a
                className={`button-outline ${s.secondary}`}
                href={whatsappLink(
                  `Hello MK Associates, I configured my design direction on your website:\n\n• Room: ${brief.room}\n• Palette: ${brief.palette}\n• Material: ${brief.material}\n\nI have our planning PDF ready. I'd love to discuss this with your team!`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Share brief on WhatsApp ↗
              </a>
            </div>
            <ProposalDownload brief={brief} estimate={estimate} />
            <p className={`note ${s.note}`} role="status">
              {saved
                ? "Your direction is saved in this browser tab for this session. Nothing is sent until you submit an enquiry or request an email copy."
                : "Your browser could not save this direction. You can still download it or continue to the enquiry form."}
            </p>
            <button
              className={s.chip}
              type="button"
              onClick={() => setBrief(initial)}
            >
              Reset direction
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
