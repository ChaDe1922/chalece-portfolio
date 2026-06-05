"use client";

import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { Chip, Slot, usePlacement } from "@/components/lab/recursion/draggable";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.build;

/** Slide 3: build the factorial function by dragging the right code line into
 *  each slot. Distractors are rejected with a specific hint. */
export function BuildFunction() {
  const deck = useDeck();
  const { picked, pick, place, isPlaced, filledItem, complete } = usePlacement(
    data.blocks.map((b) => ({ id: b.id, fits: b.fits })),
    data.slots.map((s) => ({ id: s.id })),
  );
  const [hint, setHint] = React.useState("");

  React.useEffect(() => {
    if (complete) deck.markComplete(data.id);
  }, [complete, deck]);

  const blockById = (id: string) => data.blocks.find((b) => b.id === id);

  function tryPlace(slotId: string, itemId?: string) {
    const attempted = itemId ?? picked;
    const result = place(slotId, itemId);
    if (result === "ok") setHint("");
    else if (result === "wrong") {
      const b = attempted ? blockById(attempted) : null;
      setHint(b?.hint ?? "That line does not belong in this slot.");
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-foreground">{data.instruction}</p>

      {/* Function skeleton with slots */}
      <div className="rounded-xl border border-border bg-card p-4 font-mono text-sm [font-feature-settings:'liga'_0,'calt'_0]">
        <div className="text-foreground">{data.signature}</div>
        <div className="space-y-2 py-2 pl-4">
          {data.slots.map((s) => {
            const itemId = filledItem(s.id);
            const block = itemId ? blockById(itemId) : null;
            return (
              <Slot
                key={s.id}
                id={s.id}
                onPlace={tryPlace}
                active={!!picked && !block}
                filled={!!block}
                ariaLabel={`${s.label} slot. ${block ? `Filled with: ${block.code}` : "Empty, pick a line then activate this slot."}`}
                className="min-h-12"
              >
                {block ? (
                  <span className="flex items-center gap-2 text-foreground">
                    <Check aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
                    {block.code}
                  </span>
                ) : (
                  <span className="text-muted-foreground">{`// ${s.label}`}</span>
                )}
              </Slot>
            );
          })}
        </div>
        <div className="text-foreground">{data.close}</div>
      </div>

      {picked ? (
        <p className="text-sm text-link">Now choose a slot above, or drag the line into it.</p>
      ) : null}

      {/* Code blocks tray */}
      <div className="flex flex-col gap-2">
        {data.blocks.map((b) => (
          <Chip
            key={b.id}
            id={b.id}
            picked={picked === b.id}
            placed={isPlaced(b.id)}
            onPick={pick}
            className="font-mono [font-feature-settings:'liga'_0,'calt'_0]"
          >
            {b.code}
          </Chip>
        ))}
      </div>

      <p
        aria-live="polite"
        className={cn(
          "flex min-h-6 items-center gap-2 text-sm",
          complete ? "font-medium text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
        )}
      >
        {complete ? (
          <>
            <Sparkles aria-hidden="true" className="size-4" /> {data.success}
          </>
        ) : (
          hint
        )}
      </p>
    </div>
  );
}
