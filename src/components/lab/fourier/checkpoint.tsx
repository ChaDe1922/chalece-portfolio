"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { MultipleChoice } from "@/components/lab/assessment/multiple-choice";
import { MatchLines } from "@/components/lab/fourier/match-lines";
import { ParsonsProblem } from "@/components/lab/assessment/parsons-problem";
import { BucketSort } from "@/components/lab/assessment/bucket-sort";
import { CheckCard } from "@/components/lab/assessment/card";
import { fourierLab } from "@/data/fourier-lab";

/** End-of-section checkpoint (after Parts 1, 2, 3): recap the section, then a few
 *  varied, non-graded self-checks. It looks BACK; the forward roadmap lives on the
 *  next section's cover. Not gated, so Next always works. Question types are mixed
 *  per section (match, parsons, multiple choice, bucket sort, free reflection). */

type ShellData = {
  eyebrow: string;
  lead: string;
  recapLead?: string;
  recap?: readonly string[];
  checksLead: string;
};

function Shell({ data, children }: { data: ShellData; children: React.ReactNode }) {
  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">{data.eyebrow}</p>
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>

      {data.recapLead && data.recap ? (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.recapLead}</p>
          <ul className="mt-3 space-y-2.5">
            {data.recap.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <RichText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-base font-medium text-foreground">{data.checksLead}</p>
      {children}
    </div>
  );
}

/** A free-text reflection: type an answer, then reveal a rubric to self-check
 *  against. Never graded; the reveal is the feedback. */
function Reflection({ prompt, placeholder, rubric }: { prompt: string; placeholder: string; rubric: string }) {
  const [value, setValue] = React.useState("");
  const [revealed, setRevealed] = React.useState(false);
  const id = React.useId();

  return (
    <CheckCard label="In your own words" solved={false}>
      <label htmlFor={id} className="text-base font-medium text-foreground">
        {prompt}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="mt-3 inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Compare with a strong answer
      </button>
      {revealed ? (
        <p aria-live="polite" className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-sm leading-relaxed text-foreground">
          <RichText text={rubric} />
        </p>
      ) : null}
    </CheckCard>
  );
}

export function Checkpoint({ part }: { part: 1 | 2 | 3 }) {
  if (part === 1) {
    const d = fourierLab.slides.checkpoint;
    return (
      <Shell data={d}>
        <MatchLines
          label={d.match.label}
          prompt={d.match.prompt}
          pairs={d.match.pairs}
          successText="You matched every term to its meaning: waveform and spectrum, fundamental and harmonics, amplitude and timbre."
          objective="Match each idea to its meaning."
        />
        <MultipleChoice label="Quick check" data={d.mc} />
        <Reflection prompt={d.reflectionPrompt} placeholder={d.reflectionPlaceholder} rubric={d.reflectionRubric} />
      </Shell>
    );
  }

  if (part === 2) {
    const d = fourierLab.slides.checkpoint2;
    return (
      <Shell data={d}>
        <ParsonsProblem
          label={d.parsons.label}
          prompt={d.parsons.prompt}
          steps={d.parsons.steps}
          distractors={d.parsons.distractors}
          successText={d.parsons.successText}
          objective={d.parsons.objective}
        />
        <MatchLines
          label={d.formulaMatch.label}
          prompt={d.formulaMatch.prompt}
          pairs={d.formulaMatch.pairs}
          successText={d.formulaMatch.successText}
          objective={d.formulaMatch.objective}
        />
        <MultipleChoice label="Quick check" data={d.mc} />
      </Shell>
    );
  }

  const d = fourierLab.slides.checkpoint3;
  return (
    <Shell data={d}>
      <BucketSort
        label={d.repairLead}
        prompt={d.repairPrompt}
        buckets={d.repairBuckets}
        items={d.repairItems}
        successText="Each problem points at a frequency region: muddy lives in the low mids, dull in the treble, thin in the bass."
        objective="Match an audio problem to a fix."
      />
      <MultipleChoice label="Quick check" data={d.mc} />
      <BucketSort
        label={d.toolLead}
        prompt={d.toolPrompt}
        buckets={d.toolBuckets}
        items={d.toolItems}
        successText="Audio tools change, measure, compare, or reduce frequency information."
        objective="Sort tools by what they do with frequency."
      />
    </Shell>
  );
}
