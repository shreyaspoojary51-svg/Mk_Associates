"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
// Importing this wrapper does not import Three.js. The chunk is requested only after the gate.
const MaterialReveal = dynamic(() => import("./MaterialReveal"), {
  ssr: false,
  loading: () => null,
});
type NetworkNavigator = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};
type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};
class EnhancementBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function HeroEnhancement() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(hover: hover) and (pointer: fine)");
    const nav = navigator as NetworkNavigator;
    if (
      reduced.matches ||
      !desktop.matches ||
      navigator.maxTouchPoints > 0 ||
      (navigator.hardwareConcurrency || 2) <= 4 ||
      (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
      nav.connection?.saveData
    )
      return;
    let disposed = false;
    let attempted = false;
    let timer = 0,
      expiry = 0,
      idle = 0,
      frame = 0;
    const idleWindow = window as IdleWindow;
    const benchmark = () => {
      if (disposed || attempted || document.hidden || reduced.matches) return;
      attempted = true;
      observer?.disconnect();
      // Exercise an actual WebGL command path and synchronise completion before loading Three.
      const probe = document.createElement("canvas");
      probe.width = 128;
      probe.height = 128;
      const gl = probe.getContext("webgl", {
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      if (!gl) return;
      const gpuStarted = performance.now();
      for (let i = 0; i < 16; i++) {
        gl.clearColor(i / 16, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.finish();
      const gpuTime = performance.now() - gpuStarted;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (gpuTime > 12) return;
      const started = performance.now();
      let sum = 0;
      for (let index = 0; index < 90000; index++) sum += Math.sqrt(index);
      if (!Number.isFinite(sum) || performance.now() - started > 12) return;
      let previous = performance.now(),
        samples = 0,
        total = 0;
      const sample = (now: number) => {
        if (disposed) return;
        total += now - previous;
        previous = now;
        samples++;
        if (samples < 4) frame = requestAnimationFrame(sample);
        else if (total / samples < 26 && !document.hidden && !reduced.matches) {
          setEnabled(true);
          expiry = window.setTimeout(() => {
            disposed = true;
            setEnabled(false);
          }, 8000);
        }
      };
      frame = requestAnimationFrame(sample);
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (idleWindow.requestIdleCallback)
          idle = idleWindow.requestIdleCallback(benchmark, { timeout: 2000 });
        else timer = window.setTimeout(benchmark, 250);
      }, 1400);
    };
    // Wait until load and a quiet LCP window; never compete with hero-image loading.
    let observer: PerformanceObserver | undefined;
    try {
      observer = new PerformanceObserver(() => {
        if (document.readyState === "complete") schedule();
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* load + idle fallback */
    }
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    const disable = () => {
      if (reduced.matches || !desktop.matches || document.hidden) {
        disposed = true;
        setEnabled(false);
      }
    };
    reduced.addEventListener("change", disable);
    desktop.addEventListener("change", disable);
    document.addEventListener("visibilitychange", disable);
    return () => {
      disposed = true;
      clearTimeout(timer);
      clearTimeout(expiry);
      if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idle);
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("load", schedule);
      reduced.removeEventListener("change", disable);
      desktop.removeEventListener("change", disable);
      document.removeEventListener("visibilitychange", disable);
    };
  }, []);
  return enabled ? (
    <EnhancementBoundary>
      <MaterialReveal />
    </EnhancementBoundary>
  ) : null;
}
