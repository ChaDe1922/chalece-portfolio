"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";

const data = recursionLab.slides.code;

// Reveal groups, in the order the function is written.
const GROUP_ORDER = ["signature", "base", "recursive"] as const;
type Part = (typeof GROUP_ORDER)[number];
type Active = "base" | "recursive" | "move" | null;

const HIGHLIGHT_NOTE: Record<Exclude<Active, null>, string> = {
  base: "Highlighting the base case, the stopping point.",
  recursive: "Highlighting the recursive case, the part that calls itself.",
  move: "Highlighting the move toward the base case: n - 1.",
};

/** Slide 5: build countdown in one live code panel, map the recipe onto its
 *  parts (click a card to highlight that part), then predict its output. */
export function CountdownCode() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = React.useState(1);
  const total = GROUP_ORDER.length;
  const allShown = revealed >= total;
  const [active, setActive] = React.useState<Active>(null);
  const codeRef = React.useRef<HTMLDivElement>(null);

  const [answers, setAnswers] = React.useState<string[]>(["", "", "", ""]);
  const [checked, setChecked] = React.useState(false);
  const norm = (s: string) => s.trim();
  const isRight = (i: number) => norm(answers[i]) === data.predict.blanks[i];
  const allRight = data.predict.blanks.every((_, i) => isRight(i));

  const visibleGroups = GROUP_ORDER.slice(0, revealed) as readonly Part[];
  const visibleLines = data.codeLines.filter((l) => visibleGroups.includes(l.part as Part));

  // Clicking a recipe card reveals the whole function (so the part is visible),
  // toggles its highlight, and brings the code into view.
  function activateCard(h: "base" | "recursive" | "move") {
    setRevealed(total);
    setActive((prev) => (prev === h ? null : h));
  }
  React.useEffect(() => {
    if (active) codeRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, [active, reduced]);

  function renderLine(line: (typeof data.codeLines)[number]) {
    if (active === "move" && "move" in line) {
      const move = line.move;
      const idx = line.text.indexOf(move);
      return (
        <>
          {line.text.slice(0, idx)}
          <span className="rounded bg-primary/30 px-1 text-foreground ring-1 ring-primary/50">
            {move}
          </span>
          {line.text.slice(idx + move.length)}
        </>
      );
    }
    return line.text;
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.intro}</p>

      {/* The recipe: tap a step to highlight that part in the code. */}
      <ol className="grid gap-3 sm:grid-cols-3">
        {data.recipe.map((r) => {
          const on = active === r.highlight;
          return (
            <li key={r.id} className="contents">
              <button
                type="button"
                onClick={() => activateCard(r.highlight)}
                aria-pressed={on}
                className={cn(
                  "h-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] hover:border-primary/50",
                )}
              >
                <span className="block font-heading text-sm font-semibold text-link">{r.step}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{r.text}</span>
                <span className="mt-2 inline-block text-xs font-medium text-link">
                  {on ? "Highlighted in the code" : "Show in the code"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="text-base leading-relaxed text-muted-foreground">{data.buildIntro}</p>

      {/* One live code panel: lines accumulate as you reveal, and a clicked card
          lights up its part while the rest dims. */}
      <div ref={codeRef} className="scroll-mt-6 rounded-xl border border-border bg-card p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-link">countdown</p>
        <div className="font-mono text-sm leading-6 [font-feature-settings:'liga'_0,'calt'_0]">
          {visibleLines.map((line, i) => {
            const isActiveLine = active === "move" ? "move" in line : active === line.part;
            const dim = active !== null && !isActiveLine;
            const rowBg = isActiveLine && active !== "move";
            return (
              <div
                key={i}
                className={cn(
                  "whitespace-pre rounded px-2 py-0.5 text-foreground transition-colors",
                  rowBg && "bg-primary/15",
                  dim && "opacity-40",
                )}
              >
                {renderLine(line)}
              </div>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="min-h-5 text-sm text-link">
        {active ? HIGHLIGHT_NOTE[active] : ""}
      </p>

      {/* The note for each revealed piece. */}
      <div className="space-y-2">
        {data.chunks.slice(0, revealed).map((c) => (
          <p key={c.part} className="text-sm leading-relaxed text-muted-foreground">
            <span className="mr-2 text-xs font-medium uppercase tracking-wide text-link">{c.label}</span>
            {c.note}
          </p>
        ))}
      </div>

      {!allShown ? (
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(total, r + 1))}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus aria-hidden="true" className="size-4" /> Reveal the next piece
        </button>
      ) : (
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
                  onChange={(e) => setAnswers((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
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
      )}
    </div>
  );
}
