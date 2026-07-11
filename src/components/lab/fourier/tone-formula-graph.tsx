"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { usePlayable } from "@/components/lab/audio/use-playable";
import { cn } from "@/lib/utils";
import { GraphAxes } from "./graph-axes";

/** The wave that the one-tone formula makes, drawn in real time from the amplitude
 *  (A), frequency (f), and phase (phi) sliders, and playable on click. Higher f
 *  shows more cycles; A scales the height; phi slides the start. */
export function ToneFormulaGraph({ A, f, phi, t, label, playLabel, canvasClassName, children }: { A: number; f: number; phi: number; t: number; label: string; playLabel: string; canvasClassName?: string; children?: React.ReactNode }) {
  const engine = useAudioEngineContext();
  const { playingId, toggle } = usePlayable();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const playing = playingId === "tone";

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
    const styles = getComputedStyle(canvas);
    const border = styles.getPropertyValue("--border").trim() || "#e3dfd8";
    const primary = styles.getPropertyValue("--primary").trim() || "#6d5ae6";
    const cy = h / 2;
    // Continuous cycle count so the wave stretches smoothly with the slider.
    const cycles = Math.max(1, Math.min(10, f / 110));
    const amp = Math.max(0.04, A) * (h * 0.42);

    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    ctx.strokeStyle = primary;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const steps = Math.max(2, Math.ceil(w * 2));
    for (let k = 0; k <= steps; k++) {
      const x = k / steps;
      const y = cy - Math.sin(2 * Math.PI * cycles * x + phi) * amp;
      if (k === 0) ctx.moveTo(x * w, y);
      else ctx.lineTo(x * w, y);
    }
    ctx.stroke();

    // Time playhead: the graph spans Twin seconds (cycles / f); mark where t sits.
    const twin = cycles / Math.max(1, f);
    const xt = Math.min(1, Math.max(0, t / twin));
    const yt = cy - Math.sin(2 * Math.PI * cycles * xt + phi) * amp;
    ctx.strokeStyle = (styles.getPropertyValue("--formula-time").trim() || "#0d9488");
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(xt * w, 4);
    ctx.lineTo(xt * w, h - 4);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = (styles.getPropertyValue("--formula-time").trim() || "#0d9488");
    ctx.beginPath();
    ctx.arc(xt * w, yt, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [A, f, phi, t]);

  React.useEffect(() => {
    paint();
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const play = () =>
    toggle("tone", () => {
      engine.ensure();
      return engine.playTone({ freq: f, type: "sine", gain: Math.max(0.05, A * 0.6), duration: 1.4, env: { attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.2 } });
    });

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-link">{label}</p>
        <button
          type="button"
          onClick={play}
          aria-pressed={playing}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
          {playing ? "Stop" : playLabel}
        </button>
      </div>
      <GraphAxes yLabel="Loudness" xLabel="Time">
        <canvas ref={canvasRef} aria-hidden="true" className={cn("h-36 w-full rounded-lg border border-border bg-background", canvasClassName)} />
      </GraphAxes>
      {children ? <div className="mt-4 border-t border-border pt-4">{children}</div> : null}
    </div>
  );
}
