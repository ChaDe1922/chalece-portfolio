"use client";

import { ArrowRight, Check } from "lucide-react";
import { useDeck } from "@/components/deck/deck-context";
import { gitLab } from "@/data/git-lab";

const data = gitLab.slides.intro;

/** Decorative mini commit graph: a trunk with one branch off it. Static and
 *  aria-hidden, it just sets the visual vocabulary the lesson teaches. */
function CommitChainMark() {
  return (
    <svg viewBox="0 0 150 110" className="size-28" aria-hidden="true">
      {/* edges */}
      <line x1="24" y1="74" x2="63" y2="74" stroke="var(--primary)" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
      <line x1="63" y1="74" x2="102" y2="74" stroke="var(--primary)" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
      <line x1="63" y1="74" x2="102" y2="34" stroke="var(--coral)" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
      {/* nodes */}
      {[
        { x: 24, y: 74, c: "var(--primary)" },
        { x: 63, y: 74, c: "var(--primary)" },
        { x: 102, y: 74, c: "var(--primary)" },
        { x: 102, y: 34, c: "var(--coral)" },
      ].map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="13" fill="var(--card)" stroke={n.c} strokeWidth="2.5" />
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
          <CommitChainMark />
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
