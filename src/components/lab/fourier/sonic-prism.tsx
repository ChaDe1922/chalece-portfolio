"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import type { PlayHandle } from "@/components/lab/audio/use-audio-engine";
import { ListenIdentify } from "@/components/lab/assessment/listen-identify";
import { LabelTheSpectrum } from "@/components/lab/fourier/label-the-spectrum";
import { CheckpointDivider } from "@/components/lab/fourier/checkpoint-divider";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.sonicPrism;

/** Harmonics probed for the pure/rich readout (220 Hz fundamental and multiples). */
const HARMONICS = 8;

/** Spectrogram grid: BANDS frequency rows over [FMIN, FMAX], HISTORY frames of time. */
const BANDS = 48;
const HISTORY = 56;
const FMIN = 110;
const FMAX = 3000;

/** Synthesized fallback recipes, used only if a real recording fails to load.
 *  Either way the audio passes through the engine's analyser, so the view is real. */
const VOICES = {
  flute: [1, 0.25, 0.1, 0.05, 0, 0],
  violin: [1, 0.8, 0.6, 0.5, 0.35, 0.28],
} as const;

// Float spectrum uses dB; map to a 0..1 linear-ish amplitude against a loud
// reference so the true dynamic range shows (a flute's harmonics stay dim, a
// violin's spread stays visible). Byte FFT (dB compressed to 0-255) flattens this.
const REF_DB = -52;
const linAmp = (db: number) => (db > -Infinity ? Math.min(1, Math.pow(10, (db - REF_DB) / 20)) : 0);

// Loop lifecycle (ms): quick and deliberate, so the split reads at a glance.
const MIN_RUN = 500;
const MAX_RUN = 2800;
const QUIET_END = 350;
const AVG_LOUD = 0.02; // average band energy (0..1) that counts as "still sounding"

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** Chrome-Music-Lab-style heat colormap: dark -> blue -> green -> yellow -> red. */
const TURBO_STOPS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.0, 24, 18, 46],
  [0.22, 46, 70, 190],
  [0.45, 40, 180, 150],
  [0.62, 150, 215, 70],
  [0.8, 250, 185, 45],
  [1.0, 245, 60, 40],
];
function turbo(t: number, alpha = 1): string {
  const x = Math.min(1, Math.max(0, t));
  let lo = TURBO_STOPS[0];
  let hi = TURBO_STOPS[TURBO_STOPS.length - 1];
  for (let i = 0; i < TURBO_STOPS.length - 1; i++) {
    if (x >= TURBO_STOPS[i][0] && x <= TURBO_STOPS[i + 1][0]) {
      lo = TURBO_STOPS[i];
      hi = TURBO_STOPS[i + 1];
      break;
    }
  }
  const span = hi[0] - lo[0] || 1;
  const k = (x - lo[0]) / span;
  const r = Math.round(lo[1] + (hi[1] - lo[1]) * k);
  const g = Math.round(lo[2] + (hi[2] - lo[2]) * k);
  const b = Math.round(lo[3] + (hi[3] - lo[3]) * k);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Build the printed readout from the richest measured frame. Count the harmonics
 *  whose energy clears a share of the peak, so a flute (a few strong tones) reads
 *  pure and a violin (many) reads rich, independent of the exact fundamental. */
function buildReadout(values: number[], voiceLabel: string, baseFreq: number): string {
  const max = Math.max(...values, 0.0001);
  const strong: number[] = [];
  for (let i = 0; i < values.length; i++) if (values[i] / max > 0.3) strong.push(i + 1);
  const count = Math.max(1, strong.length);
  const freqs = strong.slice(0, 3).map((k) => k * baseFreq);
  const list = freqs.length ? ` near ${freqs.join(", ")} Hz` : "";
  const quality = count <= 5 ? "A pure sound." : "A rich sound.";
  return `${voiceLabel}: ${count} strong ${count === 1 ? "tone" : "tones"}${list}. ${quality}`;
}

/** Incoming "white beam": the real time-domain waveform entering the prism. Uses
 *  float samples (smooth, no 8-bit stair-stepping) with a zero-crossing trigger and
 *  amplitude auto-scale, drawn as a quadratic-smoothed curve for an accurate, clean trace. */
function drawBeam(ctx: CanvasRenderingContext2D, x0: number, x1: number, cy: number, wave: Float32Array, win: number, amp: number, color: string) {
  // Rising zero-crossing trigger for a stable trace.
  let start = 0;
  const searchEnd = Math.max(0, wave.length - win - 1);
  for (let i = 1; i < searchEnd; i++) {
    if (wave[i - 1] < 0 && wave[i] >= 0) {
      start = i;
      break;
    }
  }
  let peak = 0;
  for (let i = 0; i < win; i++) peak = Math.max(peak, Math.abs(wave[start + i]));
  const span = x1 - x0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  if (peak < 0.008) {
    ctx.moveTo(x0, cy);
    ctx.lineTo(x1, cy);
  } else {
    const scale = amp / peak;
    const pts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < win; i++) {
      pts.push({ x: x0 + (i / (win - 1)) * span, y: cy - wave[start + i] * scale });
    }
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  }
  ctx.stroke();
}

