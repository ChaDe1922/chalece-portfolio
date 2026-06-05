"use client";

import * as React from "react";
import { Check, FolderInput, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.dolls;
const TOTAL = 5;
const DOLL_COLORS = ["#d8412f", "#e8924a", "#6d5ae6", "#3aa6a0", "#16a766"];

function Doll({ size, color, isBase }: { size: number; color: string; isBase: boolean }) {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 60 90"
      aria-hidden="true"
      className={cn(isBase && "drop-shadow-[0_0_10px_rgba(22,167,102,0.7)]")}
    >
      <ellipse cx="30" cy="60" rx="24" ry="28" fill={color} />
      <ellipse cx="30" cy="66" rx="13" ry="14" fill="#fff" opacity="0.85" />
      <circle cx="30" cy="26" r="18" fill="#f3d9c0" />
      <path d="M12 24 a18 18 0 0 1 36 0 z" fill={color} />
      <circle cx="24" cy="27" r="2" fill="#2a2530" />
      <circle cx="36" cy="27" r="2" fill="#2a2530" />
      <path d="M26 33 q4 3 8 0" stroke="#b5495a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Slide 2: open nested dolls to the base case, then name the two parts. */
export function Dolls() {
  const deck = useDeck();
  const [revealed, setRevealed] = React.useState(1);
  const atBase = revealed >= TOTAL;

  React.useEffect(() => {
    if (atBase) deck.markComplete(data.id);
  }, [atBase, deck]);

  const narration = atBase
    ? data.narrate.base
    : revealed > 1
      ? data.narrate.open(revealed, TOTAL)
      : data.openInstr;

  return (
    <div className="lesson-stagger space-y-5">
      {/* Teaching first: the two rules and the definition. */}
      <p className="text-lg leading-relaxed text-foreground">{data.teachLead}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.rules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-4">
            <p className="font-heading text-base font-semibold text-link">{rule.term}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{rule.text}</p>
          </div>
        ))}
      </div>
      <p className="rounded-xl border border-border bg-card p-4 text-base leading-relaxed text-foreground">
        {data.definition}
      </p>

      {/* Then the interaction reinforces both parts. */}
      <p className="pt-1 text-base leading-relaxed text-muted-foreground">{data.interactLead}</p>

      <div className="flex min-h-[160px] flex-wrap items-end justify-center gap-3 rounded-xl border border-border bg-card p-5">
        {Array.from({ length: revealed }, (_, i) => {
          const isBase = i === TOTAL - 1;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <Doll size={64 - i * 9} color={DOLL_COLORS[i]} isBase={isBase && atBase} />
              {isBase && atBase ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 text-[0.65rem] font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                  <Check aria-hidden="true" className="size-3" /> base case
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <p aria-live="polite" className="min-h-6 text-center text-sm text-foreground">
        {narration}
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(TOTAL, r + 1))}
          disabled={atBase}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <FolderInput aria-hidden="true" className="size-4" /> {data.open}
        </button>
        {revealed > 1 ? (
          <button
            type="button"
            onClick={() => setRevealed(1)}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> {data.reset}
          </button>
        ) : null}
      </div>
    </div>
  );
}
