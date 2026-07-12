"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";

/** The stations the camera flies through. DOM carries the meaning; the 3D is
 *  decorative. Placeholder content by design: this is a feel test of the
 *  "continuous world" scroll, not a shippable homepage. */
const STATIONS = [
  {
    title: "From signal to skill",
    blurb: "The whole portfolio as one continuous space you travel through.",
  },
  {
    title: "Codio and Coursera",
    blurb: "Ten technical courses. One repeatable learning system.",
  },
  {
    title: "Making sound visible",
    blurb: "Play a sound, isolate its frequencies, watch the math unfold.",
  },
  {
    title: "Let's build something",
    blurb: "cdelacoudray@gmail.com",
  },
];

const STATION_Z = [0, -12, -24, -36];
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

const WorldCanvas = dynamic(
  () => import("./world-canvas").then((m) => m.WorldCanvas),
  { ssr: false, loading: () => null },
);

/**
 * Unlisted prototype of the "continuous 3D world" scroll (option 2 in the
 * cinematic-scroll workshop): one persistent canvas, and scrolling flies a
 * camera through a connected space where each section is a station you arrive
 * at. Reduced-motion / no-WebGL falls back to a plain, accessible station list,
 * so the content is never trapped in the canvas.
 */
export function ContinuousWorld() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport(); // null until probed
  const containerRef = React.useRef<HTMLDivElement>(null);
  const invalidateRef = React.useRef<(() => void) | null>(null);
  // Scroll progress (0..1) as a ref: the scroll handler writes it and the
  // useFrame camera reads it, so nothing renders per frame.
  const progressRef = React.useRef(0);
  const [activeStation, setActiveStation] = React.useState(0);
  const [active, setActive] = React.useState(true);

  const registerInvalidate = React.useCallback((fn: () => void) => {
    invalidateRef.current = fn;
  }, []);

  const use3D = webgl === true && !reduced;

  // Pause (unmount) the canvas when the tab is hidden or the stage is offscreen.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !use3D) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    const onVis = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [use3D]);

  // Scroll -> camera progress + active caption. Writes the plain progress object
  // (no React render per frame) and wakes the demand loop.
  React.useEffect(() => {
    if (!use3D) return;
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;
      progressRef.current = p;
      invalidateRef.current?.();
      setActiveStation(Math.min(STATIONS.length - 1, Math.floor(p * STATIONS.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [use3D]);

  const backLink = (
    <Link
      href="/lab"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft aria-hidden="true" className="size-4" /> Back to the Lab
    </Link>
  );

  // Fallback: reduced-motion or no WebGL (or before the probe resolves) -> a
  // plain, readable list of the stations. Content is never trapped in 3D.
  if (!use3D) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          {backLink}
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Prototype
          </span>
        </div>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          Continuous world
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          A sample of the fully immersive option: one 3D space you fly through as
          you scroll. The interactive fly-through needs motion and WebGL; here is
          the same journey as plain stations.
        </p>
        <ol className="mt-10 space-y-4">
          {STATIONS.map((s, i) => (
            <li
              key={s.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Station {i + 1}
              </p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">
                {s.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
            </li>
          ))}
        </ol>
      </main>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-[#05040d] text-white"
      style={{ height: `${STATIONS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          {active ? (
            <WorldCanvas
              progressRef={progressRef}
              registerInvalidate={registerInvalidate}
              stationZ={STATION_Z}
            />
          ) : null}
        </div>

        {/* Top bar: navigation + prototype tag (crisp DOM over the canvas). */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-5 md:px-8">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to the Lab
          </Link>
          <span className="rounded-full border border-white/25 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-white/70">
            Prototype
          </span>
        </div>

        {/* Station caption: crossfades as the camera arrives at each portal. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-lg text-center">
            {STATIONS.map((s, i) => (
              <div
                key={s.title}
                className={cn(
                  "absolute inset-x-0 transition-opacity duration-500",
                  i === activeStation ? "opacity-100" : "opacity-0",
                )}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                  Station {i + 1} of {STATIONS.length}
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-base text-white/75 sm:text-lg">
                  {s.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue. */}
        <p className="absolute inset-x-0 bottom-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          Scroll to fly through
        </p>
      </div>
    </div>
  );
}
