"use client";

import * as React from "react";

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** A fixed-scale waveform for the loudness screen: the drawn height IS the current
 *  loudness (amp 0..1), with a faint ghost sine at full amplitude behind it, so
 *  dragging loudness visibly grows and shrinks the wave. Unlike the shared
 *  Oscilloscope this does NOT peak-normalize. It only redraws when amp changes, so
 *  reduced motion needs nothing special. */
export function AmplitudeScope({ amp, cycles = 3 }: { amp: number; cycles?: number }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  const draw = React.useCallback(() => {
    const canvas = ref.current;
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
    const maxAmp = (h / 2) * 0.9;
    const steps = Math.max(2, Math.ceil(w * 2));

    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    const sine = (ampPix: number, style: string, width: number, alpha: number) => {
      ctx.strokeStyle = style;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let k = 0; k <= steps; k++) {
        const p = k / steps;
        const x = p * w;
        const y = cy - Math.sin(p * cycles * 2 * Math.PI) * ampPix;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // Ghost at full amplitude, then the live wave at the current loudness.
    sine(maxAmp, grid, 2, 0.5);
    sine(maxAmp * Math.max(0.02, amp), primary, 3, 1);
  }, [amp, cycles]);

  React.useEffect(() => {
    draw();
    const on = () => draw();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [draw]);

  return <canvas ref={ref} aria-hidden="true" className="h-44 w-full rounded-lg border border-border bg-background sm:h-52" />;
}
