"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
export default function HeroFilm() {
  const [playing, setPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    setEnabled(
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !connection?.saveData,
    );
  }, []);
  return (
    <div className="film-media">
      <Image
        src="/images/film-poster.webp"
        alt="Illustrative modern living space from the supplied architectural reference film"
        fill
        sizes="100vw"
      />
      <video
        ref={video}
        poster="/images/film-poster.webp"
        loop
        muted
        playsInline
        preload="none"
        aria-label="Illustrative architectural walkthrough"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {playing && <source src="/images/studio-film.mp4" type="video/mp4" />}
      </video>
      {enabled && (
        <button
          className="film-toggle"
          onClick={() => {
            if (playing) {
              video.current?.pause();
              setPlaying(false);
            } else {
              setPlaying(true);
              requestAnimationFrame(() => {
                video.current?.load();
                void video.current?.play();
              });
            }
          }}
        >
          {playing ? "Pause film Ⅱ" : "Play concept film ▷"}
        </button>
      )}
      <span className="film-caption">
        ILLUSTRATIVE REFERENCE FILM · NOT AN MK COMMISSION
      </span>
    </div>
  );
}
