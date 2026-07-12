/**
 * Plain mutable store for the hero signal field's per-frame values. Deliberately
 * NOT React state and NOT a ref: pointer/scroll handlers and the useFrame loop
 * read and write it directly, so nothing triggers a React render per frame
 * (protects INP). A component holds one instance via
 * useState(() => makeSignalStore(...))[0] so the compiler does not treat it as a
 * ref and it stays identity-stable.
 */

export type SignalStore = {
  /** Draw-in progress, 0 (scattered) to 1 (assembled). Derived from introElapsed. */
  assemble: number;
  /** Seconds since the intro started; drives the slow staged assemble + dolly. */
  introElapsed: number;
  /** Hero scroll progress, 0 (top) to 1 (scrolled past), drives the merge. */
  scroll: number;
  /** Skill-burst timer: -1 = armed, >=0 = seconds since it fired. */
  burstT: number;
  /** Normalized pointer position, -1..1 (0,0 = centre). Drives the hover reveal. */
  pointerX: number;
  pointerY: number;
  /** Elapsed seconds, advanced by the frame loop (for idle drift). */
  time: number;
  /** Ripple pool: RIPPLE_MAX * 3 = [x_uv, y_uv, startTime] per ripple. A click
   *  writes the next slot; the shader expands + fades each active ripple. */
  ripples: Float32Array;
  rippleHead: number;
};

/** Full cinematic intro length (seconds). */
export const INTRO_DURATION = 3.8;

/** Max concurrent click ripples in the hero wave field. */
export const RIPPLE_MAX = 6;

export function makeSignalStore(introSeen: boolean): SignalStore {
  const ripples = new Float32Array(RIPPLE_MAX * 3);
  // Park every ripple far in the past so none render until a real click.
  for (let i = 0; i < RIPPLE_MAX; i++) ripples[i * 3 + 2] = -1000;
  return {
    assemble: introSeen ? 0.9 : 0,
    // On an in-session revisit, start most of the way through so it settles in
    // ~0.8s instead of replaying the full overture.
    introElapsed: introSeen ? INTRO_DURATION - 0.8 : 0,
    scroll: 0,
    burstT: -1,
    // Parked off-screen so the hover spotlight is off until the cursor moves.
    pointerX: -3,
    pointerY: -3,
    time: 0,
    ripples,
    rippleHead: 0,
  };
}

const INTRO_SEEN_KEY = "signal:introSeen";

export function readIntroSeen(): boolean {
  try {
    return (
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(INTRO_SEEN_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // sessionStorage unavailable (private mode / SSR): harmless, intro replays.
  }
}
