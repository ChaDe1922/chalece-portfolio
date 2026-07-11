"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard } from "@/components/lab/assessment/card";

/** MatchPairs: match each item on the left to its partner on the right. Click a
 *  left item, then a right item, to pair them (keyboard-operable; aria-live
 *  result). Solved when every pair is matched. Deterministic scramble, no
 *  randomness, so it is SSR-safe. */

export type Pair = { id: string; left: string; right: string };

export function MatchPairs({
  label,
  prompt,
  pairs,
  onSolved,
}: {
  label: string;
  prompt: string;
  pairs: readonly Pair[];
  onSolved?: (solved: boolean) => void;
}) {
  // Right column in a fixed scrambled order (reverse), so it is not pre-aligned.
  const rights = React.useMemo(() => [...pairs].reverse(), [pairs]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [matched, setMatched] = React.useState<Set<string>>(new Set());
  const [status, setStatus] = React.useState("");
  const solved = matched.size === pairs.length;

  React.useEffect(() => {
    onSolved?.(solved);
  }, [solved, onSolved]);

  const pickLeft = (id: string) => {
    if (matched.has(id)) return;
    setSelected((cur) => (cur === id ? null : id));
    const p = pairs.find((x) => x.id === id);
    setStatus(p ? `Selected ${p.left}. Now choose its match.` : "");
  };

  const pickRight = (id: string) => {
    if (matched.has(id)) return;
    if (!selected) {
      const p = pairs.find((x) => x.id === id);
      setStatus(p ? "Choose a term on the left first." : "");
      return;
    }
    const leftP = pairs.find((x) => x.id === selected)!;
    const rightP = pairs.find((x) => x.id === id)!;
    if (id === selected) {
      setMatched((m) => new Set(m).add(id));
      setSelected(null);
      setStatus(`Matched ${leftP.left} with ${leftP.right}.`);
    } else {
      setStatus(`Not a match. ${leftP.left} does not go with ${rightP.right}. Try again.`);
      setSelected(null);
    }
  };

  return (
    <CheckCard label={label} solved={solved}>
      <p className="mb-3 text-base font-medium text-foreground">
        <RichText text={prompt} />
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {pairs.map((p) => {
            const isMatched = matched.has(p.id);
            const isSel = selected === p.id;
            return (
              <li key={`l-${p.id}`}>
                <button
                  type="button"
                  onClick={() => pickLeft(p.id)}
                  disabled={isMatched}
                  aria-pressed={isSel}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isMatched
                      ? "border-emerald-300 bg-emerald-50/50 text-muted-foreground dark:border-emerald-800/70 dark:bg-emerald-950/20"
                      : isSel
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {isMatched ? <Check aria-hidden="true" className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> : null}
                  {p.left}
                </button>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-2">
          {rights.map((p) => {
            const isMatched = matched.has(p.id);
            return (
              <li key={`r-${p.id}`}>
                <button
                  type="button"
                  onClick={() => pickRight(p.id)}
                  disabled={isMatched}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isMatched
                      ? "border-emerald-300 bg-emerald-50/50 text-muted-foreground dark:border-emerald-800/70 dark:bg-emerald-950/20"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {isMatched ? <Check aria-hidden="true" className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> : null}
                  {p.right}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {solved ? "All matched." : status}
      </p>
    </CheckCard>
  );
}
