"use client";

import * as React from "react";

/**
 * A very subtle blurred violet glow that trails the cursor, hinting the page
 * is alive. The glow eases toward the pointer (the lag is the "trail"). Purely
 * ambient: never intercepts clicks, only on fine pointers (mouse), and not
 * mounted under prefers-reduced-motion or in print.
 */
export function CursorGlow() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    // target = latest pointer; pos = eased position (trails behind).
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let posX = targetX;
    let posY = targetY;
    let raf = 0;
    let running = false;

    const tick = () => {
      posX += (targetX - posX) * 0.12;
      posY += (targetY - posY) * 0.12;
      el.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - posX) > 0.4 || Math.abs(targetY - posY) > 0.4) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false; // caught up; idle until next move
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      el.style.opacity = "1";
      start();
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-glow" />;
}
