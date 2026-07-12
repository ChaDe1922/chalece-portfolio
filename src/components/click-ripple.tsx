"use client";

import * as React from "react";

type Ripple = { id: number; x: number; y: number };

const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

/**
 * Signal-pulse click feedback: a thin iris ring expands from each background
 * click, matching the reticle cursor. Skips real controls AND the hero (where
 * the wave-field ripple is the click feedback, so the two never double up).
 * Never intercepts pointer events; disabled under prefers-reduced-motion and in
 * print.
 */
export function ClickRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const next = React.useRef(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastTouch = 0;

    const pulse = (x: number, y: number, target: Element | null) => {
      // Let real controls be, and let the hero's wave field own hero clicks.
      if (target?.closest(INTERACTIVE) || target?.closest("#hero")) return;
      const id = next.current++;
      setRipples((prev) => [...prev, { id, x, y }]);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (Date.now() - lastTouch < 700) return; // ignore ghost mouse after touch
      pulse(e.clientX, e.clientY, e.target as Element | null);
    };
    const onTouchStart = (e: TouchEvent) => {
      lastTouch = Date.now();
      const t = e.changedTouches[0];
      if (t) pulse(t.clientX, t.clientY, e.target as Element | null);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  const remove = (id: number) =>
    setRipples((prev) => prev.filter((r) => r.id !== id));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden print:hidden"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          onAnimationEnd={() => remove(r.id)}
          className="signal-pulse"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </div>
  );
}
