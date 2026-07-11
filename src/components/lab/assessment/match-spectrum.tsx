"use client";

import * as React from "react";
import { Volume2 } from "lucide-react";
import { CheckCard, SuccessCover } from "./card";
import type { AudioEngine } from "@/components/lab/audio/use-audio-engine";
import { PartialGraphs, harmonicColor } from "@/components/lab/fourier/partial-graphs";

/** Match-the-spectrum game: a target recipe of harmonic bars is shown; the learner
 *  sets sliders until their spectrum matches it, hearing both. Solves when every
 *  harmonic is within tolerance. Reuses PartialGraphs + playPartials. */

type Props = {
  label: string;
  prompt: string;
  engine: AudioEngine;
  target: readonly number[];
  baseFreq: number;
  tolerance: number;
  playTargetLabel: string;
  playYoursLabel: string;
  revealLabel: string;
  success: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

export function MatchSpectrum({ label, prompt, engine, target, baseFreq, tolerance, playTargetLabel, playYoursLabel, revealLabel, success, objective, onSolved }: Props) {
  const [yours, setYours] = React.useState<number[]>(() => target.map(() => 0));
  const [solved, setSolved] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const [hint, setHint] = React.useState("");

  const partialsOf = (amps: readonly number[]) => amps.map((g, i) => ({ freq: baseFreq * (i + 1), gain: g })).filter((p) => p.gain > 0.001);

  const playTarget = () => {
    engine.ensure();
    engine.playPartials(partialsOf(target), { duration: 1.1, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } });
  };
  const playYours = () => {
    engine.ensure();
    engine.playPartials(partialsOf(yours), { duration: 1.1, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } });
  };

  const setHarmonic = (i: number, v: number) => {
    setYours((prev) => {
      const next = prev.slice();
      next[i] = v;
      return next;
    });
    setHint("");
  };

  const check = () => {
    let worst = -1;
    let worstDiff = 0;
    for (let i = 0; i < target.length; i++) {
      const d = Math.abs(yours[i] - target[i]);
      if (d > worstDiff) {
        worstDiff = d;
        worst = i;
      }
    }
    if (worstDiff <= tolerance) {
      setSolved(true);
      onSolved?.(true);
    } else {
      setHint(`Close. Check harmonic ${worst + 1}.`);
    }
  };

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={success} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">{prompt}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <figure className="space-y-1">
          <PartialGraphs amps={target} view="bars" />
          <figcaption className="text-center text-xs font-medium text-muted-foreground">Target</figcaption>
        </figure>
        <figure className="space-y-1">
          <PartialGraphs amps={yours} view="bars" />
          <figcaption className="text-center text-xs font-medium text-muted-foreground">Yours</figcaption>
        </figure>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={playTarget} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Volume2 aria-hidden="true" className="size-4" /> {playTargetLabel}
        </button>
        <button type="button" onClick={playYours} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Volume2 aria-hidden="true" className="size-4" /> {playYoursLabel}
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        {yours.map((a, i) => (
          <label key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex w-16 items-center gap-2 font-medium">
              <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ backgroundColor: harmonicColor(i, yours.length) }} />
              H{i + 1}
            </span>
            <input type="range" min={0} max={1} step={0.05} value={a} onChange={(e) => setHarmonic(i, Number(e.target.value))} className="flex-1 accent-[var(--primary)]" aria-label={`Harmonic ${i + 1} level`} />
          </label>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={check} className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Check match
        </button>
        {!revealed ? (
          <button type="button" onClick={() => setRevealed(true)} className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {revealLabel}
          </button>
        ) : null}
      </div>
      {hint ? (
        <p aria-live="polite" className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-foreground">
          {hint}
        </p>
      ) : null}
      {revealed ? (
        <p className="mt-2 text-sm text-muted-foreground">Target levels: {target.map((t, i) => `H${i + 1}=${t}`).join(", ")}.</p>
      ) : null}
    </CheckCard>
  );
}
