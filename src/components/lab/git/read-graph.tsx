"use client";

import * as React from "react";
import { Footprints, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { gitLab } from "@/data/git-lab";
import { RichText } from "@/components/lab/rich-text";
import { GitGraph, type GraphCommit, type GraphRef } from "@/components/lab/git/git-graph";

const data = gitLab.slides.graph;

// A fixed diverged history to read: main moved to f6, feature to e5, both off c3.
const COMMITS: GraphCommit[] = [
  { id: "c1", parents: [], col: 0, lane: 0, tone: "main" },
  { id: "c2", parents: ["c1"], col: 1, lane: 0, tone: "main" },
  { id: "c3", parents: ["c2"], col: 2, lane: 0, tone: "main" },
  { id: "f6", parents: ["c3"], col: 3, lane: 0, tone: "main" },
  { id: "d4", parents: ["c3"], col: 3, lane: 1, tone: "feature" },
  { id: "e5", parents: ["d4"], col: 4, lane: 1, tone: "feature" },
];
const REFS: GraphRef[] = [
  { name: "main", commit: "f6", tone: "main" },
  { name: "feature", commit: "e5", tone: "feature" },
];
const ORDER = ["c1", "c2", "c3", "f6", "d4", "e5"];

const parentOf = (id: string) => COMMITS.find((c) => c.id === id)?.parents[0] ?? null;

// The HEAD -> branch -> commit -> parent walk.
const WALK: Array<{ hl: string[]; cap: string }> = [
  { hl: [], cap: data.walkCaptions.head },
  { hl: ["e5"], cap: data.walkCaptions.branch },
  { hl: ["e5"], cap: data.walkCaptions.commit },
  { hl: ["d4"], cap: data.walkCaptions.parent },
];

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
const btnGhost =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** Slide 4: read the graph. Either step the HEAD -> branch -> commit -> parent
 *  walk, or hover/tap a photo to light up the one it points back to. The buttons
 *  are the keyboard-and-screen-reader path; the SVG is decorative. */
export function ReadGraph() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [walk, setWalk] = React.useState(0); // 0 = not walking, 1..WALK.length

  const walking = walk > 0;
  const highlight = walking ? WALK[walk - 1].hl : selected ? [selected] : [];
  const caption = walking
    ? WALK[walk - 1].cap
    : selected
      ? data.readout(selected, parentOf(selected))
      : "Press Trace, or pick a photo below.";

  const startOrAdvance = () => {
    setSelected(null);
    setWalk((w) => (w >= WALK.length ? 1 : w + 1));
  };
  const walkLabel = walk === 0 ? data.walkLabel : walk >= WALK.length ? "Trace again" : "Next pointer";

  return (
    <div className="lesson-stagger space-y-5">
      <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
      <p className="text-base leading-relaxed text-muted-foreground">
        <RichText text={data.teach} />
      </p>
      <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <GitGraph
          model={{ commits: COMMITS, refs: REFS, head: "feature", highlight }}
          caption={caption}
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={startOrAdvance} className={btnPrimary}>
            <Footprints aria-hidden="true" className="size-4" /> {walkLabel}
          </button>
          {walking || selected ? (
            <button
              type="button"
              onClick={() => {
                setWalk(0);
                setSelected(null);
              }}
              className={btnGhost}
            >
              <RotateCcw aria-hidden="true" className="size-4" /> {data.walkResetLabel}
            </button>
          ) : null}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-link">Or trace one yourself</p>
          <div className="flex flex-wrap gap-2">
            {ORDER.map((cid) => {
              const isSel = !walking && selected === cid;
              return (
                <button
                  key={cid}
                  type="button"
                  aria-pressed={isSel}
                  onClick={() => {
                    setWalk(0);
                    setSelected(selected === cid ? null : cid);
                  }}
                  onMouseEnter={() => {
                    setWalk(0);
                    setSelected(cid);
                  }}
                  onFocus={() => {
                    setWalk(0);
                    setSelected(cid);
                  }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSel
                      ? "border-primary bg-primary/10 text-link"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {cid}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>
    </div>
  );
}
