"use client";

import * as React from "react";
import { Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";

/** Teaches how to *say* a formula, not just read it. The formula is shown as ordered
 *  chunks; a Play steps left to right, highlighting each chunk and showing how it is
 *  spoken, then leaves the full spoken sentence. Reduced motion reveals the full
 *  sentence at once. Presentational; chunks come from data. */

export type SayChunk = { text: string; say: string; color?: string };

export function FormulaSayItAloud({ label, chunks, playLabel = "Say it out loud" }: { label: string; chunks: readonly SayChunk[]; playLabel?: string }) {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(-1);
  const [playing, setPlaying] = React.useState(false);
  const timerRef = React.useRef(0);
  const playingRef = React.useRef(false);

  const fullSentence = chunks.map((c) => c.say).join(" ");
  const speech = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

  const stop = React.useCallback(() => {
    playingRef.current = false;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = 0;
    if (speech) speech.cancel();
    setPlaying(false);
    setActive(-1);
  }, [speech]);

  const play = React.useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (speech) speech.cancel();

    if (reduced) {
      setPlaying(false);
      setActive(chunks.length); // show the full sentence, no stepping
      if (speech) speech.speak(new SpeechSynthesisUtterance(fullSentence));
      return;
    }

    // Preferred: speak each chunk and advance the highlight when it finishes speaking.
    // A backup timeout advances even if `onend` never fires (e.g. no installed voices).
    if (speech) {
      playingRef.current = true;
      setPlaying(true);
      const speakChunk = (idx: number) => {
        setActive(idx);
        const u = new SpeechSynthesisUtterance(chunks[idx].say);
        u.rate = 0.95;
        let advanced = false;
        const advance = () => {
          if (advanced || !playingRef.current) return;
          advanced = true;
          if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = 0;
          }
          const next = idx + 1;
          if (next >= chunks.length) {
            playingRef.current = false;
            setActive(chunks.length);
            setPlaying(false);
          } else {
            speakChunk(next);
          }
        };
        u.onend = advance;
        timerRef.current = window.setTimeout(advance, 2600);
        speech.speak(u);
      };
      speakChunk(0);
      return;
    }

    // Fallback (no Speech API): silent timed stepping.
    setPlaying(true);
    setActive(0);
    let i = 0;
    timerRef.current = window.setInterval(() => {
      i += 1;
      if (i >= chunks.length) {
        window.clearInterval(timerRef.current);
        timerRef.current = 0;
        setActive(chunks.length);
        setPlaying(false);
      } else {
        setActive(i);
      }
    }, 750);
  }, [chunks, reduced, speech, fullSentence]);

  React.useEffect(() => () => {
    playingRef.current = false;
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (speech) speech.cancel();
  }, [speech]);

  const done = active >= chunks.length;
  const phrase = active >= 0 && active < chunks.length ? chunks[active].say : done ? fullSentence : "";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-link">{label}</p>
        <button
          type="button"
          onClick={playing ? stop : play}
          aria-pressed={playing}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
          {playing ? "Stop" : playLabel}
        </button>
      </div>

      <div className="flex flex-wrap items-baseline justify-center gap-x-1 gap-y-2 py-2 text-center font-serif text-xl text-foreground sm:text-2xl">
        {chunks.map((c, i) => (
          <span
            key={i}
            className={cn("rounded-md px-1 py-0.5 transition-colors", i === active ? "bg-primary/20 ring-1 ring-primary/50" : "")}
            style={c.color ? { color: c.color } : undefined}
          >
            {c.text}
          </span>
        ))}
      </div>

      <p aria-live="polite" className="mt-2 min-h-6 rounded-lg bg-muted px-3 py-2 text-center text-sm text-foreground">
        {phrase ? <>&ldquo;{phrase}&rdquo;</> : "Press play to hear how to say it."}
      </p>
    </div>
  );
}
