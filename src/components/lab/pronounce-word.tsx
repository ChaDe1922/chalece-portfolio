"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";

/** An inline pronunciation chip: shows a respelling in parentheses with a small
 *  speaker icon, and plays an audio clip of the word when clicked. Full-volume,
 *  one-off playback via `new Audio()` (independent of the music engine). The click
 *  is a user gesture, so playback is allowed. */
export function PronounceWord({ respelling, src, label }: { respelling: string; src: string; label: string }) {
  const play = () => {
    try {
      const audio = new Audio(src);
      void audio.play().catch(() => {
        // autoplay/codec failure: ignore, the respelling is still shown
      });
    } catch {
      // Audio unavailable: no-op
    }
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label={label}
      className="inline-flex items-baseline gap-1 rounded text-sm text-link underline decoration-dotted decoration-from-font underline-offset-2 transition-colors hover:text-link/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span aria-hidden="true">({respelling})</span>
      <Volume2 aria-hidden="true" className="size-3.5 self-center" />
    </button>
  );
}
