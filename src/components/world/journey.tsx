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

// All Act I content. On the 3D path the hero title shows as DOM (fading into the
// world) and the stats present as 3D plaques on the corridor walls; a parallel
// sr-only block carries the full semantic content, and the reduced-motion /
// no-WebGL path renders it all as a plain stacked reading.
// (The hero wave field crossfades in during the Phase 5 homepage unification,
// where hero + world share one WebGL context.)
const HERO = {
  eyebrow: "Learning systems · AI · Interactive media · Sound",
  title: "From signal to skill.",
  body: "I design the systems, stories, and experiences that turn complex technology into human capability.",
};
const STATS = [
  { value: "48,000+", label: "Learners reached" },
  { value: "10", label: "Published Coursera courses" },
  { value: "10+", label: "Years in learning and technology" },
  { value: "M.S.", label: "Music Technology, Georgia Tech" },
];
const THESIS = "Complexity is not the problem. The experience is.";
const ATRIUM = "The work behind the point of view.";
const CODIO = {
  title: "Codio and Coursera.",
  body: "Ten technical courses. One repeatable learning system that has reached more than 48,000 learners.",
};

const SCROLL_VH = 5; // journey scroll length, in viewport-heights
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth01 = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Immersive Act I journey (preview). Scrolling flies the camera forward through
 * the living wave world; the DOM hero title fades into the world, the four stats
 * read as plaques on the corridor walls (3D). Reduced-motion / no-WebGL falls
 * back to a plain accessible reading.
 */
export function Journey() {
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport(); // null until probed
  const containerRef = React.useRef<HTMLDivElement>(null);
  const heroTitleRef = React.useRef<HTMLDivElement>(null);
  const [store] = React.useState(() => makeWorldStore());
  const [active, setActive] = React.useState(true);
  const [tier] = React.useState<{ quality: "high" | "low" }>(() => {
    if (typeof window === "undefined") return { quality: "high" };
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    return { quality: wide && fine ? "high" : "low" };
  });

  const use3D = webgl === true && !reduced;

  // Scroll -> worldProgress (camera flies) + hero title fade, written straight to
  // the store / DOM (no per-frame React render).
  useGSAP(
    () => {
      if (!use3D) return;
      const el = containerRef.current;
      if (!el) return;
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
            const heroFade = 1 - smooth01(0.02, 0.12, p);
            store.heroFade = heroFade;
            if (heroTitleRef.current)
              heroTitleRef.current.style.opacity = String(heroFade);
          },
        });
      });
    },
    { dependencies: [use3D, store] },
  );

  // Pause (unmount) the canvas when offscreen / tab hidden.
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

  // Fallback: reduced-motion / no-WebGL -> plain, readable, accessible stack.
  if (!use3D) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Back to the Lab
          </Link>
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Prototype
          </span>
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {HERO.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">
          {HERO.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {HERO.body}
        </p>
        <ul className="mt-12 grid grid-cols-2 gap-6">
          {STATS.map((s) => (
            <li key={s.value}>
              <p className="font-display text-3xl tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </li>
          ))}
        </ul>
        <h2 className="mt-14 font-display text-3xl tracking-tight">{THESIS}</h2>
        <h2 className="mt-14 font-display text-3xl tracking-tight">{ATRIUM}</h2>
        <div className="mt-14">
          <h2 className="font-display text-3xl tracking-tight">{CODIO.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {CODIO.body}
          </p>
        </div>
      </main>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-[#05040d] text-white"
      style={{ height: `${SCROLL_VH * 100}vh` }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: "#05040d" }}
      >
        <div aria-hidden="true" className="absolute inset-0">
          {active ? <WorldCanvas store={store} quality={tier.quality} /> : null}
        </div>

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

        {/* Hero title (DOM), fades into the world. */}
        <div
          ref={heroTitleRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
        >
          <div className="max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">
              {HERO.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-7xl">
              {HERO.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/75 sm:text-lg">
              {HERO.body}
            </p>
          </div>
        </div>

        {/* Accessible mirror of everything presented in 3D. */}
        <div className="sr-only">
          <h2>{HERO.title}</h2>
          <p>{HERO.body}</p>
          <ul>
            {STATS.map((s) => (
              <li key={s.value}>
                {s.value} — {s.label}
              </li>
            ))}
          </ul>
          <h2>{THESIS}</h2>
          <h2>{ATRIUM}</h2>
          <h2>{CODIO.title}</h2>
          <p>{CODIO.body}</p>
        </div>

        <p className="absolute inset-x-0 bottom-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          Scroll to travel
        </p>
      </div>
    </div>
  );
}
