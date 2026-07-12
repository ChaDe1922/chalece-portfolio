/**
 * Shared shaping for the hero signal field, so the static SVG
 * (static-signal-field.tsx) and the WebGL scene (signal-scene.tsx) render the
 * SAME composition. Everything here is in a normalized space:
 *   xNorm 0 (far left) -> 1 (the resolve point on the right)
 *   yNorm -1 (bottom) -> +1 (top), 0 = vertical centre (the resolve height)
 * Each renderer maps normalized -> its own coordinate system.
 *
 * The idea it must communicate: many RAW signals on the left (scattered, dim,
 * near-neutral) that align, brighten, and CONVERGE into one luminous point
 * (skill) on the right. Colors mirror the --v2-* tokens.
 */

export type LaneKind = "waveform" | "nodes" | "frames" | "pathway" | "code";

export type Lane = {
  kind: LaneKind;
  color: string;
  /** Resting lane centre in yNorm (+1 top .. -1 bottom). */
  center: number;
  /** Stable seed for deterministic scatter. */
  seed: number;
};

export const LANES: Lane[] = [
  { kind: "waveform", color: "#66dff2", center: 0.86, seed: 11 }, // Sound (cyan)
  { kind: "nodes", color: "#8e75ff", center: 0.44, seed: 23 }, // Data (iris)
  { kind: "frames", color: "#d4ae67", center: 0.0, seed: 37 }, // Motion (gold)
  { kind: "pathway", color: "#ff7b72", center: -0.44, seed: 41 }, // Curriculum (coral)
  { kind: "code", color: "#b8b3be", center: -0.86, seed: 53 }, // Code (fog)
];

/** Neutral used for the raw/dim left; accent emerges toward the right. */
export const NEUTRAL = "#7d7a86";
/** The synthesis / skill color that the whole field resolves into. */
export const RESOLVE_COLOR = "#8e75ff";

export const NODE_COUNT = 8;
export const FRAME_COUNT = 7;
export const PATHWAY_COUNT = 7;
export const CODE_COUNT = 8;
export const WAVEFORM_SAMPLES = 120;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const hash = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
};

/** 0 through acts 1-2, easing to 1 at the resolve (lanes bend to centre). */
export const convergeFactor = (x: number) => smooth(0.66, 1.0, x);
/** Opacity ramp: dim on the raw left, bright by the aligning middle. */
export const laneAlpha = (x: number) => 0.2 + 0.72 * smooth(0.04, 0.55, x);
/** Neutral -> accent blend factor, and a final push to iris near the resolve. */
export const laneTint = (x: number) => smooth(0.14, 0.55, x);
export const resolveTint = (x: number) => smooth(0.78, 1.0, x);
/** Scatter strength: strong on the far left, gone by the aligning zone. */
export const scatterAmp = (x: number) => 1 - smooth(0.02, 0.42, x);

/** Lane baseline y at xNorm: jittered around its centre on the left, then bent
 *  toward the centre (0) as it approaches the resolve. */
export function laneYNorm(lane: Lane, x: number): number {
  const jitter = (hash(lane.seed + x * 13.0) - 0.5) * 0.5 * scatterAmp(x);
  const base = lane.center + jitter;
  return base * (1 - convergeFactor(x));
}

/** Waveform displacement: noisy on the left, a clean low wave on the right. */
export function waveY(x: number): number {
  const clean = Math.sin(x * 6.5) * 0.13;
  const noise = (hash(x * 90.0) - 0.5) * 0.22 * scatterAmp(x);
  return clean * (1 - 0.5 * scatterAmp(x)) + noise;
}

/** Element x for discrete lanes: evenly spaced, with slight left-side jitter. */
export function elementX(i: number, n: number, seed: number): number {
  const even = n <= 1 ? 0.5 : i / (n - 1);
  const jit = (hash(seed + i * 7.3) - 0.5) * 0.05 * scatterAmp(even);
  return clamp01(even * 0.98 + 0.01 + jit);
}

/** Reveal factor for a staggered left-to-right draw-in (used by the WebGL
 *  animator). Item i of n is fully present once `assemble` passes its slot. */
export function laneReveal(assemble: number, i: number, n: number): number {
  const slot = n <= 1 ? 0 : i / (n - 1);
  const span = 0.55;
  const start = slot * (1 - span);
  return clamp01((assemble - start) / span);
}

/** For the DOM label overlay: each lane's left-edge anchor as CSS percentages
 *  of the field box (so labels sit clear of the lines, aligned to lane start).
 *  topPct is derived from the lane centre; leftPct is a small inset. */
export function laneLabelAnchors(): Array<{
  kind: LaneKind;
  label: string;
  topPct: number;
}> {
  const labels: Record<LaneKind, string> = {
    waveform: "Sound",
    nodes: "Data",
    frames: "Motion",
    pathway: "Curriculum",
    code: "Code",
  };
  return LANES.map((l) => ({
    kind: l.kind,
    label: labels[l.kind],
    // yNorm +1 (top) -> 0%, -1 (bottom) -> 100%
    topPct: (1 - (l.center + 1) / 2) * 100,
  }));
}
