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
  /** Draw-in phase offset (0..1): later lanes start assembling later. */
  phase: number;
};

export const LANES: Lane[] = [
  { kind: "waveform", color: "#66dff2", center: 0.86, seed: 11, phase: 0.0 }, // Sound (cyan)
  { kind: "nodes", color: "#8e75ff", center: 0.44, seed: 23, phase: 0.1 }, // Data (iris)
  { kind: "frames", color: "#d4ae67", center: 0.0, seed: 37, phase: 0.2 }, // Motion (gold)
  { kind: "pathway", color: "#ff7b72", center: -0.44, seed: 41, phase: 0.3 }, // Curriculum (coral)
  { kind: "code", color: "#b8b3be", center: -0.86, seed: 53, phase: 0.4 }, // Code (fog)
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

const mix1 = (a: number, b: number, t: number) => a + (b - a) * t;

/** 0 through acts 1-2, easing to 1 at the resolve (lanes bend to centre).
 *  Static resting composition (scroll = 0). */
export const convergeFactor = (x: number) => smooth(0.66, 1.0, x);

/** Scroll-driven convergence: the merge threshold sweeps LEFT as scroll rises,
 *  so at scroll 1 every lane sits at centre across the full width (one path). */
export function convergeAt(x: number, scroll: number): number {
  const start = mix1(0.66, -0.3, scroll);
  const end = mix1(1.0, -0.05, scroll);
  return smooth(start, end, x);
}

/** Per-lane assemble: later-phase lanes start drawing later, so the five lanes
 *  arrive in sequence rather than all at once. */
export function phasedAssemble(assemble: number, phase: number): number {
  return clamp01((assemble - phase) / Math.max(0.001, 1 - phase));
}

/** How much a lane has merged into the single path (fade its own identity). */
export const mergeFactor = (scroll: number) => smooth(0.5, 0.9, scroll);
/** How present the single merged iris path is. */
export const mergedPathAlpha = (scroll: number) => smooth(0.55, 0.95, scroll);
/** Opacity ramp: dim on the raw left, bright by the aligning middle. */
export const laneAlpha = (x: number) => 0.2 + 0.72 * smooth(0.04, 0.55, x);
/** Neutral -> accent blend factor, and a final push to iris near the resolve. */
export const laneTint = (x: number) => smooth(0.14, 0.55, x);
export const resolveTint = (x: number) => smooth(0.78, 1.0, x);
/** Scatter strength: strong on the far left, gone by the aligning zone. */
export const scatterAmp = (x: number) => 1 - smooth(0.02, 0.42, x);

/** Vertical span (screen %) per unit yNorm. Shared by the labels, the SVG
 *  (sy half-range 185 of 480 = 38.5%), and the WebGL wy scale, so a lane's
 *  centre renders at the SAME height in all three. */
export const LANE_VSPAN = 38.5;

/** 0 at the very start, ramping to 1 just after, so each lane/wave begins
 *  exactly at its centre (level with its label) before any scatter. */
export const startFade = (x: number) => smooth(0, 0.14, x);

/** Lane baseline y at xNorm: jittered around its centre on the left, then bent
 *  toward the centre (0) as it approaches the resolve. */
export function laneYNorm(lane: Lane, x: number): number {
  const jitter =
    (hash(lane.seed + x * 13.0) - 0.5) * 0.5 * scatterAmp(x) * startFade(x);
  const base = lane.center + jitter;
  return base * (1 - convergeFactor(x));
}

/** Waveform displacement: noisy on the left, a clean low wave on the right.
 *  The start fade keeps the wave anchored at centre where it meets its label. */
export function waveY(x: number): number {
  const clean = Math.sin(x * 6.5) * 0.13;
  const noise = (hash(x * 90.0) - 0.5) * 0.22 * scatterAmp(x) * startFade(x);
  return clean * (1 - 0.5 * scatterAmp(x)) * startFade(x) + noise;
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
    // Same vertical mapping the renderers use, so the label sits level with
    // the lane's centre (where the lane now begins).
    topPct: 50 - l.center * LANE_VSPAN,
  }));
}
