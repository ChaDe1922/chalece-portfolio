"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";
import { CheckCard, SuccessCover } from "./card";
import type { AudioEngine } from "@/components/lab/audio/use-audio-engine";
import { nearestNoteName } from "@/components/lab/audio/use-audio-engine";

/** Find-the-frequency game: a sound hides one pure tone. Tune the test frequency
 *  until the match score peaks, then lock it in. Mirrors the P6 correlation idea:
 *  the score is highest when the test lines up with the tone inside the sound. */

type Props = {
  label: string;
  prompt: string;
  engine: AudioEngine;
  hiddenFreq: number;
  min: number;
  max: number;
  tolerance: number;
  playSoundLabel: string;
  lockLabel: string;
  revealLabel: string;
  success: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

export function FindTheFrequency({ label, prompt, engine, hiddenFreq, min, max, tolerance, playSoundLabel, lockLabel, revealLabel, success, objective, onSolved }: Props) {
  const [test, setTest] = React.useState(Math.round((min + max) / 2));
  const [attempts, setAttempts] = React.useState(0);
  const [solved, setSolved] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const sigma = (max - min) * 0.06;
  const match = Math.exp(-((test - hiddenFreq) ** 2) / (2 * sigma * sigma));

  const playSound = () => {
    engine.ensure();
    engine.playTone({ freq: hiddenFreq, type: "sine", gain: 0.7, duration: 0.9 });
  };
  const playTest = () => {
    engine.ensure();
    engine.playTone({ freq: test, type: "sine", gain: 0.7, duration: 0.7 });
  };

  const lock = () => {
    const close = Math.abs(test - hiddenFreq) <= tolerance;
    setAttempts((a) => a + 1);
    if (close) {
      setSolved(true);
      onSolved?.(true);
    } else {
      setMsg(test > hiddenFreq ? "Not quite. The hidden tone is lower than your test." : "Not quite. The hidden tone is higher than your test.");
    }
  };

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={`${success} It was about ${Math.round(hiddenFreq)} Hz, near ${nearestNoteName(hiddenFreq)}.`} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">{prompt}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={playSound} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Volume2 aria-hidden="true" className="size-4" /> {playSoundLabel}
        </button>
        <button type="button" onClick={playTest} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Volume2 aria-hidden="true" className="size-4" /> Play test tone
        </button>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Match strength</span>
          <span aria-live="polite" className="font-medium text-link">{Math.round(match * 100)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${Math.round(match * 100)}%` }} />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <span className="w-24 font-medium">Test frequency</span>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={test}
          onChange={(e) => {
            setTest(Number(e.target.value));
            setMsg("");
          }}
          className="flex-1 accent-[var(--primary)]"
          aria-label="Test frequency in hertz"
        />
        <span className="w-16 text-right font-mono text-xs text-foreground">{test} Hz</span>
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={lock} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {lockLabel}
        </button>
        {attempts >= 2 && !revealed ? (
          <button type="button" onClick={() => setRevealed(true)} className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {revealLabel}
          </button>
        ) : null}
      </div>
      {msg ? (
        <p aria-live="polite" className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-foreground">
          {msg}
        </p>
      ) : null}
      {revealed ? (
        <p className="mt-2 text-sm text-muted-foreground">The hidden tone is about {Math.round(hiddenFreq)} Hz. Slide near it and lock in.</p>
      ) : null}
    </CheckCard>
  );
}
