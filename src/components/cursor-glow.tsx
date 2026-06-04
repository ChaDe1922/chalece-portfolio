"use client";

import * as React from "react";

/**
 * A light, delicate trail that traces the mouse path while it moves and fades
 * out when it stops (no lingering spotlight). Soft violet dots are emitted
 * along the movement path and quickly fade. Pointer-fine only; not mounted
 * under prefers-reduced-motion; never intercepts clicks; hidden in print.
 */
export function CursorTrail() {
  const layerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    const STEP = 6; // px between dots along the path
    const MAX_PER_MOVE = 32; // cap dots emitted per event (fast flicks)
    let lastX: number | null = null;
    let lastY: number | null = null;

    const spawn = (x: number, y: number) => {
      const dot = document.createElement("span");
      dot.className = "cursor-trail-dot";
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
      layer.appendChild(dot);
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (lastX === null || lastY === null) {
        lastX = x;
        lastY = y;
        spawn(x, y);
        return;
      }
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist < STEP) return; // not enough movement yet
      const count = Math.min(Math.floor(dist / STEP), MAX_PER_MOVE);
      for (let i = 1; i <= count; i++) {
        const t = i / count;
        spawn(lastX + dx * t, lastY + dy * t);
      }
      lastX = x;
      lastY = y;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={layerRef} aria-hidden="true" className="cursor-trail" />;
}
