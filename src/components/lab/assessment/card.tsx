import * as React from "react";
import { Check, CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";

/** Shared shells for the assessment bank, matching the recursion/git quiz look:
 *  a card with a header label + solved badge, and a success cover that states
 *  the objective. Reused by every bank component so the lessons feel consistent. */

export function CheckCard({
  label,
  solved,
  children,
}: {
  label: string;
  solved: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors sm:p-6",
        solved
          ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/70 dark:bg-emerald-950/20"
          : "border-border bg-card",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-link">{label}</span>
        {solved ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-300 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-300">
            <Check aria-hidden="true" className="size-3" /> Solved
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function SuccessCover({ objective, rationale }: { objective?: string; rationale: string }) {
  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <CircleCheckBig aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div>
        <p className="font-heading text-base font-semibold text-emerald-800 dark:text-emerald-200">Correct</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          <RichText text={rationale} />
        </p>
        {objective ? (
          <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            You can now: {objective}
          </p>
        ) : null}
      </div>
    </div>
  );
}
