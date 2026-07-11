"use client";

import * as React from "react";
import { Play, Volume2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { AirPressure } from "@/components/lab/fourier/air-pressure";
import { SignalFlow } from "@/components/lab/fourier/signal-flow";
import { WaveAnatomy } from "@/components/lab/fourier/wave-anatomy";
import { CheckpointDivider } from "@/components/lab/fourier/checkpoint-divider";
import { TapTheMoment } from "@/components/lab/fourier/tap-the-moment";
import { GraphAxes } from "@/components/lab/fourier/graph-axes";
import { LabProse, LabRail, LabDuo } from "@/components/lab/fourier/lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.movingShape;

type Motion = "bump" | "wave" | "swell";

/** A pressure value at one normalized x (0..1) for each motion. The dot rides this
 *  curve and the line trails behind it. Time runs left to right; up is positive
 *  pressure; bigger excursions mean a stronger signal. */
function pressure(motion: Motion, x: number): number {
  if (motion === "bump") {
    const c = 0.18;
    const env = Math.exp(-((x - c) ** 2) / (2 * 0.05 ** 2));
    return Math.sin((x - c) * Math.PI * 6) * env;
  }
  if (motion === "wave") {
    return Math.sin(x * Math.PI * 2 * 4) * 0.7;
  }
  const env = Math.sin(x * Math.PI);
  return Math.sin(x * Math.PI * 2 * 4) * env;
}

const MOTIONS: ReadonlyArray<{ id: Motion; label: string }> = [
  { id: "bump", label: data.tapOnceLabel },
  { id: "wave", label: data.tapManyLabel },
  { id: "swell", label: data.holdLabel },
];

export function MovingShape() {
  const engine = useAudioEngineContext();
  const reduced = useReducedMotion();
  const [motion, setMotion] = React.useState<Motion | null>(null);
  const [momentsSolved, setMomentsSolved] = React.useState(false);
  const [loudFound, setLoudFound] = React.useState(false);
  const [loudStatus, setLoudStatus] = React.useState("");

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const loudCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const startRef = React.useRef(0);
  const progressRef = React.useRef(0);

  const paint = React.useCallback((m: Motion, prog: number) => {
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
    const amp = h * 0.4;

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
    const steps = Math.max(2, Math.ceil(w));
    const end = Math.max(0.0001, prog);
    let last = { x: 0, y: cy };
    for (let k = 0; k <= steps; k++) {
      const x = k / steps;
      if (x > end) break;
      const px = x * w;
      const py = cy - pressure(m, x) * amp;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      last = { x: px, y: py };
    }
    ctx.stroke();

    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.arc(last.x, last.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  React.useEffect(() => {
    if (!motion) return;
    if (reduced) {
      progressRef.current = 1;
      paint(motion, 1);
      return;
    }
    progressRef.current = 0;
    startRef.current = 0;
    const dur = 1400;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / dur);
      progressRef.current = t;
      paint(motion, t);
      if (t < 1) rafRef.current = window.requestAnimationFrame(tick);
      else rafRef.current = 0;
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [motion, reduced, paint]);

  React.useEffect(() => {
    const onResize = () => {
      if (motion) paint(motion, progressRef.current || 1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [motion, paint]);

  const runMotion = (m: Motion) => {
    setMotion(m);
    engine.ensure();
    if (m === "bump") {
      engine.playTone({ freq: 220, type: "sine", gain: 0.4, duration: 0.18, env: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.05 } });
    } else if (m === "wave") {
      engine.playTone({ freq: 330, type: "sine", gain: 0.4, duration: 1.0, env: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.2 } });
    } else {
      engine.playTone({ freq: 330, type: "sine", gain: 0.5, duration: 1.2, env: { attack: 0.25, decay: 0.1, sustain: 0.8, release: 0.35 } });
    }
  };

  const readout =
    motion === null
      ? "Play a motion to draw a waveform."
      : motion === "bump"
        ? "Short bump: a single push, then the line settles back to the center."
        : motion === "wave"
          ? "Steady wave: a repeating shape that runs evenly across time."
          : "Rising swell: the line swings further from the center, then eases off.";

  const loudThirds = [
    { id: "left", label: "Beginning", from: 0, to: 1 / 3 },
    { id: "middle", label: "Middle", from: 1 / 3, to: 2 / 3 },
    { id: "end", label: "End", from: 2 / 3, to: 1 },
  ] as const;

  // The loudest check shows its own example waveform (a swell that is loudest in the
  // middle), so the image is always present and the answer does not depend on which
  // motion was last played.
  const paintLoud = React.useCallback(() => {
    const canvas = loudCanvasRef.current;
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
    const amp = h * 0.4;

    // Faint third dividers so the three sections line up with the buttons.
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    for (const fx of [1 / 3, 2 / 3]) {
      ctx.beginPath();
      ctx.moveTo(fx * w, 6);
      ctx.lineTo(fx * w, h - 6);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(w, cy);
    ctx.stroke();

    ctx.strokeStyle = primary;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    const steps = Math.max(2, Math.ceil(w));
    for (let k = 0; k <= steps; k++) {
      const x = k / steps;
      const px = x * w;
      const py = cy - pressure("swell", x) * amp;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }, []);

  React.useEffect(() => {
    if (!momentsSolved) return;
    paintLoud();
    const onResize = () => paintLoud();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [momentsSolved, loudFound, paintLoud]);

  const checkLoud = (third: (typeof loudThirds)[number]) => {
    if (loudFound) return;
    const peak = 0.5; // the example swell is loudest in the middle
    if (peak >= third.from && peak < third.to) {
      setLoudFound(true);
      setLoudStatus("That is the loudest-looking section, where the line swings furthest from the center.");
    } else {
      setLoudStatus("Not the strongest part. Look for where the line swings furthest from the center.");
    }
  };

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">{data.lead}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.vibrateLine}</p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.flowLine}</p>
        <p className="text-base leading-relaxed text-muted-foreground">
          <RichText text={data.body} />
        </p>
      </LabProse>

      {/* Two illustrations of the narrative, side by side to save vertical space:
          a vibration pushing air, and mic -> numbers -> speaker. */}
      <LabDuo>
        <AirPressure caption={data.airCaption} />
        <SignalFlow flow={data.flow} />
      </LabDuo>

      <LabRail
        main={
          <>
            {/* Instrument: play each motion, watch the shape it draws. */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{data.instruction}</p>
                <AudioControls engine={engine} />
              </div>

              <div className="flex flex-wrap gap-2">
                {MOTIONS.map((mo) => (
                  <button
                    key={mo.id}
                    type="button"
                    onClick={() => runMotion(mo.id)}
                    aria-pressed={motion === mo.id}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      motion === mo.id ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-link hover:bg-muted",
                    )}
                  >
                    <Play aria-hidden="true" className="size-3.5 fill-current" /> {mo.label}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <GraphAxes yLabel="Pressure" xLabel="Time">
                  <canvas ref={canvasRef} aria-hidden="true" className="h-52 w-full rounded-lg border border-border bg-background lg:h-64" />
                </GraphAxes>
              </div>

              <p aria-live="polite" className="mt-3 text-sm font-medium text-foreground">
                {readout}
              </p>
            </div>

            {/* Teaching: the parts of a waveform, with axis labels and hover-highlight. */}
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <p className="mb-3 font-heading text-base font-semibold text-foreground">The parts of a waveform</p>
              <WaveAnatomy readings={data.readings} hint={data.anatomyHint} />
            </div>
          </>
        }
        aside={
          <>
            <CheckpointDivider label={data.checkpointLabel} />

            {/* Check: point to the moment (one label at a time), then the loudest section. */}
            <TapTheMoment
              label={data.challengeLead}
              prompt={data.challengePrompt}
              moments={data.moments}
              successText={data.momentSuccess}
              objective="Read a waveform as time."
              onSolved={setMomentsSolved}
            />

            {momentsSolved ? (
              <CheckCard label="Tap the loudest section" solved={loudFound}>
                {loudFound ? (
                  <SuccessCover objective="Read strength from a waveform." rationale={loudStatus} />
                ) : (
                  <>
                    <p className="text-base font-medium text-foreground">{data.loudestPrompt}</p>
                    <canvas ref={loudCanvasRef} aria-hidden="true" className="mt-3 h-28 w-full rounded-lg border border-border bg-background" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {loudThirds.map((third) => (
                        <button
                          key={third.id}
                          type="button"
                          onClick={() => checkLoud(third)}
                          className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Volume2 aria-hidden="true" className="mr-1.5 size-4 text-muted-foreground" /> {third.label}
                        </button>
                      ))}
                    </div>
                    <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
                      {loudStatus}
                    </p>
                  </>
                )}
              </CheckCard>
            ) : null}

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
