import { cn } from "@/lib/utils";
import {
  FOCAL_X,
  FOCAL_Y,
  SIGNAL_CYAN,
  SIGNAL_IRIS,
  SKILL_CORE,
  stillPoint,
  type Pt,
} from "@/components/signal/hero-morph";

// Normalized -> SVG space (viewBox 0 0 640 480). The still sweeps left->right.
const sx = (xn: number) => 40 + xn * 560;
const sy = (yn: number) => 240 - yn * 150;

/**
 * Static hero signal field: one completed editorial still of the morph's full
 * journey. Reads left-to-right as one luminous line that is a raw waveform on
 * the left, gains structure through the middle, and resolves into the glowing
 * "skill" node on the right. This is the first paint / LCP / no-WebGL /
 * reduced-motion / context-loss state; the WebGL scene animates the same form.
 * Decorative (aria-hidden): the H1 carries the meaning.
 */
export function StaticSignalField({ className }: { className?: string }) {
  const N = 160;
  const p: Pt = { x: 0, y: 0 };
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    stillPoint(i / N, p);
    pts.push(`${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`);
  }
  const path = `M ${pts.join(" L ")}`;
  const fx = sx(FOCAL_X);
  const fy = sy(FOCAL_Y);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 640 480"
      preserveAspectRatio="xMidYMid meet"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient
          id="morph-line"
          gradientUnits="userSpaceOnUse"
          x1="40"
          y1="0"
          x2="600"
          y2="0"
        >
          <stop offset="0" stopColor={SIGNAL_CYAN} stopOpacity="0.25" />
          <stop offset="0.55" stopColor={SIGNAL_CYAN} stopOpacity="0.85" />
          <stop offset="1" stopColor={SIGNAL_IRIS} stopOpacity="1" />
        </linearGradient>
        <radialGradient id="morph-glow">
          <stop offset="0" stopColor={SIGNAL_IRIS} stopOpacity="0.55" />
          <stop offset="0.55" stopColor={SIGNAL_IRIS} stopOpacity="0.16" />
          <stop offset="1" stopColor={SIGNAL_IRIS} stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d={path}
        fill="none"
        stroke="url(#morph-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Resolve node (the focal "skill") */}
      <g data-layer="resolve">
        <circle cx={fx} cy={fy} r="52" fill="url(#morph-glow)" />
        <circle cx={fx} cy={fy} r="7" fill={SIGNAL_IRIS} />
        <circle cx={fx} cy={fy} r="3" fill={SKILL_CORE} />
      </g>
    </svg>
  );
}
