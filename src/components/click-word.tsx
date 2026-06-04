"use client";

import * as React from "react";

/**
 * The violet, clickable word in the hero headline ("click."). Clicking (or
 * pressing Enter/Space) lights it up: a large soft violet/coral glow blooms
 * behind the word as it gives a gentle pop, literally making it click.
 * Decorative only; reduced-motion users get the click without motion. It is a
 * real <button>, so the global background burst skips it.
 */
export function ClickWord({ children = "click." }: { children?: React.ReactNode }) {
  const [blooms, setBlooms] = React.useState<number[]>([]);
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
    const id = seq.current++;
    setBlooms((prev) => [...prev, id]);
  }

  function removeBloom(id: number) {
    setBlooms((prev) => prev.filter((b) => b !== id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="click-word"
      aria-label="click (tap for a little surprise)"
    >
      {blooms.map((id) => (
        <span
          key={id}
          aria-hidden="true"
          className="click-word-bloom"
          onAnimationEnd={() => removeBloom(id)}
        />
      ))}
      <span key={pop} className="click-word-text" data-pop={pop > 0 ? "" : undefined}>
        {children}
      </span>
    </button>
  );
}
