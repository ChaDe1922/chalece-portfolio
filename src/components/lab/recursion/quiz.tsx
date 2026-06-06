"use client";

import * as React from "react";
import { Check, CircleCheckBig, ListChecks, PenLine, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/recursion/rich-text";

const data = recursionLab.slides.quiz;
type Q = (typeof data.questions)[number];

/** Card shell for a graded check, with a header label + solved badge. */
function CheckCard({
  index,
  solved,
  children,
}: {
  index: number;
  solved: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors sm:p-6",
        solved ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/70 dark:bg-emerald-950/20" : "border-border bg-card",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "grid size-7 shrink-0 place-items-center rounded-lg",
            solved ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-link",
          )}
        >
          {solved ? (
            <CircleCheckBig aria-hidden="true" className="size-4" />
          ) : (
            <ListChecks aria-hidden="true" className="size-4" />
          )}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-link">Question {index}</span>
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

/** The success "cover" shown over a check once it is answered correctly. */
function SuccessCover({ objective, rationale }: { objective: string; rationale: string }) {
  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <CircleCheckBig aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div>
        <p className="font-heading text-base font-semibold text-emerald-800 dark:text-emerald-200">Correct!</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground">
          <RichText text={rationale} />
        </p>
        <p className="mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-800 dark:text-emerald-200">
          You can now: {objective}
        </p>
      </div>
    </div>
  );
}

/** Multiple choice (code or text options). Wrong picks show rationale and stay
 *  retryable; a correct pick reveals the success cover with the objective. */
function MultipleChoice({
  q,
  index,
  chosen,
  onChoose,
}: {
  q: Extract<Q, { kind: "mc-code" | "mc-text" }>;
  index: number;
  chosen: string | null;
  onChoose: (key: string) => void;
}) {
  const chosenOpt = q.options.find((o) => o.key === chosen);
  const solved = Boolean(chosenOpt?.correct);

  return (
    <CheckCard index={index} solved={solved}>
      {solved && chosenOpt ? (
        <SuccessCover objective={q.objective} rationale={chosenOpt.feedback} />
      ) : (
        <fieldset className="space-y-3">
          <legend className="text-base font-medium text-foreground">
            <RichText text={q.prompt} />
          </legend>
          <div className="space-y-2">
            {q.options.map((o) => {
              const isChosen = chosen === o.key;
              const showWrong = isChosen && !o.correct;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => onChoose(o.key)}
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
                  {"code" in o ? (
                    <pre className="overflow-x-auto whitespace-pre font-mono text-xs text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
                      {o.code}
                    </pre>
                  ) : (
                    <span className="text-sm leading-relaxed text-foreground">
                      <RichText text={o.text} />
                    </span>
                  )}
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

/** Fill-in-the-blanks trace. Re-checkable; a correct check reveals the cover. */
function FillIn({
  q,
  index,
  onSolved,
}: {
  q: Extract<Q, { kind: "fill" }>;
  index: number;
  onSolved: (id: string, solved: boolean) => void;
}) {
  const [vals, setVals] = React.useState<string[]>(q.labels.map(() => ""));
  const [checked, setChecked] = React.useState(false);
  const right = (i: number) => vals[i].trim() === q.answers[i];
  const allRight = q.answers.every((_, i) => right(i));
  const solved = checked && allRight;

  React.useEffect(() => {
    onSolved(q.id, solved);
  }, [solved, q.id, onSolved]);

  return (
    <CheckCard index={index} solved={solved}>
      {solved ? (
        <SuccessCover objective={q.objective} rationale={q.feedbackCorrect} />
      ) : (
        <div className="space-y-3">
          <p className="text-base font-medium text-foreground">
            <RichText text={q.prompt} />
          </p>
          {"code" in q ? (
            <pre className="overflow-x-auto whitespace-pre rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
              {q.code}
            </pre>
          ) : null}
          <div className="space-y-2">
            {q.labels.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <label htmlFor={`q-fill-${i}`} className="w-28 text-sm text-muted-foreground">
                  {label}
                </label>
                <input
                  id={`q-fill-${i}`}
                  value={vals[i]}
                  onChange={(e) => setVals((a) => a.map((v, j) => (j === i ? e.target.value : v)))}
                  className="h-10 w-24 rounded-lg border border-border bg-background px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {checked ? (
                  right(i) ? (
                    <Check aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <X aria-hidden="true" className="size-4 text-destructive" />
                  )
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Check
          </button>
          {checked && !allRight ? (
            <p aria-live="polite" className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-destructive">Not quite. </span>
              <RichText text={q.feedbackIncorrect} />
            </p>
          ) : null}
        </div>
      )}
    </CheckCard>
  );
}

/** Slide 7: graded quick checks (each with rationale and a per-objective
 *  success cover), then a synthesis reflection. */
export function Quiz() {
  const deck = useDeck();
  const [mc, setMc] = React.useState<Record<string, string>>({});
  const [fillSolved, setFillSolved] = React.useState<Record<string, boolean>>({});
  const [reflection, setReflection] = React.useState("");
  const [showRubric, setShowRubric] = React.useState(false);

  const onFillSolved = React.useCallback((id: string, solved: boolean) => {
    setFillSolved((prev) => (prev[id] === solved ? prev : { ...prev, [id]: solved }));
  }, []);

  const isSolved = (q: Q) =>
    q.kind === "fill"
      ? Boolean(fillSolved[q.id])
      : Boolean(q.options.find((o) => o.key === mc[q.id])?.correct);
  const solvedCount = data.questions.filter(isSolved).length;
  const allSolved = solvedCount === data.questions.length;

  React.useEffect(() => {
    if (allSolved) deck.markComplete(data.id);
  }, [allSolved, deck]);

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      {data.questions.map((q, i) =>
        q.kind === "fill" ? (
          <FillIn key={q.id} q={q} index={i + 1} onSolved={onFillSolved} />
        ) : (
          <MultipleChoice
            key={q.id}
            q={q}
            index={i + 1}
            chosen={mc[q.id] ?? null}
            onChoose={(key) => setMc((m) => ({ ...m, [q.id]: key }))}
          />
        ),
      )}

      {allSolved ? (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          All {data.questions.length} checks passed. Now the real test: say it in your own words.
        </p>
      ) : null}

      {/* Synthesis reflection (self-checked, not graded). */}
      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-link">
            <PenLine aria-hidden="true" className="size-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-link">In your own words</span>
        </div>
        <label htmlFor="reflection" className="text-base font-medium text-foreground">
          {data.reflection.prompt}
        </label>
        <textarea
          id="reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={3}
          placeholder={data.reflection.placeholder}
          className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {showRubric ? (
          <div className="mt-3 space-y-3">
            <p className="text-sm text-muted-foreground">{data.reflection.instruction}</p>
            <ul className="space-y-2">
              {data.reflection.rubric.map((r) => (
                <li key={r.level} className="rounded-lg border border-border bg-card p-3">
                  <span className="text-sm font-semibold text-link">{r.level}</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">{r.criteria}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowRubric(true)}
            disabled={reflection.trim().length === 0}
            className="mt-3 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
          >
            Check it against the rubric
          </button>
        )}
      </div>
    </div>
  );
}
