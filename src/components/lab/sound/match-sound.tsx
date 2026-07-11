"use client";

import * as React from "react";
import { Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { soundLab } from "@/data/sound-lab";
import type { WaveType } from "@/components/lab/audio/use-audio-engine";

const data = soundLab.slides.check.matchSound;
const FREQ = 330;
const SHAPES: { type: WaveType; label: string }[] = [
  { type: "sine", label: "Sine" },
  { type: "square", label: "Square" },
  { type: "sawtooth", label: "Saw" },
  { type: "triangle", label: "Triangle" },
];

/** TargetMatch game: set the shape + envelope until your sound matches a hidden
 *  target. A closeness meter warms up; a match locks it in. */
export function MatchSound({ onSolved }: { onSolved?: (solved: boolean) => void }) {
  const engine = useAudioEngineContext();
  const [shape, setShape] = React.useState<WaveType>("sine");
  const [attack, setAttack] = React.useState(0.4);
  const [decay, setDecay] = React.useState(0.8);
  const [revealed, setRevealed] = React.useState(false);

  const target = data.target;
  const shapeMatch = shape === target.type;
  const attackClose = Math.abs(attack - target.attack) <= 0.08;
  const decayClose = Math.abs(decay - target.decay) <= 0.2;
  const solved = shapeMatch && attackClose && decayClose;

  React.useEffect(() => {
    onSolved?.(solved);
  }, [solved, onSolved]);

  // Warmth 0..1 for the meter.
  const warmth =
    (shapeMatch ? 0.5 : 0) +
    0.25 * Math.max(0, 1 - Math.abs(attack - target.attack) / 0.6) +
    0.25 * Math.max(0, 1 - Math.abs(decay - target.decay) / 1.2);

  const playTone = (type: WaveType, a: number, d: number) => {
    engine.ensure();
    engine.playTone({ freq: FREQ, type, gain: 0.8, duration: a + d, env: { attack: a, decay: d, sustain: 0, release: 0.04 } });
  };

  const reveal = () => {
    setShape(target.type as WaveType);
    setAttack(target.attack);
    setDecay(target.decay);
    setRevealed(true);
    playTone(target.type as WaveType, target.attack, target.decay);
  };

  return (
    <CheckCard label={data.label} solved={solved}>
      {solved ? (
        <SuccessCover objective={data.objective} rationale={data.success} />
      ) : (
        <div className="space-y-3">
          <p className="text-base font-medium text-foreground">{data.prompt}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => playTone(target.type as WaveType, target.attack, target.decay)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Play aria-hidden="true" className="size-4 fill-current" /> {data.playTargetLabel}
            </button>
            <button type="button" onClick={() => playTone(shape, attack, decay)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Play aria-hidden="true" className="size-4" /> {data.playYoursLabel}
            </button>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Waveshape">
            {SHAPES.map((s) => (
              <button key={s.type} type="button" onClick={() => setShape(s.type)} aria-pressed={shape === s.type} className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", shape === s.type ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted")}>
                {s.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="w-16 font-medium">Attack</span>
            <input type="range" min={0.005} max={1.2} step={0.005} value={attack} onChange={(e) => setAttack(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" aria-label="Attack time" />
          </label>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="w-16 font-medium">Decay</span>
            <input type="range" min={0.05} max={2} step={0.01} value={decay} onChange={(e) => setDecay(Number(e.target.value))} className="flex-1 accent-[var(--primary)]" aria-label="Decay time" />
          </label>

          {/* Closeness meter */}
          <div aria-hidden="true" className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${Math.round(warmth * 100)}%` }} />
          </div>
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {warmth > 0.85 ? "Very close. Fine-tune it." : warmth > 0.55 ? "Getting warmer." : "Keep adjusting the shape and the envelope."}
          </p>

          <button type="button" onClick={reveal} className="inline-flex items-center gap-1.5 text-sm font-medium text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Sparkles aria-hidden="true" className="size-4" /> {data.revealLabel}
          </button>
          {revealed && !solved ? <p className="text-xs text-muted-foreground">Target set for you. Press Play yours to hear the match.</p> : null}
        </div>
      )}
    </CheckCard>
  );
}
