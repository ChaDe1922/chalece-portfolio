"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** A placeable item. `fits` is the slot id it belongs in, or null for a
 *  distractor that fits nowhere. */
export type PlaceItem = { id: string; fits: string | null };
export type PlaceSlot = { id: string };

type PlacementState = {
  picked: string | null;
  placements: Record<string, string>; // slotId -> itemId (only correct items land)
  pick: (id: string | null) => void;
  /** Try to place the currently picked item (or `itemId`) into `slotId`.
   *  Returns "ok" on a correct placement, "wrong" otherwise. */
  place: (slotId: string, itemId?: string) => "ok" | "wrong" | "noop";
  isPlaced: (itemId: string) => boolean;
  filledItem: (slotId: string) => string | null;
  complete: boolean;
  reset: () => void;
};

/** Shared chip-to-slot placement logic for the match and build slides. Works
 *  the same for pointer drag, tap-to-place, and keyboard. Only correct items
 *  ever land; a wrong attempt returns "wrong" so the slide can show a hint. */
export function usePlacement(items: PlaceItem[], slots: PlaceSlot[]): PlacementState {
  const [picked, setPicked] = React.useState<string | null>(null);
  const [placements, setPlacements] = React.useState<Record<string, string>>({});

  const place = React.useCallback(
    (slotId: string, itemId?: string): "ok" | "wrong" | "noop" => {
      const id = itemId ?? picked;
      if (!id) return "noop";
      const item = items.find((i) => i.id === id);
      if (!item) return "noop";
      if (item.fits === slotId) {
        setPlacements((p) => ({ ...p, [slotId]: id }));
        setPicked(null);
        return "ok";
      }
      return "wrong";
    },
    [items, picked],
  );

  const isPlaced = React.useCallback(
    (itemId: string) => Object.values(placements).includes(itemId),
    [placements],
  );
  const filledItem = React.useCallback((slotId: string) => placements[slotId] ?? null, [placements]);
  const complete = slots.every((s) => placements[s.id]);
  const reset = React.useCallback(() => {
    setPlacements({});
    setPicked(null);
  }, []);

  return { picked, placements, pick: setPicked, place, isPlaced, filledItem, complete, reset };
}

/** A draggable / tappable chip. Click or Enter to pick it up; drag it on a
 *  pointer device. Disabled once placed. */
export function Chip({
  id,
  picked,
  placed,
  onPick,
  children,
  className,
}: {
  id: string;
  picked: boolean;
  placed: boolean;
  onPick: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      draggable={!placed}
      aria-pressed={picked}
      disabled={placed}
      onClick={() => onPick(id)}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
        onPick(id);
      }}
      className={cn(
        "cursor-grab rounded-xl border px-4 py-3 text-left text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing disabled:cursor-default",
        picked
          ? "border-primary bg-primary/10 ring-2 ring-primary"
          : "border-border bg-card hover:border-primary/50 hover:bg-muted",
        placed && "opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** A drop target. Accepts a dropped chip, a tap (places the picked chip), or
 *  keyboard activation. */
export function Slot({
  id,
  onPlace,
  active,
  filled,
  label,
  ariaLabel,
  className,
  children,
}: {
  id: string;
  onPlace: (slotId: string, itemId?: string) => void;
  active: boolean; // a chip is currently picked, so this is a candidate target
  filled: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => onPlace(id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData("text/plain");
        onPlace(id, itemId || undefined);
      }}
      className={cn(
        "flex min-h-16 w-full flex-col items-start justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        filled
          ? "border-solid border-primary/40 bg-card"
          : active
            ? "border-primary bg-primary/5"
            : "border-border bg-background",
        className,
      )}
    >
      {label ? (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      ) : null}
      {children}
    </button>
  );
}
