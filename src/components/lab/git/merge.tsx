"use client";

import * as React from "react";
import { GitMerge, RotateCcw } from "lucide-react";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";
import { GitGraph, type GraphCommit, type GraphModel, type GraphRef } from "@/components/lab/git/git-graph";

const data = gitLab.slides.merge;

// The diverged starting point, on main.
const BASE: GraphCommit[] = [
  { id: "c1", parents: [], col: 0, lane: 0, tone: "main" },
  { id: "c2", parents: ["c1"], col: 1, lane: 0, tone: "main" },
  { id: "c3", parents: ["c2"], col: 2, lane: 0, tone: "main" },
  { id: "f6", parents: ["c3"], col: 3, lane: 0, tone: "main" },
  { id: "d4", parents: ["c3"], col: 3, lane: 1, tone: "feature" },
  { id: "e5", parents: ["d4"], col: 4, lane: 1, tone: "feature" },
];
const M: GraphCommit = { id: "M", parents: ["f6", "e5"], col: 5, lane: 0, tone: "merge" };
const refs = (mainAt: string): GraphRef[] => [
  { name: "main", commit: mainAt, tone: "main" },
  { name: "feature", commit: "e5", tone: "feature" },
];

// One model per step. Find tips, create M reaching both, then move main to M.
const STATES: GraphModel[] = [
  { commits: BASE, refs: refs("f6"), head: "main" },
  { commits: BASE, refs: refs("f6"), head: "main", highlight: ["f6", "e5"] },
  { commits: [...BASE, M], refs: refs("f6"), head: "main", highlight: ["M"] },
  { commits: [...BASE, M], refs: refs("M"), head: "main" },
];

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 font-mono text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Slide 7: merge, stepped. Find the two tips, create a merge commit that
 *  reaches back to both, then move main onto it. */
export function Merge() {
  const [step, setStep] = React.useState(0);
  const done = step >= STATES.length - 1;

  const caption = step === 0 ? "Diverged: `main` at `f6`, `feature` at `e5`, sharing `c3`." : data.steps[step - 1].caption;
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
            <GitMerge aria-hidden="true" className="size-4" /> {label}
          </button>
          {step > 0 ? (
            <button type="button" onClick={() => setStep(0)} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          ) : null}
        </div>
      </div>

      {done ? (
        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
        </div>
      ) : null}
    </div>
  );
}
