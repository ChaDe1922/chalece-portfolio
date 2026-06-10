"use client";

import * as React from "react";
import { Check, CircleCheckBig, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckData = {
  prompt: string;
  button: string;
  options: ReadonlyArray<{ text: string; correct: boolean }>;
  feedbackCorrect: string;
  feedbackIncorrect: string;
};

/** Shared observation check under each artifact: clicking reveals the options,
 *  the learner names what changed, and gets feedback. Formative only. */
export function WhatChanged({ check }: { check: CheckData }) {
  const [open, setOpen] = React.useState(false);
  const [picked, setPicked] = React.useState<number | null>(null);
  const correct = picked !== null && check.options[picked].correct;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <HelpCircle aria-hidden="true" className="size-4" />
        {check.button}
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <p className="text-base font-medium text-foreground">{check.prompt}</p>
      <div className="mt-3 space-y-2">
        {check.options.map((o, i) => {
          const isPicked = picked === i;
          const showWrong = isPicked && !o.correct;
          const showRight = isPicked && o.correct;
          return (
            <button
              key={o.text}
              type="button"
              onClick={() => setPicked(i)}
              aria-pressed={isPicked}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                showRight
                  ? "border-emerald-400 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                  : showWrong
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border bg-background hover:border-primary/50 hover:bg-muted",
              )}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border">
                {showRight ? (
                  <Check aria-hidden="true" className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : showWrong ? (
                  <X aria-hidden="true" className="size-3.5 text-destructive" />
                ) : null}
              </span>
              <span className="text-foreground">{o.text}</span>
            </button>
          );
        })}
      </div>
      {picked !== null ? (
        <p
          aria-live="polite"
          className={cn(
            "mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-sm leading-relaxed",
            correct ? "bg-emerald-500/10 text-foreground" : "text-muted-foreground",
          )}
        >
          {correct ? (
            <CircleCheckBig aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : null}
          <span>
            {correct ? (
              check.feedbackCorrect
            ) : (
              <>
                <span className="font-medium text-destructive">Not quite. </span>
                {check.feedbackIncorrect}
              </>
            )}
          </span>
        </p>
      ) : null}
    </div>
  );
}
