"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { recursionLab } from "@/data/recursion-lab";
import { RichText } from "@/components/lab/recursion/rich-text";

const data = recursionLab.slides.quiz;

type Q = (typeof data.questions)[number];

/** Multiple choice (code or text options) with per-option feedback after a pick. */
function MultipleChoice({
  q,
  chosen,
  onChoose,
}: {
  q: Extract<Q, { kind: "mc-code" | "mc-text" }>;
  chosen: string | null;
  onChoose: (key: string) => void;
}) {
  const answered = chosen !== null;
  const chosenOpt = q.options.find((o) => o.key === chosen);
  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-medium text-foreground">
        <RichText text={q.prompt} />
      </legend>
      <div className="space-y-2">
        {q.options.map((o) => {
          const isChosen = chosen === o.key;
          const showCorrect = answered && o.correct;
          const showWrong = isChosen && !o.correct;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => !answered && onChoose(o.key)}
              aria-pressed={isChosen}
              disabled={answered}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                showCorrect
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
                  : showWrong
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border bg-card",
                !answered && "hover:border-primary/50 hover:bg-muted",
              )}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs">
                {showCorrect ? (
                  <Check aria-hidden="true" className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : showWrong ? (
                  <X aria-hidden="true" className="size-3.5 text-destructive" />
                ) : (
                  o.key
                )}
              </span>
              {"code" in o ? (
                <pre className="overflow-x-auto whitespace-pre font-mono text-xs text-foreground [font-feature-settings:'liga'_0,'calt'_0]">
                  {o.code}
                </pre>
              ) : (
                <span className="text-sm text-foreground">{o.text}</span>
              )}
            </button>
          );
        })}
      </div>
      {answered ? (
        <p
          aria-live="polite"
          className={cn(
            "text-sm leading-relaxed",
            chosenOpt?.correct ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
          )}
        >
          {chosenOpt?.feedback}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Fill-in-the-blanks trace. */
function FillIn({ q }: { q: Extract<Q, { kind: "fill" }> }) {
  const [vals, setVals] = React.useState<string[]>(q.labels.map(() => ""));
  const [checked, setChecked] = React.useState(false);
  const right = (i: number) => vals[i].trim() === q.answers[i];
  const allRight = q.answers.every((_, i) => right(i));
  return (
    <div className="space-y-3">
      <p className="text-base font-medium text-foreground">
        <RichText text={q.prompt} />
      </p>
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
                <span className="flex items-center gap-1 text-sm text-destructive">
                  <X aria-hidden="true" className="size-4" />
                  <span className="font-mono text-muted-foreground">{q.answers[i]}</span>
                </span>
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
      {checked ? (
        <p
          aria-live="polite"
          className={cn(
            "text-sm leading-relaxed",
            allRight ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground",
          )}
        >
          {allRight ? q.feedbackCorrect : q.feedbackIncorrect}
        </p>
      ) : null}
    </div>
  );
}

/** Slide 6: the graded assessment plus a synthesis reflection. */
export function Quiz() {
  const deck = useDeck();
  const [mc, setMc] = React.useState<Record<string, string>>({});
  const [reflection, setReflection] = React.useState("");
  const [showRubric, setShowRubric] = React.useState(false);

  const mcQuestions = data.questions.filter(
    (q): q is Extract<Q, { kind: "mc-code" | "mc-text" }> => q.kind !== "fill",
  );
  const answeredMc = mcQuestions.filter((q) => mc[q.id]).length;
  const correctMc = mcQuestions.filter((q) => {
    const chosen = mc[q.id];
    return chosen && q.options.find((o) => o.key === chosen)?.correct;
  }).length;

  React.useEffect(() => {
    if (answeredMc === mcQuestions.length) deck.markComplete(data.id);
  }, [answeredMc, mcQuestions.length, deck]);

  return (
    <div className="lesson-stagger space-y-8">
      <p className="text-lg leading-relaxed text-muted-foreground">{data.intro}</p>

      {data.questions.map((q) => (
        <div key={q.id} className="border-t border-border pt-6 first:border-0 first:pt-0">
          {q.kind === "fill" ? (
            <FillIn q={q} />
          ) : (
            <MultipleChoice
              q={q}
              chosen={mc[q.id] ?? null}
              onChoose={(key) => setMc((m) => ({ ...m, [q.id]: key }))}
            />
          )}
        </div>
      ))}

      {answeredMc === mcQuestions.length ? (
        <p className="rounded-xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] px-4 py-3 text-sm font-medium text-foreground">
          You got {correctMc} of {mcQuestions.length} multiple choice questions. Now the real test: say it
          in your own words.
        </p>
      ) : null}

      {/* Synthesis reflection */}
      <div className="border-t border-border pt-6">
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
