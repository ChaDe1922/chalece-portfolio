/**
 * Plain mutable store for the persistent world layer (the scroll-driven camera
 * that dollies into the distant "wave rooms"). Same rationale as the hero signal
 * store: a ScrollTrigger writes worldProgress and the useFrame camera reads it,
 * so nothing triggers a React render per frame. Held via
 * useState(() => makeWorldStore()).
 */

export type WorldStore = {
  /** 0..1 progress through the current approach (far -> arrived in the room). */
  worldProgress: number;
  /** Elapsed seconds, advanced by the frame loop, so the waves stay alive. */
  time: number;
};

export function makeWorldStore(): WorldStore {
  return { worldProgress: 0, time: 0 };
}
