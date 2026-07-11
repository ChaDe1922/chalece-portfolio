"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

/** A reusable, animated commit-graph primitive shared by the Git lab slides that
 *  show branches, divergence, merge, and rebase. Commits, edges, branch tags,
 *  and an animated HEAD pin are rendered in one responsive SVG and glide to new
 *  positions with Motion. New edges grow out of the new commit toward each
 *  parent (the merge/rebase draw-on). The SVG is decorative (aria-hidden);
 *  meaning is carried by a live text region so screen-reader users get every
 *  state change in words. */

export type GraphTone = "main" | "feature" | "merge";

export type GraphCommit = {
  id: string; // short label shown in the node, e.g. "c3", "d4'"
  parents: readonly string[];
  col: number; // time index (x)
  lane: number; // branch row (y), 0 = top
  tone?: GraphTone;
  ghost?: boolean; // abandoned (rebase): dashed + faded, but kept visible
};

export type GraphRef = {
  name: string; // "main", "feature"
  commit: string; // id of the commit it points to
  tone?: GraphTone;
};

export type GraphModel = {
  commits: readonly GraphCommit[];
  refs: readonly GraphRef[];
  head?: string; // name of the branch ref HEAD is attached to
  highlight?: readonly string[]; // commit ids to emphasize (and their parent edges)
};

const NODE_R = 17;
const COL_W = 94;
const LANE_H = 88;
const ORIGIN_X = 78;
const ORIGIN_Y = 122; // room above lane 0 for stacked tags + the HEAD pin
const TAG_H = 24;
const TAG_GAP = 28;

function toneColor(tone: GraphTone | undefined): string {
  if (tone === "feature") return "var(--coral)";
  if (tone === "merge") return "var(--link)";
  return "var(--primary)";
}

const tagWidth = (label: string) => label.length * 7.4 + 22;

