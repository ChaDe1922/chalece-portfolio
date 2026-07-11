"use client";

import * as React from "react";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { RichText } from "@/components/lab/rich-text";
import { Roadmap } from "@/components/lab/fourier/part-nav";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.introThree;

/** Cover slide for Lesson 3: bridges from finding a recipe to using it, names the
 *  Part 3 objectives, shows the shared roadmap with stage 3 current, then begins.
 *  Mirrors IntroTwo: meta eyebrow, promise paragraphs, objectives card, roadmap. */
export function IntroThree() {
  const deck = useDeck();
  const [picked, setPicked] = React.useState<Set<string>>(() => new Set());
  const toggle = (opt: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.meta}</p>

      <div className="max-w-xl space-y-3">
        {data.promise.map((p, i) => (
          <p key={i} className="text-lg leading-relaxed text-muted-foreground">
            <RichText text={p} />
          </p>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">The tools ahead:</p>
        <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {data.toolStrip.map((t, i) => (
            <li key={t} className="flex items-center gap-1.5">
              <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground">{t}</span>
              {i < data.toolStrip.length - 1 ? <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /> : null}
            </li>
          ))}
        </ol>
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

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="font-heading text-base font-semibold text-foreground">{data.activation.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.activation.options.map((opt) => {
            const on = picked.has(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                aria-pressed={on}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted",
                )}
              >
                {on ? <Check aria-hidden="true" className="size-3.5" /> : null}
                {opt}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">{picked.size > 0 ? data.activation.note : ""}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.roadmapLead}</p>
        <div className="mt-3">
          <Roadmap current={3} />
        </div>
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
