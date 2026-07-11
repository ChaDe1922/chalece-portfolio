"use client";

import * as React from "react";
import { GitPullRequestArrow, RotateCcw, TriangleAlert } from "lucide-react";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";
import { CuriousNote } from "@/components/lab/git/curious-note";
import { GitGraph, type GraphCommit, type GraphModel, type GraphRef } from "@/components/lab/git/git-graph";

const data = gitLab.slides.rebase;

// Same divergence as the merge slide, but HEAD is on feature this time.
const TRUNK: GraphCommit[] = [
  { id: "c1", parents: [], col: 0, lane: 0, tone: "main" },
  { id: "c2", parents: ["c1"], col: 1, lane: 0, tone: "main" },
  { id: "c3", parents: ["c2"], col: 2, lane: 0, tone: "main" },
  { id: "f6", parents: ["c3"], col: 3, lane: 0, tone: "main" },
];
const d4: GraphCommit = { id: "d4", parents: ["c3"], col: 3, lane: 1, tone: "feature" };
const e5: GraphCommit = { id: "e5", parents: ["d4"], col: 4, lane: 1, tone: "feature" };
const d4g: GraphCommit = { ...d4, ghost: true };
const e5g: GraphCommit = { ...e5, ghost: true };
const d4p: GraphCommit = { id: "d4'", parents: ["f6"], col: 4, lane: 0, tone: "feature" };
const e5p: GraphCommit = { id: "e5'", parents: ["d4'"], col: 5, lane: 0, tone: "feature" };

const refs = (featureAt: string): GraphRef[] => [
  { name: "main", commit: "f6", tone: "main" },
  { name: "feature", commit: featureAt, tone: "feature" },
];

// One model per step: go to f6, set the originals aside and replay d4, then e5,
// then settle. main never moves.
const STATES: GraphModel[] = [
  { commits: [...TRUNK, d4, e5], refs: refs("e5"), head: "feature" },
  { commits: [...TRUNK, d4, e5], refs: refs("e5"), head: "feature", highlight: ["f6"] },
  { commits: [...TRUNK, d4g, e5g, d4p], refs: refs("d4'"), head: "feature", highlight: ["d4'"] },
  { commits: [...TRUNK, d4g, e5g, d4p, e5p], refs: refs("e5'"), head: "feature", highlight: ["e5'"] },
  { commits: [...TRUNK, d4g, e5g, d4p, e5p], refs: refs("e5'"), head: "feature" },
];

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-mono text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Slide 8: rebase, stepped replay. Each feature photo lifts off, fades to a
 *  ghost, and comes back as a new commit on top of main, one at a time. The
 *  contrast with merge is the whole point. */
export function Rebase() {
  const [step, setStep] = React.useState(0);
  const done = step >= STATES.length - 1;

  const caption = step === 0 ? "Diverged: `main` at `f6`, `feature` at `e5`. HEAD is on `feature`." : data.steps[step - 1].caption;
  const label = step === 0 ? data.runLabel : data.nextLabel;

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.teach} />
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <GitGraph model={STATES[step]} caption={caption} />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STATES.length - 1, s + 1))}
            disabled={done}
            className={btnPrimary}
          >
            <GitPullRequestArrow aria-hidden="true" className="size-4" /> {label}
          </button>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(0)} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          ) : null}
        </div>
      </div>

      {done ? (
        <div className="lesson-stagger space-y-4">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
          <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50/60 p-5 dark:border-amber-800/70 dark:bg-amber-950/20">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm leading-relaxed text-foreground">
              <RichText text={data.danger} />
            </p>
          </div>
          <p className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 text-sm font-medium leading-relaxed text-foreground">
            {data.compare}
          </p>
          <CuriousNote title={data.curiousTitle} body={data.curiousBody} />
        </div>
      ) : null}
    </div>
  );
}
