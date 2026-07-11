"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudioEngine } from "@/components/lab/audio/use-audio-engine";
import { CheckCard, SuccessCover } from "./card";

/** Listen-and-identify formative check: play a mystery instrument, decide whether
 *  it splits into a few tones (pure) or many (rich), then name the instrument. The
 *  mystery round is chosen on the client at play time (no hydration mismatch). Audio
 *  runs through the shared engine, so mute/volume apply. Reduced motion is a non-issue
 *  (no animation). Solved once the instrument is named correctly. */

export type IdentifyRound = {
  readonly sample: string;
  readonly instrument: string;
  readonly isPure: boolean;
  readonly gain?: number;
};

export type IdentifyData = {
  readonly label: string;
  readonly prompt: string;
  readonly playLabel: string;
  readonly replayLabel: string;
  readonly splitPrompt: string;
  readonly pureLabel: string;
  readonly richLabel: string;
  readonly splitRight: string;
  readonly splitWrong: string;
  readonly instrumentPrompt: string;
  readonly instrumentWrong: string;
  readonly anotherLabel: string;
  readonly rounds: readonly IdentifyRound[];
  readonly success: string;
  readonly objective?: string;
};

export function ListenIdentify({
  data,
  engine,
  onSolved,
}: {
  data: IdentifyData;
  engine: AudioEngine;
  onSolved?: (solved: boolean) => void;
}) {
  const [round, setRound] = React.useState<IdentifyRound | null>(null);
  const [splitOk, setSplitOk] = React.useState(false);
  const [solved, setSolved] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");

  const pickRound = React.useCallback(() => {
    const i = Math.floor(Math.random() * data.rounds.length);
    return data.rounds[i];
  }, [data.rounds]);

  const play = (r: IdentifyRound) => {
    engine.ensure();
    void engine.playSample(r.sample, { gain: r.gain ?? 0.9 });
  };

  const onPlay = () => {
    const r = round ?? pickRound();
    if (!round) setRound(r);
    play(r);
  };

  const answerSplit = (guessPure: boolean) => {
    if (!round) return;
    if (guessPure === round.isPure) {
      setSplitOk(true);
      setFeedback(data.splitRight);
    } else {
      setFeedback(data.splitWrong);
    }
  };

  const answerInstrument = (name: string) => {
    if (!round) return;
    if (name === round.instrument) {
      setSolved(true);
      setFeedback("");
      onSolved?.(true);
    } else {
      setFeedback(data.instrumentWrong);
    }
  };

  const another = () => {
    const r = pickRound();
    setRound(r);
    setSolved(false);
    setSplitOk(false);
    setFeedback("");
    play(r);
  };

  const instruments = Array.from(new Set(data.rounds.map((r) => r.instrument)));

  return (
    <CheckCard label={data.label} solved={solved}>
      {solved ? (
        <div className="space-y-4">
          <SuccessCover objective={data.objective} rationale={data.success} />
          <button
            type="button"
            onClick={another}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> {data.anotherLabel}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-base font-medium text-foreground">{data.prompt}</p>

          <button
            type="button"
            onClick={onPlay}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" />
            {round ? data.replayLabel : data.playLabel}
          </button>

          {round ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{data.splitPrompt}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={data.splitPrompt}>
                {[
                  { pure: true, label: data.pureLabel },
                  { pure: false, label: data.richLabel },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => answerSplit(opt.pure)}
                    className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {round && splitOk ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{data.instrumentPrompt}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={data.instrumentPrompt}>
                {instruments.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => answerInstrument(name)}
                    className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <p
            aria-live="polite"
            className={cn("min-h-5 text-sm", feedback ? "text-muted-foreground" : "sr-only")}
          >
            {feedback}
          </p>
        </div>
      )}
    </CheckCard>
  );
}
