"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Play, Square, ChevronLeft, ChevronRight, RotateCcw, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** Order items left to right along a dotted line. Drag a card with a pointer, or use
 *  the left/right buttons (keyboard-operable). Each card can play its sound. Solved
 *  when the order matches `correctOrder`. Deterministic reverse start (SSR-safe). */

type Item = { id: string; label: string };

type Props = {
  label: string;
  prompt: string;
  items: readonly Item[];
  correctOrder: readonly string[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
  onPlayItem?: (id: string) => void;
  playingId?: string | null;
};

export function SortLine({ label, prompt, items, correctOrder, successText, objective, onSolved, onPlayItem, playingId }: Props) {
  const byId = React.useMemo(() => new Map(items.map((it) => [it.id, it])), [items]);
  const initial = React.useMemo(() => [...correctOrder].reverse(), [correctOrder]);
  const [order, setOrder] = React.useState<string[]>(() => initial);
  const [checked, setChecked] = React.useState(false);
  const [solved, setSolved] = React.useState(false);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [dragPos, setDragPos] = React.useState<{ x: number; y: number; offX: number; offY: number; w: number } | null>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);

  const isCorrect = order.length === correctOrder.length && order.every((id, i) => id === correctOrder[i]);

  const moveTo = (id: string, toIndex: number) => {
    setOrder((prev) => {
      const from = prev.indexOf(id);
      if (from < 0 || toIndex < 0 || toIndex >= prev.length || from === toIndex) return prev;
      const next = prev.slice();
      next.splice(from, 1);
      next.splice(toIndex, 0, id);
      return next;
    });
    setChecked(false);
  };
  const nudge = (id: string, dir: -1 | 1) => moveTo(id, order.indexOf(id) + dir);

  // Pointer drag: reorder live by comparing the pointer x to each card's center.
  React.useEffect(() => {
    if (!dragId) return;
    const onMove = (e: PointerEvent) => {
      setDragPos((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      const row = rowRef.current;
      if (!row) return;
      const cards = Array.from(row.querySelectorAll<HTMLElement>("[data-card]"));
      let target = -1;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        if (e.clientX < r.left + r.width / 2) {
          target = i;
          break;
        }
      }
      if (target < 0) target = cards.length - 1;
      if (order[target] !== dragId) moveTo(dragId, target);
    };
    const onUp = () => {
      setDragId(null);
      setDragPos(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragId, order]);

  const check = () => {
    setChecked(true);
    if (isCorrect && !solved) {
      setSolved(true);
      onSolved?.(true);
    }
  };
  const reset = () => {
    setOrder(initial);
    setChecked(false);
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

      <div className="relative mt-5">
        {/* dotted track behind the cards */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-1/2 -z-0 flex -translate-y-1/2 items-center justify-between">
          <span className="h-px flex-1 border-t border-dashed border-border" />
        </div>
        <ul ref={rowRef} className="relative z-10 flex items-stretch gap-2">
          {order.map((id, i) => {
            const item = byId.get(id);
            if (!item) return null;
            const playing = playingId === id;
            return (
              <li
                key={id}
                data-card
                className={cn(
                  "flex flex-1 flex-col items-center gap-2 rounded-xl border bg-background p-3 transition-opacity",
                  dragId === id ? "border-primary opacity-40" : "border-border",
                )}
              >
                <span className="grid size-6 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">{i + 1}</span>
                <span className="text-center text-sm font-medium text-foreground">
                  <RichText text={item.label} />
                </span>
                {onPlayItem ? (
                  <button
                    type="button"
                    onClick={() => onPlayItem(id)}
                    aria-label={`${playing ? "Stop" : "Play"} "${item.label}"`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {playing ? <Square aria-hidden="true" className="size-3 fill-current" /> : <Play aria-hidden="true" className="size-3 fill-current" />}
                    {playing ? "Stop" : "Play"}
                  </button>
                ) : null}
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => nudge(id, -1)} disabled={i === 0} aria-label={`Move "${item.label}" left`} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30">
                    <ChevronLeft aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      const li = (e.currentTarget as HTMLElement).closest("li");
                      const r = li?.getBoundingClientRect();
                      setDragId(id);
                      if (r) setDragPos({ x: e.clientX, y: e.clientY, offX: e.clientX - r.left, offY: e.clientY - r.top, w: r.width });
                    }}
                    aria-label={`Drag "${item.label}" to reorder`}
                    className="grid size-7 cursor-grab touch-none place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                  >
                    <GripHorizontal aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => nudge(id, 1)} disabled={i === order.length - 1} aria-label={`Move "${item.label}" right`} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30">
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={check} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Check the order
        </button>
        <button type="button" onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <RotateCcw aria-hidden="true" className="size-4" /> Reset
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {checked && !isCorrect ? "Not yet. Drag the cards, or use the arrows, then check again." : ""}
      </p>

      {/* Full-size drag ghost following the pointer, portaled to <body> so `fixed` is
          viewport-relative (a transformed ancestor would otherwise offset it). */}
      {dragId && dragPos && byId.get(dragId) && typeof document !== "undefined"
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[100] rounded-xl border-2 border-primary bg-card px-3 py-2 text-center text-sm font-medium text-foreground shadow-xl"
              style={{ left: dragPos.x - dragPos.offX, top: dragPos.y - dragPos.offY, width: dragPos.w }}
            >
              <RichText text={byId.get(dragId)!.label} />
            </div>,
            document.body,
          )
        : null}
    </CheckCard>
  );
}
