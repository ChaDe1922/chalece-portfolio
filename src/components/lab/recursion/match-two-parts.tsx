"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { Chip, Slot, usePlacement } from "@/components/lab/recursion/draggable";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.match;

/** Slide 2: drag each chip into the right slot. Reveals base case / recursive
 *  case on a correct match. Pointer, tap, and keyboard all work. */
export function MatchTwoParts() {
  const reduced = useReducedMotion();
  const deck = useDeck();
  const { picked, pick, place, isPlaced, filledItem, complete } = usePlacement(
    data.chips.map((c) => ({ id: c.id, fits: c.fits })),
    data.slots.map((s) => ({ id: s.id })),
  );
  const [hint, setHint] = React.useState("");

  React.useEffect(() => {
    if (complete) deck.markComplete(data.id);
  }, [complete, deck]);

  function tryPlace(slotId: string, itemId?: string) {
    const result = place(slotId, itemId);
    if (result === "wrong") setHint(data.wrongHint);
    else if (result === "ok") setHint("");
  }

  const chipById = (id: string) => data.chips.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-foreground">{data.instruction}</p>

      {/* Chips */}
      <div className="flex flex-wrap gap-3">
        {data.chips.map((c) => (
          <Chip key={c.id} id={c.id} picked={picked === c.id} placed={isPlaced(c.id)} onPick={pick}>
            {c.text}
          </Chip>
        ))}
      </div>

      {picked ? (
        <p className="text-sm text-link">Now choose a slot below, or drag the chip into it.</p>
      ) : null}

      {/* Slots */}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.slots.map((s) => {
          const itemId = filledItem(s.id);
          const filledChip = itemId ? chipById(itemId) : null;
          return (
            <Slot
              key={s.id}
              id={s.id}
              onPlace={tryPlace}
              active={!!picked && !filledChip}
              filled={!!filledChip}
              label={s.label}
              ariaLabel={`${s.label}. ${filledChip ? `Filled with: ${filledChip.text}` : "Empty, choose a chip then activate this slot."}`}
            >
              {filledChip ? (
                <span className="space-y-1">
                  <span className="block text-sm text-foreground">{filledChip.text}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    <Check aria-hidden="true" className="size-3" /> {s.term}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Drop a chip here</span>
              )}
            </Slot>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className={cn(
          "min-h-6 text-sm",
          complete ? "font-medium text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
          !reduced && complete && "transition-opacity",
        )}
      >
        {complete ? "That is it. A base case to stop, a recursive case to shrink." : hint}
      </p>
    </div>
  );
}
