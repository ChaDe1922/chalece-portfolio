"use client";

import * as React from "react";

/**
 * The violet, clickable word "Python" in the code slide heading. Reuses the
 * hero's .click-word styling for color/focus/hover, but its easter egg is a
 * little green python: on click a snake slithers out from behind the word and
 * retreats back behind it. Decorative only; reduced-motion users get the click
 * without the snake. A real <button>, so the global background burst skips it.
 */
export function PythonWord({ children = "Python" }: { children?: React.ReactNode }) {
  const [snakes, setSnakes] = React.useState<number[]>([]);
  const seq = React.useRef(0);
  const lastTouch = React.useRef(0);

  function fire() {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setSnakes((prev) => [...prev, seq.current++]);
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (Date.now() - lastTouch.current < 700) return; // skip the ghost click
    fire();
  }

  function handleTouchStart(e: React.TouchEvent) {
    e.stopPropagation();
    lastTouch.current = Date.now();
    fire();
  }

  function removeSnake(id: number) {
    setSnakes((prev) => prev.filter((s) => s !== id));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      className="click-word"
      aria-label="Python (tap for a little surprise)"
    >
      {snakes.map((id) => (
        <span
          key={id}
          aria-hidden="true"
          className="python-snake"
          // Only the slither end removes the snake; the tongue flick's
          // animationend bubbles up here too and would cut it off early.
          onAnimationEnd={(e) => {
            if (e.animationName.includes("python-slither")) removeSnake(id);
          }}
        >
          <svg viewBox="0 0 40 16" width="40" height="16" role="presentation">
            {/* body: a sinuous green serpent, head at the right (leading) end */}
            <path
              d="M2 8 Q7 2 12 8 T22 8 T31 8"
              fill="none"
              stroke="#3f9d6f"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            <circle cx="32" cy="8" r="4" fill="#5cc28c" />
            <circle cx="33.4" cy="6.6" r="0.9" fill="#0f2a1d" />
            {/* forked tongue, flicking */}
            <path
              className="python-snake-tongue"
              d="M36 8 L39 6.6 M36 8 L39 9.4"
              stroke="#e8554e"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </span>
      ))}
      <span className="click-word-text">{children}</span>
    </button>
  );
}
