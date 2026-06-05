"use client";

import * as React from "react";

/**
 * A light, delicate trail that traces the pointer path while it moves and fades
 * out when it stops (no lingering spotlight). Soft violet dots are emitted
 * along the movement path and quickly fade. Works for both mouse movement and
 * finger drags on touch (pointermove fires for both); not mounted under
 * prefers-reduced-motion; never intercepts clicks or scrolling; hidden in print.
 */
export function CursorTrail() {
  const layerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;

    const STEP = 6; // px between dots along the path
    const MAX_PER_MOVE = 20; // cap dots emitted per event (shorter streak on fast flicks)
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

    // Interpolate dots from the last point to (x, y) so fast moves still leave
    // a connected streak rather than spaced dots.
    const emit = (x: number, y: number) => {
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

    // Mouse: pointermove (ignore touch here; the browser cancels touch
    // pointermove on scroll, so touch is handled via the touch events below).
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      emit(e.clientX, e.clientY);
    };
    // Touch: touchmove keeps firing throughout a finger drag / scroll, so the
    // trail traces the finger reliably. Passive: never blocks scrolling.
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] ?? e.changedTouches[0];
      if (t) emit(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      lastX = null;
      lastY = null;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return <div ref={layerRef} aria-hidden="true" className="cursor-trail" />;
}
