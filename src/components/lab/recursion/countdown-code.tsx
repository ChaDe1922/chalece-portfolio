"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Check, ClipboardCheck, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/recursion/rich-text";

const data = recursionLab.slides.code;

// Reveal groups, in the order the function is written.
const GROUP_ORDER = ["signature", "base", "recursive"] as const;
type Part = (typeof GROUP_ORDER)[number];
type Active = "signature" | "base" | "recursive" | "move" | null;

const HIGHLIGHT_NOTE: Record<Exclude<Active, null>, string> = {
  signature: "Highlighting the signature, where the function is named.",
  base: "Highlighting the base case, the stopping point.",
  recursive: "Highlighting the recursive case, the part that calls itself.",
  move: "Highlighting the move toward the base case: n - 1.",
};

/** Slide 5: build countdown in one live code panel, map the recipe onto its
 *  parts (hover or click a card or a note to highlight that part), then predict
 *  its output in a separated checkpoint. */
export function CountdownCode() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = React.useState(1);
  const total = GROUP_ORDER.length;
  const allShown = revealed >= total;
  const [active, setActive] = React.useState<Active>(null); // pinned by click
  const [hovered, setHovered] = React.useState<Active>(null); // transient preview
  const effective = hovered ?? active;
  const codeRef = React.useRef<HTMLDivElement>(null);

  const [answers, setAnswers] = React.useState<string[]>(["", "", "", ""]);
  const [checked, setChecked] = React.useState(false);
  const norm = (s: string) => s.trim();
  const isRight = (i: number) => norm(answers[i]) === data.predict.blanks[i];
  const allRight = data.predict.blanks.every((_, i) => isRight(i));

  const visibleGroups = GROUP_ORDER.slice(0, revealed) as readonly Part[];
  const visibleLines = data.codeLines.filter((l) => visibleGroups.includes(l.part as Part));

  function pin(p: Exclude<Active, null>) {
    setActive((prev) => (prev === p ? null : p));
  }
  // Clicking a recipe card reveals the whole function so the part is visible.
  function activateCard(p: "base" | "recursive" | "move") {
    setRevealed(total);
    pin(p);
  }
  React.useEffect(() => {
    if (active) codeRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, [active, reduced]);

  function renderLine(line: (typeof data.codeLines)[number]) {
    if (effective === "move" && "move" in line) {
      const move = line.move;
      const idx = line.text.indexOf(move);
      return (
        <>
          {line.text.slice(0, idx)}
          <span className="rounded bg-primary/30 px-1 text-foreground ring-1 ring-primary/50">{move}</span>
          {line.text.slice(idx + move.length)}
        </>
      );
    }
    return line.text;
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.intro} />
      </p>

      <p className="text-base font-medium text-foreground">{data.cardsLead}</p>

      {/* The recipe: hover or tap a step to highlight that part in the code. */}
      <ol className="grid gap-3 sm:grid-cols-3">
        {data.recipe.map((r) => {
          const on = active === r.highlight;
          return (
            <li key={r.id} className="contents">
              <button
                type="button"
                onClick={() => activateCard(r.highlight)}
                onMouseEnter={() => setHovered(r.highlight)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(r.highlight)}
                onBlur={() => setHovered(null)}
                aria-pressed={on}
                className={cn(
                  "flex h-full flex-col rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on
                    ? "border-primary bg-primary/10 ring-2 ring-primary"
                    : "border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] hover:border-primary/50",
                )}
              >
                <span className="block font-heading text-sm font-semibold text-link">{r.step}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  <RichText text={r.text} />
                </span>
                <code className="mt-2 inline-block self-start rounded bg-primary/10 px-1.5 py-0.5 font-mono text-xs text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
                  {r.snippet}
                </code>
                <span className="mt-auto pt-3 text-xs font-medium text-link">
                  {on ? "Highlighted in the code" : "Show in the code"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.buildIntro} />
      </p>

      {/* One live code panel: lines accumulate as you write, and a hovered or
          clicked card/note lights up its part while the rest dims. */}
      <div ref={codeRef} className="scroll-mt-6 rounded-xl border border-border bg-card p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-link">countdown</p>
        <div className="font-mono text-sm leading-6 [font-feature-settings:'liga'_0,'calt'_0]">
          {visibleLines.map((line, i) => {
            const isActiveLine = effective === "move" ? "move" in line : effective === line.part;
            const dim = effective !== null && !isActiveLine;
            const rowBg = isActiveLine && effective !== "move";
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

      {/* The note for each revealed piece. Hover or focus highlights it too. */}
      <div className="space-y-1">
        {data.chunks.slice(0, revealed).map((c) => {
          const on = active === c.part;
          return (
            <button
              key={c.part}
              type="button"
              onClick={() => pin(c.part)}
              onMouseEnter={() => setHovered(c.part)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c.part)}
              onBlur={() => setHovered(null)}
              aria-pressed={on}
              className={cn(
                "block w-full rounded-lg px-2 py-1.5 text-left text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on && "bg-muted",
              )}
            >
              <span className="mr-2 text-xs font-medium uppercase tracking-wide text-link">{c.label}</span>
              <RichText text={c.note} />
            </button>
          );
        })}
      </div>

      {!allShown ? (
        <button
          type="button"
          onClick={() => setRevealed((r) => Math.min(total, r + 1))}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus aria-hidden="true" className="size-4" /> Write the next part
        </button>
      ) : (
        <div className="border-t border-border pt-6">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck aria-hidden="true" className="size-4 text-link" />
            <span className="text-xs font-semibold uppercase tracking-wide text-link">Quick check</span>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground">
              <RichText text={data.predict.prompt} />
            </p>
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
        </div>
      )}
    </div>
  );
}
