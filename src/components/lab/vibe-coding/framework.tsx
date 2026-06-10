"use client";

import * as React from "react";
import { ArrowDown, ArrowRight, FlaskConical, HelpCircle, MessageSquareText, MousePointerClick, RotateCw, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVibeBuild } from "@/components/lab/vibe-coding/vibe-context";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.slides.framework;
const builds = vibeCodingLab.builds;

const ICONS = {
  say: MessageSquareText,
  test: FlaskConical,
  remix: Wand2,
} as const;

// Node positions around the ring (top, bottom-right, bottom-left), matching the
// steps order say / test / remix.
const POS = [
  { left: "50%", top: "13%" },
  { left: "82%", top: "69%" },
  { left: "18%", top: "69%" },
] as const;

// Clockwise arrowheads at the midpoints between nodes (SVG 0..100 coords).
const ARROWS = [
  { x: 82.9, y: 31, rot: 60 },
  { x: 50, y: 88, rot: 180 },
  { x: 17.1, y: 31, rot: 300 },
];

/** Slide 1: the say / test / remix loop as a circular cycle. It does not
 *  auto-advance; the current step pulses to invite a click, and clicking moves
 *  clockwise, uncovering each step and looping back so it reads as something you
 *  repeat. The detail panel shows an example matched to the build choice. */
export function Framework() {
  const { build } = useVibeBuild();
  const [active, setActive] = React.useState(0);
  const [seen, setSeen] = React.useState<boolean[]>(() => data.steps.map((_, i) => i === 0));

  // The next step to click to keep moving around the loop (-1 once all seen).
  const nextUnseen = seen.findIndex((v) => !v);

  // Clicking a step selects it (and uncovers it). Re-clicking the active step is
  // a no-op: no deselect, no jumping ahead.
  const handleClick = (i: number) => {
    setActive(i);
    if (!seen[i]) setSeen((prev) => prev.map((v, j) => (j === i ? true : v)));
  };

  const step = data.steps[active];
  const b = builds[build ?? data.defaultBuild];

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-sm text-muted-foreground">{data.intro}</p>

      {/* Circular cycle */}
      <div className="relative mx-auto aspect-square w-full max-w-[18rem] sm:max-w-[20rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 4" />
          {ARROWS.map((a, i) => (
            <path
              key={i}
              d="M3,0 L-2.2,2.4 L-2.2,-2.4 Z"
              fill="var(--link)"
              transform={`translate(${a.x} ${a.y}) rotate(${a.rot})`}
            />
          ))}
        </svg>

        {/* Center: it repeats */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <RotateCw aria-hidden="true" className="size-5 text-link cycle-spin" />
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {data.repeatLabel}
          </span>
        </div>

        {/* Nodes */}
        {data.steps.map((s, i) => {
          const Icon = ICONS[s.id];
          const isActive = i === active;
          const isSeen = seen[i];
          const isNext = i === nextUnseen;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleClick(i)}
              aria-pressed={isActive}
              aria-label={`${s.label}, step ${s.num}${isActive ? ", current" : isNext ? ", next step" : ""}`}
              style={POS[i]}
              className={cn(
                "absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !isSeen && !isNext && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "grid size-14 place-items-center rounded-full border transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isSeen
                      ? "border-primary/40 bg-card text-link"
                      : isNext
                        ? "border-primary/50 bg-card text-link"
                        : "border-border bg-card text-muted-foreground",
                  isNext && "cycle-nudge",
                )}
              >
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <span className="font-heading text-xs font-semibold text-foreground">{s.label}</span>
            </button>
          );
        })}
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <MousePointerClick aria-hidden="true" className="size-4 shrink-0 text-link" />
        {data.cycleHint}
      </p>

      {/* Personalized detail for the active step. */}
      <div aria-live="polite" className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="font-heading text-base font-semibold text-foreground">
            <span className="text-link">Step {step.num}: </span>
            {step.head}
          </h3>
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-link">
            {data.personalizedLabel(b.label)}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

        {/* Example, matched to the chosen build. */}
        {step.id === "say" ? (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex-1 rounded-lg border border-border bg-background p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Weak</p>
              <p className="mt-0.5 text-sm text-foreground">{b.weak}</p>
            </div>
            <span aria-hidden="true" className="flex items-center justify-center text-muted-foreground">
              <ArrowDown className="size-4 sm:hidden" />
              <ArrowRight className="hidden size-5 sm:block" />
            </span>
            <div className="flex-1 rounded-lg border border-primary/40 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-link">Stronger</p>
              <p className="mt-0.5 text-sm text-foreground">{b.sentence}</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-primary/40 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-3">
            <p className="text-sm text-foreground">{step.id === "test" ? b.framework.test : b.framework.remix}</p>
          </div>
        )}

        <p className="mt-3 flex items-start gap-2 text-sm font-medium leading-snug text-foreground">
          <HelpCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-link" />
          {step.question}
        </p>

        {!build ? <p className="mt-3 text-xs text-muted-foreground">{data.defaultHint}</p> : null}
      </div>
    </div>
  );
}
