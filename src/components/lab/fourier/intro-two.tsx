"use client";

import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { useDeck } from "@/components/deck/deck-context";
import { RichText } from "@/components/lab/rich-text";
import { Roadmap } from "@/components/lab/fourier/part-nav";
import { MultipleChoice } from "@/components/lab/assessment/multiple-choice";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.introTwo;

/** Cover slide for Lesson 2: recaps Part 1, names the Part 2 objectives, shows the
 *  shared roadmap with stage 2 current, then begins. No audio A/B here; the hook is
 *  the harder question, not a sound. */
export function IntroTwo() {
  const deck = useDeck();

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
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.flowLead}</p>
        <ol className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {data.flow.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground">{step}</span>
              {i < data.flow.length - 1 ? <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /> : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.recapLead}</p>
        <ul className="mt-3 space-y-2.5">
          {data.recap.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden="true" className="size-3.5" />
              </span>
              <RichText text={item} />
            </li>
          ))}
        </ul>
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
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.roadmapLead}</p>
        <div className="mt-3">
          <Roadmap current={2} />
        </div>
      </div>

      <MultipleChoice label="Quick check" data={data.quickCheck} />

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
