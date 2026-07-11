/**
 * Shared geometry constants for the hero signal field, so the static SVG
 * (static-signal-field.tsx) and the WebGL scene (signal-scene.tsx) stay in
 * lockstep. Colors mirror the --v2-* design tokens in globals.css (WebGL needs
 * literal color values, not CSS vars).
 *
 * Coordinate space: a shallow 3D field roughly x in [-5, 5], y in [-2.5, 2.5],
 * with each lane pushed to its own z for pointer/scroll parallax depth.
 */

export type LaneKind = "waveform" | "nodes" | "frames" | "pathway" | "code";

export type Lane = {
  kind: LaneKind;
  color: string;
  y: number;
  z: number;
};

export const LANES: Lane[] = [
  { kind: "waveform", color: "#66dff2", y: 1.85, z: 0.7 }, // cyan (sound)
  { kind: "nodes", color: "#8e75ff", y: 0.9, z: 0.25 }, // iris (systems)
  { kind: "frames", color: "#d4ae67", y: -0.05, z: -0.15 }, // gold (motion)
  { kind: "pathway", color: "#ff7b72", y: -0.95, z: 0.25 }, // coral (curriculum)
  { kind: "code", color: "#b8b3be", y: -1.85, z: 0.7 }, // soft fog (raw code)
];

/** The single point on the right where every lane resolves. */
export const RESOLVE = { x: 5.1, y: 0, z: 0, color: "#8e75ff" };

export const X_START = -5;
export const X_END = 4.6;

/** Node/frame counts per lane (kept modest for draw-call + perf budget). */
export const NODE_COUNT = 10;
export const FRAME_COUNT = 11;
export const PATHWAY_COUNT = 8;
export const CODE_COUNT = 12;
export const WAVEFORM_SEGMENTS = 96;

/** Reveal factor for a staggered left-to-right draw-in: item i of n is fully
 *  present when `assemble` has passed its slot. Returns 0..1. */
export function laneReveal(assemble: number, i: number, n: number): number {
  const slot = n <= 1 ? 0 : i / (n - 1);
  const span = 0.55; // how much of the 0..1 assemble each item's fade spans
  const start = slot * (1 - span);
  const t = (assemble - start) / span;
  return Math.min(1, Math.max(0, t));
}
