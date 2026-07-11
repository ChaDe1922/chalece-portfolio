"use client";

import * as React from "react";
import { ChevronUp, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckCard, SuccessCover } from "./card";

/** Generic Parsons problem: reorder jumbled blocks into the correct order, and
 *  leave out any distractor blocks that do not belong. Keyboard-first (up/down +
 *  include/exclude), exact-order grading, aria-live feedback. Extracted and
 *  generalized from the vibe-coding ParsonsCheck. */

export type ParsonsBlock = { id: string; text: string };

type Props = {
  label: string;
  prompt: string;
  steps: readonly ParsonsBlock[]; // the correct solution, in order
  distractors?: readonly ParsonsBlock[]; // blocks that must be left out
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
}

export function ParsonsProblem({ label, prompt, steps, distractors = [], successText, objective, onSolved }: Props) {
  const all = React.useMemo(() => {
    const combined = [...steps, ...distractors];
    return [...combined].sort((a, b) => hashId(a.id) - hashId(b.id));
  }, [steps, distractors]);

  const byId = React.useMemo(() => {
    const m = new Map<string, ParsonsBlock>();
    for (const b of [...steps, ...distractors]) m.set(b.id, b);
    return m;
  }, [steps, distractors]);

  const [order, setOrder] = React.useState<string[]>(() => all.map((b) => b.id));
  const [included, setIncluded] = React.useState<Record<string, boolean>>(() => Object.fromEntries(all.map((b) => [b.id, true])));
  const [checked, setChecked] = React.useState(false);
  const [solved, setSolved] = React.useState(false);

  const correctIds = steps.map((s) => s.id);
  const distractorIds = React.useMemo(() => new Set(distractors.map((d) => d.id)), [distractors]);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    setOrder((prev) => {
      const next = prev.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setChecked(false);
  };

  const toggle = (id: string) => {
    setIncluded((prev) => ({ ...prev, [id]: !prev[id] }));
    setChecked(false);
  };

  const reset = () => {
    setOrder(all.map((b) => b.id));
    setIncluded(Object.fromEntries(all.map((b) => [b.id, true])));
    setChecked(false);
  };

  const includedInOrder = order.filter((id) => included[id]);
  const hasDistractor = includedInOrder.some((id) => distractorIds.has(id));
  const orderOk = includedInOrder.length === correctIds.length && includedInOrder.every((id, i) => id === correctIds[i]);
  const isCorrect = orderOk && !hasDistractor;

  const check = () => {
    setChecked(true);
    if (isCorrect && !solved) {
      setSolved(true);
      onSolved?.(true);
    }
  };

  const feedback = hasDistractor
    ? "A block that does not belong is still included. Leave it out."
    : "Not yet. Check the order of the steps.";

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">{prompt}</p>
      <ul className="mt-4 space-y-2">
        {order.map((id, i) => {
          const block = byId.get(id);
          if (!block) return null;
          const isIn = included[id];
          return (
            <li
              key={id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
                isIn ? "border-border bg-background" : "border-dashed border-border bg-muted/40 opacity-60",
              )}
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move "${block.text}" up`}
                  className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                >
                  <ChevronUp aria-hidden="true" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  aria-label={`Move "${block.text}" down`}
                  className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                >
                  <ChevronDown aria-hidden="true" className="size-4" />
                </button>
              </div>
              <span className={cn("flex-1 text-sm", isIn ? "text-foreground" : "text-muted-foreground line-through")}>{block.text}</span>
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-pressed={!isIn}
                className="shrink-0 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isIn ? "Leave out" : "Put back"}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Check the order
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw aria-hidden="true" className="size-4" /> Reset
        </button>
      </div>
      {checked && !isCorrect ? (
        <p aria-live="polite" className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-foreground">
          {feedback}
        </p>
      ) : null}
    </CheckCard>
  );
}
