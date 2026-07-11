"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** Classic single multiple-choice item for the assessment bank. Per-option
 *  feedback, retry on wrong, success cover with the objective. Data-driven so it
 *  reads from a lesson data file. */

export type MCOption = { key: string; text: string; correct: boolean; feedback: string };

export type MCData = {
  readonly objective?: string;
  readonly prompt: string;
  readonly options: readonly MCOption[];
};

export function MultipleChoice({
  label,
  data,
  onSolved,
}: {
  label: string;
  data: MCData;
  onSolved?: (solved: boolean) => void;
}) {
  const [chosen, setChosen] = React.useState<string | null>(null);
  const chosenOpt = data.options.find((o) => o.key === chosen) ?? null;
  const solved = Boolean(chosenOpt?.correct);

  React.useEffect(() => {
    onSolved?.(solved);
  }, [solved, onSolved]);

  return (
    <CheckCard label={label} solved={solved}>
      {solved && chosenOpt ? (
        <SuccessCover objective={data.objective} rationale={chosenOpt.feedback} />
      ) : (
        <fieldset className="space-y-3">
          <legend className="text-base font-medium text-foreground">
            <RichText text={data.prompt} />
          </legend>
          <div className="space-y-2">
            {data.options.map((o) => {
              const isChosen = chosen === o.key;
              const showWrong = isChosen && !o.correct;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setChosen(o.key)}
                  aria-pressed={isChosen}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    showWrong
                      ? "border-destructive/50 bg-destructive/10"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted",
                  )}
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs">
                    {showWrong ? <X aria-hidden="true" className="size-3.5 text-destructive" /> : o.key}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">
                    <RichText text={o.text} />
                  </span>
                </button>
              );
            })}
          </div>
          {chosenOpt && !chosenOpt.correct ? (
            <p aria-live="polite" className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-destructive">Not quite. </span>
              <RichText text={chosenOpt.feedback} />
              <span className="mt-1 block text-xs text-muted-foreground">Try another answer.</span>
            </p>
          ) : null}
        </fieldset>
      )}
    </CheckCard>
  );
}
