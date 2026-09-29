"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./motion.module.css";

/** Enhancement only: page content is never hidden while waiting for JavaScript. */
export default function MotionSystem() {
  const progress = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const cursorLabel = useRef<HTMLElement>(null);
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const gain = useRef<GainNode | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const value =
        distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      if (progress.current)
        progress.current.style.transform = `scaleX(${value})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    let dispose: (() => void) | undefined;
    let generation = 0;
    const configure = () => {
      const token = ++generation;
      dispose?.();
      dispose = undefined;
      if (cursor.current) cursor.current.style.opacity = "0";
      if (reduced.matches) return;
      const desktop = fine.matches && navigator.maxTouchPoints === 0;
      let cancelled = false;
      const cleanups: (() => void)[] = [];
      dispose = () => {
        cancelled = true;
        cleanups.reverse().forEach((fn) => fn());
      };
      // Cursor remains decorative. The operating-system pointer is never hidden.
      if (desktop) {
        let magnetic: HTMLElement | null = null;
        const originals = new Map<HTMLElement, string>();
        const resetMagnet = () => {
          if (magnetic)
            magnetic.style.translate = originals.get(magnetic) || "";
          magnetic = null;
        };
        const move = (event: PointerEvent) => {
          if (!cursor.current) return;
          cursor.current.style.opacity = "0.65";
          cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
          const target = event.target instanceof Element ? event.target : null;
          const label = target
            ?.closest<HTMLElement>("[data-cursor]")
            ?.dataset.cursor?.toUpperCase();
          if (cursorLabel.current)
            cursorLabel.current.textContent =
              label && ["VIEW", "EXPLORE", "DRAG"].includes(label) ? label : "";
          const button = target?.closest<HTMLElement>(".button") || null;
          if (button !== magnetic) {
            resetMagnet();
            magnetic = button;
          }
          if (magnetic && !magnetic.matches(":focus-visible")) {
            if (!originals.has(magnetic))
              originals.set(magnetic, magnetic.style.translate);
            const rect = magnetic.getBoundingClientRect();
            const x = Math.max(
              -4,
              Math.min(4, (event.clientX - rect.left - rect.width / 2) * 0.07),
            );
            const y = Math.max(
              -4,
              Math.min(4, (event.clientY - rect.top - rect.height / 2) * 0.07),
            );
            magnetic.style.translate = `${x}px ${y}px`;
          }
        };
        const leave = () => {
          if (cursor.current) cursor.current.style.opacity = "0";
          resetMagnet();
        };
        window.addEventListener("pointermove", move, { passive: true });
        document.addEventListener("pointerleave", leave);
        window.addEventListener("blur", leave);
        cleanups.push(() => {
          window.removeEventListener("pointermove", move);
          document.removeEventListener("pointerleave", leave);
          window.removeEventListener("blur", leave);
          originals.forEach((value, element) => {
            element.style.translate = value;
          });
        });
      }
      void import("gsap")
        .then(({ gsap }) => {
          if (cancelled || token !== generation) return;
          const animated = new Set<Element>();
          const tweens = new Set<ReturnType<typeof gsap.to>>();
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting || animated.has(entry.target)) return;
                animated.add(entry.target);
                observer.unobserve(entry.target);
                const tween = gsap.fromTo(
                  entry.target,
                  { y: 16 },
                  {
                    y: 0,
                    duration: 0.55,
                    ease: "power2.out",
                    clearProps: "transform",
                  },
                );
                tweens.add(tween);
              });
            },
            { threshold: 0.1 },
          );
          const scan = () =>
            document.querySelectorAll(".reveal").forEach((el) => {
              if (!animated.has(el)) observer.observe(el);
            });
          scan();
          const mutations = new MutationObserver(scan);
          mutations.observe(document.body, { childList: true, subtree: true });
          cleanups.push(() => {
            observer.disconnect();
            mutations.disconnect();
            tweens.forEach((tween) => tween.kill());
            animated.forEach((el) => {
              if (el instanceof HTMLElement)
                el.style.removeProperty("transform");
            });
          });
          if (desktop) {
            // Load the scroll plugin only on eligible desktop devices. Source SVGs are fully drawn.
            void import("gsap/ScrollTrigger")
              .then(({ ScrollTrigger }) => {
                if (cancelled || token !== generation) return;
                gsap.registerPlugin(ScrollTrigger);
                const drawn = new Map<
                  SVGGeometryElement,
                  { dash: string; offset: string }
                >();
                const drawings = new Set<ReturnType<typeof gsap.to>>();
                const scanPaths = () => {
                  document
                    .querySelectorAll<SVGGeometryElement>(
                      "[data-draw-path], svg[aria-labelledby='timeline-title'] path",
                    )
                    .forEach((path) => {
                      if (
                        drawn.has(path) ||
                        typeof path.getTotalLength !== "function"
                      )
                        return;
                      const length = path.getTotalLength();
                      if (!length || !Number.isFinite(length)) return;
                      drawn.set(path, {
                        dash: path.style.strokeDasharray,
                        offset: path.style.strokeDashoffset,
                      });
                      const tween = gsap.fromTo(
                        path,
                        { strokeDasharray: length, strokeDashoffset: length },
                        {
                          strokeDashoffset: 0,
                          duration: 0.6,
                          ease: "none",
                          scrollTrigger: {
                            trigger: path.closest("svg") || path,
                            start: "top 85%",
                            end: "bottom 40%",
                            scrub: 0.4,
                            invalidateOnRefresh: true,
                          },
                        },
                      );
                      drawings.add(tween);
                    });
                };
                scanPaths();
                const changes = new MutationObserver(scanPaths);
                changes.observe(document.body, {
                  childList: true,
                  subtree: true,
                });
                cleanups.push(() => {
                  changes.disconnect();
                  drawings.forEach((tween) => {
                    tween.scrollTrigger?.kill();
                    tween.kill();
                  });
                  drawn.forEach((original, path) => {
                    path.style.strokeDasharray = original.dash;
                    path.style.strokeDashoffset = original.offset;
                  });
                });
              })
              .catch(() => {
                /* All SVG lines remain drawn without the plugin. */
              });
            let raf = 0;
            const elements = Array.from(
              document.querySelectorAll<HTMLElement>(".parallax"),
            );
            const paint = () => {
              raf = 0;
              elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > innerHeight) return;
                const y = Math.max(
                  -12,
                  Math.min(
                    12,
                    (rect.top + rect.height / 2 - innerHeight / 2) * 0.025,
                  ),
                );
                el.style.translate = `0 ${y}px`;
              });
            };
            const scroll = () => {
              if (!raf) raf = requestAnimationFrame(paint);
            };
            window.addEventListener("scroll", scroll, { passive: true });
            paint();
            cleanups.push(() => {
              cancelAnimationFrame(raf);
              window.removeEventListener("scroll", scroll);
              elements.forEach((el) => el.style.removeProperty("translate"));
            });
          }
        })
        .catch(() => {
          /* Native static content remains fully readable. */
        });
      if (desktop)
        void import("lenis")
          .then(({ default: Lenis }) => {
            if (cancelled || token !== generation) return;
            const lenis = new Lenis({
              duration: 0.6,
              smoothWheel: true,
              syncTouch: false,
              anchors: true,
              prevent: (node) =>
                Boolean(node.closest("dialog, [data-lenis-prevent]")),
            });
            let raf = 0;
            const tick = (time: number) => {
              lenis.raf(time);
              raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            // Native keyboard navigation must not compete with an in-flight wheel tween.
            const keyboard = (event: KeyboardEvent) => {
              if (
                [
                  "Tab",
                  "ArrowUp",
                  "ArrowDown",
                  "PageUp",
                  "PageDown",
                  "Home",
                  "End",
                  " ",
                ].includes(event.key)
              ) {
                lenis.scrollTo(window.scrollY, { immediate: true });
              }
            };
            window.addEventListener("keydown", keyboard);
            cleanups.push(() => {
              cancelAnimationFrame(raf);
              window.removeEventListener("keydown", keyboard);
              lenis.destroy();
            });
          })
          .catch(() => {
            /* Native scrolling is the fallback. */
          });
    };
    configure();
    reduced.addEventListener("change", configure);
    fine.addEventListener("change", configure);
    return () => {
      generation++;
      dispose?.();
      reduced.removeEventListener("change", configure);
      fine.removeEventListener("change", configure);
    };
  }, []);

  useEffect(() => {
    const context = audio.current;
    if (context && gain.current) {
      gain.current.gain.setTargetAtTime(
        sound ? 0.008 : 0,
        context.currentTime,
        0.2,
      );
      if (sound) void context.resume().catch(() => setSound(false));
      else {
        const timer = setTimeout(() => {
          void context.suspend();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [sound]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) {
        setSound(false);
        void audio.current?.suspend();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      void audio.current?.close();
      audio.current = null;
    };
  }, []);
  const toggleSound = () => {
    if (!audio.current) {
      try {
        const context = new AudioContext();
        const volume = context.createGain();
        volume.gain.value = 0;
        volume.connect(context.destination);
        [110, 164.81, 220].forEach((frequency) => {
          const oscillator = context.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          oscillator.connect(volume);
          oscillator.start();
        });
        audio.current = context;
        gain.current = volume;
      } catch {
        return;
      }
    }
    setSound((value) => !value);
  };
  return (
    <>
      <div
        ref={progress}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 2,
          background: "#a77b45",
          transform: "scaleX(0)",
          transformOrigin: "left",
          zIndex: 100,
          pointerEvents: "none",
        }}
      />
      <div ref={cursor} className={styles.cursor} aria-hidden="true">
        <span />
        <small ref={cursorLabel} />
      </div>
      <button
        className={styles.sound}
        type="button"
        aria-pressed={sound}
        onClick={toggleSound}
        aria-label={sound ? "Turn ambient sound off" : "Turn ambient sound on"}
      >
        <span aria-hidden="true">{sound ? "♫" : "♪"}</span> Sound{" "}
        {sound ? "on" : "off"}
      </button>
    </>
  );
}
