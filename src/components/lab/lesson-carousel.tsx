"use client";

import * as React from "react";
import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonAnimation, type LessonId } from "./lesson-animation";

export type Lab = {
  id: LessonId;
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
  external?: boolean;
};

const SWIPE_THRESHOLD = 60;
const SWIPE_IGNORE = "a, button, input, select, textarea, [role='button'], [data-no-swipe]";
const AUTOPLAY_MS = 6000;

// Runs before paint on the client (so the shuffle lands on the first frame, no
// skip), and falls back to useEffect on the server to avoid the SSR warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Per-|offset| placement around the 3D ring. The front card (offset 0) is upright
 *  and readable; neighbors curve back into depth. Tune here. */
type Placed = { x: string; rotateY: number; z: number; scale: number; opacity: number };
function placement(off: number): Placed {
  const a = Math.abs(off);
  const sign = Math.sign(off);
  if (a === 0) return { x: "0%", rotateY: 0, z: 0, scale: 1, opacity: 1 };
  if (a === 1) return { x: `${sign * 58}%`, rotateY: -sign * 38, z: -150, scale: 0.84, opacity: 0.62 };
  if (a === 2) return { x: `${sign * 96}%`, rotateY: -sign * 50, z: -300, scale: 0.72, opacity: 0.26 };
  return { x: `${sign * 120}%`, rotateY: -sign * 56, z: -440, scale: 0.64, opacity: 0 };
}

/** Shortest signed offset from `index` to `i` around a ring of `count`. */
function ringOffset(i: number, index: number, count: number) {
  let off = ((i - index) % count + count) % count; // 0..count-1
  if (off > count / 2) off -= count;
  return off;
}

const CARD_SHELL = "flex min-h-[460px] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm";

function Cta({ lab, interactive }: { lab: Lab; interactive: boolean }) {
  const className =
    "group/cta mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  if (!interactive) {
    return (
      <span aria-hidden="true" className={cn(className, "pointer-events-none")}>
        Start the lesson
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    );
  }
  return lab.external ? (
    <a href={lab.href} className={className}>
      Start the lesson
      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
    </a>
  ) : (
    <Link href={lab.href} className={className}>
      Start the lesson
      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
    </Link>
  );
}

function CardBody({ lab, front }: { lab: Lab; front: boolean }) {
  return (
    <>
      <div className="rounded-xl border border-border bg-background">
        <LessonAnimation id={lab.id} active={front} />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-link">{lab.eyebrow}</p>
      <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">{lab.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{lab.blurb}</p>
      <Cta lab={lab} interactive={front} />
    </>
  );
}

/** Spotlight carousel for the lab index, as a 3D coverflow ring: the front lesson
 *  is upright with a themed animation + description; neighbors curve back in 3D and
 *  rotate through as you cycle. Gentle autoplay (paused on hover/focus/hidden/
 *  reduced-motion, with a Pause/Play control), plus keyboard + swipe + dots. Fourier
 *  is pinned first; the rest are shuffled on the client after mount. Reduced motion
 *  drops the 3D for a single flat card. */
export function LessonCarousel({ labs }: { labs: Lab[] }) {
  const reduced = useReducedMotion();

  const fourierFirst = React.useMemo(() => {
    const f = labs.filter((l) => l.id === "spectrum");
    const rest = labs.filter((l) => l.id !== "spectrum");
    return [...f, ...rest];
  }, [labs]);

  const [items, setItems] = React.useState<Lab[]>(fourierFirst);
  const [index, setIndex] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [entering, setEntering] = React.useState(true);
  const swipe = React.useRef<{ x: number; y: number } | null>(null);

  // One-time client-only shuffle, applied BEFORE the first paint (layout effect) so
  // the shuffled neighbor order lands on the first frame with no visible re-order.
  // Random cannot run during render without a hydration mismatch; Fourier stays first.
  useIsoLayoutEffect(() => {
    const [first, ...rest] = fourierFirst;
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }
    setItems([first, ...rest]);
  }, []);

  const count = items.length;
  const active = items[index];

  const go = React.useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );
  const goTo = React.useCallback((i: number) => setIndex(i), []);

  React.useEffect(() => {
    const onVis = () => setHidden(document.visibilityState !== "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // The fan-out cascade only applies to the landing entrance; after it settles,
  // navigation springs with no per-card delay.
  React.useEffect(() => {
    const t = window.setTimeout(() => setEntering(false), 2100);
    return () => window.clearTimeout(t);
  }, []);

  const autoOk = !userPaused && !hovering && !focusWithin && !hidden && !reduced && count > 1;

  // Gentle autoplay. `index` in deps resets the timer after any manual nav.
  React.useEffect(() => {
    if (!autoOk) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [autoOk, count, index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (e.target instanceof Element && e.target.closest(SWIPE_IGNORE)) {
      swipe.current = null;
      return;
    }
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  const onBlurCapture = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
  };

  const cardShell = CARD_SHELL;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Interactive lessons"
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={onBlurCapture}
      className="mt-8"
    >
      <p className="sr-only" aria-live={autoOk ? "off" : "polite"}>
        {active.title}, {index + 1} of {count}
      </p>

      {reduced ? (
        // Flat, calm fallback: a single upright card, no perspective or rotation.
        <div className="mx-auto max-w-md">
          <div className={cardShell} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}: ${active.title}`}>
            <CardBody lab={active} front />
          </div>
        </div>
      ) : (
        // 3D coverflow ring.
        <div className="relative overflow-hidden px-1 py-4" style={{ perspective: 1200 }} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          <div className="relative mx-auto h-[460px] max-w-3xl" style={{ transformStyle: "preserve-3d" }}>
            {items.map((lab, i) => {
              const off = ringOffset(i, index, count);
              const a = Math.abs(off);
              const p = placement(off);
              const front = off === 0;
              return (
                <m.div
                  key={lab.id}
                  className={cn(
                    "absolute inset-x-0 top-0 mx-auto max-w-sm will-change-transform",
                    cardShell,
                    !front && "cursor-pointer",
                    a >= 1 && "max-sm:hidden", // mobile: front card only
                  )}
                  style={{ zIndex: 30 - a * 10 }}
                  initial={{ opacity: 0, scale: 0.7, z: -260, x: "0%", rotateY: 0 }}
                  animate={{ x: p.x, rotateY: p.rotateY, z: p.z, scale: p.scale, opacity: p.opacity }}
                  transition={
                    entering
                      ? { duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: a * 0.14 } // slow, gently dramatic arrival
                      : { type: "spring", stiffness: 210, damping: 26, mass: 0.9 } // snappy cycling
                  }
                  onClick={front ? undefined : () => goTo(i)}
                  aria-hidden={front ? undefined : true}
                  role={front ? "group" : undefined}
                  aria-roledescription={front ? "slide" : undefined}
                  aria-label={front ? `${index + 1} of ${count}: ${lab.title}` : undefined}
                >
                  <CardBody lab={lab} front={front} />
                </m.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous lesson"
          className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Choose a lesson">
          {items.map((l, i) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1}: ${l.title}`}
              onClick={() => goTo(i)}
              className={cn(
                "size-2.5 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                i === index ? "border-primary bg-primary" : "border-border bg-transparent hover:border-primary/60",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next lesson"
          className="grid size-10 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>

        {!reduced ? (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            aria-label={userPaused ? "Start autoplay" : "Pause autoplay"}
            className="ml-1 grid size-10 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {userPaused ? <Play aria-hidden="true" className="size-4 fill-current" /> : <Pause aria-hidden="true" className="size-4 fill-current" />}
          </button>
        ) : null}
      </div>
    </section>
  );
}
