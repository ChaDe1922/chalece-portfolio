import { cn } from "@/lib/utils";
import {
  LANES,
  NEUTRAL,
  RESOLVE_COLOR,
  NODE_COUNT,
  FRAME_COUNT,
  PATHWAY_COUNT,
  CODE_COUNT,
  WAVEFORM_SAMPLES,
  convergeFactor,
  laneAlpha,
  laneTint,
  resolveTint,
  laneYNorm,
  waveY,
  elementX,
  type Lane,
} from "@/components/signal/signal-lanes";

// Normalized -> SVG space (viewBox 0 0 640 480). Resolve point at (600, 240).
// Art starts at x=108 (~17%), leaving a left gutter for the DOM labels.
const RX = 600;
const RY = 240;
const sx = (xn: number) => 108 + xn * (RX - 108);
const sy = (yn: number) => RY - yn * 185;

function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
/** Per-element color: neutral on the raw left, accent through the middle, iris
 *  as it nears the resolve. */
const tone = (lane: Lane, xn: number) =>
  mix(mix(NEUTRAL, lane.color, laneTint(xn)), RESOLVE_COLOR, resolveTint(xn));

const baseline = (lane: Lane, xn: number) => lane.center * (1 - convergeFactor(xn));

/**
 * Static hero signal field. Reads left-to-right: five raw signals (Sound, Data,
 * Motion, Curriculum, Code) start scattered and dim on the left, align and
 * brighten through the middle, and converge into one glowing point (skill) on
 * the right. This is the first paint / no-WebGL / reduced-motion / context-loss
 * state; the WebGL scene mirrors this exact composition. Decorative
 * (aria-hidden): the H1 and the DOM labels carry the meaning.
 */
export function StaticSignalField({ className }: { className?: string }) {
  const wave = LANES[0];
  const nodes = LANES[1];
  const frames = LANES[2];
  const pathway = LANES[3];
  const code = LANES[4];

  // Waveform path (baseline bend + wave, noisy left -> clean right).
  const wavePts: string[] = [];
  for (let i = 0; i <= WAVEFORM_SAMPLES; i++) {
    const xn = i / WAVEFORM_SAMPLES;
    const yn = baseline(wave, xn) + waveY(xn);
    wavePts.push(`${sx(xn).toFixed(1)} ${sy(yn).toFixed(1)}`);
  }
  const wavePath = `M ${wavePts.join(" L ")}`;

  const nodePts = Array.from({ length: NODE_COUNT }, (_, i) => {
    const xn = elementX(i, NODE_COUNT, nodes.seed);
    return { xn, x: sx(xn), y: sy(laneYNorm(nodes, xn)) };
  });
  const framePts = Array.from({ length: FRAME_COUNT }, (_, i) => {
    const xn = elementX(i, FRAME_COUNT, frames.seed);
    return { xn, x: sx(xn), y: sy(laneYNorm(frames, xn)) };
  });
  const pathPts = Array.from({ length: PATHWAY_COUNT }, (_, i) => {
    const xn = elementX(i, PATHWAY_COUNT, pathway.seed);
    return { xn, x: sx(xn), y: sy(laneYNorm(pathway, xn)) };
  });
  const codePts = Array.from({ length: CODE_COUNT }, (_, i) => {
    const xn = elementX(i, CODE_COUNT, code.seed);
    return { xn, x: sx(xn), y: sy(laneYNorm(code, xn)) };
  });

  // Convergence: bright strokes from each lane's rightmost element to resolve.
  const lastOf = (pts: { x: number; y: number }[]) => pts[pts.length - 1];
  const convergeFrom = [
    { x: sx(0.9), y: sy(baseline(wave, 0.9) + waveY(0.9)) },
    lastOf(nodePts),
    lastOf(framePts),
    lastOf(pathPts),
    lastOf(codePts),
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 480"
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient
          id="sig-wave"
          gradientUnits="userSpaceOnUse"
          x1="40"
          y1="0"
          x2={RX}
          y2="0"
        >
          <stop offset="0" stopColor={NEUTRAL} stopOpacity="0.12" />
          <stop offset="0.5" stopColor={wave.color} stopOpacity="0.85" />
          <stop offset="1" stopColor={RESOLVE_COLOR} stopOpacity="1" />
        </linearGradient>
        <radialGradient id="sig-glow">
          <stop offset="0" stopColor={RESOLVE_COLOR} stopOpacity="0.55" />
          <stop offset="0.55" stopColor={RESOLVE_COLOR} stopOpacity="0.16" />
          <stop offset="1" stopColor={RESOLVE_COLOR} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Waveform */}
      <g data-layer="waveform">
        <path d={wavePath} fill="none" stroke="url(#sig-wave)" strokeWidth="2" />
      </g>

      {/* Data nodes */}
      <g data-layer="nodes">
        <polyline
          points={nodePts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={nodes.color}
          strokeWidth="1.25"
          opacity="0.35"
        />
        {nodePts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5 + p.xn * 2.5}
            fill={tone(nodes, p.xn)}
            opacity={laneAlpha(p.xn)}
          />
        ))}
      </g>

      {/* Film frames */}
      <g data-layer="frames">
        {framePts.map((p, i) => (
          <rect
            key={i}
            x={p.x - 12}
            y={p.y - 9}
            width="24"
            height="18"
            rx="3"
            fill="none"
            stroke={tone(frames, p.xn)}
            strokeWidth="1.5"
            opacity={laneAlpha(p.xn)}
          />
        ))}
      </g>

      {/* Curriculum pathway */}
      <g data-layer="pathway">
        <polyline
          points={pathPts.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={pathway.color}
          strokeWidth="1.25"
          opacity="0.3"
        />
        {pathPts.map((p, i) => (
          <rect
            key={i}
            x={p.x - 11}
            y={p.y - 9}
            width="22"
            height="18"
            rx="4"
            fill={tone(pathway, p.xn)}
            opacity={laneAlpha(p.xn) * 0.9}
          />
        ))}
      </g>

      {/* Code tokens */}
      <g data-layer="code">
        {codePts.map((p, i) => {
          const w = 10 + p.xn * 26;
          return (
            <line
              key={i}
              x1={p.x - w / 2}
              y1={p.y}
              x2={p.x + w / 2}
              y2={p.y}
              stroke={tone(code, p.xn)}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={laneAlpha(p.xn)}
            />
          );
        })}
      </g>

      {/* Convergence + resolve node (the focal "skill") */}
      <g data-layer="resolve">
        {convergeFrom.map((p, i) => (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={RX}
            y2={RY}
            stroke={RESOLVE_COLOR}
            strokeWidth="1.5"
            opacity="0.45"
          />
        ))}
        <circle cx={RX} cy={RY} r="52" fill="url(#sig-glow)" />
        <circle cx={RX} cy={RY} r="7" fill={RESOLVE_COLOR} />
        <circle cx={RX} cy={RY} r="3" fill="#e7ddff" />
      </g>
    </svg>
  );
}
