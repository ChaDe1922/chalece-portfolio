"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { Oscilloscope } from "@/components/lab/audio/visualizers";
import { nearestNoteName, type WaveType } from "@/components/lab/audio/use-audio-engine";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { GuidedGoals } from "@/components/lab/fourier/guided-goals";
import { GraphAxes } from "@/components/lab/fourier/graph-axes";
import { EarTraining } from "@/components/lab/assessment/ear-training";
import { AmplitudeScope } from "./amplitude-scope";

type Shape = { type: string; label: string; character: string };

type Instruments = {
  lead: string;
  fluteSample: string;
  violinSample: string;
  fluteLabel: string;
  violinLabel: string;
};

type Props = {
  control: "none" | "frequency" | "amplitude" | "shape";
  lead: string;
  instruction: string;
  insight: string;
  freq?: number; // base/fixed frequency
  min?: number;
  max?: number;
  shapes?: readonly Shape[];
  instruments?: Instruments; // optional "hear the real thing" row (timbre screen)
};

const NOTE_ID = "tone-explorer";
const SAMPLE_FREQ = 440; // the bundled flute-a4 / violin-a4 samples are A4

const FREQ_GOALS = [
  { id: "tighter", text: "Make the wave tighter by raising the pitch." },
  { id: "wider", text: "Make the wave wider by lowering the pitch." },
] as const;
const AMP_GOALS = [{ id: "louder", text: "Make it louder without changing the pitch." }] as const;

/** Sound P3 to P5: one sustained tone with a scope, plus exactly one control
 *  (frequency, amplitude, or waveshape). Discovery-first: hear and see the change,
 *  then read what it is. Wide lab layout: the viz + controls in the main column, the
 *  formative check + takeaway in the rail. */
