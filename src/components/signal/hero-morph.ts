/**
 * Shared shaping for the hero "morphing signal", so the static SVG
 * (static-signal-field.tsx) and the WebGL scene (signal-scene.tsx) render the
 * SAME form. One luminous line of fixed SAMPLE_COUNT points whose vertices
 * interpolate between four states as the hero scrolls:
 *
 *   waveform  ->  timeline  ->  curriculum pathway  ->  skill
 *   (raw sound)   (structure)   (learning path)         (resolved mastery)
 *
 * Everything is in a normalized space:
 *   u    0..1  param along the line (also left->right position for most states)
 *   x    ~0..1 horizontal (0 = far left, FOCAL_X = the resolve/skill point)
 *   y    ~-0.6..0.6 vertical displacement around centre (0)
 * Each renderer maps normalized -> its own coordinate system. Colors mirror the
 * --v2-* tokens; the form resolves from cyan (raw signal) to iris (skill).
 *
 * The point functions write into a caller-owned {x,y} so the per-frame WebGL
 * loop allocates nothing.
 */

export const SAMPLE_COUNT = 128;

export const STATES = ["waveform", "timeline", "pathway", "skill"] as const;
export type MorphState = (typeof STATES)[number];

/** The resolve / "skill" focal point in normalized space. */
export const FOCAL_X = 0.9;
export const FOCAL_Y = 0;

/** Palette (mirrors --v2-cyan / --v2-iris and the skill core). */
export const SIGNAL_CYAN = "#66dff2";
export const SIGNAL_IRIS = "#8e75ff";
export const SKILL_CORE = "#e7ddff";

export type Pt = { x: number; y: number };

const TAU = Math.PI * 2;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Amplitude envelope: tapers both ends so the ribbon reads as a wave packet. */
const env = (u: number) => Math.pow(Math.sin(clamp01(u) * Math.PI), 0.6);

// --- the four states (all share one topology so vertices can lerp per index) ---

function waveform(u: number, time: number, out: Pt): Pt {
  out.x = u;
  out.y = Math.sin(u * TAU * 2.4 + time * 1.1) * 0.5 * env(u);
  return out;
}

function timeline(u: number, out: Pt): Pt {
  out.x = u;
  // Segmented near-square beats along a baseline: raw signal gains structure.
  out.y = Math.tanh(Math.sin(u * TAU * 5) * 3) * 0.2;
  return out;
}

function pathway(u: number, out: Pt): Pt {
  out.x = u;
  // Ascending staircase: structure becomes a curriculum path through levels.
  const levels = 5;
  const lvl = Math.min(levels - 1, Math.floor(u * levels));
  out.y = (lvl / (levels - 1) - 0.5) * 0.72;
  return out;
}

function skill(u: number, out: Pt): Pt {
  // The path gathers and resolves toward the focal node (flattens to centre).
  out.x = lerp(u, FOCAL_X, 0.72);
  out.y = (1 - u) * 0.05 * Math.sin(u * TAU);
  return out;
}

/** Point for a single state at param u (writes into `out`). */
export function statePoint(
  state: MorphState,
  u: number,
  time: number,
  out: Pt,
): Pt {
  switch (state) {
    case "waveform":
      return waveform(u, time, out);
    case "timeline":
      return timeline(u, out);
    case "pathway":
      return pathway(u, out);
    case "skill":
      return skill(u, out);
  }
}

/** Which two states the scroll position sits between, and the blend. */
export function morphAt(scroll: number): {
  from: MorphState;
  to: MorphState;
  mix: number;
} {
  const s = clamp01(scroll) * (STATES.length - 1);
  const i = Math.min(STATES.length - 2, Math.floor(s));
  return { from: STATES[i], to: STATES[i + 1], mix: smooth(s - i) };
}

// Two scratch points so morphPoint allocates nothing per call.
const _a: Pt = { x: 0, y: 0 };
const _b: Pt = { x: 0, y: 0 };

/** The morphed point at (scroll, u), written into `out`. */
export function morphPoint(
  scroll: number,
  u: number,
  time: number,
  out: Pt,
): Pt {
  const { from, to, mix } = morphAt(scroll);
  statePoint(from, u, time, _a);
  statePoint(to, u, time, _b);
  out.x = lerp(_a.x, _b.x, mix);
  out.y = lerp(_a.y, _b.y, mix);
  return out;
}

/**
 * A frozen "full journey" point for the static still: u doubles as both the
 * left->right position and the morph progress, so the drawn path is wavy on the
 * left (raw signal) and resolves flat into the skill node on the right. x is
 * forced monotonic for a clean editorial sweep.
 */
export function stillPoint(u: number, out: Pt): Pt {
  morphPoint(u, u, 0, out);
  out.x = lerp(0.03, FOCAL_X, u);
  return out;
}

/** Per-vertex brightness: dim on the raw left, bright toward the skill node. */
export function brightness(u: number): number {
  return 0.35 + 0.65 * smooth(u);
}

function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/** Hue ramp cyan -> iris across the morph (hex string, for SVG + THREE.Color). */
export function colorAt(scroll: number): string {
  return mixHex(SIGNAL_CYAN, SIGNAL_IRIS, smooth(clamp01(scroll)));
}
