"use client";

import * as React from "react";

/** Decorative SVG illustrations for the "where you meet recursion" scenarios.
 *  Each one literally shows a thing that contains a smaller version of itself.
 *  They are aria-hidden art: the meaning is carried by the card label, the hint
 *  text, and the aria-live caption in why-recursion.tsx. All use a square 120
 *  viewBox so they scale crisply from a small card icon to the large stage. */

type SceneProps = { className?: string };

const FOLDER =
  "M8 30 C8 26 8 24 12 24 L36 24 L44 32 L88 32 C92 32 92 34 92 38 " +
  "L92 80 C92 84 90 86 86 86 L14 86 C10 86 8 84 8 80 Z";

/** Folders inside folders: the same folder shape nested three levels deep. */
function FoldersScene({ className }: SceneProps) {
  const levels = [
    { k: 1, stroke: "var(--border)", fill: "color-mix(in oklch, var(--muted-foreground) 8%, transparent)" },
    { k: 0.6, stroke: "var(--link)", fill: "color-mix(in oklch, var(--link) 12%, transparent)" },
    { k: 0.32, stroke: "var(--primary)", fill: "color-mix(in oklch, var(--primary) 28%, transparent)" },
  ];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" role="presentation">
      {levels.map((lv, i) => {
        const cx = 60 - 50 * lv.k;
        const cy = 56 - 55 * lv.k;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${lv.k})`}>
            <path d={FOLDER} fill={lv.fill} stroke={lv.stroke} strokeWidth={3 / lv.k} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
}

/** Reply threads: a comment, an indented reply, and a reply to that reply. */
function ThreadsScene({ className }: SceneProps) {
  const rows = [
    { x: 12, y: 16, w: 96, accent: "var(--border)" },
    { x: 34, y: 50, w: 74, accent: "var(--link)" },
    { x: 56, y: 84, w: 52, accent: "var(--primary)" },
  ];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" role="presentation">
      {/* connector lines stepping inward */}
      <path
        d="M21 30 L21 62 Q21 66 25 66 L34 66 M43 64 L43 96 Q43 100 47 100 L56 100"
        fill="none"
        stroke="var(--border)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {rows.map((r, i) => (
        <g key={i}>
          <circle cx={r.x + 9} cy={r.y + 9} r={7} fill={r.accent} />
          <rect x={r.x + 22} y={r.y + 3} width={r.w - 26} height={5} rx={2.5} fill="var(--muted-foreground)" opacity={0.5} />
          <rect x={r.x + 22} y={r.y + 13} width={r.w - 40} height={5} rx={2.5} fill="var(--muted-foreground)" opacity={0.32} />
        </g>
      ))}
    </svg>
  );
}

// A real recursive tree: each branch splits into two smaller branches. Built
// once at module load (deterministic, no randomness).
type Line = { x1: number; y1: number; x2: number; y2: number; w: number };
const TREE_LINES: Line[] = [];
const TREE_LEAVES: { x: number; y: number }[] = [];
(function grow(x: number, y: number, angle: number, len: number, depth: number) {
  const x2 = x + Math.sin(angle) * len;
  const y2 = y - Math.cos(angle) * len;
  TREE_LINES.push({ x1: x, y1: y, x2, y2, w: Math.max(1, depth) });
  if (depth <= 1) {
    TREE_LEAVES.push({ x: x2, y: y2 });
    return;
  }
  grow(x2, y2, angle - 0.42, len * 0.72, depth - 1);
  grow(x2, y2, angle + 0.42, len * 0.72, depth - 1);
})(60, 112, 0, 30, 5);

/** Patterns in nature: a fractal tree, the same branch shape at every scale. */
function NatureScene({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" role="presentation">
      {TREE_LINES.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#3f9d6f"
          strokeWidth={l.w}
          strokeLinecap="round"
        />
      ))}
      {TREE_LEAVES.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.2} fill="#5cc28c" />
      ))}
    </svg>
  );
}

/** Divide and conquer: keep halving the list, the same step on a smaller half. */
function DivideScene({ className }: SceneProps) {
  // Each row is half the width of the one above, centered; the final midpoint
  // cell is the answer.
  const rows = [
    { w: 104, active: false },
    { w: 52, active: false },
    { w: 26, active: false },
    { w: 13, active: true },
  ];
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" role="presentation">
      {rows.map((r, i) => {
        const x = 60 - r.w / 2;
        const y = 14 + i * 26;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={r.w}
              height={16}
              rx={4}
              fill={r.active ? "var(--primary)" : "color-mix(in oklch, var(--muted-foreground) 10%, transparent)"}
              stroke={r.active ? "var(--primary)" : "var(--border)"}
              strokeWidth={2}
            />
            {/* the midline where we split */}
            {!r.active && <line x1={60} y1={y - 1} x2={60} y2={y + 17} stroke="var(--link)" strokeWidth={2} />}
          </g>
        );
      })}
    </svg>
  );
}

export const WHY_SCENES: Record<string, React.ComponentType<SceneProps>> = {
  folders: FoldersScene,
  threads: ThreadsScene,
  nature: NatureScene,
  divide: DivideScene,
};
