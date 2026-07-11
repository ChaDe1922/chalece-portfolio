"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Play, Square, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/lab/rich-text";
import { CheckCard, SuccessCover } from "@/components/lab/assessment/card";
import { useAudioEngineContext } from "@/components/lab/audio/audio-context";
import { usePlayable } from "@/components/lab/audio/use-playable";

/** "Where does its energy live?": play a real sound and watch its spectrum land on
 *  the bass/mids/treble map, then drag the sound onto the region where its energy
 *  sits, one sound at a time. Drag (pointer, ghost portaled to body) or tap a region.
 *  The overlay is the live analyser spectrum mapped onto the log-frequency axis. */

type Band = { id: string; label: string; from: number; to: number; note: string };
type Marker = { label: string; freq: number };
type DragSound = { id: string; label: string; url: string; region: string };

type Props = {
  label: string;
  prompt: string;
  min: number;
  max: number;
  bands: readonly Band[];
  markers: readonly Marker[];
  sounds: readonly DragSound[];
  successText: string;
  objective?: string;
  onSolved?: (solved: boolean) => void;
};

const BAND_BG: Record<string, string> = {
  bass: "rgba(109, 90, 230, 0.16)",
  mid: "rgba(167, 139, 250, 0.18)",
  treble: "rgba(255, 107, 94, 0.18)",
};

