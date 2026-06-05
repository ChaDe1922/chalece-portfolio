"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.predict;

/** Slide 5: predict the output. Commit to an answer, then reveal. */
export function Challenge() {
  const deck = useDeck();
  const [picked, setPicked] = React.useState<number | null>(null);
  const [reflect, setReflect] = React.useState(false);

  function choose(value: number, correct: boolean) {
    setPicked(value);
    if (correct) deck.markComplete(data.id);
  }

  const answered = picked !== null;
  const pickedCorrect = data.options.find((o) => o.value === picked)?.correct ?? false;

  return (
    <div className="space-y-6">
      <p className="text-lg leading-relaxed text-foreground">{data.instruction}</p>

      <p className="rounded-xl border border-border bg-card px-4 py-3 font-mono text-base text-foreground">
        {data.expr}
      </p>

      <div className="flex flex-wrap gap-3" role="group" aria-label="Predict the output">
        {data.options.map((o) => {
          const isPicked = picked === o.value;
          const reveal = answered && o.correct; // always mark the correct one after answering
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => choose(o.value, o.correct)}
              aria-pressed={isPicked}
              className={cn(
                "inline-flex h-12 min-w-16 items-center justify-center gap-1.5 rounded-xl border px-4 font-mono text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                reveal
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : isPicked
                    ? "border-destructive/50 bg-destructive/10 text-destructive"
                    : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {answered && o.correct ? <Check aria-hidden="true" className="size-4" /> : null}
              {isPicked && !o.correct ? <X aria-hidden="true" className="size-4" /> : null}
              {o.value}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="min-h-6 text-sm text-foreground">
        {answered ? (pickedCorrect ? `Correct. ${data.why}` : `Not quite. ${data.why}`) : ""}
      </p>

      {/* Optional reflective reveal */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">{data.reflect.q}</p>
        {reflect ? (
          <p className="mt-2 text-sm text-muted-foreground">{data.reflect.model}</p>
        ) : (
          <button
            type="button"
            onClick={() => setReflect(true)}
            className="mt-2 inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Show one way
          </button>
        )}
      </div>
    </div>
  );
}
