"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeckProvider } from "@/components/deck/deck-context";
import type { Slide } from "@/components/deck/types";

type SlideDeckProps = {
  slides: Slide[];
  deckId: string;
  className?: string;
};

const SWIPE_THRESHOLD = 60; // px of horizontal travel to count as a swipe
const INTERACTIVE = "a, button, input, select, textarea, [contenteditable], [role='button']";

/** Reusable, data-driven full-viewport slide deck. Keyboard, swipe, dots, hash
 *  deep-linking, reduced-motion aware, and a completion gate for slide bodies. */
export function SlideDeck({ slides, deckId, className }: SlideDeckProps) {
  const reduced = useReducedMotion();
  const count = slides.length;

  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [completed, setCompleted] = React.useState<Set<string>>(new Set());
  const mounted = React.useRef(false);

  const headingId = (slide: Slide) => `${deckId}__h__${slide.id}`;

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      setDirection(clamped > index ? 1 : clamped < index ? -1 : 0);
      setIndex(clamped);
    },
    [count, index],
  );

  // Deep-link: read the hash on mount, write it on change.
  React.useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    const found = slides.findIndex((s) => s.id === id);
    if (found >= 0) setIndex(found);
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!mounted.current) return;
    const id = slides[index]?.id;
    if (id) window.history.replaceState(null, "", `#${id}`);
  }, [index, slides]);

  // Move focus to the new slide heading on change (not on first mount).
  React.useEffect(() => {
    if (!mounted.current) return;
    const el = document.getElementById(headingId(slides[index]));
    el?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const current = slides[index];
  const gated = Boolean(current?.advanceGate) && !completed.has(current.id);
  const atStart = index === 0;
  const atEnd = index === count - 1;

  const next = React.useCallback(() => {
    if (!gated) goTo(index + 1);
  }, [gated, goTo, index]);
  const prev = React.useCallback(() => goTo(index - 1), [goTo, index]);

  // Keyboard: arrows always navigate; Space advances unless a control is focused
  // (so Space still activates buttons and inputs keep their keys).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const onControl = !!el?.closest(INTERACTIVE);
      const inField = !!el?.matches("input, textarea, select, [contenteditable]");
      if (e.key === "ArrowRight") {
        if (inField) return;
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        if (inField) return;
        e.preventDefault();
        prev();
      } else if (e.key === " " || e.code === "Space") {
        if (onControl) return; // let buttons/inputs handle Space
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Touch / pointer swipe.
  const swipe = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

  const ctx = React.useMemo(
    () => ({
      markComplete: (id: string) =>
        setCompleted((prev) => (prev.has(id) ? prev : new Set(prev).add(id))),
      isComplete: (id: string) => completed.has(id),
    }),
    [completed],
  );

  const offset = reduced ? 0 : 40;
  const variants = {
    enter: (dir: number) => ({ x: dir >= 0 ? offset : -offset, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir >= 0 ? -offset : offset, opacity: 0 }),
  };

  return (
    <DeckProvider value={ctx}>
      <section
        aria-roledescription="carousel"
        aria-label="Interactive lesson slides"
        className={cn("relative flex h-[100svh] w-full flex-col bg-background", className)}
      >
        {/* Top progress bar */}
        <div className="h-1 w-full shrink-0 bg-border" aria-hidden="true">
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${((index + 1) / count) * 100}%` }}
          />
        </div>

        {/* Slide viewport */}
        <div
          className="relative flex-1 overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <AnimatePresence custom={direction} initial={false} mode="sync">
            <m.div
              key={current.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduced ? 0.18 : 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-y-auto"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${count}`}
              aria-labelledby={current.title ? headingId(current) : undefined}
            >
              <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-5 py-16 md:px-8">
                {current.title ? (
                  <h2
                    id={headingId(current)}
                    tabIndex={-1}
                    className="mb-6 font-heading text-2xl font-bold tracking-tight text-foreground outline-none sm:text-3xl md:text-4xl"
                  >
                    {current.title}
                  </h2>
                ) : null}
                {current.render()}
              </div>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-background/80 px-5 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={atStart}
              aria-label="Previous slide"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft aria-hidden="true" className="size-4" /> Prev
            </button>
            <button
              type="button"
              onClick={next}
              disabled={atEnd || gated}
              aria-label={gated ? "Finish this slide to continue" : "Next slide"}
              className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
            >
              Next <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-current={i === index ? "true" : undefined}
                aria-label={`Go to slide ${i + 1}: ${s.title ?? s.id}`}
                onClick={() => goTo(i)}
                className={cn(
                  "size-3 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  i === index
                    ? "border-primary bg-primary"
                    : "border-border bg-transparent hover:border-primary/60",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(0)}
            aria-label="Restart from the first slide"
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </section>
    </DeckProvider>
  );
}
