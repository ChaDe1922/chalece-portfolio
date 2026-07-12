"use client";

import * as React from "react";

const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

/**
 * Signal-node reticle cursor: a minimal glowing node with measurement ticks that
 * follows the pointer, replacing the old comet trail. It ACCOMPANIES the native
 * cursor (never hides it, per the design guardrail). Fine-pointer only; parked
 * off-screen until the mouse moves; scales up over interactive elements. All
 * position updates go through a rAF loop writing a transform (no React render);
 * under reduced-motion it snaps instead of easing. Hidden on touch and in print.
 */
export function SignalCursor() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let shown = false;
    let raf = 0;

    const loop = () => {
      const k = reduce ? 1 : 0.3;
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
      const t = e.target as Element | null;
      el.dataset.active = t?.closest(INTERACTIVE) ? "true" : "false";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="signal-cursor">
      <svg
        className="reticle"
        width="44"
        height="44"
        viewBox="-22 -22 44 44"
        fill="none"
      >
        <circle r="8.5" stroke="currentColor" strokeWidth="1" opacity="0.85" />
        <circle r="1.6" fill="currentColor" />
        <line x1="0" y1="-13" x2="0" y2="-17.5" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="13" x2="0" y2="17.5" stroke="currentColor" strokeWidth="1" />
        <line x1="-13" y1="0" x2="-17.5" y2="0" stroke="currentColor" strokeWidth="1" />
        <line x1="13" y1="0" x2="17.5" y2="0" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
