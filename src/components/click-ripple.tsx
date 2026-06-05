"use client";

import * as React from "react";

type Ripple = { id: number; x: number; y: number; color: string };

const COLORS = ["var(--ring)", "var(--coral)"];
const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

/**
 * Decorative click feedback: a soft, blurred color glow blooms from each
 * background click and fades, reinforcing "I make complex technical concepts click."
 * Purely visual: the layer never intercepts pointer events, it skips clicks on
 * interactive elements, and it is disabled under prefers-reduced-motion and in
 * print.
 */
export function ClickRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const next = React.useRef(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastTouch = 0;

    const bloom = (x: number, y: number, target: Element | null) => {
      if (target?.closest(INTERACTIVE)) return; // let real controls be
      const id = next.current++;
      const color = COLORS[id % COLORS.length];
      setRipples((prev) => [...prev, { id, x, y, color }]);
    };

    // Mouse only: touch is handled by touchstart below (real/synthesized touch
    // pointerdowns don't reliably report button 0).
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (Date.now() - lastTouch < 700) return; // ignore ghost mouse after touch
      bloom(e.clientX, e.clientY, e.target as Element | null);
    };
    const onTouchStart = (e: TouchEvent) => {
      lastTouch = Date.now();
      const t = e.changedTouches[0];
      // Use the event target (topmost element under the touch) for the
      // interactive-skip; Touch.target can be stale.
      if (t) bloom(t.clientX, t.clientY, e.target as Element | null);
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
          className="click-burst"
          style={
            {
              left: r.x,
              top: r.y,
              "--burst-color": r.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
