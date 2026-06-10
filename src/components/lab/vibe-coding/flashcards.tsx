"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Plus, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatChanged } from "@/components/lab/vibe-coding/what-changed";
import { TryItCta } from "@/components/lab/vibe-coding/try-it-cta";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.builds.school.artifact;

type Card = { q: string; a: string };

/** Slide 2 (school): a real, simple flashcard tool. Flip a card, move through
 *  the deck, and add your own. Pure React, no dependencies. */
export function Flashcards() {
  const reduced = useReducedMotion();

  const [cards, setCards] = React.useState<Card[]>(() => data.starter.map((c) => ({ ...c })));
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [a, setA] = React.useState("");

  const card = cards[index];

  const next = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % cards.length);
  };

  const shuffle = () => {
    setCards((prev) => {
      const arr = prev.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setIndex(0);
    setFlipped(false);
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim() || !a.trim()) return;
    setCards((prev) => [...prev, { q: q.trim(), a: a.trim() }]);
    setQ("");
    setA("");
  };

  return (
    <div className="lesson-stagger space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{data.intro}</p>
        <p className="text-sm text-muted-foreground">{data.patternLead}</p>
        <ul className="space-y-1">
          {data.pattern.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-link" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <section aria-label="Flashcards" className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">{data.cardTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{data.cardSub}</p>

        {/* The card */}
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          className={cn(
            "mt-4 flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !reduced && "transition-colors",
            flipped
              ? "border-primary/50 bg-[color-mix(in_oklch,var(--link)_8%,var(--card))]"
              : "border-border bg-background hover:border-primary/40",
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wide text-link">
            {flipped ? "Answer" : "Question"}
          </span>
          <span className="font-heading text-xl font-semibold text-foreground">{flipped ? card.a : card.q}</span>
          <span className="text-xs text-muted-foreground">{flipped ? data.flipHintBack : data.flipHintFront}</span>
        </button>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-muted-foreground">{data.cardCount(index + 1, cards.length)}</span>
          <div className="ml-auto flex gap-2.5">
            <button
              type="button"
              onClick={next}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <SkipForward aria-hidden="true" className="size-4" />
              {data.next}
            </button>
            <button
              type="button"
              onClick={shuffle}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              {data.shuffle}
            </button>
          </div>
        </div>

        {/* Add a card */}
        <form onSubmit={addCard} className="mt-5 space-y-2 border-t border-border pt-4">
          <p className="font-heading text-sm font-semibold text-foreground">{data.addLead}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block text-sm text-muted-foreground">
              {data.questionLabel}
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={data.questionPlaceholder}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <label className="block text-sm text-muted-foreground">
              {data.answerLabel}
              <input
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder={data.answerPlaceholder}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={!q.trim() || !a.trim()}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-4" />
            {data.addButton}
          </button>
        </form>
      </section>

      <p className="text-sm text-muted-foreground">{data.tip}</p>

      <WhatChanged check={data.check} />
      <TryItCta />
    </div>
  );
}
