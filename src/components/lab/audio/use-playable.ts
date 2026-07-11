"use client";

import * as React from "react";
import type { PlayHandle } from "./use-audio-engine";

type Starter = () => PlayHandle | null | Promise<PlayHandle | null>;

/** Turns the engine's one-shot plays into toggleable buttons. Tracks which id is
 *  currently sounding, stops the previous sound when a new one starts, auto-resets
 *  when a clip finishes (via its duration), and stops on unmount. Use `toggle(id,
 *  starter)` for a play/stop button and read `playingId` for the button state. */
export function usePlayable() {
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const handleRef = React.useRef<PlayHandle | null>(null);
  const timerRef = React.useRef(0);
  const tokenRef = React.useRef(0);

  const hardClear = React.useCallback(() => {
    if (handleRef.current) {
      try {
        handleRef.current.stop();
      } catch {
        // already stopped
      }
    }
    handleRef.current = null;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  }, []);

  const stop = React.useCallback(() => {
    hardClear();
    setPlayingId(null);
  }, [hardClear]);

  const play = React.useCallback((id: string, starter: Starter) => {
    hardClear();
    const token = ++tokenRef.current;
    setPlayingId(id);
    const arm = (h: PlayHandle | null) => {
      if (tokenRef.current !== token) {
        // Superseded before it armed: stop this stray sound immediately.
        if (h) {
          try {
            h.stop();
          } catch {
            // already stopped
          }
        }
        return;
      }
      if (!h) {
        setPlayingId(null);
        return;
      }
      handleRef.current = h;
      timerRef.current = window.setTimeout(() => {
        if (tokenRef.current === token) {
          handleRef.current = null;
          timerRef.current = 0;
          setPlayingId(null);
        }
      }, h.duration * 1000 + 120);
    };
    const res = starter();
    if (res && typeof (res as Promise<unknown>).then === "function") (res as Promise<PlayHandle | null>).then(arm);
    else arm(res as PlayHandle | null);
  }, [hardClear]);

  const toggle = React.useCallback(
    (id: string, starter: Starter) => {
      if (playingId === id) stop();
      else play(id, starter);
    },
    [playingId, play, stop],
  );

  React.useEffect(() => () => hardClear(), [hardClear]);

  return { playingId, play, stop, toggle };
}
