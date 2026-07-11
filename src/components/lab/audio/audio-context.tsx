"use client";

import * as React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioEngine, type AudioEngine } from "./use-audio-engine";

/** Provides one shared audio engine for a whole lesson, so there is a single
 *  AudioContext and the mute/volume choice persists across slides. Suspends on
 *  tab-hidden. Wrap a lesson deck in <AudioEngineProvider>. */

const Ctx = React.createContext<AudioEngine | null>(null);

export function AudioEngineProvider({ children }: { children: React.ReactNode }) {
  const engine = useAudioEngine();

  React.useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible") engine.suspend();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [engine]);

  return <Ctx.Provider value={engine}>{children}</Ctx.Provider>;
}

/** Read the lesson's shared engine. Falls back to a private engine if used
 *  outside a provider (so a component still works standalone). */
export function useAudioEngineContext(): AudioEngine {
  const fromCtx = React.useContext(Ctx);
  const fallback = useAudioEngine();
  return fromCtx ?? fallback;
}

/** Compact mute + volume control. Place it at the top of an interactive; it
 *  reads the shared engine so the choice persists across slides. */
export function AudioControls({ engine, className }: { engine: AudioEngine; className?: string }) {
  const [muted, setMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(0.8);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          const next = !muted;
          setMuted(next);
          engine.setMuted(next);
        }}
        aria-pressed={muted}
        aria-label={muted ? "Unmute" : "Mute"}
        className="grid size-9 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {muted ? <VolumeX aria-hidden="true" className="size-4" /> : <Volume2 aria-hidden="true" className="size-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => {
          const v = Number(e.target.value);
          setVolume(v);
          engine.setVolume(v);
          if (muted && v > 0) {
            setMuted(false);
            engine.setMuted(false);
          }
        }}
        aria-label="Volume"
        className="w-24 accent-[var(--primary)]"
      />
    </div>
  );
}
