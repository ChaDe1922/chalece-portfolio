"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";
import { GitGraph, type GraphCommit, type GraphModel, type GraphRef } from "@/components/lab/git/git-graph";

const data = gitLab.slides.diverge;

/** The six states of the divergence, one per executed command. Building them
 *  cumulatively keeps the topology (not the prose) next to the stepping logic,
 *  the same split the recursion lab uses for its call-stack stepper. */
function buildStates(): GraphModel[] {
  const trunk: GraphCommit[] = [
    { id: "c1", parents: [], col: 0, lane: 0, tone: "main" },
    { id: "c2", parents: ["c1"], col: 1, lane: 0, tone: "main" },
    { id: "c3", parents: ["c2"], col: 2, lane: 0, tone: "main" },
  ];
  const d4: GraphCommit = { id: "d4", parents: ["c3"], col: 3, lane: 1, tone: "feature" };
  const e5: GraphCommit = { id: "e5", parents: ["d4"], col: 4, lane: 1, tone: "feature" };
  const f6: GraphCommit = { id: "f6", parents: ["c3"], col: 3, lane: 0, tone: "main" };

  const main = (commit: string): GraphRef => ({ name: "main", commit, tone: "main" });
  const feat = (commit: string): GraphRef => ({ name: "feature", commit, tone: "feature" });

  return [
    { commits: trunk, refs: [main("c3")], head: "main" },
    { commits: trunk, refs: [main("c3"), feat("c3")], head: "feature" },
    { commits: [...trunk, d4], refs: [main("c3"), feat("d4")], head: "feature" },
    { commits: [...trunk, d4, e5], refs: [main("c3"), feat("e5")], head: "feature" },
    { commits: [...trunk, d4, e5], refs: [main("c3"), feat("e5")], head: "main" },
    { commits: [...trunk, d4, e5, f6], refs: [main("f6"), feat("e5")], head: "main" },
  ];
}

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/** Slide 5: build a real divergence by running commands in order. */
export function Diverge() {
  const states = React.useMemo(() => buildStates(), []);
  const [step, setStep] = React.useState(0);

  const done = step >= data.steps.length;
  const caption = step === 0 ? "On `main` at `c3`. Ready to branch." : data.steps[step - 1].caption;

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.teach} />
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-1 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-full bg-primary" /> {data.laneLabels.main}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-full bg-coral" /> {data.laneLabels.feature}
          </span>
        </div>
        <GitGraph model={states[step]} caption={caption} />

        {/* Command log */}
        {step > 0 ? (
          <div className="mt-3 rounded-lg border border-border bg-background p-3">
            <ul className="space-y-1">
              {data.steps.slice(0, step).map((s, i) => (
                <li key={i} className="font-mono text-xs text-muted-foreground">
                  <span className="text-link">$</span> {s.cmd}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(data.steps.length, s + 1))}
            disabled={done}
            className={btnPrimary}
          >
            <Play aria-hidden="true" className="size-4" /> {data.nextLabel}
          </button>
          {!done ? (
            <code className="rounded bg-primary/10 px-2 py-1 font-mono text-xs text-link">{data.steps[step].cmd}</code>
          ) : null}
          {step > 0 ? (
            <button type="button" onClick={() => setStep(0)} className={btnGhost}>
              <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
            </button>
          ) : null}
        </div>
      </div>

      {done ? (
        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm font-medium text-foreground">{data.doneCaption}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
        </div>
      ) : null}
    </div>
  );
}
