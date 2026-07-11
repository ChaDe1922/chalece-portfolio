"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { RichText } from "@/components/lab/rich-text";
import { AssignLabels } from "@/components/lab/assessment/assign-labels";
import { LabProse, LabRail } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.spectrogram;

/** Heat color for a 0..1 magnitude: dark blue -> green -> yellow -> red. */
function heat(m: number): string {
  const t = Math.max(0, Math.min(1, m));
  const stops: Array<[number, number, number, number]> = [
    [0, 24, 18, 46],
    [0.3, 46, 70, 190],
    [0.55, 40, 180, 150],
    [0.75, 150, 215, 70],
    [0.9, 250, 185, 45],
    [1, 245, 60, 40],
  ];
  let a = stops[0];
  let b = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }
  const span = b[0] - a[0] || 1;
  const f = (t - a[0]) / span;
  const r = Math.round(a[1] + (b[1] - a[1]) * f);
  const g = Math.round(a[2] + (b[2] - a[2]) * f);
  const bl = Math.round(a[3] + (b[3] - a[3]) * f);
  return `rgb(${r}, ${g}, ${bl})`;
}

/** A scrolling spectrogram: time runs left to right, frequency bottom to top,
 *  strength as color. Plays synth-approximate sounds (a sung note, a drum hit, a
 *  spoken phrase) and paints the analyser output column by column. */
export function Spectrogram() {
  const engine = useAudioEngineContext();
  const reduced = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const bufRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [active, setActive] = React.useState(false);

  // Paint a single fresh column at the right edge, shifting the rest left.
  const paintColumn = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = engine.analyser();
    if (!ctx || !analyser) return;
    const w = canvas.width;
    const h = canvas.height;
    // Shift left by one device pixel.
    ctx.drawImage(canvas, -1, 0);
    const bins = analyser.frequencyBinCount;
    if (!bufRef.current || bufRef.current.length !== bins) bufRef.current = new Uint8Array(bins);
    const buf = bufRef.current;
    analyser.getByteFrequencyData(buf);
    const usable = Math.min(bins, Math.floor(bins * 0.5));
    for (let y = 0; y < h; y++) {
      const frac = 1 - y / h; // bottom = low freq
      const idx = Math.floor(frac * (usable - 1));
      ctx.fillStyle = heat(buf[idx] / 255);
      ctx.fillRect(w - 1, y, 1, 1);
    }
  }, [engine]);

  React.useEffect(() => {
    if (!active || reduced) return;
    const loop = () => {
      if (document.visibilityState === "visible") paintColumn();
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [active, reduced, paintColumn]);

  const start = () => {
    setActive(true);
    window.setTimeout(() => setActive(false), 2600);
  };

  const playNote = () => {
    engine.ensure();
    engine.playTone({ freq: 330, type: "sawtooth", gain: 0.5, duration: 2.2 });
    start();
  };
  const playDrum = () => {
    engine.ensure();
    engine.playTone({ freq: 110, type: "triangle", gain: 0.6, duration: 0.22, env: { attack: 0.002, decay: 0.18, sustain: 0, release: 0.05 } });
    start();
  };
  const playSpeech = () => {
    engine.ensure();
    const seq = [440, 620, 520, 700, 480];
    seq.forEach((f, i) => window.setTimeout(() => engine.playTone({ freq: f, type: "sawtooth", gain: 0.45, duration: 0.35 }), i * 320));
    start();
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
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={playNote} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Play aria-hidden="true" className="size-4 fill-current" /> {data.playNoteLabel}
              </button>
              <button type="button" onClick={playDrum} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Play aria-hidden="true" className="size-4 fill-current" /> {data.playDrumLabel}
              </button>
              <button type="button" onClick={playSpeech} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Play aria-hidden="true" className="size-4 fill-current" /> {data.playSpeechLabel}
              </button>
              <AudioControls engine={engine} />
            </div>
            <canvas ref={canvasRef} width={480} height={180} aria-hidden="true" className="h-56 w-full rounded-lg border border-border bg-[rgb(24,18,46)] lg:h-72" />
            <p className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>Time, left to right</span>
              <span>Low to high frequency, bottom to top</span>
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Weaker</span>
              <span aria-hidden="true" className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(to right, rgb(24,18,46), rgb(46,70,190), rgb(40,180,150), rgb(150,215,70), rgb(250,185,45), rgb(245,60,40))" }} />
              <span>Stronger</span>
            </div>
            <p className="mt-1 text-center text-xs text-muted-foreground">Brighter color means that frequency is stronger.</p>
          </div>
        }
        aside={
          <>
            <AssignLabels
              label={data.challengeLead}
              prompt={data.challengePrompt}
              slots={data.cards.map((c) => ({ id: c.id, label: c.shape === "bands" ? "Steady horizontal bands" : c.shape === "burst" ? "A sudden vertical burst" : "Changing, shifting shapes" }))}
              labels={data.cards.map((c) => ({ id: c.id, label: c.label }))}
              successText="Each sound leaves a different trail: steady bands for a held note, a sudden burst for a drum, shifting shapes for speech."
              objective="Match a sound to its spectrogram."
            />
            <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
              <p className="text-sm leading-relaxed text-foreground">{data.insight}</p>
            </div>
          </>
        }
      />
    </div>
  );
}