export function GitGraph({ model, caption }: { model: GraphModel; caption?: string }) {
  const reduced = useReducedMotion();
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const t = { duration: reduced ? 0 : 0.5, ease };

  const byId = React.useMemo(() => {
    const map = new Map<string, GraphCommit>();
    for (const c of model.commits) map.set(c.id, c);
    return map;
  }, [model.commits]);

  const highlight = React.useMemo(() => new Set(model.highlight ?? []), [model.highlight]);

  const maxCol = model.commits.reduce((m, c) => Math.max(m, c.col), 0);
  const maxLane = model.commits.reduce((m, c) => Math.max(m, c.lane), 0);
  const width = ORIGIN_X * 2 + maxCol * COL_W;
  const height = ORIGIN_Y + maxLane * LANE_H + NODE_R + 32;

  const cx = (c: GraphCommit) => ORIGIN_X + c.col * COL_W;
  const cy = (c: GraphCommit) => ORIGIN_Y + c.lane * LANE_H;

  // Stack the refs that share a commit so their tags do not overlap. HEAD's
  // branch is placed on top so the HEAD pin above it has clear space.
  const refsByCommit = new Map<string, GraphRef[]>();
  for (const r of model.refs) {
    const list = refsByCommit.get(r.commit) ?? [];
    list.push(r);
    refsByCommit.set(r.commit, list);
  }
  for (const list of refsByCommit.values()) {
    list.sort((a, b) => (a.name === model.head ? 1 : b.name === model.head ? -1 : 0));
  }

  // The position of a given ref's tag (used for the HEAD pin).
  function tagPos(ref: GraphRef) {
    const c = byId.get(ref.commit);
    if (!c) return null;
    const list = refsByCommit.get(ref.commit)!;
    const i = list.indexOf(ref);
    return { x: cx(c), y: cy(c) - NODE_R - 14 - i * TAG_GAP };
  }

  const headRef = model.head ? model.refs.find((r) => r.name === model.head) : undefined;
  const headPin = headRef ? tagPos(headRef) : null;

  // Edges: one line per (commit -> parent). x1/y1 = parent, x2/y2 = child.
  const edges: Array<{
    key: string;
    px: number;
    py: number;
    kx: number;
    ky: number;
    tone: GraphTone | undefined;
    ghost: boolean;
    hot: boolean;
  }> = [];
  for (const c of model.commits) {
    for (const pid of c.parents) {
      const p = byId.get(pid);
      if (!p) continue;
      edges.push({
        key: `${c.id}->${pid}`,
        px: cx(p),
        py: cy(p),
        kx: cx(c),
        ky: cy(c),
        tone: c.tone,
        ghost: Boolean(c.ghost || p.ghost),
        hot: highlight.has(c.id),
      });
    }
  }

  const structural =
    model.refs.map((r) => `${r.name} points to commit ${r.commit}`).join(". ") +
    (model.head ? `. HEAD is on ${model.head}.` : ".");

  return (
    <div className="my-2">
      <div className="mx-auto w-full" style={{ maxWidth: width }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          className="h-auto w-full"
          role="img"
          aria-hidden="true"
        >
          {/* Edges (behind nodes). New edges grow from the child toward the parent. */}
          <AnimatePresence>
            {edges.map((e) => {
              const stroke = e.ghost ? "var(--muted-foreground)" : toneColor(e.tone);
              return (
                <m.line
                  key={e.key}
                  initial={{ x1: e.kx, y1: e.ky, x2: e.kx, y2: e.ky, opacity: 0 }}
                  animate={{ x1: e.px, y1: e.py, x2: e.kx, y2: e.ky, opacity: e.ghost ? 0.3 : e.hot ? 1 : 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={t}
                  stroke={stroke}
                  strokeWidth={e.hot ? 3.5 : 2}
                  strokeLinecap="round"
                  strokeDasharray={e.ghost ? "5 5" : undefined}
                />
              );
            })}
          </AnimatePresence>

          {/* Commit nodes */}
          <AnimatePresence>
            {model.commits.map((c) => {
              const x = cx(c);
              const y = cy(c);
              const color = toneColor(c.tone);
              const hot = highlight.has(c.id);
              return (
                <m.g
                  key={c.id}
                  initial={{ x, y, opacity: 0, scale: 0.4 }}
                  animate={{ x, y, opacity: c.ghost ? 0.4 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={t}
                >
                  <circle
                    r={NODE_R}
                    fill="var(--card)"
                    stroke={c.ghost ? "var(--muted-foreground)" : color}
                    strokeWidth={hot ? 4 : 2.5}
                    strokeDasharray={c.ghost ? "4 4" : undefined}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, fontWeight: 600 }}
                    fill="var(--foreground)"
                  >
                    {c.id}
                  </text>
                </m.g>
              );
            })}
          </AnimatePresence>

          {/* Branch tags */}
          <AnimatePresence>
            {model.commits.flatMap((c) => {
              const list = refsByCommit.get(c.id);
              if (!list) return [];
              const baseX = cx(c);
              const topY = cy(c) - NODE_R - 14;
              return list.map((r, i) => {
                const isHead = r.name === model.head;
                const w = tagWidth(r.name);
                const tagY = topY - i * TAG_GAP;
                const color = toneColor(r.tone);
                return (
                  <m.g
                    key={`ref-${r.name}`}
                    initial={{ x: baseX, y: tagY, opacity: 0, scale: 0.6 }}
                    animate={{ x: baseX, y: tagY, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={t}
                  >
                    {/* Opaque card base keeps text high-contrast; the branch
                        color is the border, and HEAD is carried by the separate
                        pin + a thicker border, so color is never the only signal. */}
                    <rect
                      x={-w / 2}
                      y={-TAG_H / 2}
                      width={w}
                      height={TAG_H}
                      rx={TAG_H / 2}
                      fill="var(--card)"
                      stroke={color}
                      strokeWidth={isHead ? 3.5 : 2}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, fontWeight: 600 }}
                      fill="var(--foreground)"
                    >
                      {r.name}
                    </text>
                  </m.g>
                );
              });
            })}
          </AnimatePresence>

          {/* HEAD pin: glides to whichever branch HEAD is on. */}
          {headPin ? (
            <m.g
              key="head-pin"
              initial={false}
              animate={{ x: headPin.x, y: headPin.y - TAG_H / 2 - 14 }}
              transition={t}
            >
              <rect x={-22} y={-12} width={44} height={22} rx={6} fill="var(--primary)" />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                y={-1}
                style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 11, fontWeight: 700 }}
                fill="var(--primary-foreground)"
              >
                HEAD
              </text>
              {/* little downward pointer at the tag */}
              <path d="M -5 10 L 5 10 L 0 16 Z" fill="var(--primary)" />
            </m.g>
          ) : null}
        </svg>
      </div>

      {/* The graph's meaning in words: a single live region so screen-reader
          users hear each state change. Sighted users see the narrative caption;
          the structural detail is visually hidden but announced with it. */}
      <p aria-live="polite" className="mt-2 min-h-6 text-center text-sm leading-relaxed text-muted-foreground">
        {caption ? <span>{caption}</span> : null}
        <span className="sr-only"> {structural}</span>
      </p>
    </div>
  );
}
