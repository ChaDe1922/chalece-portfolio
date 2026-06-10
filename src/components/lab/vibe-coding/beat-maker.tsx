"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { Eraser, Play, Shuffle, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatChanged } from "@/components/lab/vibe-coding/what-changed";
import { TryItCta } from "@/components/lab/vibe-coding/try-it-cta";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

const data = vibeCodingLab.builds.music.artifact;

const STEPS = 8;
// One synth voice per row, in row order: Kick, Snare, Hi-hat.
const TYPES = ["kick", "snare", "hat"] as const;
type Voice = (typeof TYPES)[number];

// Loads already sounding good so the first interaction succeeds (self-efficacy
// first, per the research brief).
const STARTER: boolean[][] = [
  [true, false, false, false, true, false, false, false],
  [false, false, true, false, false, false, true, false],
  [true, false, true, false, true, false, true, false],
];

// Surprise me cycles through these in order (no Math.random / Date.now).
const PRESETS: boolean[][][] = [
  [
    [true, false, false, false, true, false, false, false],
    [false, false, true, false, false, false, true, false],
    [true, true, true, true, true, true, true, true],
  ],
  [
    [true, false, true, false, true, false, true, false],
    [false, false, false, true, false, false, false, true],
    [true, false, true, false, true, false, true, false],
  ],
  [
    [true, false, false, true, false, false, true, false],
    [false, false, true, false, false, false, true, false],
    [true, true, false, true, true, true, false, true],
  ],
];

const clone = (p: boolean[][]) => p.map((row) => row.slice());

/** Web Audio synthesis for one drum hit. Ported verbatim from the reference
 *  beat maker: a pitch-swept sine for the kick, filtered white noise for the
 *  snare and hi-hat. */
function playSound(ctx: AudioContext, type: Voice) {
  const now = ctx.currentTime;
  if (type === "kick") {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, now);
    o.frequency.exponentialRampToValueAtTime(50, now + 0.14);
    g.gain.setValueAtTime(0.9, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.2);
    return;
  }
  // snare and hi-hat are both filtered noise bursts, with different lengths.
  const dur = type === "snare" ? 0.2 : 0.08;
  const decay = type === "snare" ? 0.18 : 0.05;
  const peak = type === "snare" ? 0.7 : 0.35;
  const cutoff = type === "snare" ? 1200 : 7000;

  const noise = ctx.createBufferSource();
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const channel = buf.getChannelData(0);
  for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;
  noise.buffer = buf;

  const g = ctx.createGain();
  g.gain.setValueAtTime(peak, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + decay);

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = cutoff;

  noise.connect(hp);
  hp.connect(g);
  g.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + dur);
}

/** Slide 2 (music): the artifact. A real, playable step sequencer that one
 *  sentence produced. Web Audio only, no dependencies. */