/** 3D perspective waterfall: one ridge per frequency band over the time history.
 *  Ridges are parallel and equal-length, each sheared up-and-right as frequency
 *  rises, so the stack recedes like the Chrome Music Lab spectrogram. Painted
 *  back(high)-to-front(low) so nearer ridges occlude farther ones. Color is a
 *  boosted heat map so strong harmonics read hot (orange/red). */
function drawSpectrogram3D(
  ctx: CanvasRenderingContext2D,
  area: { x: number; y: number; w: number; h: number },
  history: number[][],
  bg: string,
) {
  const frames = history.length;
  if (frames === 0) return;
  const shearX = area.w * 0.2; // rightward shear from bottom row to top row (depth)
  const timeW = area.w - shearX - 4; // every ridge spans the same time width
  const yBottom = area.y + area.h - 4;
  const usableH = area.h * 0.82; // vertical span used to stack the bands
  const baseRidgeH = usableH * 0.17; // a strong front ridge rises this much (tall = 3D)
  // Gamma curve: dark/blue valleys, hot (orange/red) only at true harmonic peaks.
  const heat = (m: number) => Math.min(1, Math.pow(m, 1.7) * 2.0);

  for (let j = BANDS - 1; j >= 0; j--) {
    const d = j / (BANDS - 1); // 0 front/low, 1 back/high
    // Perspective: rows spread at the front (low) and compress toward the back (high).
    const baseline = yBottom - usableH * Math.pow(d, 0.8);
    const ridgeH = baseRidgeH * (1 - 0.5 * d); // front ridges taller than far ones

    // Newest frame emerges at the prism face (area.x); older frames trail right and
    // fan out with frequency, so the spectrum disperses out of the prism, left -> right.
    const pts: Array<{ x: number; y: number; m: number }> = [];
    for (let t = 0; t < frames; t++) {
      const m = history[t][j] ?? 0;
      const age = 1 - t / (frames - 1); // 0 newest (at prism) .. 1 oldest (far right)
      const x = area.x + age * timeW + d * shearX * age;
      const y = baseline - m * ridgeH;
      pts.push({ x, y, m });
    }

    // Filled body, opaque so nearer ridges occlude farther ones (the 3D surface).
    const frontM = pts[pts.length - 1].m;
    const grad = ctx.createLinearGradient(0, baseline - ridgeH, 0, baseline);
    grad.addColorStop(0, turbo(heat(frontM) * 0.65, 1));
    grad.addColorStop(1, bg);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, baseline);
    for (const p of pts) ctx.lineTo(p.x, p.y);
    ctx.lineTo(pts[pts.length - 1].x, baseline);
    ctx.closePath();
    ctx.fill();

    // Bright colored ridge top, per segment by magnitude.
    ctx.lineWidth = 1.2 + 1.4 * (1 - d);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    for (let t = 1; t < frames; t++) {
      const a = pts[t - 1];
      const b = pts[t];
      ctx.strokeStyle = turbo(heat(Math.max(a.m, b.m)), 0.95);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

/** "Read the prism": after a sound is split, tap the matching band on a spectrum
 *  diagram, one prompt at a time (strongest, then highest, then lowest). Tapping a
 *  band plays its tone. Reuses the one-at-a-time spectrum check for a real visual. */
function ReadThePrism({ engine }: { engine: ReturnType<typeof useAudioEngineContext> }) {
  const freqs = data.readBandFreqs;
  const playBand = (i: number) => {
    const f = freqs[i];
    if (f == null) return;
    engine.playTone({ freq: f, type: "sine", gain: 0.4, duration: 0.5, env: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.15 } });
  };
  return (
    <LabelTheSpectrum
      label={data.challengeLead}
      prompt={data.readPrompt}
      amps={data.readAmps}
      steps={data.readSteps}
      barLabels={data.readBandLabels}
      successText={data.readSuccess}
      objective="Read amplitude and frequency from a spectrum."
      onPick={playBand}
    />
  );
}

/** Hero analogy slide: a prism splits white light into a rainbow; the Fourier
 *  transform splits a sound into its pure tones. Send a real flute or violin
 *  recording through and the engine's analyser drives a live 3D spectrogram (the
 *  incoming white beam is the real waveform; the split side is a perspective
 *  waterfall of the real harmonics) that holds when the note ends. Reduced motion
 *  draws a static snapshot. The canvas is decorative; the aria-live readout carries
 *  the real measured result. */
export function SonicPrism() {
  const engine = useAudioEngineContext();
  const reduced = useReducedMotion();
  const [voice, setVoice] = React.useState<keyof typeof VOICES>("violin");
  const [played, setPlayed] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [playToken, setPlayToken] = React.useState(0);
  const [readout, setReadout] = React.useState("Send a sound through the prism to split it into its pure tones.");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const historyRef = React.useRef<number[][]>([]);
  const freqBufRef = React.useRef<Float32Array<ArrayBuffer> | null>(null);
  const waveBufRef = React.useRef<Float32Array<ArrayBuffer> | null>(null);
  // Richest single frame (max total energy = sustain) -> honest pure/rich readout
  // and a clean frozen 3D surface (so the held view is the sustain, not the tail).
  const bestFrameRef = React.useRef<number[]>(new Array(HARMONICS).fill(0));
  const bestBandFrameRef = React.useRef<number[]>(new Array(BANDS).fill(0));
  const bestTotalRef = React.useRef(0);
  const startTsRef = React.useRef(0);
  const lastLoudTsRef = React.useRef(0);
  const voiceFreqRef = React.useRef<number>(data.fluteFreq); // fundamental of the playing voice
  const sampleHandleRef = React.useRef<PlayHandle | null>(null);

  // Read the analyser into a BANDS-length magnitude frame (0..1 per band).
  const measureFrame = React.useCallback((): number[] | null => {
    const analyser = engine.analyser();
    if (!analyser) return null;
    const bins = analyser.frequencyBinCount;
    if (!freqBufRef.current || freqBufRef.current.length !== bins) freqBufRef.current = new Float32Array(bins);
    const buf = freqBufRef.current;
    analyser.getFloatFrequencyData(buf);
    const sr = engine.context()?.sampleRate ?? 44100;
    const binHz = sr / analyser.fftSize;
    const frame = new Array(BANDS).fill(0);
    for (let j = 0; j < BANDS; j++) {
      const f = FMIN + (FMAX - FMIN) * (j / (BANDS - 1));
      const bin = Math.round(f / binHz);
      let mdb = -Infinity;
      for (let b = bin - 1; b <= bin + 1; b++) if (b >= 0 && b < bins) mdb = Math.max(mdb, buf[b]);
      frame[j] = linAmp(mdb);
    }
    return frame;
  }, [engine]);

  // The per-harmonic energies (for the readout), from the current analyser frame.
  const measureHarmonics = React.useCallback((baseFreq: number): number[] | null => {
    const analyser = engine.analyser();
    const buf = freqBufRef.current;
    if (!analyser || !buf) return null;
    const sr = engine.context()?.sampleRate ?? 44100;
    const binHz = sr / analyser.fftSize;
    const out = new Array(HARMONICS).fill(0);
    for (let k = 1; k <= HARMONICS; k++) {
      const bin = Math.round((baseFreq * k) / binHz);
      let mdb = -Infinity;
      for (let b = bin - 1; b <= bin + 1; b++) if (b >= 0 && b < buf.length) mdb = Math.max(mdb, buf[b]);
      out[k - 1] = linAmp(mdb);
    }
    return out;
  }, [engine]);

  const drawScene = React.useCallback(() => {
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

    const ink = readVar(canvas, "--foreground", "#1c1b22");
    const border = readVar(canvas, "--border", "#e3dfd8");
    const cy = h / 2;

    // Prism: a vertical glass slab. Sits ~1/4 in from the left so the incoming
    // waveform has room. The waveform enters its left face and the spectrum
    // disperses out the right face.
    const slabW = Math.max(16, w * 0.05);
    const slabLeft = w * 0.27;
    const slabRight = slabLeft + slabW;
    const slabTop = 2;
    const slabBot = h - 2;
    const radius = Math.min(8, slabW / 2);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(slabLeft, slabTop, slabW, slabBot - slabTop, radius);
    else ctx.rect(slabLeft, slabTop, slabW, slabBot - slabTop);
    // Faint glassy fill + border.
    const glass = ctx.createLinearGradient(slabLeft, 0, slabRight, 0);
    glass.addColorStop(0, "rgba(125,125,150,0.05)");
    glass.addColorStop(0.5, "rgba(125,125,150,0.14)");
    glass.addColorStop(1, "rgba(125,125,150,0.05)");
    ctx.fillStyle = glass;
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Incoming white beam = live waveform, entering the slab's left face.
    const wave = waveBufRef.current;
    const beamAmp = Math.min(40, h * 0.34);
    if (wave) {
      const sr = engine.context()?.sampleRate ?? 44100;
      const win = Math.max(64, Math.min(wave.length - 2, Math.round((sr / voiceFreqRef.current) * 3)));
      drawBeam(ctx, 0, slabLeft, cy, wave, win, beamAmp, ink);
    } else {
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(slabLeft, cy);
      ctx.stroke();
    }

    // Dark panel behind the spectrogram so the heat colors pop and valleys read
    // dark, like the Chrome Music Lab reference.
    const specX = slabRight + 2;
    const panel = "#0d0b16";
    ctx.fillStyle = panel;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(specX, 2, w - specX - 2, h - 4, 8);
    else ctx.rect(specX, 2, w - specX - 2, h - 4);
    ctx.fill();

    // Spectrum disperses out the right face, streaming left -> right.
    drawSpectrogram3D(ctx, { x: specX + 2, y: 4, w: w - specX - 6, h: h - 8 }, historyRef.current, panel);
  }, [engine]);

  // Initial paint + redraw on resize.
  React.useEffect(() => {
    drawScene();
    const onResize = () => drawScene();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawScene]);

  React.useEffect(() => {
    engine.preloadSamples([data.fluteSample, data.violinSample]);
  }, [engine]);

  // The analysis loop runs while a sound plays.
  React.useEffect(() => {
    if (!playing) return;
    const voiceLabel = voice === "flute" ? data.fluteLabel : data.violinLabel;
    const t0 = performance.now();
    startTsRef.current = t0;
    lastLoudTsRef.current = t0;

    const pushFrame = (frame: number[]) => {
      const hist = historyRef.current;
      hist.push(frame);
      while (hist.length > HISTORY) hist.shift();
      let total = 0;
      for (const v of frame) total += v;
      if (total > bestTotalRef.current) {
        bestTotalRef.current = total;
        bestBandFrameRef.current = frame.slice();
        bestFrameRef.current = measureHarmonics(voiceFreqRef.current) ?? bestFrameRef.current;
      }
      return total / frame.length; // average band energy
    };

    const finalize = () => {
      // Freeze the surface to the loudest captured frame (the sustain), not the
      // silent tail, so the held 3D view shows the real, hot spectrum.
      const surface = bestBandFrameRef.current;
      if (surface.some((v) => v > 0)) historyRef.current = Array.from({ length: HISTORY }, () => surface.slice());
      drawScene();
      setReadout(buildReadout(bestFrameRef.current, voiceLabel, voiceFreqRef.current));
      setPlaying(false);
    };

    if (reduced) {
      // No animation loop: sample a few frames, fill the surface, then settle.
      const stamps = [350, 800, 1300];
      const timers = stamps.map((ms, idx) =>
        window.setTimeout(() => {
          const frame = measureFrame();
          const analyser = engine.analyser();
          if (analyser && (!waveBufRef.current || waveBufRef.current.length !== analyser.fftSize)) waveBufRef.current = new Float32Array(analyser.fftSize);
          if (analyser && waveBufRef.current) analyser.getFloatTimeDomainData(waveBufRef.current);
          if (frame) pushFrame(frame);
          drawScene();
          if (idx === stamps.length - 1) finalize();
        }, ms),
      );
      return () => timers.forEach((t) => window.clearTimeout(t));
    }

    const loop = () => {
      if (document.visibilityState !== "visible") {
        rafRef.current = window.requestAnimationFrame(loop);
        return;
      }
      const now = performance.now();
      const analyser = engine.analyser();
      if (analyser) {
        if (!waveBufRef.current || waveBufRef.current.length !== analyser.fftSize) waveBufRef.current = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(waveBufRef.current);
      }
      const frame = measureFrame();
      if (frame) {
        const avg = pushFrame(frame);
        if (avg > AVG_LOUD) lastLoudTsRef.current = now;
        drawScene();
        const elapsed = now - startTsRef.current;
        if (elapsed > MAX_RUN || (elapsed > MIN_RUN && now - lastLoudTsRef.current > QUIET_END)) {
          finalize();
          return;
        }
      }
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [playing, playToken, reduced, voice, drawScene, measureFrame, measureHarmonics, engine]);

  const sendThrough = (v: keyof typeof VOICES) => {
    setVoice(v);
    setPlayed(true);
    historyRef.current = [];
    bestTotalRef.current = 0;
    bestFrameRef.current = new Array(HARMONICS).fill(0);
    bestBandFrameRef.current = new Array(BANDS).fill(0);
    setReadout(`Splitting the ${v === "flute" ? data.fluteLabel : data.violinLabel} into its tones...`);
    const freq = v === "flute" ? data.fluteFreq : data.violinFreq;
    voiceFreqRef.current = freq;
    engine.ensure();
    const url = v === "flute" ? data.fluteSample : data.violinSample;
    const amps = VOICES[v];
    const gain = v === "violin" ? 0.85 : 0.95;
    // Real recording; fall back to the synthesized mix if it cannot load.
    void engine.playSample(url, { gain }).then((handle) => {
      if (handle) {
        sampleHandleRef.current = handle;
        return;
      }
      sampleHandleRef.current = engine.playPartials(
        amps.map((g, i) => ({ freq: freq * (i + 1), gain: g })).filter((p) => p.gain > 0),
        { duration: 1.1, env: { attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.2 } },
      );
    });
    setPlaying(true);
    setPlayToken((n) => n + 1);
  };

  // Stop the split early: stop the sound and freeze the current surface.
  const stopPrism = () => {
    sampleHandleRef.current?.stop();
    sampleHandleRef.current = null;
    engine.stopOneShots();
    setPlaying(false);
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          <RichText text={data.body} />
        </p>
      </LabProse>

      {/* Hero analogy image, kept large and centered. The metaphor caveat rides
          quietly under the caption instead of a heavy callout near the image. */}
      <figure className="mx-auto max-w-2xl space-y-2">
        <Image
          src={data.image.src}
          alt={data.image.alt}
          width={data.image.width}
          height={data.image.height}
          sizes="(min-width: 640px) 42rem, 100vw"
          className="h-auto w-full rounded-2xl border border-border"
        />
        <figcaption className="text-center text-sm italic text-muted-foreground">{data.image.caption}</figcaption>
        <p className="text-center text-xs italic text-muted-foreground">Metaphor note: {data.disclaimer}</p>
      </figure>

      <LabProse>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label={data.sendLabel}>
                {(Object.keys(VOICES) as Array<keyof typeof VOICES>).map((v) => {
                  const isPlaying = playing && voice === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => (isPlaying ? stopPrism() : sendThrough(v))}
                      aria-pressed={played && voice === v}
                      className={cn(
                        "inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        played && voice === v ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-link hover:bg-muted",
                      )}
                    >
                      {isPlaying ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
                      {v === "flute" ? data.fluteLabel : data.violinLabel}
                    </button>
                  );
                })}
              </div>
              <AudioControls engine={engine} />
            </div>

            <canvas ref={canvasRef} aria-hidden="true" className="h-64 w-full rounded-lg border border-border bg-background sm:h-72 lg:h-80" />
            <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
              {readout}
            </p>

            {/* Legend: how to read the spectrum. */}
            <p className="mt-4 text-sm text-muted-foreground">{data.legend}</p>
          </div>
        }
        aside={
          <>
            <ReadThePrism engine={engine} />
            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">
                <RichText text={data.insight} />
              </p>
            </div>
          </>
        }
      />

      <CheckpointDivider label={data.checkpointLabel} />
      <ListenIdentify data={data.identify} engine={engine} />
    </div>
  );
}
