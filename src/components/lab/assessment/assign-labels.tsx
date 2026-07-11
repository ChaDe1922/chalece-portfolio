"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** AssignLabels: drop each label onto the slot it describes. A label belongs to
 *  the slot that shares its id. Click a label to select it, then click a slot to
 *  place it. A correct placement locks the slot green; a wrong placement gives
 *  aria-live feedback and clears the selection. Keyboard-operable (real buttons),
 *  no HTML5 drag. Solved when every slot holds its matching label. Deterministic
 *  label order (reverse) so it is SSR-safe. Powers "build the label", "formula
 *  translator", and "explain with icons". */

type Slot = { id: string; label: string };
type LabelChip = { id: string; label: string };

type Props = {
  label: string;
  prompt: string;
  slots: readonly Slot[];
  labels: readonly LabelChip[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

export function AssignLabels({ label, prompt, slots, labels, successText, objective, onSolved }: Props) {
  // Scramble the chip tray deterministically so it is not pre-aligned with slots.
  const tray = React.useMemo(() => [...labels].reverse(), [labels]);

  const [selected, setSelected] = React.useState<string | null>(null);
  const [placed, setPlaced] = React.useState<Record<string, string>>({}); // slotId -> labelId
  const [status, setStatus] = React.useState("");

  const placedLabelIds = React.useMemo(() => new Set(Object.values(placed)), [placed]);
  const solved = slots.length > 0 && slots.every((s) => placed[s.id] === s.id);

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  const labelById = React.useMemo(() => {
    const m = new Map<string, LabelChip>();
    for (const l of labels) m.set(l.id, l);
    return m;
  }, [labels]);

  const pickLabel = (id: string) => {
    if (placedLabelIds.has(id)) return;
    setSelected((cur) => (cur === id ? null : id));
    const chip = labelById.get(id);
    setStatus(chip ? `Selected "${chip.label}". Now choose where it goes.` : "");
  };

  const placeInSlot = (slot: Slot) => {
    if (placed[slot.id]) return; // already filled correctly and locked
    if (!selected) {
      setStatus("Choose a label first, then a slot.");
      return;
    }
    if (selected === slot.id) {
      setPlaced((prev) => ({ ...prev, [slot.id]: selected }));
      const chip = labelById.get(selected);
      setSelected(null);
      setStatus(chip ? `Placed "${chip.label}".` : "");
    } else {
      const chip = labelById.get(selected);
      setStatus(chip ? `"${chip.label}" does not belong here. Try a different slot.` : "Not quite. Try again.");
      setSelected(null);
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

      <ul className="mt-4 space-y-2">
        {slots.map((slot) => {
          const filledId = placed[slot.id];
          const chip = filledId ? labelById.get(filledId) : undefined;
          return (
            <li key={slot.id}>
              <button
                type="button"
                onClick={() => placeInSlot(slot)}
                disabled={Boolean(filledId)}
                aria-label={`Place selected label in slot: ${slot.label}`}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  filledId
                    ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800/70 dark:bg-emerald-950/20"
                    : "border-dashed border-border bg-background hover:bg-muted",
                )}
              >
                <span className="flex-1 font-medium text-foreground">
                  <RichText text={slot.label} />
                </span>
                {filledId ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-100/60 px-2 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <Check aria-hidden="true" className="size-3.5" />
                    {chip ? <RichText text={chip.label} /> : null}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Tap to fill</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Labels</p>
      <div className="flex flex-wrap gap-2">
        {tray.map((chip) => {
          const used = placedLabelIds.has(chip.id);
          if (used) return null;
          const isSel = selected === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => pickLabel(chip.id)}
              aria-pressed={isSel}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSel
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              <RichText text={chip.label} />
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status}
      </p>
    </CheckCard>
  );
}
