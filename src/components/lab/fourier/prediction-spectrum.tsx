"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { GraphAxes } from "./graph-axes";

/** An ungraded "make a prediction" widget: a blank frequency strip where the learner
 *  taps up to two spots to guess where the hidden tones might be. There is no right
 *  answer, so nothing locks or scores. Fully keyboard-operable (each slot is a real
 *  button) and motion-free, so reduced motion needs nothing special. */

export function PredictionSpectrum({
  label,
  prompt,
  savedText,
  slots = 12,
  maxPins = 2,
}: {
  label: string;
  prompt: string;
  savedText: string;
  slots?: number;
  maxPins?: number;
}) {
  const [pins, setPins] = React.useState<number[]>([]);
  const [guessed, setGuessed] = React.useState(false);

  const toggle = (i: number) => {
    setGuessed(true);
    setPins((prev) => {
      if (prev.includes(i)) return prev.filter((p) => p !== i);
      if (prev.length >= maxPins) return [...prev.slice(1), i];
      return [...prev, i];
    });
  };

  const clear = () => setPins([]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-link">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{prompt}</p>

      <div className="mt-4">
        <GraphAxes xLabel="Frequency" xLeft="low" xRight="high" ticks={0}>
          <div className="flex h-32 items-end gap-px rounded-lg border border-border bg-background p-2">
            {Array.from({ length: slots }, (_, i) => {
              const pinned = pins.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={pinned}
                  aria-label={`Guess a hidden tone at frequency ${i + 1} of ${slots}${pinned ? ", placed" : ""}`}
                  className="group relative flex-1 self-stretch rounded-sm hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex h-full flex-col items-center justify-end">
                    {pinned ? (
                      <>
                        <span className="mb-1 size-2.5 rounded-full bg-primary" />
                        <span className="w-0.5 flex-1 bg-primary/60" />
                      </>
                    ) : (
                      <span className="mb-1 hidden size-2.5 rounded-full bg-primary/30 group-hover:block" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </GraphAxes>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p aria-live="polite" className="min-h-5 text-sm leading-relaxed text-foreground">
          {guessed ? savedText : "Tap where you think a hidden tone might be. There is no wrong answer here."}
        </p>
        {pins.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" /> Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
