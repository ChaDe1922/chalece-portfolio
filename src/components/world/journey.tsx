"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { makeWorldStore } from "@/lib/world-store";
import { useWebGLSupport } from "@/components/lab/recursion/mirror-tunnel/use-webgl-support";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

const WorldCanvas = dynamic(
  () => import("./world-canvas").then((m) => m.WorldCanvas),
  { ssr: false, loading: () => null },
);

/** The content beats you travel past, integrated over the living world. Real DOM
 *  (accessible); the reduced-motion / no-WebGL path renders them as a plain
 *  stacked reading order. */
const BEATS = [
  {
    key: "hero",
    eyebrow: "Learning systems · AI · Interactive media · Sound",
    title: "From signal to skill.",
    body: "I design the systems, stories, and experiences that turn complex technology into human capability.",
  },
  {
    key: "metrics",
    eyebrow: "The proof",
    title: "48,000+ learners.",
    body: "Ten published Coursera courses. A decade turning complexity into capability.",
  },
  {
    key: "thesis",
    eyebrow: "The idea",
    title: "Complexity is not the problem. The experience is.",
    body: "People do not need complex ideas stripped of their intelligence. They need better ways to enter them, test them, and make them their own.",
  },
  {
    key: "codio",
    eyebrow: "01 · Technical learning at scale",
    title: "Codio and Coursera.",
    body: "Ten technical courses. One repeatable learning system that has reached more than 48,000 learners.",
  },
];

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Immersive-journey preview: scrolling flies the camera forward through the
 * living wave world while the content beats crossfade in and out IN PLACE (a
 * sticky stage), so no two beats are on screen at once and nothing scrolls up.
 * You travel past the numbers and the thesis on the way to the Codio "room".
 * Reduced-motion / no-WebGL falls back to a plain, accessible stacked reading.
 */
export function Journey() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport(); // null until probed
  const containerRef = React.useRef<HTMLDivElement>(null);
  const beatRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [store] = React.useState(() => makeWorldStore());
  const [active, setActive] = React.useState(true);
  const [tier] = React.useState<{ quality: "high" | "low" }>(() => {
    if (typeof window === "undefined") return { quality: "high" };
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    return { quality: wide && fine ? "high" : "low" };
  });

  const use3D = webgl === true && !reduced;

  // Scroll -> journey progress -> worldProgress (camera flies) + per-beat
  // crossfade opacity, written straight to the DOM (no React render per frame).
  // A pin-less ScrollTrigger over the tall container drives it.
  useGSAP(
    () => {
      if (!use3D) return;
      const el = containerRef.current;
      if (!el) return;
      const n = BEATS.length;
      const win = 0.5 / n; // half-width of each beat's visible window
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            store.worldProgress = p;
            for (let i = 0; i < n; i++) {
              const b = beatRefs.current[i];
              if (!b) continue;
              const center = (i + 0.5) / n;
              const op = clamp01(1 - Math.abs(p - center) / win);
              b.style.opacity = String(op);
              b.style.transform = `translateY(${(p - center) * -48}px)`;
            }
          },
        });
      });
    },
    { dependencies: [use3D, store] },
  );

  // Pause (unmount) the always-rendering canvas when offscreen / tab hidden.
  React.useEffect(() => {
    if (!use3D) return;
    const el = containerRef.current;
    if (!el) return;
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

  const backLink = (
    <Link
      href="/lab"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <ArrowLeft aria-hidden="true" className="size-4" /> Back to the Lab
    </Link>
  );

  // Fallback: plain, readable stacked beats (accessible; no canvas).
  if (!use3D) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          {backLink}
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Prototype
          </span>
        </div>
        <ol className="space-y-14">
          {BEATS.map((b) => (
            <li key={b.key}>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {b.eyebrow}
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
                {b.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {b.body}
              </p>
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
      style={{ height: `${BEATS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          {active ? <WorldCanvas store={store} quality={tier.quality} /> : null}
        </div>

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-5 md:px-8">
          {backLink}
          <span className="rounded-full border border-white/25 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-white/70">
            Prototype
          </span>
        </div>

        {/* Beats crossfade in place over the moving world. */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="relative w-full max-w-3xl text-center">
            {BEATS.map((b, i) => (
              <div
                key={b.key}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                className="absolute inset-x-0"
                style={{ opacity: 0 }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                  {b.eyebrow}
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-6xl">
                  {b.title}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-white/75 sm:text-lg">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute inset-x-0 bottom-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          Scroll to travel
        </p>
      </div>
    </div>
  );
}
