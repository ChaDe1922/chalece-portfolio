"use client";

import * as React from "react";
import { Play, Square, Headphones, Music, Radio, Mic, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import type { AudioEngine } from "@/components/lab/audio/use-audio-engine";
import { LabProse, LabSplit } from "./lab-layout";
import { fourierLab } from "@/data/fourier-lab";

const data = fourierLab.slides.applications;
const CARD_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  anc: Headphones,
  shazam: Music,
  mp3: Radio,
  pitch: Mic,
};
const G = 0.18;
const btnPrimary =
  "inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const btnGhost =
  "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

/** Noise cancelling: a tone, then its phase-inverted twin cancels it to silence. */
function NoiseCancelDemo({ engine, freq, playNoiseLabel, addAntiLabel, challengePrompt }: { engine: AudioEngine; freq: number; playNoiseLabel: string; addAntiLabel: string; challengePrompt: string }) {
  const [state, setState] = React.useState<"off" | "noise" | "cancelled">("off");
  const nodesRef = React.useRef<{ a: OscillatorNode; b: OscillatorNode; ga: GainNode; gb: GainNode } | null>(null);

  const stop = React.useCallback(() => {
    const n = nodesRef.current;
    if (n) {
      try {
        n.a.stop();
        n.b.stop();
      } catch {
        // already stopped
      }
      n.a.disconnect();
      n.b.disconnect();
      n.ga.disconnect();
      n.gb.disconnect();
    }
    nodesRef.current = null;
    setState("off");
  }, []);

  const playNoise = () => {
    const ctx = engine.ensure();
    const master = engine.master();
    if (!ctx || !master) return;
    if (nodesRef.current) stop();
    const now = ctx.currentTime;
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = "sine";
    b.type = "sine";
    a.frequency.value = freq;
    b.frequency.value = freq;
    const ga = ctx.createGain();
    const gb = ctx.createGain();
    ga.gain.value = G;
    gb.gain.value = 0;
    a.connect(ga);
    b.connect(gb);
    ga.connect(master);
    gb.connect(master);
    a.start(now);
    b.start(now);
    nodesRef.current = { a, b, ga, gb };
    setState("noise");
  };

  const addAnti = () => {
    const n = nodesRef.current;
    const ctx = engine.context();
    if (!n || !ctx) return;
    n.gb.gain.setTargetAtTime(-G, ctx.currentTime, 0.04);
    setState("cancelled");
  };

  React.useEffect(() => () => stop(), [stop]);

  return (
    <div className="mt-3 rounded-lg border border-border bg-background p-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={playNoise} className={btnPrimary}>
          <Play aria-hidden="true" className="size-3.5 fill-current" /> {playNoiseLabel}
        </button>
        <button type="button" onClick={addAnti} disabled={state !== "noise"} className={btnGhost}>
          {addAntiLabel}
        </button>
        {state !== "off" ? (
          <button type="button" onClick={stop} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Square aria-hidden="true" className="size-3.5 fill-current" /> Stop
          </button>
        ) : null}
      </div>
      <p aria-live="polite" className="mt-2 text-xs font-medium text-foreground">
        {state === "noise" ? challengePrompt : state === "cancelled" ? "The two waves work against each other, so the sound gets much quieter." : "Press play to hear the tone."}
      </p>
    </div>
  );
}

/** Song recognition: play a clip, then click the strong peaks. Three or more
 *  connect into a fingerprint constellation. */
