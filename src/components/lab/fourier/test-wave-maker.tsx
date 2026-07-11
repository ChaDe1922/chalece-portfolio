"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.testWave;

function readVar(canvas: HTMLCanvasElement, name: string, fallback: string) {
  return getComputedStyle(canvas).getPropertyValue(name).trim() || fallback;
}

/** Draw a smooth sine across the canvas. `cycles` controls spacing (higher
 *  frequency = more cycles = tighter spacing). Oversampled so it never looks
 *  blocky. Optional faint style for background target/mystery waves. */
function drawWave(canvas: HTMLCanvasElement | null, cycles: number, color: string, opts?: { faint?: boolean }) {
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

  const grid = readVar(canvas, "--border", "#e3dfd8");
  const cy = h / 2;
  const ampY = (h / 2) * 0.78;

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();

  const steps = Math.max(2, Math.ceil(w * 4));
  ctx.strokeStyle = color;
  ctx.globalAlpha = opts?.faint ? 0.35 : 1;
  ctx.lineWidth = opts?.faint ? 2 : 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const p = k / steps;
    const x = p * w;
    const y = cy - Math.sin(p * cycles * 2 * Math.PI) * ampY;
    if (k === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Number of visible cycles drawn for a given frequency, so spacing reads as
 *  pitch. Scaled relative to the hidden frequency for a sane on-screen density. */
function cyclesFor(freq: number): number {
  return (freq / data.hiddenFreq) * 4;
}

/** Screen 15: make a test wave. The mystery sound sits faint on top; the test
 *  wave below follows the test-frequency slider. Play either through the engine.
 *  "Match the spacing" hides a target at the hidden frequency behind the test
 *  wave; landing within tolerance reports a match. Canvases are decorative; the
 *  aria-live readout carries the meaning. */
export function TestWaveMaker() {
  const engine = useAudioEngineContext();
  const [freq, setFreq] = React.useState<number>(Math.round((data.min + data.max) / 3));
  const [challenge, setChallenge] = React.useState(false);

  const mysteryRef = React.useRef<HTMLCanvasElement>(null);
  const testRef = React.useRef<HTMLCanvasElement>(null);

  const matched = Math.abs(freq - data.hiddenFreq) <= data.challengeTolerance;

  const paint = React.useCallback(() => {
    const primary = mysteryRef.current ? readVar(mysteryRef.current, "--primary", "#6d5ae6") : "#6d5ae6";
    const coral = "#e0564a";
    // Top: the mystery sound, drawn faintly at its hidden frequency.
    drawWave(mysteryRef.current, cyclesFor(data.hiddenFreq), primary, { faint: true });
    // Bottom: target behind (only during the challenge), then the live test wave.
    const test = testRef.current;
    if (test) {
      if (challenge) {
        // Draw the faint target first, then overlay the test wave on the same canvas.
        drawWave(test, cyclesFor(data.hiddenFreq), coral, { faint: true });
        const ctx = test.getContext("2d");
        if (ctx) {
          // Overlay the live test wave without clearing the target.
          const w = test.clientWidth;
          const h = test.clientHeight;
          const cy = h / 2;
          const ampY = (h / 2) * 0.78;
          const cycles = cyclesFor(freq);
          const steps = Math.max(2, Math.ceil(w * 4));
          ctx.strokeStyle = primary;
          ctx.lineWidth = 3;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.beginPath();
          for (let k = 0; k <= steps; k++) {
            const p = k / steps;
            const x = p * w;
            const y = cy - Math.sin(p * cycles * 2 * Math.PI) * ampY;
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else {
        drawWave(test, cyclesFor(freq), primary);
      }
    }
  }, [freq, challenge]);

  React.useEffect(() => {
    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [paint]);

  const playMystery = () => {
    engine.ensure();
    engine.playTone({ freq: data.hiddenFreq, type: "sine", gain: 0.5, duration: 0.9, env: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.2 } });
  };
  const playTest = () => {
    engine.ensure();
    engine.playTone({ freq, type: "sine", gain: 0.5, duration: 0.9, env: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.2 } });
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-foreground">
          <RichText text={data.body} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={playMystery}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.playMysteryLabel}
          </button>
          <button
            type="button"
            onClick={playTest}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play aria-hidden="true" className="size-4 fill-current" /> {data.playTestLabel}
          </button>
          <AudioControls engine={engine} className="ml-auto" />
        </div>

        <figure className="space-y-1">
          <canvas ref={mysteryRef} aria-hidden="true" className="h-36 lg:h-40 w-full rounded-lg border border-border bg-background" />
          <figcaption className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{data.mysteryTopLabel}</span>
            <span>Time, left to right</span>
          </figcaption>
        </figure>
        <figure className="mt-3 space-y-1">
          <canvas ref={testRef} aria-hidden="true" className="h-36 lg:h-40 w-full rounded-lg border border-border bg-background" />
          <figcaption className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{data.testMidLabel}</span>
            <span>Time, left to right</span>
          </figcaption>
        </figure>

        <label className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-28 font-medium">{data.freqLabel}</span>
          <input
            type="range"
            min={data.min}
            max={data.max}
            step={1}
            value={freq}
            onChange={(e) => setFreq(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
            aria-label={`${data.freqLabel}, ${freq} hertz`}
          />
          <span className="w-20 text-right font-mono text-xs text-foreground">{freq} Hz</span>
        </label>

        <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
          {`Test frequency ${freq} Hz. ${
            Math.abs(freq - data.hiddenFreq) <= data.challengeTolerance * 2
              ? data.feedbackClose
              : freq < data.hiddenFreq
                ? data.feedbackLow
                : data.feedbackHigh
          }`}
        </p>
          </div>
        }
        aside={
          <>
            {/* Micro-challenge: Match the spacing. */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="text-sm font-semibold text-foreground">{data.challengeLead}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{data.challengePrompt}</p>
        <button
          type="button"
          onClick={() => setChallenge((v) => !v)}
          aria-pressed={challenge}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {challenge ? "Hide the target wave" : "Show the target wave"}
        </button>
        {challenge ? (
          <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
            {matched
              ? "Spacing matched. Your test wave lines up with the target, so its frequency is right."
              : "Keep adjusting the test frequency until the test wave sits right on top of the faint target."}
          </p>
        ) : null}
      </div>

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