export function ToneExplorer({ control, lead, instruction, insight, freq = 220, min = 110, max = 880, shapes, instruments }: Props) {
  const engine = useAudioEngineContext();
  const [playing, setPlaying] = React.useState(false);
  const [frequency, setFrequency] = React.useState(freq);
  const [amp, setAmp] = React.useState(0.7);
  const [shape, setShape] = React.useState<WaveType>((shapes?.[0]?.type as WaveType) ?? "sine");
  const [sampleActive, setSampleActive] = React.useState(false);
  const [done, setDone] = React.useState<Set<string>>(() => new Set());

  const markDone = (id: string) => setDone((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  const start = React.useCallback(
    (f = frequency, a = amp, s = shape) => {
      engine.ensure();
      engine.noteOn(NOTE_ID, { freq: f, type: s, gain: a });
      setPlaying(true);
    },
    [engine, frequency, amp, shape],
  );
  const stop = React.useCallback(() => {
    engine.noteOff(NOTE_ID);
    setPlaying(false);
  }, [engine]);

  React.useEffect(() => () => engine.noteOff(NOTE_ID), [engine]);

  React.useEffect(() => {
    if (instruments) engine.preloadSamples([instruments.fluteSample, instruments.violinSample]);
  }, [engine, instruments]);

  const setFreq = (f: number) => {
    setFrequency(f);
    if (playing) engine.noteUpdate(NOTE_ID, { freq: f });
    if (f >= freq * 1.25) markDone("tighter");
    if (f <= freq * 0.8) markDone("wider");
  };
  const setAmplitude = (a: number) => {
    setAmp(a);
    if (playing) engine.noteUpdate(NOTE_ID, { gain: a });
    if (a >= 0.9) markDone("louder");
  };
  const pickShape = (s: WaveType) => {
    setShape(s);
    if (playing) engine.noteUpdate(NOTE_ID, { type: s });
    else start(frequency, amp, s); // tapping a shape plays it
  };
  const octave = (mult: number) => {
    const f = Math.min(max * 2, Math.max(min / 2, Math.round(frequency * mult)));
    setFreq(f);
    if (!playing) start(f, amp, shape);
  };

  // Play a real instrument recording; fall back to a synthesized mix if it fails.
  const playInstrument = (kind: "flute" | "violin") => {
    if (!instruments) return;
    engine.ensure();
    if (playing) stop();
    const url = kind === "flute" ? instruments.fluteSample : instruments.violinSample;
    setSampleActive(true);
    void engine.playSample(url, { gain: kind === "violin" ? 0.8 : 0.95 }).then((ok) => {
      if (ok) return;
      const amps = kind === "flute" ? [1, 0.25, 0.1, 0.05] : [1, 0.8, 0.6, 0.5, 0.35, 0.28];
      engine.playPartials(amps.map((g, i) => ({ freq: SAMPLE_FREQ * (i + 1), gain: g })), { duration: 1.1, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } });
    });
    window.setTimeout(() => setSampleActive(false), 3200);
  };

  // Timbre check: play a mystery waveshape, name its character.
  const mysteryShape = shapes?.find((s) => s.type === "sawtooth") ?? shapes?.[0];
  const playMystery = () => {
    if (!mysteryShape) return;
    engine.ensure();
    if (playing) stop();
    engine.playTone({ freq: frequency, type: mysteryShape.type as WaveType, gain: 0.5, duration: 1.3 });
  };

  const redrawKey = `${playing}-${sampleActive}-${frequency}-${amp}-${shape}`;
  const currentShape = shapes?.find((s) => s.type === shape);

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => (playing ? stop() : start())}
                aria-pressed={playing}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                {playing ? "Stop" : "Play"}
              </button>
              <AudioControls engine={engine} />
            </div>

            <GraphAxes yLabel="Pressure / loudness" xLabel="Time" ticks={0}>
              {control === "amplitude" ? (
                <AmplitudeScope amp={amp} />
              ) : (
                <Oscilloscope engine={engine} active={playing || sampleActive} redrawKey={redrawKey} freq={sampleActive ? SAMPLE_FREQ : frequency} className="h-44 sm:h-52" />
              )}
            </GraphAxes>

            {/* Readout */}
            <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
              {control === "none" && `About ${frequency} vibrations per second.`}
              {control === "frequency" && `${Math.round(frequency)} Hz, near the note ${nearestNoteName(frequency)}.`}
              {control === "amplitude" && `Loudness ${amp.toFixed(2)}. Pitch fixed at ${Math.round(frequency)} Hz, near ${nearestNoteName(frequency)}.`}
              {control === "shape" && `${currentShape?.label ?? "Sine"}, sounds ${currentShape?.character ?? "smooth"}. Pitch fixed at ${Math.round(frequency)} Hz.`}
            </p>

            {/* Control */}
            {control === "frequency" ? (
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="w-20 font-medium">Frequency</span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={frequency}
                    onChange={(e) => setFreq(Number(e.target.value))}
                    className="flex-1 accent-[var(--primary)]"
                    aria-label="Frequency in hertz"
                  />
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => octave(0.5)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-link hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Octave down
                  </button>
                  <button type="button" onClick={() => octave(2)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-link hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Octave up
                  </button>
                </div>
              </div>
            ) : null}

            {control === "amplitude" ? (
              <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-20 font-medium">Loudness</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={amp}
                  onChange={(e) => setAmplitude(Number(e.target.value))}
                  className="flex-1 accent-[var(--primary)]"
                  aria-label="Loudness"
                />
              </label>
            ) : null}

            {control === "shape" && shapes ? (
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Waveshape">
                {shapes.map((s) => (
                  <button
                    key={s.type}
                    type="button"
                    onClick={() => pickShape(s.type as WaveType)}
                    aria-pressed={shape === s.type}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      shape === s.type ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="ml-1 text-xs text-muted-foreground">({s.character})</span>
                  </button>
                ))}
              </div>
            ) : null}
            {control === "shape" && instruments ? (
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 text-sm leading-relaxed text-muted-foreground">{instruments.lead}</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Real instruments">
                  <button
                    type="button"
                    onClick={() => playInstrument("flute")}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Play aria-hidden="true" className="size-4 fill-current" /> {instruments.fluteLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => playInstrument("violin")}
                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Play aria-hidden="true" className="size-4 fill-current" /> {instruments.violinLabel}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        }
        aside={
          <>
            {control === "shape" && mysteryShape ? (
              <EarTraining
                label="Name the character"
                prompt="Press play to hear a mystery shape. Which character is it?"
                playLabel="Play the mystery shape"
                onPlay={playMystery}
                options={(shapes ?? []).map((s) => ({
                  key: s.type,
                  label: `${s.label}, ${s.character}`,
                  correct: s.type === mysteryShape.type,
                  feedback: s.type === mysteryShape.type ? `Yes. That ${mysteryShape.character} tone is the ${mysteryShape.label.toLowerCase()} wave.` : `That one sounds ${s.character}. Play it again and compare.`,
                }))}
                objective="Name a wave's character by ear."
              />
            ) : control === "frequency" || control === "amplitude" ? (
              <GuidedGoals
                label="Try it"
                intro={control === "frequency" ? "Use the slider and the octave buttons." : "Use the loudness slider (the pitch stays put)."}
                goals={control === "frequency" ? FREQ_GOALS : AMP_GOALS}
                doneIds={done}
                allDoneText={control === "frequency" ? "You stretched and squeezed the wave. Faster vibration is higher pitch." : "You changed the size of the wave without touching its speed. Bigger wave, same pitch, louder sound."}
              />
            ) : null}
            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <RichText text={insight} />
              </p>
            </div>
          </>
        }
      />
    </div>
  );
}