export function BeatMaker() {
  const reduced = useReducedMotion();

  const [pattern, setPattern] = React.useState<boolean[][]>(() => clone(STARTER));
  const [playing, setPlaying] = React.useState(false);
  const [bpm, setBpm] = React.useState(110);
  const [currentStep, setCurrentStep] = React.useState(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const audioRef = React.useRef<AudioContext | null>(null);
  const timerRef = React.useRef<number | null>(null);
  const patternRef = React.useRef(pattern);
  const bpmRef = React.useRef(bpm);
  const stepRef = React.useRef(0);
  const presetRef = React.useRef(0);

  React.useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);
  React.useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const ensureAudio = React.useCallback(() => {
    if (!audioRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioRef.current = new Ctor();
    }
    if (audioRef.current.state === "suspended") void audioRef.current.resume();
    return audioRef.current;
  }, []);

  const stepInterval = () => (60 / bpmRef.current) * 1000 / 2;

  // The sequencer reschedules itself through a ref so the callback can stay
  // stable while still pointing at the latest version.
  const tickRef = React.useRef<() => void>(() => {});
  const tick = React.useCallback(() => {
    const step = stepRef.current;
    const ctx = audioRef.current;
    if (ctx) {
      for (let r = 0; r < TYPES.length; r++) {
        if (patternRef.current[r]?.[step]) playSound(ctx, TYPES[r]);
      }
    }
    setCurrentStep(step);
    stepRef.current = (step + 1) % STEPS;
    timerRef.current = window.setTimeout(() => tickRef.current(), stepInterval());
  }, []);
  React.useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const stop = React.useCallback(() => {
    setPlaying(false);
    setCurrentStep(-1);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    ensureAudio();
    setPlaying(true);
    stepRef.current = 0;
    tick();
  }, [ensureAudio, tick]);

  // Pause when the slide scrolls offscreen or the tab is hidden, so audio never
  // plays unseen (mirrors the recursion lab's offscreen handling).
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) stop();
      },
      { threshold: 0 },
    );
    io.observe(el);
    const onVisibility = () => {
      if (document.visibilityState !== "visible") stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [stop]);

  // Clean up the timer and audio context on unmount.
  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      void audioRef.current?.close();
    };
  }, []);

  const toggleCell = (r: number, s: number) => {
    const ctx = ensureAudio();
    const willBeOn = !patternRef.current[r][s];
    setPattern((prev) => prev.map((row, ri) => (ri === r ? row.map((c, ci) => (ci === s ? !c : c)) : row)));
    if (willBeOn && ctx) playSound(ctx, TYPES[r]);
  };

  const clear = () => {
    if (playing) stop();
    setPattern(data.rows.map(() => Array<boolean>(STEPS).fill(false)));
  };

  const surprise = () => {
    ensureAudio();
    const pick = PRESETS[presetRef.current % PRESETS.length];
    presetRef.current += 1;
    setPattern(clone(pick));
  };

  return (
    <div ref={containerRef} className="lesson-stagger space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{data.intro}</p>
        <p className="text-sm text-muted-foreground">{data.patternLead}</p>
        <ul className="space-y-1">
          {data.pattern.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-link" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <section
        aria-label="Interactive beat maker"
        className="rounded-2xl border border-border bg-card p-4 sm:p-6"
      >
        <h3 className="font-heading text-lg font-semibold text-foreground">{data.makerTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{data.makerSub}</p>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => (playing ? stop() : start())}
            aria-pressed={playing}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {playing ? (
              <Square aria-hidden="true" className="size-4 fill-current" />
            ) : (
              <Play aria-hidden="true" className="size-4 fill-current" />
            )}
            {playing ? data.stop : data.play}
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Eraser aria-hidden="true" className="size-4" />
            {data.clear}
          </button>
          <button
            type="button"
            onClick={surprise}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Shuffle aria-hidden="true" className="size-4" />
            {data.surprise}
          </button>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <label htmlFor="bpm" className="font-medium">
              {data.speedLabel}
            </label>
            <input
              id="bpm"
              type="range"
              min={60}
              max={180}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 accent-[var(--primary)]"
              aria-label="Tempo in beats per minute"
            />
            <span className="w-16 tabular-nums">{bpm} BPM</span>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-5 space-y-2">
          {data.rows.map((label, r) => (
            <div
              key={label}
              className="grid items-center gap-1.5 sm:gap-2"
              style={{ gridTemplateColumns: "3.75rem repeat(8, minmax(0, 1fr))" }}
            >
              <span className="font-heading text-xs font-semibold text-foreground sm:text-sm">{label}</span>
              {Array.from({ length: STEPS }, (_, s) => {
                const on = pattern[r][s];
                const beam = currentStep === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleCell(r, s)}
                    aria-pressed={on}
                    aria-label={`${label} step ${s + 1}`}
                    className={cn(
                      "aspect-square rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !reduced && "transition-transform hover:scale-105",
                      on
                        ? "border-primary bg-primary"
                        : "border-border bg-background hover:border-primary/50",
                      beam && (on ? "ring-2 ring-coral" : "ring-2 ring-primary/40"),
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <p className="text-sm text-muted-foreground">{data.tip}</p>

      <WhatChanged check={data.check} />
      <TryItCta />
    </div>
  );
}
