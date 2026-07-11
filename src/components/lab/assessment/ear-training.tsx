"use client";

import * as React from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";

/** EarTraining: play a sound, then identify it. Audio is delegated to the lesson
 *  via the onPlay callbacks (the lesson owns the audio engine); this component is
 *  the accessible UI + grading. Keyboard-operable, aria-live result, retry on
 *  wrong. */

export type EarOption = {
  key: string;
  label: string;
  correct: boolean;
  feedback: string;
  /** Optional: preview this option's own sound. */
  onPreview?: () => void;
};

export function EarTraining({
  label,
  prompt,
  playLabel = "Play the sound",
  onPlay,
  options,
  objective,
  onSolved,
}: {
  label: string;
  prompt: string;
  playLabel?: string;
  onPlay: () => void;
  options: readonly EarOption[];
  objective?: string;
  onSolved?: (solved: boolean) => void;
}) {
  const [chosen, setChosen] = React.useState<string | null>(null);
  const chosenOpt = options.find((o) => o.key === chosen) ?? null;
  const solved = Boolean(chosenOpt?.correct);

  React.useEffect(() => {
    onSolved?.(solved);
  }, [solved, onSolved]);

  return (
    <CheckCard label={label} solved={solved}>
      {solved && chosenOpt ? (
        <SuccessCover objective={objective} rationale={chosenOpt.feedback} />
      ) : (
        <div className="space-y-3">
          <p className="text-base font-medium text-foreground">
            <RichText text={prompt} />
          </p>
          <button
            type="button"
            onClick={onPlay}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {playLabel}
          </button>
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o) => {
              const isChosen = chosen === o.key;
              const showWrong = isChosen && !o.correct;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => {
                    setChosen(o.key);
                    o.onPreview?.();
                  }}
                  aria-pressed={isChosen}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    showWrong
                      ? "border-destructive/50 bg-destructive/10"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted",
                  )}
                >
                  {showWrong ? <X aria-hidden="true" className="size-4 shrink-0 text-destructive" /> : null}
                  <span className="text-foreground">{o.label}</span>
                </button>
              );
            })}
          </div>
          {chosenOpt && !chosenOpt.correct ? (
            <p aria-live="polite" className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-destructive">Not quite. </span>
              <RichText text={chosenOpt.feedback} /> <span className="text-xs">Play it again and try another.</span>
            </p>
          ) : null}
        </div>
      )}
    </CheckCard>
  );
}
