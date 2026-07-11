"use client";

import * as React from "react";
import { Play, Square, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { usePlayable } from "@/components/lab/audio/use-playable";

/** "Match the description": read a description, hear the sounds, then tap the one
 *  it fits. One prompt at a time, correct advances, wrong gives a hint. A light
 *  exploration (plain card, not the graded assessment chrome). */

type Question = { id: string; prompt: string; answer: string; hint: string };
type Sound = { id: string; label: string; amps: readonly number[] };

export function MatchToSound({
  label,
  intro,
  questions,
  sounds,
  baseFreq,
  sampleUrls,
  successText,
}: {
  label: string;
  intro: string;
  questions: readonly Question[];
  sounds: readonly Sound[];
  baseFreq: number;
  sampleUrls?: Record<string, string>;
  successText: string;
}) {
  const engine = useAudioEngineContext();
  const { playingId, toggle, play } = usePlayable();
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState("");

  const startSound = (s: Sound) => {
    engine.ensure();
    const url = sampleUrls?.[s.id];
    if (url) return engine.playSample(url, { gain: 0.9 });
    const partials = s.amps.map((g, i) => ({ freq: baseFreq * (i + 1), gain: g })).filter((p) => p.gain > 0.001);
    return engine.playPartials(partials, { duration: 1.0, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } });
  };

  const done = step >= questions.length;
  const current = done ? null : questions[step];

  const choose = (soundId: string) => {
    if (!current) return;
    const s = sounds.find((x) => x.id === soundId) ?? sounds[0];
    play(`choose-${soundId}`, () => startSound(s));
    if (soundId === current.answer) {
      setStep((s) => s + 1);
      setStatus("");
    } else {
      setStatus(current.hint);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-link">{label}</span>
        <span className="ml-auto text-xs font-medium text-muted-foreground">
          {Math.min(step, questions.length)} / {questions.length}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{intro}</p>

      {/* Hear any sound at any time. */}
      <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hear the sounds</p>
      <div className="flex flex-wrap gap-2">
        {sounds.map((s) => {
          const on = playingId === `hear-${s.id}`;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(`hear-${s.id}`, () => startSound(s))}
              aria-label={`${on ? "Stop" : "Play"} ${s.label}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {on ? <Square aria-hidden="true" className="size-3 fill-current" /> : <Play aria-hidden="true" className="size-3 fill-current" />} {s.label}
            </button>
          );
        })}
      </div>

      {current ? (
        <div className="mt-5">
          <p className="text-base font-medium text-foreground">{current.prompt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sounds.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {s.label}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
            {status}
          </p>
        </div>
      ) : (
        <div className={cn("mt-5 flex items-start gap-2 rounded-lg bg-primary/5 px-3 py-2.5")} aria-live="polite">
          <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-link" />
          <p className="text-sm leading-relaxed text-foreground">{successText}</p>
        </div>
      )}
    </div>
  );
}
