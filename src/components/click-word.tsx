"use client";

import * as React from "react";

/**
 * The violet, clickable word in the hero headline ("click."). Clicking (or
 * pressing Enter/Space) lights it up: a large soft violet/coral glow blooms
 * behind the word as it gives a gentle pop, literally making it click.
 * Decorative only; reduced-motion users get the click without motion. It is a
 * real <button>, so the global background burst skips it.
 */
export function ClickWord({
  children = "click.",
  label = "click (tap for a little surprise)",
}: {
  children?: React.ReactNode;
  label?: string;
}) {
  const [blooms, setBlooms] = React.useState<number[]>([]);
  const [pop, setPop] = React.useState(0);
  const seq = React.useRef(0);
  const lastTouch = React.useRef(0);

  function fire() {
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

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // the word owns this gesture; no background burst too
    // A tap fires touchstart then a synthesized click; skip the ghost click.
    if (Date.now() - lastTouch.current < 700) return;
    fire();
  }

  function handleTouchStart(e: React.TouchEvent) {
    e.stopPropagation(); // keep the window ripple/trail off the word itself
    lastTouch.current = Date.now();
    fire();
  }

  function removeBloom(id: number) {
    setBlooms((prev) => prev.filter((b) => b !== id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className="click-word"
      aria-label={label}
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