export function BandDrag({ label, prompt, min, max, bands, markers, sounds, successText, objective, onSolved }: Props) {
  const engine = useAudioEngineContext();
  const { playingId, toggle } = usePlayable();
  const [step, setStep] = React.useState(0);
  const [placed, setPlaced] = React.useState<Record<string, string[]>>({});
  const [status, setStatus] = React.useState("");
  const [drag, setDrag] = React.useState<{ x: number; y: number; offX: number; offY: number; w: number } | null>(null);
  const [hoverRegion, setHoverRegion] = React.useState<string | null>(null);
  const regionRefs = React.useRef<Map<string, HTMLElement>>(new Map());
  const overlayRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef(0);
  const bufRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);

  const solved = step >= sounds.length;
  const current = solved ? null : sounds[step];
  const playing = playingId === "clip";

  const logPct = React.useCallback((f: number) => ((Math.log(Math.min(max, Math.max(min, f))) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100, [min, max]);

  React.useEffect(() => {
    if (solved) onSolved?.(true);
  }, [solved, onSolved]);

  // Live spectrum overlay while a clip plays.
  const drawOverlay = React.useCallback(() => {
    const canvas = overlayRef.current;
    const analyser = engine.analyser();
    if (!canvas || !analyser) return;
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
    const bins = analyser.frequencyBinCount;
    if (!bufRef.current || bufRef.current.length !== bins) bufRef.current = new Uint8Array(bins);
    const buf = bufRef.current;
    analyser.getByteFrequencyData(buf);
    const sr = engine.context()?.sampleRate ?? 44100;
    const binHz = sr / analyser.fftSize;
    const primary = getComputedStyle(canvas).getPropertyValue("--primary").trim() || "#6d5ae6";
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 2) {
      const f = min * Math.pow(max / min, x / w);
      const bin = Math.round(f / binHz);
      const v = bin >= 0 && bin < bins ? buf[bin] / 255 : 0;
      const y = h - v * (h - 4);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = primary;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  }, [engine, min, max]);

  React.useEffect(() => {
    if (!playing) {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      const c = overlayRef.current;
      const ctx = c?.getContext("2d");
      if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
      return;
    }
    const loop = () => {
      drawOverlay();
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [playing, drawOverlay]);

  const playCurrent = () => {
    if (!current) return;
    toggle("clip", () => {
      engine.ensure();
      return engine.playSample(current.url, { gain: 0.9 });
    });
  };

  const place = React.useCallback(
    (regionId: string) => {
      const s = sounds[step];
      if (!s) return;
      if (s.region === regionId) {
        setPlaced((prev) => ({ ...prev, [regionId]: [...(prev[regionId] ?? []), s.label] }));
        setStep((n) => n + 1);
        setStatus("");
      } else {
        const b = bands.find((x) => x.id === regionId);
        setStatus(`Not the ${b?.label ?? "right region"}. Play it again and watch where the spectrum peaks.`);
      }
    },
    [sounds, step, bands],
  );

  // Pointer drag of the current card onto a region.
  React.useEffect(() => {
    if (!drag) return;
    const regionAt = (x: number, y: number): string | null => {
      for (const [id, el] of regionRefs.current) {
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
      }
      return null;
    };
    const onMove = (e: PointerEvent) => {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      setHoverRegion(regionAt(e.clientX, e.clientY));
    };
    const onUp = (e: PointerEvent) => {
      const region = regionAt(e.clientX, e.clientY);
      setDrag(null);
      setHoverRegion(null);
      if (region) place(region);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag, place]);

  if (solved) {
    return (
      <CheckCard label={label} solved>
        <SuccessCover objective={objective} rationale={successText} />
      </CheckCard>
    );
  }

  return (
    <CheckCard label={label} solved={false}>
      <p className="text-base font-medium text-foreground">
        <RichText text={prompt} />
      </p>

      {/* Current sound: play it, then drag it. */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sound {step + 1} of {sounds.length}
        </p>
        {current ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={playCurrent}
              aria-label={playing ? `Stop ${current.label}` : `Play ${current.label}`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-link transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {playing ? <Square aria-hidden="true" className="size-4 fill-current" /> : <Play aria-hidden="true" className="size-4 fill-current" />}
              Play
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                const r = e.currentTarget.getBoundingClientRect();
                setDrag({ x: e.clientX, y: e.clientY, offX: e.clientX - r.left, offY: e.clientY - r.top, w: r.width });
              }}
              className={cn(
                "cursor-grab touch-none rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-4 py-2.5 text-sm font-medium text-foreground transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing",
                drag && "opacity-40",
              )}
            >
              {current.label}
              <span className="ml-2 text-xs font-normal text-muted-foreground">drag me onto the map</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* The frequency map with drop-zone regions + live spectrum overlay. */}
      <div className="relative mt-4 h-32 w-full select-none overflow-hidden rounded-lg border border-border bg-background">
        {bands.map((b) => {
          const left = logPct(b.from);
          const right = logPct(b.to);
          return (
            <button
              key={b.id}
              type="button"
              ref={(el) => {
                if (el) regionRefs.current.set(b.id, el);
                else regionRefs.current.delete(b.id);
              }}
              onClick={() => place(b.id)}
              aria-label={`Place in ${b.label}`}
              className={cn("absolute inset-y-0 flex flex-col items-center justify-start border-l border-border/60 pt-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", hoverRegion === b.id && "ring-2 ring-inset ring-primary")}
              style={{ left: `${left}%`, width: `${right - left}%`, backgroundColor: BAND_BG[b.id] ?? "transparent" }}
            >
              <span className="text-xs font-semibold text-foreground">{b.label}</span>
              <span className="mt-0.5 hidden px-1 text-[10px] leading-tight text-muted-foreground sm:block">{b.note}</span>
              {(placed[b.id] ?? []).map((lbl) => (
                <span key={lbl} className="mt-1 inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">
                  <Check aria-hidden="true" className="size-2.5" /> {lbl}
                </span>
              ))}
            </button>
          );
        })}
        {/* markers */}
        {markers.map((m) => (
          <span key={m.label} aria-hidden="true" className="pointer-events-none absolute bottom-1 -translate-x-1/2 text-[9px] text-muted-foreground" style={{ left: `${logPct(m.freq)}%` }}>
            {m.label}
          </span>
        ))}
        <canvas ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      </div>
      <p className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>Low</span>
        <span>Frequency, low to high</span>
        <span>High</span>
      </p>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted-foreground">
        {status}
      </p>

      {drag && current && typeof document !== "undefined"
        ? createPortal(
            <div className="pointer-events-none fixed z-[100] rounded-xl border-2 border-primary bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xl" style={{ left: drag.x - drag.offX, top: drag.y - drag.offY, width: drag.w }}>
              {current.label}
            </div>,
            document.body,
          )
        : null}
    </CheckCard>
  );
}
