"use client";

import * as React from "react";
import { Play, Square, Eye, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { Spectrum } from "@/components/lab/audio/visualizers";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.response;
const CURVE_N = 220;

function makeFreqs(): Float32Array<ArrayBuffer> {
  const f = new Float32Array(CURVE_N);
  for (let i = 0; i < CURVE_N; i++) f[i] = 20 * Math.pow(20000 / 20, i / (CURVE_N - 1));
  return f;
}

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** Reading a headphone's curve as a listen-first mystery: one hidden voicing plays
 *  through a real BiquadFilter chain; the learner guesses its character by ear, then
 *  reveals the curve to check. A headphone is an EQ baked into the hardware. The
 *  mystery starts on a distinctive voicing and cycles deterministically (SSR-safe). */
export function FrequencyResponse() {
  const engine = useAudioEngineContext();
  // The hidden mystery voicing. Start on "bass-emphasized" (index 1), the clearest to
  // hear; "Try another" cycles deterministically, so no Math.random and SSR is stable.
  const [mysteryIdx, setMysteryIdx] = React.useState(1);
  const [playing, setPlaying] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const [guess, setGuess] = React.useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const filtersRef = React.useRef<BiquadFilterNode[] | null>(null);
  const srcRef = React.useRef<{ osc: OscillatorNode; pre: GainNode } | null>(null);
  const freqsRef = React.useRef<Float32Array<ArrayBuffer>>(makeFreqs());

  const mystery = data.voicings[mysteryIdx % data.voicings.length];
  const solved = guess === mystery.id;

  const ensureFilters = React.useCallback(() => {
    const ctx = engine.ensure();
    const master = engine.master();
    if (!ctx || !master) return null;
    if (!filtersRef.current) {
      const low = ctx.createBiquadFilter();
      low.type = "lowshelf";
      low.frequency.value = 200;
      const mid = ctx.createBiquadFilter();
      mid.type = "peaking";
      mid.frequency.value = 1200;
      mid.Q.value = 1;
      const high = ctx.createBiquadFilter();
      high.type = "highshelf";
      high.frequency.value = 4500;
      low.connect(mid);
      mid.connect(high);
      high.connect(master);
      filtersRef.current = [low, mid, high];
    }
    return filtersRef.current;
  }, [engine]);

  const applyVoicing = React.useCallback((v: (typeof data.voicings)[number], smooth: boolean) => {
    const filters = filtersRef.current;
    const ctx = engine.context();
    if (!filters || !ctx) return;
    const vals = [v.low, v.mid, v.high];
    filters.forEach((f, i) => {
      if (smooth) f.gain.setTargetAtTime(vals[i], ctx.currentTime, 0.03);
      else f.gain.value = vals[i];
    });
  }, [engine]);

  const drawCurve = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, (typeof window !== "undefined" && window.devicePixelRatio) || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const primary = readVar(canvas, "--primary", "#6d5ae6");
    const grid = readVar(canvas, "--border", "#e3dfd8");
    const cy = h / 2;

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    const freqs = freqsRef.current;
    const combined = new Float32Array(CURVE_N).fill(1);
    const filters = filtersRef.current;
    if (filters) {
      const mag = new Float32Array(CURVE_N) as Float32Array<ArrayBuffer>;
      const phase = new Float32Array(CURVE_N) as Float32Array<ArrayBuffer>;
      for (const f of filters) {
        f.getFrequencyResponse(freqs, mag, phase);
        for (let i = 0; i < CURVE_N; i++) combined[i] *= mag[i];
      }
    }

    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < CURVE_N; i++) {
      const db = 20 * Math.log10(Math.max(1e-4, combined[i]));
      const x = (i / (CURVE_N - 1)) * w;
      const y = cy - Math.max(-cy * 0.92, Math.min(cy * 0.92, (db / 15) * (h * 0.42)));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, []);

  // Draw the mystery curve only once revealed; keep it correct on resize.
  React.useEffect(() => {
    if (!revealed) return;
    ensureFilters();
    applyVoicing(mystery, false);
    const run = () => drawCurve();
    requestAnimationFrame(run);
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, [revealed, mysteryIdx, mystery, ensureFilters, applyVoicing, drawCurve]);

  const stop = React.useCallback(() => {
    const s = srcRef.current;
    if (s) {
      try {
        s.osc.stop();
      } catch {
        // already stopped
      }
      s.osc.disconnect();
      s.pre.disconnect();
    }
    srcRef.current = null;
    setPlaying(false);
  }, []);

  const start = React.useCallback(() => {
    const ctx = engine.ensure();
    const master = engine.master();
    if (!ctx || !master) return;
    const filters = ensureFilters();
    if (!filters) return;
    applyVoicing(mystery, false);
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = data.baseFreq;
    const pre = ctx.createGain();
    pre.gain.value = 0.12;
    osc.connect(pre);
    pre.connect(filters[0]);
    osc.start();
    srcRef.current = { osc, pre };
    setPlaying(true);
  }, [engine, ensureFilters, applyVoicing, mystery]);

  React.useEffect(() => () => stop(), [stop]);

  const another = () => {
    stop();
    setMysteryIdx((i) => (i + 1) % data.voicings.length);
    setRevealed(false);
    setGuess(null);
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="rounded-xl border border-border bg-card/60 p-4 text-sm leading-relaxed text-muted-foreground">{data.caveat}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
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
                {playing ? "Stop" : "Play the mystery curve"}
              </button>
              <AudioControls engine={engine} />
            </div>

            {revealed ? (
              <>
                <canvas ref={canvasRef} aria-hidden="true" className="h-48 w-full rounded-lg border border-border bg-background lg:h-64" />
                <p className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Bass</span>
                  <span>Frequency, low to high (louder above the line, quieter below)</span>
                  <span>Treble</span>
                </p>
                <Spectrum engine={engine} active={playing} redrawKey={`${playing}-${mysteryIdx}`} bars={56} displayBins={320} className="mt-3 h-20" />
                <p className="mt-2 rounded-lg bg-muted/60 px-3 py-2 text-sm text-foreground">
                  This is the <span className="font-semibold">{mystery.label}</span> voicing. It {mystery.desc}.
                </p>
              </>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 text-center lg:h-64">
                <Eye aria-hidden="true" className="size-6 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Curve hidden. Listen first, then guess.</p>
                <p className="text-xs text-muted-foreground">Play the mystery, decide its character on the right, then reveal the curve.</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRevealed(true)}
                disabled={revealed}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <Eye aria-hidden="true" className="size-4" /> Reveal the curve
              </button>
              <button
                type="button"
                onClick={another}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Shuffle aria-hidden="true" className="size-4" /> Try another mystery
              </button>
            </div>
          </div>
        }
        aside={
          <>
            <CheckCard label={data.challengeLead} solved={solved}>
              {solved ? (
                <SuccessCover objective="Read the character of a headphone curve by ear." rationale={`Correct. The mystery is the ${mystery.label} voicing.`} />
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.challengeLabels.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setGuess(l.id)}
                        aria-pressed={guess === l.id}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          guess === l.id ? "border-destructive/50 bg-destructive/10 text-foreground" : "border-border bg-background text-foreground hover:bg-muted",
                        )}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
                    {guess == null ? "" : "Not quite. Play the mystery again and listen for where it is loudest."}
                  </p>
                </>
              )}
            </CheckCard>
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
