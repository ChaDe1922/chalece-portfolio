"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { Oscilloscope } from "@/components/lab/audio/visualizers";
import { nearestNoteName } from "@/components/lab/audio/use-audio-engine";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { GraphAxes } from "@/components/lab/fourier/graph-axes";
import { TapCompression } from "./tap-compression";

type Props = {
  lead: string;
  detail: string;
  instruction: string;
  insight: string;
  connector: string;
  baseFreq: number;
  min?: number;
  max?: number;
};

const NOTE_ID = "air-wave";

/** Canvas cannot resolve CSS custom properties, so read the theme colors off the
 *  canvas element's computed style (they are hex in this theme). */
function readColors(canvas: HTMLCanvasElement) {
  const cs = getComputedStyle(canvas);
  const get = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    primary: get("--primary", "#6d5ae6"),
    coral: get("--coral", "#ff6b5e"),
    muted: get("--muted-foreground", "#5a5862"),
    border: get("--border", "#e3dfd8"),
  };
}

function withAlpha(hex: string, alpha: number): string {
  // hex is #rrggbb in this theme; fall back to the color itself if not.
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Page 1 hero: a speaker on the left pushes air, particles bunch into
 *  compressions and spread into rarefactions as the wave travels to an ear on the
 *  right, with traveling wavefront markers over the field. Driven by
 *  displacement(x, t) = A sin(k x - omega t) and tied to the real audio. Reduced
 *  motion shows a single frozen snapshot; the canvas is aria-hidden and the state
 *  is mirrored in a text readout. */
export function AirWave({ lead, detail, instruction, insight, connector, baseFreq, min = 110, max = 880 }: Props) {
  const engine = useAudioEngineContext();
  const reduced = useReducedMotion();
  const [playing, setPlaying] = React.useState(false);
  const [frequency, setFrequency] = React.useState(baseFreq);
  const [amp, setAmp] = React.useState(0.6);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const start = React.useCallback(
    (f = frequency, a = amp) => {
      engine.ensure();
      engine.noteOn(NOTE_ID, { freq: f, type: "sine", gain: a });
      setPlaying(true);
    },
    [engine, frequency, amp],
  );
  const stop = React.useCallback(() => {
    engine.noteOff(NOTE_ID);
    setPlaying(false);
  }, [engine]);

  React.useEffect(() => () => engine.noteOff(NOTE_ID), [engine]);

  const setFreq = (f: number) => {
    setFrequency(f);
    if (playing) engine.noteUpdate(NOTE_ID, { freq: f });
  };
  const setAmplitude = (a: number) => {
    setAmp(a);
    if (playing) engine.noteUpdate(NOTE_ID, { gain: a });
  };

  const drawScene = React.useCallback(
    (canvas: HTMLCanvasElement, t: number, freq: number, a: number, animated: boolean) => {
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

      const c = readColors(canvas);
      const cy = h / 2;
      const pad = 10;
      const sx = pad + 4; // speaker anchor
      const ex = w - pad - 6; // ear anchor
      const airLeft = sx + 34;
      const airRight = ex - 30;
      const airW = Math.max(60, airRight - airLeft);

      const fClamp = Math.min(max, Math.max(min, freq));
      const tNorm = (fClamp - min) / (max - min);
      const cyclesAcross = 2 + tNorm * 5; // higher pitch packs more compressions in
      const wavelength = airW / cyclesAcross;
      const k = (2 * Math.PI) / wavelength;
      const speedHz = 0.5 + tNorm * 1.3; // watchable travel speed
      const omega = 2 * Math.PI * speedHz;

      const cols = 46;
      const rows = 4;
      const spacing = airW / (cols - 1);
      const A = (animated ? a : 0) * spacing * 0.9;
      const bandHalf = h * 0.2;
      const bandTop = cy - bandHalf;
      const rowGap = rows > 1 ? (bandHalf * 2) / (rows - 1) : 0;

      // Traveling wavefront markers at compression centers (cos(phase) = -1).
      if (animated) {
        ctx.fillStyle = withAlpha(c.coral, 0.12);
        const mMin = Math.ceil((k * airLeft - Math.PI - omega * t) / (2 * Math.PI));
        const mMax = Math.floor((k * airRight - Math.PI - omega * t) / (2 * Math.PI));
        for (let m = mMin; m <= mMax; m++) {
          const cx = (Math.PI + 2 * Math.PI * m + omega * t) / k;
          const bw = spacing * 1.2;
          ctx.beginPath();
          ctx.rect(cx - bw / 2, bandTop - 8, bw, bandHalf * 2 + 16);
          ctx.fill();
        }
      }

      // Air particles.
      for (let col = 0; col < cols; col++) {
        const restX = airLeft + col * spacing;
        const phase = k * restX - omega * t;
        const disp = A * Math.sin(phase);
        const x = restX + disp;
        const compress = animated ? Math.max(0, -Math.cos(phase)) : 0; // converging = compression
        const r = 1.8 + compress * 1.9;
        ctx.fillStyle = withAlpha(c.primary, 0.4 + compress * 0.5);
        for (let row = 0; row < rows; row++) {
          const y = bandTop + row * rowGap;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Speaker on the left: a box body and a cone that pushes with the source.
      const drive = animated ? Math.sin(omega * t) : 0;
      const coneOffset = drive * 3;
      ctx.fillStyle = c.primary;
      ctx.beginPath();
      ctx.rect(sx, cy - 11, 9, 22);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx + 9, cy - 8);
      ctx.lineTo(sx + 24 + coneOffset, cy - 17);
      ctx.lineTo(sx + 24 + coneOffset, cy + 17);
      ctx.lineTo(sx + 9, cy + 8);
      ctx.closePath();
      ctx.fill();

      // Ear on the right: a "C" helix that reacts when a compression arrives.
      const earPulse = animated ? Math.max(0, -Math.cos(k * airRight - omega * t)) : 0;
      const earR = 13 * (1 + earPulse * 0.16);
      ctx.strokeStyle = c.primary;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(ex, cy, earR, Math.PI * 0.62, Math.PI * 1.38, false);
      ctx.stroke();
      ctx.fillStyle = c.primary;
      ctx.beginPath();
      ctx.arc(ex - earR * 0.1, cy, 2.6, 0, Math.PI * 2);
      ctx.fill();
    },
    [min, max],
  );

  // Animate while playing; otherwise (and under reduced motion) draw one frame.
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let startTs = 0;
    const frame = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = (ts - startTs) / 1000;
      drawScene(canvas, reduced ? 0 : t, frequency, amp, playing);
      if (!reduced && playing && document.visibilityState === "visible") {
        raf = window.requestAnimationFrame(frame);
      }
    };
    raf = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(raf);
  }, [playing, frequency, amp, reduced, drawScene]);

  const note = nearestNoteName(frequency);
  const readout = playing
    ? `Sound traveling from the speaker to the ear. Pitch ${Math.round(frequency)} hertz, near the note ${note}. A louder sound pushes the air harder.`
    : "The air is at rest. Press play to send a wave from the speaker to the ear.";

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">
          <RichText text={detail} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="space-y-5">
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

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="h-52 w-full rounded-lg border border-border bg-background sm:h-60"
        />

        <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
          {readout}
        </p>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="w-20 font-medium">Pitch</span>
            <input
              type="range"
              min={min}
              max={max}
              value={frequency}
              onChange={(e) => setFreq(Number(e.target.value))}
              className="flex-1 accent-[var(--primary)]"
              aria-label="Pitch in hertz"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
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
        </div>
      </div>

            <p className="text-base leading-relaxed text-muted-foreground">{connector}</p>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <GraphAxes yLabel="Pressure / loudness" xLabel="Time" ticks={0}>
                <Oscilloscope engine={engine} active={playing} redrawKey={`${playing}-${frequency}-${amp}`} freq={frequency} className="h-40" />
              </GraphAxes>
            </div>
          </div>
        }
        aside={
          <>
            <TapCompression />
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
