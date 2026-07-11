"use client";

import * as React from "react";
import { GitBranch, GitCommitHorizontal, RotateCcw, SquareArrowRight } from "lucide-react";
import { useDeck } from "@/components/deck/deck-context";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";
import { CuriousNote } from "@/components/lab/git/curious-note";
import { GitGraph, type GraphCommit, type GraphRef } from "@/components/lab/git/git-graph";

const data = gitLab.slides.branch;

const TRUNK: GraphCommit[] = [
  { id: "c1", parents: [], col: 0, lane: 0, tone: "main" },
  { id: "c2", parents: ["c1"], col: 1, lane: 0, tone: "main" },
  { id: "c3", parents: ["c2"], col: 2, lane: 0, tone: "main" },
];

const btnCmd =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 font-mono text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/** Slide 3: the reveal. A branch is a movable pointer, not a copy. Commit and
 *  watch the branch slide forward; create a branch and see a second label on the
 *  same commit. Gated: complete once the learner has committed and branched. */
export function BranchPointer() {
  const deck = useDeck();
  const [commits, setCommits] = React.useState<GraphCommit[]>(TRUNK);
  const [refs, setRefs] = React.useState<GraphRef[]>([{ name: "main", commit: "c3", tone: "main" }]);
  const [head, setHead] = React.useState("main");
  const [caption, setCaption] = React.useState<string>(data.caption.start);
  const [counter, setCounter] = React.useState(4);
  const [committed, setCommitted] = React.useState(false);
  const [branched, setBranched] = React.useState(false);

  const hasFeature = refs.some((r) => r.name === "feature");
  const done = committed && branched;

  React.useEffect(() => {
    if (done) deck.markComplete(data.id);
  }, [done, deck]);

  function commit() {
    const tipId = refs.find((r) => r.name === head)!.commit;
    const tip = commits.find((c) => c.id === tipId)!;
    const onMain = head === "main";
    const id = `c${counter}`;
    const newCommit: GraphCommit = {
      id,
      parents: [tip.id],
      col: tip.col + 1,
      lane: onMain ? 0 : 1,
      tone: onMain ? "main" : "feature",
    };
    setCommits((cs) => [...cs, newCommit]);
    setRefs((rs) => rs.map((r) => (r.name === head ? { ...r, commit: id } : r)));
    setCounter((n) => n + 1);
    setCommitted(true);
    setCaption(onMain ? data.caption.committed : data.caption.committedFeature(id));
  }

  function branch() {
    if (hasFeature) return;
    const tipId = refs.find((r) => r.name === head)!.commit;
    setRefs((rs) => [...rs, { name: "feature", commit: tipId, tone: "feature" }]);
    setBranched(true);
    setCaption(data.caption.branched);
  }

  function switchTo(name: string) {
    setHead(name);
    setCaption(name === "feature" ? data.caption.switchedFeature : data.caption.switchedMain);
  }

  function reset() {
    setCommits(TRUNK);
    setRefs([{ name: "main", commit: "c3", tone: "main" }]);
    setHead("main");
    setCaption(data.caption.start);
    setCounter(4);
    setCommitted(false);
    setBranched(false);
  }

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.teach} />
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.instruction} />
      </p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <GitGraph model={{ commits, refs, head }} caption={caption} />

        <div className="mt-3 flex flex-wrap gap-2.5">
          <button type="button" onClick={commit} className={btnCmd}>
            <GitCommitHorizontal aria-hidden="true" className="size-4 text-link" /> {data.commitLabel}
          </button>
          <button type="button" onClick={branch} disabled={hasFeature} className={btnCmd}>
            <GitBranch aria-hidden="true" className="size-4 text-link" /> {data.branchLabel}
          </button>
          <button
            type="button"
            onClick={() => switchTo("feature")}
            disabled={!hasFeature || head === "feature"}
            className={btnCmd}
          >
            <SquareArrowRight aria-hidden="true" className="size-4 text-link" /> {data.switchFeatureLabel}
          </button>
          <button
            type="button"
            onClick={() => switchTo("main")}
            disabled={head === "main"}
            className={btnCmd}
          >
            <SquareArrowRight aria-hidden="true" className="size-4 text-link" /> {data.switchMainLabel}
          </button>
          <button type="button" onClick={reset} className={btnGhost}>
            <RotateCcw aria-hidden="true" className="size-4" /> {data.resetLabel}
          </button>
        </div>
      </div>

      {done ? (
        <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
          <p className="text-sm leading-relaxed text-foreground">
            <RichText text={data.insight} />
          </p>
        </div>
      ) : (
        <p className="text-sm font-medium text-link">{data.doneHint}</p>
      )}

      <CuriousNote title={data.curiousTitle} body={data.curiousBody} />
    </div>
  );
}