function FingerprintDemo({ engine, playLabel, challengePrompt }: { engine: AudioEngine; playLabel: string; challengePrompt: string }) {
  const peaks = React.useMemo(
    () => [
      { x: 0.12, y: 0.7 },
      { x: 0.3, y: 0.35 },
      { x: 0.48, y: 0.6 },
      { x: 0.66, y: 0.25 },
      { x: 0.84, y: 0.5 },
    ],
    [],
  );
  const [picked, setPicked] = React.useState<number[]>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const draw = React.useCallback(() => {
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
    const primary = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#6d5ae6";
    const muted = getComputedStyle(canvas).getPropertyValue("--muted-foreground").trim() || "#7a756c";
    // connect picked peaks in x order
    const order = [...picked].sort((a, b) => peaks[a].x - peaks[b].x);
    ctx.strokeStyle = primary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    order.forEach((idx, i) => {
      const p = peaks[idx];
      const x = p.x * w;
      const y = p.y * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    peaks.forEach((p, i) => {
      const on = picked.includes(i);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, on ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = on ? primary : muted;
      ctx.globalAlpha = on ? 1 : 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }, [peaks, picked]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    let best = -1;
    let bestD = 0.02;
    peaks.forEach((p, i) => {
      const d = (p.x - fx) ** 2 + (p.y - fy) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (best >= 0) setPicked((prev) => (prev.includes(best) ? prev.filter((x) => x !== best) : [...prev, best]));
  };

  const playClip = () => {
    engine.ensure();
    engine.playPartials([
      { freq: 220, gain: 0.5 },
      { freq: 440, gain: 0.35 },
      { freq: 660, gain: 0.25 },
    ], { duration: 1.0 });
  };

  return (
    <div className="mt-3 rounded-lg border border-border bg-background p-3">
      <button type="button" onClick={playClip} className={btnPrimary}>
        <Play aria-hidden="true" className="size-3.5 fill-current" /> {playLabel}
      </button>
      <canvas ref={canvasRef} onClick={onClick} aria-hidden="true" className="mt-2 h-24 w-full cursor-pointer rounded-lg border border-border bg-[rgb(24,18,46)]" />
      <p aria-live="polite" className="mt-2 text-xs font-medium text-foreground">
        {picked.length >= 3 ? "Fingerprint found. These peaks identify the clip." : challengePrompt}
      </p>
    </div>
  );
}

/** Audio compression: original vs compressed (high partials dropped) vs the
 *  difference (the dropped, less-audible content). */
function CompressionDemo({ engine, challengePrompt }: { engine: AudioEngine; challengePrompt: string }) {
  const base = 220;
  const full = [1, 0.6, 0.4, 0.28, 0.2, 0.15, 0.11, 0.08];
  const play = (amps: number[]) => {
    engine.ensure();
    engine.playPartials(amps.map((g, i) => ({ freq: base * (i + 1), gain: g })).filter((p) => p.gain > 0), { duration: 1.1 });
  };
  return (
    <div className="mt-3 rounded-lg border border-border bg-background p-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => play(full)} className={btnPrimary}>
          <Play aria-hidden="true" className="size-3.5 fill-current" /> Original
        </button>
        <button type="button" onClick={() => play(full.map((g, i) => (i < 4 ? g : 0)))} className={btnGhost}>
          Compressed
        </button>
        <button type="button" onClick={() => play(full.map((g, i) => (i >= 4 ? g : 0)))} className={btnGhost}>
          Difference
        </button>
      </div>
      <p className="mt-2 text-xs font-medium text-foreground">{challengePrompt}</p>
    </div>
  );
}

/** Pitch correction: a slightly sharp sung note, then snapped to the target. */
function PitchDemo({ engine, playLabel, snapLabel, challengePrompt }: { engine: AudioEngine; playLabel: string; snapLabel: string; challengePrompt: string }) {
  const [snapped, setSnapped] = React.useState(false);
  const playSung = () => {
    engine.ensure();
    engine.playTone({ freq: 453, type: "sawtooth", gain: 0.4, duration: 1.0 });
    setSnapped(false);
  };
  const snap = () => {
    engine.ensure();
    engine.playTone({ freq: 440, type: "sawtooth", gain: 0.4, duration: 1.0 });
    setSnapped(true);
  };
  return (
    <div className="mt-3 rounded-lg border border-border bg-background p-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={playSung} className={btnPrimary}>
          <Play aria-hidden="true" className="size-3.5 fill-current" /> {playLabel}
        </button>
        <button type="button" onClick={snap} className={btnGhost}>
          {snapLabel}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-xs font-medium text-foreground">
        {snapped ? "Snapped to A, 440 Hz. The pitch is nudged onto the target note." : challengePrompt}
      </p>
    </div>
  );
}

/** S26: where frequency thinking lives. Four expandable mini-labs, one open at a
 *  time, so each tool gets room to breathe instead of a dense 2x2 grid. */
export function Applications() {
  const engine = useAudioEngineContext();
  const [openId, setOpenId] = React.useState<string | null>(data.cards[0].id);

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
      </LabProse>

      <div className="space-y-3">
        {data.cards.map((card) => {
          const Icon = CARD_ICON[card.id] ?? Music;
          const open = openId === card.id;
          const demo = "demo" in card ? card.demo : undefined;
          const prompt = "challengePrompt" in card ? card.challengePrompt : "";
          return (
            <div key={card.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : card.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-link">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-base font-semibold text-foreground">{card.title}</span>
                  {!open ? <span className="mt-0.5 block truncate text-sm text-muted-foreground">{card.body}</span> : null}
                </span>
                <ChevronDown aria-hidden="true" className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
              </button>
              {open ? (
                <div className="border-t border-border p-4">
                  <LabSplit
                    start={<p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>}
                    end={
                      demo === "anc" ? (
                        <NoiseCancelDemo
                          engine={engine}
                          freq={"demoFreq" in card ? card.demoFreq : 220}
                          playNoiseLabel={"playNoiseLabel" in card ? card.playNoiseLabel : "Play noise"}
                          addAntiLabel={"addAntiLabel" in card ? card.addAntiLabel : "Add anti-noise"}
                          challengePrompt={prompt}
                        />
                      ) : demo === "fingerprint" ? (
                        <FingerprintDemo engine={engine} playLabel={"playLabel" in card ? card.playLabel : "Play noisy clip"} challengePrompt={prompt} />
                      ) : demo === "compression" ? (
                        <CompressionDemo engine={engine} challengePrompt={prompt} />
                      ) : demo === "pitch" ? (
                        <PitchDemo engine={engine} playLabel={"playLabel" in card ? card.playLabel : "Play sung note"} snapLabel={"snapLabel" in card ? card.snapLabel : "Snap to target note"} challengePrompt={prompt} />
                      ) : null
                    }
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5">
        <p className="text-sm leading-relaxed text-foreground">
          <RichText text={data.insight} />
        </p>
      </div>
    </div>
  );
}
