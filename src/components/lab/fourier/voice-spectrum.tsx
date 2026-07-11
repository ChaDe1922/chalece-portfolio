"use client";

import * as React from "react";
import { Mic, Square, Volume2, ShieldCheck } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { GuidedGoals } from "@/components/lab/fourier/guided-goals";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.voice;

/** Heat color for a spectrogram cell: dark -> violet -> coral by intensity. */
function heat(v: number): string {
  const t = v / 255;
  if (t < 0.04) return "rgba(0,0,0,0)";
  const a = [0x6d, 0x5a, 0xe6];
  const b = [0xff, 0x6b, 0x5e];
  const k = Math.min(1, t * 1.2);
  const r = Math.round(a[0] + (b[0] - a[0]) * k);
  const g = Math.round(a[1] + (b[1] - a[1]) * k);
  const bl = Math.round(a[2] + (b[2] - a[2]) * k);
  return `rgba(${r}, ${g}, ${bl}, ${0.25 + 0.75 * t})`;
}

type Mode = "idle" | "mic" | "sample" | "denied";

/** P11: see your own voice. Opt-in mic feeds a private local analyser into a
 *  scrolling spectrogram (reduced motion shows live bars). A whistle is nearly one
 *  bar; a vowel is a tall stack. Audio never leaves the device; full teardown on
 *  stop and unmount. Generated sample fallback when the mic is unavailable. */
export function VoiceSpectrum() {
  const engine = useAudioEngineContext();
  const reduced = useReducedMotion();
  const [mode, setMode] = React.useState<Mode>("idle");
  const [doneGoals, setDoneGoals] = React.useState<Set<string>>(() => new Set());
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const micNodesRef = React.useRef<{ source: MediaStreamAudioSourceNode; analyser: AnalyserNode } | null>(null);
  const rafRef = React.useRef(0);
  const dataRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);

  const stopDraw = React.useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    const bins = analyser.frequencyBinCount;
    if (!dataRef.current || dataRef.current.length !== bins) dataRef.current = new Uint8Array(bins);
    const buf = dataRef.current;
    analyser.getByteFrequencyData(buf);
    const show = Math.min(bins, 256); // low ~5.5 kHz, where the voice lives

    if (reduced) {
      // Static live bars (no horizontal motion).
      ctx.clearRect(0, 0, w, h);
      const barCount = 64;
      const bw = w / barCount;
      for (let i = 0; i < barCount; i++) {
        const idx = Math.floor((i / barCount) * show);
        const v = buf[idx];
        const bh = (v / 255) * h;
        ctx.fillStyle = heat(v);
        ctx.fillRect(i * bw, h - bh, bw - 1, bh);
      }
      return;
    }

    // Scroll left by 1px, draw a new intensity column on the right.
    ctx.drawImage(canvas, -1, 0);
    for (let y = 0; y < h; y++) {
      const idx = Math.floor(((h - 1 - y) / h) * show);
      ctx.fillStyle = heat(buf[idx]);
      ctx.fillRect(w - 1, y, 1, 1);
    }
  }, [reduced]);

  const startDraw = React.useCallback(() => {
    stopDraw();
    const loop = () => {
      if (document.visibilityState === "visible") draw();
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
  }, [draw, stopDraw]);

  const teardownMic = React.useCallback(() => {
    const nodes = micNodesRef.current;
    if (nodes) {
      try {
        nodes.source.disconnect();
        nodes.analyser.disconnect();
      } catch {
        // ignore
      }
    }
    micNodesRef.current = null;
    const stream = streamRef.current;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stop = React.useCallback(() => {
    stopDraw();
    teardownMic();
    engine.allNotesOff();
    analyserRef.current = null;
    setMode("idle");
  }, [stopDraw, teardownMic, engine]);

  const startMic = async () => {
    const ctx = engine.ensure();
    if (!ctx || typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMode("denied");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser); // not connected to destination: no playback, no feedback
      streamRef.current = stream;
      micNodesRef.current = { source, analyser };
      analyserRef.current = analyser;
      setMode("mic");
      startDraw();
    } catch {
      setMode("denied");
    }
  };

  const playVowel = () => {
    teardownMic();
    engine.ensure();
    analyserRef.current = engine.analyser();
    // A vowel-like "aah": a low fundamental with a formant-shaped harmonic stack.
    const base = 160;
    const partials = Array.from({ length: 16 }, (_, i) => {
      const n = i + 1;
      const f = base * n;
      const formant = Math.exp(-((f - 700) ** 2) / (2 * 350 ** 2)) + 0.7 * Math.exp(-((f - 1100) ** 2) / (2 * 450 ** 2));
      return { freq: f, gain: Math.max(0.03, (formant / n) * 1.2) };
    });
    engine.playPartials(partials, { duration: 2.6, env: { attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.3 } });
    setMode("sample");
    startDraw();
  };

  const playWhistle = () => {
    teardownMic();
    engine.ensure();
    analyserRef.current = engine.analyser();
    void engine.playSample(data.whistleSample, { gain: 0.85 });
    setMode("sample");
    startDraw();
  };

  React.useEffect(() => {
    return () => {
      stopDraw();
      teardownMic();
      analyserRef.current = null;
    };
  }, [stopDraw, teardownMic]);

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.micLine}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {mode === "mic" ? (
              <button
                type="button"
                onClick={stop}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Square aria-hidden="true" className="size-4 fill-current" /> {data.stopLabel}
              </button>
            ) : (
              <button
                type="button"
                onClick={startMic}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mic aria-hidden="true" className="size-4" /> {data.useMicLabel}
              </button>
            )}
            <button
              type="button"
              onClick={playVowel}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Volume2 aria-hidden="true" className="size-4" /> {data.sampleVowelLabel}
            </button>
            <button
              type="button"
              onClick={playWhistle}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Volume2 aria-hidden="true" className="size-4" /> {data.sampleWhistleLabel}
            </button>
          </div>
          <AudioControls engine={engine} />
        </div>

        <canvas ref={canvasRef} aria-hidden="true" className="h-52 w-full rounded-lg border border-border bg-background lg:h-64" />
        <p aria-live="polite" className="mt-2 text-sm font-medium text-foreground">
          {mode === "mic"
            ? "Listening. Hum a steady aah, then try a whistle, and watch the bars."
            : mode === "sample"
              ? "A sung vowel: one low tone plus a tall stack of harmonics."
              : mode === "denied"
                ? data.deniedNote
                : "Use your mic, or play a sample voice."}
        </p>

        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 text-emerald-600 dark:text-emerald-400" />
          {data.privacy}
        </p>
          </div>
        }
        aside={
          <>
            {/* Voice detective: a self-marked journey; tap each goal as you try it. */}
            <GuidedGoals
              label={data.challengeLead}
              intro="Try each one with the spectrum, then tap it to mark it off."
              goals={data.goals.map((g, i) => ({ id: `g${i}`, text: g }))}
              doneIds={doneGoals}
              allDoneText="You shaped your own spectrum four ways. Moving the main bar changes pitch; adding energy above it adds richness."
              onToggle={(id) =>
                setDoneGoals((prev) => {
                  const next = new Set(prev);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                })
              }
            />

            <details className="group rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-heading text-base font-semibold text-foreground marker:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                What am I seeing?
              </summary>
              <p className="mt-3 text-sm font-medium text-foreground">{data.explainLead}</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {data.explain.map((e) => (
                  <li key={e} className="text-sm leading-relaxed text-muted-foreground">
                    {e}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <RichText text={data.formantNote} />
              </p>
            </details>

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
