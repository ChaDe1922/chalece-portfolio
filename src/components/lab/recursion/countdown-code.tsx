"use client";

import * as React from "react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.code;

/** Slide 3: build countdown in chunks, then predict its output. */
export function CountdownCode() {
  const [revealed, setRevealed] = React.useState(1);
  const allShown = revealed >= data.chunks.length;
  const [answers, setAnswers] = React.useState<string[]>(["", "", "", ""]);
  const [checked, setChecked] = React.useState(false);

  const norm = (s: string) => s.trim();
  const isRight = (i: number) => norm(answers[i]) === data.predict.blanks[i];
  const allRight = data.predict.blanks.every((_, i) => isRight(i));

  return (
    <div className="space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      {/* Chunked reveal */}
      <div className="space-y-3">
        {data.chunks.slice(0, revealed).map((chunk) => (
          <div key={chunk.label} className="rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-link">{chunk.label}</p>
            <pre className="whitespace-pre-wrap font-mono text-sm text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
              {chunk.code}
            </pre>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{chunk.note}</p>
          </div>
        ))}
      </div>

      {!allShown ? (
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(data.chunks.length, r + 1))}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus aria-hidden="true" className="size-4" /> Reveal the next piece
        </button>
      ) : (
        <>
          <div className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-link">The whole function</p>
            <pre className="whitespace-pre-wrap font-mono text-sm text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
              {data.full}
            </pre>
          </div>

          {/* Predict the output */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground">{data.predict.prompt}</p>
            <div className="mt-3 space-y-2">
              {data.predict.labels.map((label, i) => (
                <div key={label} className="flex items-center gap-3">
                  <label htmlFor={`blank-${i}`} className="w-28 text-sm text-muted-foreground">
                    {label}
                  </label>
                  <input
                    id={`blank-${i}`}
                    value={answers[i]}
                    onChange={(e) =>
                      setAnswers((a) => a.map((v, j) => (j === i ? e.target.value : v)))
                    }
                    className="h-10 w-24 rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {checked ? (
                    isRight(i) ? (
                      <Check aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-destructive">
                        <X aria-hidden="true" className="size-4" />
                        <span className="font-mono text-muted-foreground">{data.predict.blanks[i]}</span>
                      </span>
                    )
                  ) : null}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setChecked(true)}
              className="mt-3 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Check
            </button>
            <p
              aria-live="polite"
              className={cn(
                "mt-3 min-h-5 text-sm",
                checked && allRight ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
              )}
            >
              {checked ? (allRight ? data.predict.correctNote : data.predict.wrongNote) : ""}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
