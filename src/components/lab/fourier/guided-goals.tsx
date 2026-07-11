"use client";

import { Target, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";

/** A "guided quest" checklist: an accented panel with a target icon, a progress
 *  count, and ordered steps that light up as they are completed. Deliberately not
 *  styled like the graded assessment cards, so an explore-and-do task does not read
 *  as a test. Presentation only; the parent owns the goal logic and doneIds. */

type Goal = { id: string; text: string };

export function GuidedGoals({
  label,
  intro,
  goals,
  doneIds,
  allDoneText,
  onToggle,
}: {
  label: string;
  intro?: string;
  goals: readonly Goal[];
  doneIds: ReadonlySet<string>;
  allDoneText: string;
  /** When provided, each step is tappable to mark it done (self-marked journeys). */
  onToggle?: (id: string) => void;
}) {
  const done = goals.reduce((n, g) => n + (doneIds.has(g.id) ? 1 : 0), 0);
  const all = done === goals.length && goals.length > 0;

  return (
    <div className="rounded-2xl border border-primary/30 bg-[color-mix(in_oklch,var(--primary)_5%,var(--card))] p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-link">
          <Target aria-hidden="true" className="size-4" />
        </span>
        <span className="font-heading text-base font-semibold text-foreground">{label}</span>
        <span className="ml-auto text-sm font-semibold text-link">
          {done} / {goals.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
        <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${(done / Math.max(1, goals.length)) * 100}%` }} />
      </div>

      {intro ? <p className="mt-3 text-sm text-muted-foreground">{intro}</p> : null}

      <ol className="mt-3 space-y-2">
        {goals.map((g, i) => {
          const isDone = doneIds.has(g.id);
          const marker = (
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-xs font-semibold",
                isDone ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground",
              )}
            >
              {isDone ? <Check aria-hidden="true" className="size-3.5" /> : i + 1}
            </span>
          );
          const body = (
            <span className={cn(isDone && "text-muted-foreground")}>
              <RichText text={g.text} />
            </span>
          );
          const cls = cn(
            "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
            isDone ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-background text-foreground",
          );
          return (
            <li key={g.id}>
              {onToggle ? (
                <button type="button" onClick={() => onToggle(g.id)} aria-pressed={isDone} className={cn(cls, "hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}>
                  {marker}
                  {body}
                </button>
              ) : (
                <div className={cls}>
                  {marker}
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm font-medium text-link">
        {all ? allDoneText : ""}
      </p>
    </div>
  );
}
