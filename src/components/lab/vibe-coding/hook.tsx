"use client";

import * as React from "react";
import { ArrowRight, Check, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { useVibeBuild } from "@/components/lab/vibe-coding/vibe-context";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.slides.hook;

/** Slide 0: the reframe. You direct, the AI types. Before revealing the result,
 *  the learner makes their first design decision by picking what they would
 *  build. The choice persists (vibe context) so later slides personalize. */
export function Hook() {
  const deck = useDeck();
  const { build, setBuild } = useVibeBuild();
  const sentence = vibeCodingLab.builds[build ?? "music"].sentence;

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.meta}</p>

      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{data.body}</p>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="font-heading text-base font-semibold text-foreground">{data.decideLead}</p>
        <ul className="lesson-stagger mt-3 space-y-2.5">
          {data.decide.map((d) => (
            <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
              {d}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{data.decideClose}</p>
      </div>

      <figure className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <figcaption className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-link">
          <Quote aria-hidden="true" className="size-4" />
          {data.promptLabel}
        </figcaption>
        <blockquote className="font-heading text-xl font-semibold leading-snug text-primary sm:text-2xl">
          {sentence}
        </blockquote>
      </figure>

      {/* First design decision: pick a build type before seeing the result. */}
      <div>
        <p className="text-sm font-medium text-foreground">{data.choiceLead}</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {data.choices.map((c) => {
            const active = build === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setBuild(c.id)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-11 items-center rounded-xl border px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        {build ? (
          <p
            aria-live="polite"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-foreground"
          >
            <Check aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
            {data.choiceFeedback}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => deck.next()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {data.begin}
          <ArrowRight aria-hidden="true" className="size-5" />
        </button>
        <p className="text-sm text-muted-foreground">{data.byline}</p>
      </div>
    </div>
  );
}
