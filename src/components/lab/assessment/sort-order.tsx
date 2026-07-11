"use client";

import * as React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Play } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** SortOrder: reorder a list of items into the correct sequence, then check the
 *  order. Vertical layout uses up/down chevrons; horizontal layout arranges the
 *  items in a left-to-right row with left/right chevrons and an optional Play
 *  button per item (onPlayItem). Keyboard-operable, aria-live feedback, exact-order
 *  grading. The initial order is a deterministic scramble (reverse of the correct
 *  order) so it is SSR-safe with no randomness. Solved when order matches. */

type Item = { id: string; label: string };

type Props = {
  label: string;
  prompt: string;
  items: readonly Item[];
  correctOrder: readonly string[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
  layout?: "vertical" | "horizontal";
  onPlayItem?: (id: string) => void;
};

export function SortOrder({ label, prompt, items, correctOrder, successText, objective, onSolved, layout = "vertical", onPlayItem }: Props) {
  const byId = React.useMemo(() => {
    const m = new Map<string, Item>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  // Deterministic scramble: lay items out in the reverse of the correct order so
  // it is never pre-aligned and never depends on Math.random.
  const initial = React.useMemo(() => [...correctOrder].reverse(), [correctOrder]);

  const [order, setOrder] = React.useState<string[]>(() => initial);
  const [checked, setChecked] = React.useState(false);
  const [solved, setSolved] = React.useState(false);

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

  const reset = () => {
    setOrder(initial);
    setChecked(false);
  };

  const isCorrect = order.length === correctOrder.length && order.every((id, i) => id === correctOrder[i]);

  const check = () => {
    setChecked(true);
    if (isCorrect && !solved) {
      setSolved(true);
      onSolved?.(true);
    }
  };

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">
        <RichText text={prompt} />
      </p>
      {layout === "horizontal" ? (
        <ol className="mt-4 flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
          {order.map((id, i) => {
            const item = byId.get(id);
            if (!item) return null;
            return (
              <li key={id} className="flex flex-1 flex-col items-center gap-2 rounded-lg border border-border bg-background p-3">
                <span className="grid size-6 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{i + 1}</span>
                <span className="text-center text-sm font-medium text-foreground">
                  <RichText text={item.label} />
                </span>
                {onPlayItem ? (
                  <button
                    type="button"
                    onClick={() => onPlayItem(item.id)}
                    aria-label={`Play "${item.label}"`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Play aria-hidden="true" className="size-3 fill-current" /> Play
                  </button>
                ) : null}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move "${item.label}" left`}
                    className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move "${item.label}" right`}
                    className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                  >
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <ul className="mt-4 space-y-2">
          {order.map((id, i) => {
            const item = byId.get(id);
            if (!item) return null;
            return (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label={`Move "${item.label}" up`}
                    className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                  >
                    <ChevronUp aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === order.length - 1}
                    aria-label={`Move "${item.label}" down`}
                    className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
                  >
                    <ChevronDown aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-foreground">
                  <RichText text={item.label} />
                </span>
              </li>
            );
          })}
        </ul>
      )}

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
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {checked && !isCorrect ? "Not yet. Use the chevrons to reorder, then check again." : ""}
      </p>
    </CheckCard>
  );
}
