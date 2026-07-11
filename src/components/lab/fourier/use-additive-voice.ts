"use client";

import * as React from "react";
import type { AudioEngine } from "@/components/lab/audio/use-audio-engine";

/** A sustained additive voice: one sine per harmonic, summed, with live gain
 *  updates so the sound morphs as sliders move. Built on the engine's
 *  noteOn/noteUpdate/noteOff, so it shares the master gain, mute, and analyser.
 *  Per-harmonic gain is scaled down so a full stack stays within the safe cap. */

const HARMONIC_GAIN = 0.2;

export type Partial = { mult: number; gain: number }; // mult = frequency multiple of the base

export function useAdditiveVoice(engine: AudioEngine, baseFreq: number, prefix = "add") {
  const [playing, setPlaying] = React.useState(false);
  const activeRef = React.useRef<Set<number>>(new Set());

  const apply = React.useCallback(
    (partials: ReadonlyArray<Partial>, start: boolean) => {
      for (const p of partials) {
        const id = `${prefix}-${p.mult}`;
        const g = Math.max(0.0001, p.gain * HARMONIC_GAIN);
        if (start || !activeRef.current.has(p.mult)) {
          engine.noteOn(id, { freq: baseFreq * p.mult, type: "sine", gain: g });
          activeRef.current.add(p.mult);
        } else {
          engine.noteUpdate(id, { gain: g });
        }
      }
    },
    [engine, baseFreq, prefix],
  );

  const play = React.useCallback(
    (partials: ReadonlyArray<Partial>) => {
      engine.ensure();
      apply(partials, true);
      setPlaying(true);
    },
    [engine, apply],
  );

  const update = React.useCallback(
    (partials: ReadonlyArray<Partial>) => {
      if (activeRef.current.size > 0) apply(partials, false);
    },
    [apply],
  );

  const stop = React.useCallback(() => {
    for (const m of activeRef.current) engine.noteOff(`${prefix}-${m}`);
    activeRef.current.clear();
    setPlaying(false);
  }, [engine, prefix]);

  React.useEffect(() => {
    const active = activeRef.current; // stable Set reference for cleanup
    return () => {
      for (const m of active) engine.noteOff(`${prefix}-${m}`);
      active.clear();
    };
  }, [engine, prefix]);

  return { play, update, stop, playing };
}
