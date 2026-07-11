"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Decides whether the WebGL hero canvas should mount. It mounts only when ALL
 * hold: motion is allowed, WebGL is supported, and the hero is in view with the
 * tab visible. The WebGL probe is deferred to idle so it never competes with
 * first paint; state is only set from idle/observer/event callbacks (never
 * synchronously in an effect body), keeping this compiler- and lint-clean.
 *
 * The static SVG is always the fallback, so returning false is a first-class
 * path (no-WebGL, reduced-motion, offscreen, or hidden tab).
 */
export function useSignalCanvasGate(
  containerRef: React.RefObject<HTMLElement | null>,
): boolean {
  const reduced = useReducedMotion();
  const [webglReady, setWebglReady] = React.useState(false);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const probe = () => {
      if (cancelled) return;
      let ok = false;
      try {
        const c = document.createElement("canvas");
        ok = Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
      } catch {
        ok = false;
      }
      if (!cancelled) setWebglReady(ok);
    };
    const w = window as IdleWindow;
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(probe, { timeout: 1200 })
      : window.setTimeout(probe, 400);
    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [reduced]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || reduced) return;
    let inView = false;
    const sync = () =>
      setActive(inView && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: "150px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [containerRef, reduced]);

  return !reduced && webglReady && active;
}
