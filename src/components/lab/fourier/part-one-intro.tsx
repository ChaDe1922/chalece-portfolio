"use client";

import { ArrowRight } from "lucide-react";
import { useDeck } from "@/components/deck/deck-context";
import { RichText } from "@/components/lab/rich-text";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.partOneIntro;

/** Short part-intro/rest screen before Screen 1. It reorients (a lead), redefines
 *  what Part 1 covers (the body, waveform vs spectrum), gives a settling note, then
 *  begins. Non-gated; Next still works. */
export function PartOneIntro() {
  const deck = useDeck();

  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.lead} />
      </p>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <p className="text-base font-medium text-foreground">{data.bodyLead}</p>
        <ul className="mt-4 space-y-3">
          {data.views.map((v) => (
            <li key={v.term} className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
              <span>
                <span className="font-semibold text-foreground">{v.term}</span> {v.pre}{" "}
                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-link">{v.accent}</span>
                {v.post ? ` ${v.post}` : ""}.
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 text-sm leading-relaxed text-foreground">
        <RichText text={data.note} />
      </p>

      <button
        type="button"
        onClick={() => deck.next()}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {data.begin}
        <ArrowRight aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
