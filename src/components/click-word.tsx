"use client";

import * as React from "react";

type Spark = { id: number; tx: number; ty: number; color: string };

/**
 * The violet, clickable word in the hero headline ("click."). Clicking (or
 * pressing Enter/Space) gives a small on-brand surprise: the word pops and a
 * soft burst of violet/coral sparks radiates outward, literally making it
 * click. Decorative only; reduced-motion users get the click without motion.
 * It is a real <button>, so the global background burst skips it.
 */
export function ClickWord({ children = "click." }: { children?: React.ReactNode }) {
  const [sparks, setSparks] = React.useState<Spark[]>([]);
  const [pop, setPop] = React.useState(0);
  const seq = React.useRef(0);

  function handleClick() {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setPop((p) => p + 1);

    const COUNT = 9;
    const base = seq.current;
    const next: Spark[] = Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 26 + Math.random() * 22;
      return {
        id: base + i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        color: i % 2 === 0 ? "var(--ring)" : "var(--coral)",
      };
    });
    seq.current += COUNT;
    setSparks((prev) => [...prev, ...next]);
  }

  function removeSpark(id: number) {
    setSparks((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="click-word"
      aria-label="click (tap for a little surprise)"
    >
      <span key={pop} className="click-word-text" data-pop={pop > 0 ? "" : undefined}>
        {children}
      </span>
      <span aria-hidden="true" className="spark-layer">
        {sparks.map((s) => (
          <span
            key={s.id}
            className="spark"
            onAnimationEnd={() => removeSpark(s.id)}
            style={
              {
                "--tx": `${s.tx}px`,
                "--ty": `${s.ty}px`,
                "--spark": s.color,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </button>
  );
}
