"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** Sort cards into labeled columns, one card at a time. Drag the current card into a
 *  column with a pointer, or tap a column to place it (keyboard-operable). A card
 *  belongs to the column whose id matches its `column`. Wrong drops give a hint and
 *  keep the card. Solved when every card is placed correctly. */

type GlyphKind = "wave" | "bars";
type Column = { id: string; label: string; glyph?: GlyphKind };
type Card = { id: string; label: string; column: string };

type Props = {
  label: string;
  prompt: string;
  columns: readonly Column[];
  cards: readonly Card[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

function Glyph({ kind }: { kind: GlyphKind }) {
  if (kind === "bars") {
    return (
      <svg viewBox="0 0 48 24" aria-hidden="true" className="h-6 w-12 text-link">
        {[20, 12, 16, 8, 6].map((h, i) => (
          <rect key={i} x={2 + i * 9} y={22 - h} width="6" height={h} rx="1" fill="currentColor" opacity={1 - i * 0.14} />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 24" aria-hidden="true" className="h-6 w-12 text-link">
      <path d="M2 12 Q8 2 14 12 T26 12 T38 12 T50 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SortColumns({ label, prompt, columns, cards, successText, objective, onSolved }: Props) {
  const [step, setStep] = React.useState(0);
  const [placed, setPlaced] = React.useState<Record<string, string[]>>({}); // columnId -> card labels
  const [status, setStatus] = React.useState("");
  const [drag, setDrag] = React.useState<{ x: number; y: number; offX: number; offY: number; w: number } | null>(null);
  const [hoverCol, setHoverCol] = React.useState<string | null>(null);
  const colRefs = React.useRef<Map<string, HTMLElement>>(new Map());

  const solved = step >= cards.length;
  const current = solved ? null : cards[step];

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  const place = React.useCallback(
    (columnId: string) => {
      const card = cards[step];
      if (!card) return;
      if (card.column === columnId) {
        setPlaced((prev) => ({ ...prev, [columnId]: [...(prev[columnId] ?? []), card.label] }));
        setStep((s) => s + 1);
        setStatus("");
      } else {
        const col = columns.find((c) => c.id === columnId);
        setStatus(`Not ${col?.label ?? "there"}. Think about what that view shows, then try the other column.`);
      }
    },
    [cards, step, columns],
  );

  // Pointer drag of the current card; drop places it in the column under the pointer.
  React.useEffect(() => {
    if (!drag) return;
    const colAt = (x: number, y: number): string | null => {
      for (const [id, el] of colRefs.current) {
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
      }
      return null;
    };
    const onMove = (e: PointerEvent) => {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      setHoverCol(colAt(e.clientX, e.clientY));
    };
    const onUp = (e: PointerEvent) => {
      const col = colAt(e.clientX, e.clientY);
      setDrag(null);
      setHoverCol(null);
      if (col) place(col);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, place]);

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

      {/* The current card to place. */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Card {step + 1} of {cards.length}
        </p>
        {current ? (
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              const r = e.currentTarget.getBoundingClientRect();
              setDrag({ x: e.clientX, y: e.clientY, offX: e.clientX - r.left, offY: e.clientY - r.top, w: r.width });
            }}
            className={cn(
              "w-full cursor-grab touch-none rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-4 py-3 text-left text-sm font-medium text-foreground transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
              drag && "opacity-40",
            )}
          >
            <RichText text={current.label} />
            <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Drag me to a column, or tap a column below.</span>
          </button>
        ) : null}
      </div>

      {/* The columns. */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {columns.map((col) => (
          <button
            key={col.id}
            type="button"
            ref={(el) => {
              if (el) colRefs.current.set(col.id, el);
              else colRefs.current.delete(col.id);
            }}
            onClick={() => place(col.id)}
            className={cn(
              "flex min-h-32 flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              hoverCol === col.id ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-muted",
            )}
          >
            {col.glyph ? <Glyph kind={col.glyph} /> : null}
            <span className="text-sm font-semibold text-foreground">{col.label}</span>
            <ul className="mt-1 w-full space-y-1">
              {(placed[col.id] ?? []).map((lbl) => (
                <li key={lbl} className="flex items-center justify-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  <Check aria-hidden="true" className="size-3" /> {lbl}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status}
      </p>

      {/* Drag ghost: the full-size card, anchored under the pointer where you grabbed
          it. Portaled to <body> so `fixed` is viewport-relative (an animated ancestor
          with a transform would otherwise offset it). */}
      {drag && current && typeof document !== "undefined"
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[100] rounded-xl border-2 border-primary bg-card px-4 py-3 text-sm font-medium text-foreground shadow-xl"
              style={{ left: drag.x - drag.offX, top: drag.y - drag.offY, width: drag.w }}
            >
              <RichText text={current.label} />
            </div>,
            document.body,
          )
        : null}
    </CheckCard>
  );
}
