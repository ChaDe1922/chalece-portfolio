"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDeck } from "@/components/deck/deck-context";
import { RichText } from "@/components/lab/rich-text";
import { useAudioEngineContext, AudioControls } from "@/components/lab/audio/audio-context";
import { LabProse, LabRail } from "@/components/lab/fourier/lab-layout";
import { GuidedGoals } from "@/components/lab/fourier/guided-goals";
import { soundLab } from "@/data/sound-lab";
import type { WaveType } from "@/components/lab/audio/use-audio-engine";

const data = soundLab.slides.synth;
const SHAPES: { type: WaveType; label: string }[] = [
  { type: "sine", label: "Sine" },
  { type: "square", label: "Square" },
  { type: "sawtooth", label: "Saw" },
  { type: "triangle", label: "Triangle" },
];
const FEELS = [
  { id: "pluck", label: "Pluck", attack: 0.005, release: 0.18 },
  { id: "pad", label: "Pad", attack: 0.4, release: 0.6 },
] as const;
type FeelId = (typeof FEELS)[number]["id"];

const CHECKLIST = [
  { id: "shape", text: "Choose a wave shape." },
  { id: "feel", text: "Choose an envelope (a feel)." },
  { id: "play", text: "Play a key." },
  { id: "tune", text: "Play a few notes in a row." },
] as const;

/** Sound P7: a playable mini keyboard using the chosen waveshape + feel. Gates the
 *  deck on the first note (you built a synth, now play it). A build checklist, a
 *  "Your sound" readout, and guided presets sit in the rail. */
export function SynthKeyboard() {
  const deck = useDeck();
  const engine = useAudioEngineContext();
  const [shape, setShape] = React.useState<WaveType>("triangle");
  const [feelId, setFeelId] = React.useState<FeelId>("pluck");
  const [active, setActive] = React.useState<Set<string>>(new Set());
  const [chose, setChose] = React.useState<Set<string>>(() => new Set());
  const [noteCount, setNoteCount] = React.useState(0);
  const playedRef = React.useRef(false);

  const markChose = (id: string) => setChose((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  const chooseShape = (s: WaveType) => {
    setShape(s);
    markChose("shape");
  };
  const chooseFeel = (id: FeelId) => {
    setFeelId(id);
    markChose("feel");
  };
  const preset = (s: WaveType, id: FeelId) => {
    chooseShape(s);
    chooseFeel(id);
  };

  const doneChecklist = React.useMemo(() => {
    const s = new Set(chose);
    if (noteCount >= 1) s.add("play");
    if (noteCount >= 4) s.add("tune");
    return s;
  }, [chose, noteCount]);

  const noteOn = React.useCallback(
    (note: string, freq: number) => {
      engine.ensure();
      const f = FEELS.find((x) => x.id === feelId)!;
      engine.noteOn(note, { freq, type: shape, gain: 0.6, attack: f.attack });
      setActive((s) => (s.has(note) ? s : new Set(s).add(note)));
      setNoteCount((n) => n + 1);
      if (!playedRef.current) {
        playedRef.current = true;
        deck.markComplete(data.id);
      }
    },
    [engine, deck, shape, feelId],
  );

  const noteOff = React.useCallback(
    (note: string) => {
      const f = FEELS.find((x) => x.id === feelId)!;
      engine.noteOff(note, f.release);
      setActive((s) => {
        if (!s.has(note)) return s;
        const next = new Set(s);
        next.delete(note);
        return next;
      });
    },
    [engine, feelId],
  );

  // Computer keyboard: hold to play, release to stop.
  React.useEffect(() => {
    const byKey = new Map<string, (typeof data.keys)[number]>(data.keys.map((k) => [k.key, k]));
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const target = e.target as Element | null;
      if (target?.matches("input, textarea, select, [contenteditable]")) return;
      const k = byKey.get(e.key.toLowerCase());
      if (k) {
        e.preventDefault();
        noteOn(k.note, k.freq);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const k = byKey.get(e.key.toLowerCase());
      if (k) noteOff(k.note);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [noteOn, noteOff]);

  React.useEffect(() => () => engine.allNotesOff(), [engine]);

  const shapeLabel = SHAPES.find((s) => s.type === shape)?.label ?? "Triangle";
  const feelLabel = FEELS.find((f) => f.id === feelId)?.label ?? "Pluck";

  return (
    <div className="lesson-stagger space-y-6">
      <LabProse>
        <p className="text-lg leading-relaxed text-foreground">
          <RichText text={data.lead} />
        </p>
        <p className="text-base leading-relaxed text-muted-foreground">{data.instruction}</p>
      </LabProse>

      <LabRail
        main={
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            {/* Sound controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Waveshape">
                {SHAPES.map((sh) => (
                  <button key={sh.type} type="button" onClick={() => chooseShape(sh.type)} aria-pressed={shape === sh.type} className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", shape === sh.type ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted")}>
                    {sh.label}
                  </button>
                ))}
              </div>
              <AudioControls engine={engine} />
            </div>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Feel">
              {FEELS.map((f) => (
                <button key={f.id} type="button" onClick={() => chooseFeel(f.id)} aria-pressed={feelId === f.id} className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", feelId === f.id ? "border-primary bg-primary/10 text-link" : "border-border bg-background text-foreground hover:bg-muted")}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Keys */}
            <div className="mt-4 grid grid-cols-8 gap-1.5">
              {data.keys.map((k) => {
                const isActive = active.has(k.note);
                return (
                  <button
                    key={k.note}
                    type="button"
                    aria-label={`Play ${k.note}`}
                    aria-pressed={isActive}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture?.(e.pointerId);
                      noteOn(k.note, k.freq);
                    }}
                    onPointerUp={() => noteOff(k.note)}
                    onPointerLeave={() => noteOff(k.note)}
                    onPointerCancel={() => noteOff(k.note)}
                    className={cn(
                      "flex h-24 flex-col items-center justify-end rounded-lg border pb-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-28",
                      isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted",
                    )}
                  >
                    <span>{k.note}</span>
                    <span className="mt-1 font-mono text-[0.65rem] text-muted-foreground">{k.key}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{data.tuneLabel}: </span>
              {data.tune.join(" ")}
            </p>
          </div>
        }
        aside={
          <>
            <GuidedGoals label="Build checklist" intro="Set your sound, then play." goals={CHECKLIST} doneIds={doneChecklist} allDoneText="You built a synth and played it. Pitch, loudness, shape, and envelope, all in your hands." />

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-link">Your sound</p>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Wave shape</dt><dd className="font-medium text-foreground">{shapeLabel}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Envelope</dt><dd className="font-medium text-foreground">{feelLabel}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Pitch</dt><dd className="font-medium text-foreground">C4 to C5</dd></div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => preset("triangle", "pad")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Make a soft pad
                </button>
                <button type="button" onClick={() => preset("sawtooth", "pluck")} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Make a bright pluck
                </button>
              </div>
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
