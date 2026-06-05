"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { RotateCcw, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { factorial, recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.shrink;
const MAX = data.maxN; // 4
const TOTAL = MAX * 2; // open MAX, then combine MAX

/** Slide 1: concrete manipulative, no code. Open nested boxes down to the
 *  smallest (the base), then build the answers back up. Drag the action box
 *  onto the stage, or click it, or press Enter. */
export function ShrinkIt() {
  const reduced = useReducedMotion();
  const [step, setStep] = React.useState(0);

  const opened = Math.min(step, MAX); // boxes revealed: MAX, MAX-1, ... down
  const built = Math.max(0, step - MAX); // boxes combined back, from 1 up
  const phase: "open" | "build" | "done" = step < MAX ? "open" : step < TOTAL ? "build" : "done";

  const advance = () => setStep((s) => Math.min(s + 1, TOTAL));
  const reset = () => setStep(0);

  const boxes = Array.from({ length: opened }, (_, i) => {
    const value = MAX - i;
    return {
      value,
      isBase: value === 1,
      solved: built >= value,
      result: built >= value ? factorial(value) : null,
    };
  });

  const instruction =
    phase === "open" ? data.instructionOpen : phase === "build" ? data.instructionBuild : data.doneLabel;
  const actionLabel = phase === "open" ? "Open the next box" : "Combine the next answer";

  return (
    <div className="space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.sub}</p>

      {/* Stage is a drop target; dropping the action box advances a step. */}
      <div
        onDragOver={(e) => phase !== "done" && e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (phase !== "done") advance();
        }}
        className="min-h-[240px] rounded-xl border border-border bg-card p-4"
      >
        <ol className="flex flex-col gap-2">
          {boxes.map((b, i) => (
            <li
              key={b.value}
              style={{ marginLeft: `${i * 18}px`, width: `${260 - i * 36}px` }}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-3",
                reduced ? "" : "transition-all duration-200",
                b.isBase
                  ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40"
                  : "border-border bg-background",
              )}
            >
              <span className="flex items-center gap-2 font-mono text-sm font-semibold text-foreground">
                <Square aria-hidden="true" className="size-3.5 text-muted-foreground" />
                box {b.value}
              </span>
              {b.isBase && phase !== "done" && built < 1 ? (
                <span className="rounded-full border border-emerald-300 px-2 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
                  smallest, stop here
                </span>
              ) : null}
              {b.solved ? (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm font-bold text-primary">
                  = {b.result}
                </span>
              ) : null}
            </li>
          ))}
          {opened === 0 ? (
            <li className="py-8 text-center text-sm text-muted-foreground">
              Press the button below to open the first box.
            </li>
          ) : null}
        </ol>
      </div>

      {/* Instruction + action */}
      <p aria-live="polite" className="min-h-6 text-sm text-foreground">
        {instruction}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {phase !== "done" ? (
          <button
            type="button"
            draggable
            onClick={advance}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", "step")}
            className="inline-flex h-11 cursor-grab items-center gap-2 rounded-lg bg-primary px-4 font-heading text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
          >
            <Square aria-hidden="true" className="size-4" /> {actionLabel}
          </button>
        ) : null}
        {step > 0 ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
