"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.intro;

/** Concentric rings that settle in from the outside in: a thing inside a
 *  smaller version of itself. Decorative; the entrance stagger handles motion,
 *  so it is static under reduced motion. */
function NestedRings() {
  return (
    <svg viewBox="0 0 120 120" className="size-28 lesson-stagger" aria-hidden="true">
      {[56, 44, 32, 20, 9].map((r, i) => (
        <circle
          key={r}
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={i === 4 ? "var(--coral)" : "var(--primary)"}
          strokeWidth={2}
          opacity={0.35 + i * 0.14}
        />
      ))}
    </svg>
  );
}

/** Slide 0: the cover. What this is, what you will be able to do, and a Begin
 *  button that starts the lesson. */
export function Intro() {
  const deck = useDeck();

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.meta}</p>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{data.promise}</p>
        <div className="shrink-0 self-center">
          <NestedRings />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-heading text-base font-semibold text-foreground">{data.objectivesLead}</p>
        <ul className="lesson-stagger mt-3 space-y-2.5">
          {data.objectives.map((o) => (
            <li key={o} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => deck.next()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {data.begin}
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
        <span className="text-sm text-muted-foreground">{data.byline}</span>
      </div>
    </div>
  );
}
