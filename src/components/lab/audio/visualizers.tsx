"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { AudioEngine } from "./use-audio-engine";

/** Canvas visualizers that read the engine's AnalyserNode. Decorative (the
 *  canvas is aria-hidden); meaning is carried by the text readouts the slides
 *  render next to them. Reduced motion draws a single representative frame
 *  instead of an animation loop, refreshed when `redrawKey` changes. */

/** Canvas cannot resolve CSS custom properties, so read the theme colors off the
 *  canvas element's computed style (they are hex in this theme). */
function themeColors(canvas: HTMLCanvasElement) {
  const cs = getComputedStyle(canvas);
  return {
    line: cs.getPropertyValue("--primary").trim() || "#6d5ae6",
    grid: cs.getPropertyValue("--border").trim() || "#d8d4cf",
  };
}

function useCanvasDraw(
  active: boolean,
  reduced: boolean,
  redrawKey: number | string,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawRef = React.useRef(draw);
  React.useEffect(() => {
    drawRef.current = draw;
  });

  const paint = React.useCallback(() => {
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
    drawRef.current(ctx, w, h);
  }, []);

  React.useEffect(() => {
    if (reduced) {
      // Static frame; refresh shortly after a change so the analyser has data.
      paint();
      const t = window.setTimeout(paint, 120);
      return () => window.clearTimeout(t);
    }
    if (!active) {
      paint();
      return;
    }
    let raf = 0;
    const loop = () => {
      if (document.visibilityState === "visible") paint();
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, [active, reduced, redrawKey, paint]);

  return canvasRef;
}

export function Oscilloscope({
  engine,
  active,
  redrawKey = 0,
  freq,
  className,
}: {
  engine: AudioEngine;
  active: boolean;
  redrawKey?: number | string;
  /** When given, the scope shows a stable ~3-cycle window at this frequency. */
  freq?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const dataRef = React.useRef<Float32Array<ArrayBuffer> | null>(null);

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const analyser = engine.analyser();
      const center = h / 2;
      const colors = themeColors(ctx.canvas);
      // faint baseline
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, center);
      ctx.lineTo(w, center);
      ctx.stroke();
      if (!analyser) return;

      const n = analyser.fftSize;
      if (!dataRef.current || dataRef.current.length !== n) dataRef.current = new Float32Array(n);
      const buf = dataRef.current;
      analyser.getFloatTimeDomainData(buf);

      // Window: ~3 cycles at the given frequency, so the shape is always legible.
      const sampleRate = engine.context()?.sampleRate ?? 44100;
      const win = freq && freq > 0 ? Math.max(64, Math.min(n - 2, Math.round((sampleRate / freq) * 3))) : Math.min(n - 2, 700);

      // Rising zero-crossing trigger for a stable trace.
      let start = 0;
      const searchEnd = Math.max(0, n - win - 1);
      for (let i = 1; i < searchEnd; i++) {
        if (buf[i - 1] < 0 && buf[i] >= 0) {
          start = i;
          break;
        }
      }

      // Auto-scale amplitude to fill the height (shape stays clear at any volume).
      let peak = 0;
      for (let i = 0; i < win; i++) peak = Math.max(peak, Math.abs(buf[start + i]));
      if (peak < 0.003) {
        // effectively silent: leave the flat baseline
        return;
      }
      const scale = (center * 0.85) / peak;

      // Float samples + quadratic-midpoint smoothing for a clean, non-blocky trace.
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < win; i++) pts.push({ x: (i / (win - 1)) * w, y: center - buf[start + i] * scale });
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    },
    [engine, freq],
  );

  const ref = useCanvasDraw(active, !!reduced, redrawKey, draw);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("h-32 w-full rounded-lg border border-border bg-background", className)}
    />
  );
}

export function Spectrum({
  engine,
  active,
  redrawKey = 0,
  bars = 48,
  displayBins = 96,
  linear = false,
  className,
}: {
  engine: AudioEngine;
  active: boolean;
  redrawKey?: number | string;
  bars?: number;
  displayBins?: number;
  /** Clean mode: float dB -> linear amplitude, max bin per bar, normalized. A pure
   *  sine then reads as a single bar (and noise stays near zero). Default is the
   *  averaged byte view used by the EQ / response slides. */
  linear?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const dataRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);
  const floatRef = React.useRef<Float32Array<ArrayBuffer> | null>(null);

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const analyser = engine.analyser();
      if (!analyser) return;
      const binCount = analyser.frequencyBinCount;
      const usable = Math.min(displayBins, binCount);
      const gap = 2;
      const barW = (w - gap * (bars - 1)) / bars;
      ctx.fillStyle = themeColors(ctx.canvas).line;

      if (linear) {
        if (!floatRef.current || floatRef.current.length !== binCount) floatRef.current = new Float32Array(binCount);
        const fbuf = floatRef.current;
        analyser.getFloatFrequencyData(fbuf);
        // Max bin per bar, dB -> linear; the wide dynamic range buries the noise floor.
        const vals = new Array<number>(bars).fill(0);
        let maxV = 0;
        for (let b = 0; b < bars; b++) {
          const start = Math.floor((b / bars) * usable);
          const end = Math.max(start + 1, Math.floor(((b + 1) / bars) * usable));
          let mdb = -Infinity;
          for (let i = start; i < end; i++) if (fbuf[i] > mdb) mdb = fbuf[i];
          const amp = mdb > -Infinity ? Math.pow(10, mdb / 20) : 0;
          vals[b] = amp;
          if (amp > maxV) maxV = amp;
        }
        if (maxV < 1e-4) return; // effectively silent
        for (let b = 0; b < bars; b++) {
          const v = vals[b] / maxV;
          if (v < 0.02) continue; // suppress the floor so a sine is one clean bar
          const barH = Math.max(1, v * (h - 2));
          ctx.fillRect(b * (barW + gap), h - barH, barW, barH);
        }
        return;
      }

      if (!dataRef.current || dataRef.current.length !== binCount) dataRef.current = new Uint8Array(binCount);
      const buf = dataRef.current;
      analyser.getByteFrequencyData(buf);
      for (let b = 0; b < bars; b++) {
        // average the bins that fall into this bar
        const start = Math.floor((b / bars) * usable);
        const end = Math.max(start + 1, Math.floor(((b + 1) / bars) * usable));
        let sum = 0;
        for (let i = start; i < end; i++) sum += buf[i];
        const v = sum / (end - start) / 255; // 0..1
        const barH = Math.max(1, v * (h - 2));
        const x = b * (barW + gap);
        ctx.fillRect(x, h - barH, barW, barH);
      }
    },
    [engine, bars, displayBins, linear],
  );

  const ref = useCanvasDraw(active, !!reduced, redrawKey, draw);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("h-32 w-full rounded-lg border border-border bg-background", className)}
    />
  );
}
