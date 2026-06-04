"use client";

import * as React from "react";

type Ripple = { id: number; x: number; y: number; color: string };

const COLORS = ["var(--ring)", "var(--coral)"];
const INTERACTIVE = "a, button, input, select, textarea, label, [role='button']";

/**
 * Decorative click feedback: a water-drop ring (with a faint second ring)
 * radiates from each background click, reinforcing "I make hard technical
 * ideas click." Purely visual: the layer never intercepts pointer events, it
 * skips clicks on interactive elements, and it is disabled under
 * prefers-reduced-motion and in print.
 */
export function ClickRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const next = React.useRef(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // primary click only
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE)) return; // let real controls be
      const id = next.current++;
      const color = COLORS[id % COLORS.length];
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY, color }]);
    };

    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
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
          className="ripple-ring"
          style={
            {
              left: r.x,
              top: r.y,
              "--ripple-color": r.color,
            } as React.CSSProperties
          }
        >
          <span className="ripple-ring-inner" />
        </span>
      ))}
    </div>
  );
}
