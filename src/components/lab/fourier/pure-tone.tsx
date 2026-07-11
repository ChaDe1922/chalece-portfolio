"use client";

import * as React from "react";
import { Play, Square, Volume2 } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { usePlayable } from "@/components/lab/audio/use-playable";
import { Oscilloscope, Spectrum } from "@/components/lab/audio/visualizers";
import { PureToneScope } from "@/components/lab/fourier/pure-tone-scope";
import { GuidedGoals } from "@/components/lab/fourier/guided-goals";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.pureTone;
const START_FREQ = data.freq; // the pitch when the screen loads, the baseline for "up"/"down"
const NEAR_440 = 15; // hertz tolerance for the "return near 440 Hz" goal

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteName(freq: number): string {
  const n = Math.round(12 * Math.log2(freq / 440)) + 69;
  const name = NOTE_NAMES[((n % 12) + 12) % 12];
  const octave = Math.floor(n / 12) - 1;
  return `${name}${octave}`;
}

type Mode = "idle" | "tone" | "real";

/** What is a pure tone? Play a single sine and sweep its pitch; the live scope
 *  stays a smooth wave and the spectrum stays one bar. Then hear a real flute on
 *  the same note to see one bar become a stack, setting up the prism. */
export function PureTone() {
  const engine = useAudioEngineContext();
  const { playingId, toggle, stop: stopReal } = usePlayable();
  const [mode, setMode] = React.useState<Mode>("idle");
  const [freq, setFreq] = React.useState<number>(data.freq);
  const [doneGoals, setDoneGoals] = React.useState<Set<string>>(() => new Set());
  const realPlaying = playingId === "real";

  // Tick off the ordered goals as the pitch satisfies each condition in turn.
  const evaluateGoals = React.useCallback((v: number) => {
    setDoneGoals((prev) => {
      const next = new Set(prev);
      for (const g of data.goals) {
        if (next.has(g.id)) continue;
        const ok =
          g.check === "up" ? v > START_FREQ + 1 : g.check === "down" ? v < START_FREQ - 1 : Math.abs(v - 440) <= NEAR_440;
        if (ok) next.add(g.id);
        else break; // goals complete in order; stop at the first unmet one
      }
      return next;
    });
  }, []);

  const stopTone = React.useCallback(() => {
    engine.noteOff("pure");
  }, [engine]);

  const playTone = () => {
    stopReal();
    engine.ensure();
    engine.noteOn("pure", { freq, type: "sine", gain: 0.5 });
    setMode("tone");
  };

  const stop = () => {
    stopTone();
    setMode("idle");
  };

  const onFreq = (v: number) => {
    setFreq(v);
    if (mode === "tone") engine.noteUpdate("pure", { freq: v });
    evaluateGoals(v);
  };

  const playReal = () => {
    toggle("real", () => {
      stopTone();
      setMode("idle");
      engine.ensure();
      return engine.playSample(data.fluteSample, { gain: 0.95 });
    });
  };

  React.useEffect(() => {
    return () => {
      engine.noteOff("pure");
    };
  }, [engine]);

  const active = mode === "tone" || realPlaying;
  const readout =
    mode === "tone"
      ? `A pure tone at ${freq} Hz (${noteName(freq)}): one frequency, one bar.`
      : realPlaying
        ? data.contrastReadout
        : data.idleReadout;

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.leadFork}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={mode === "tone" ? stop : playTone}
              aria-pressed={mode === "tone"}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {mode === "tone" ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
              {mode === "tone" ? data.stopLabel : data.playLabel}
            </button>
            <button
              type="button"
              onClick={playReal}
              aria-pressed={realPlaying}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {realPlaying ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Volume2 aria-hidden="true" className="size-4" />}
              {realPlaying ? "Stop" : data.contrastLabel}
            </button>
          </div>
          <AudioControls engine={engine} />
        </div>

        <div className="mb-4 space-y-1.5">
          <p className="text-sm font-medium text-foreground">{data.viewsLead}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <RichText text={data.waveExplain} />
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <RichText text={data.spectrumExplain} />
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {realPlaying ? (
            <figure className="space-y-1">
              <Oscilloscope engine={engine} active redrawKey="real" className="h-40 lg:h-48" />
              <figcaption className="text-center text-xs font-medium text-muted-foreground">Real sound waveform</figcaption>
            </figure>
          ) : (
            <PureToneScope freq={freq} active={mode === "tone"} replayLabel={data.replayLabel} peaksLabel={data.peaksLabel} hint={data.scopeHint} />
          )}
          <figure className="space-y-1">
            <Spectrum engine={engine} active={active} redrawKey={`${mode}-${realPlaying}-${freq}`} linear className="h-40 lg:h-48" />
            <figcaption className="text-center text-xs font-medium text-muted-foreground">{data.spectrumLabel}</figcaption>
          </figure>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-28 shrink-0 font-medium text-foreground">
            {data.freqLabel}: {freq} Hz
          </span>
          <input
            type="range"
            min={data.minFreq}
            max={data.maxFreq}
            step={1}
            value={freq}
            onChange={(e) => onFreq(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
            aria-label={`${data.freqLabel} in hertz`}
            aria-valuetext={`${freq} hertz, ${noteName(freq)}`}
          />
        </label>

        <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
          {readout}
        </p>
          </div>
        }
        aside={
          <>
            {/* Guided quest: "Make it move" using only the pitch slider. */}
            <GuidedGoals
              label={data.challengeLead}
              intro="Play the tone, then use the pitch slider to reach each goal."
              goals={data.goals}
              doneIds={doneGoals}
              allDoneText="All three done. You moved the pitch up, down, and back near 440 Hz, without touching loudness."
            />
            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <RichText text={data.insight} />
              </p>
            </div>
          </>
        }
      />
    </div>
  );
}
