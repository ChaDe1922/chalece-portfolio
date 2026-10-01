"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { cn } from "@/lib/utils";
import type { PillarId } from "@/data/pillars";
import { BLENDS, CHANNELS, ORDER, type MixItem } from "@/data/mix";
import { useMix } from "./mix-provider";
import { EYEBROW, H2, SHELL } from "./shell";

const OFF = "#262a33";
const SEGMENTS = 14;
/** A drag that ends this close to the bottom switches the channel off. */
const SNAP_OFF = 3;
const KEY_STEP: Record<string, number> = { ArrowUp: 5, ArrowRight: 5, ArrowDown: -5, ArrowLeft: -5, PageUp: 20, PageDown: -20 };

/** A vertical channel fader. Drag it, click the track, or use the arrow keys. Bottom is off. */
function Fader({ id, value }: { id: PillarId; value: number }) {
  const { setLevel } = useMix();
  const ch = CHANNELS[id];
  const track = useRef<HTMLSpanElement>(null);
  const [dragging, setDragging] = useState(false);

  function levelAt(clientY: number): number {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return value;
    const raw = ((rect.bottom - clientY) / rect.height) * 100;
    return raw <= SNAP_OFF ? 0 : raw;
  }

  function onPointerDown(e: PointerEvent<HTMLSpanElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus({ preventScroll: true });
    setDragging(true);
    setLevel(id, levelAt(e.clientY));
  }

  function onPointerMove(e: PointerEvent<HTMLSpanElement>) {
    if (dragging) setLevel(id, levelAt(e.clientY));
  }

  function onKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    let next: number | null = null;
    if (e.key in KEY_STEP) next = value + KEY_STEP[e.key];
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    setLevel(id, next);
  }

  const pos = `${value}%`;
  const ease = dragging ? "" : "duration-300 ease-out motion-reduce:transition-none";

  return (
    <span
      role="slider"
      tabIndex={0}
      aria-label={`${ch.name} level`}
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={value === 0 ? "Off" : `${value} percent`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onLostPointerCapture={() => setDragging(false)}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex w-11 touch-none select-none justify-center rounded-lg",
        dragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {/* Inset so the cap stays inside the hit area at both ends. */}
      <span ref={track} aria-hidden="true" className="absolute inset-y-2.5 w-1.5 rounded-[3px] bg-night-line">
        <span
          className={cn("absolute inset-x-0 bottom-0 rounded-[3px] transition-[height]", ease)}
          style={{ height: pos, background: value > 0 ? ch.color : "transparent" }}
        />
        <span
          className={cn(
            "absolute -left-[15px] -mb-2.5 flex h-5 w-9 items-center justify-center rounded-[5px] bg-night-fg shadow-[0_2px_6px_rgba(0,0,0,0.5)] transition-[bottom]",
            ease
          )}
          style={{ bottom: pos }}
        >
          <span className="h-0.5 w-5 bg-night" />
        </span>
      </span>
    </span>
  );
}

function ChannelStrip({ id }: { id: PillarId }) {
  const { on, levels, single, soloOrFull, toggle } = useMix();
  const ch = CHANNELS[id];
  const lit = on[id];
  const soloed = single === id;
  const value = lit ? levels[id] : 0;
  // The meter follows the fader; the top two segments are the peak lights.
  const n = lit ? Math.max(1, Math.round((value / 100) * SEGMENTS)) : 0;

  return (
    <div
      role="group"
      aria-label={`${ch.name} channel`}
      className="flex flex-col items-center gap-4 rounded-2xl border px-2 pb-3.5 pt-4 transition-colors duration-200 sm:px-3 sm:pt-[18px]"
      style={{
        borderColor: soloed ? ch.color : lit ? "#3a3f4b" : OFF,
        background: lit ? "#1d212a" : "#171a21",
      }}
    >
      <span className="font-mono text-xs" style={{ color: ch.color }}>
        CH {ch.num}
      </span>
      <span className="flex h-40 items-stretch gap-1.5 sm:h-[210px] sm:gap-2.5">
        <span aria-hidden="true" className="flex w-2 flex-col-reverse gap-[3px] py-2.5">
          {Array.from({ length: SEGMENTS }, (_, k) => (
            <span
              key={k}
              className="flex-1 rounded-[2px] transition-colors duration-200"
              style={{ background: k < n ? (k >= SEGMENTS - 2 ? "#ecebe6" : ch.color) : OFF }}
            />
          ))}
        </span>
        <Fader id={id} value={value} />
      </span>
      <span
        className="flex min-h-9 items-center text-center font-display text-sm font-bold leading-tight sm:text-[15px]"
        style={{ color: lit ? "#ecebe6" : "#9a9ca3" }}
      >
        {ch.short}
      </span>
      <span className="flex flex-col gap-1.5 sm:flex-row">
        <button
          type="button"
          aria-pressed={soloed}
          aria-label={`Solo ${ch.name}`}
          onClick={() => soloOrFull(id)}
          className="h-11 min-w-11 cursor-pointer rounded-lg border px-1.5 font-mono text-[12px] font-medium"
          style={{ borderColor: ch.color, background: soloed ? ch.color : "transparent", color: soloed ? "#0f1115" : ch.color }}
        >
          Solo
        </button>
        <button
          type="button"
          aria-pressed={lit}
          aria-label={`${ch.name} on`}
          onClick={() => toggle(id)}
          className="h-11 min-w-11 cursor-pointer rounded-lg border px-1.5 font-mono text-[12px] font-medium"
          style={{
            borderColor: lit ? "#ecebe6" : "#3a3f4b",
            background: lit ? "#ecebe6" : "transparent",
            color: lit ? "#0f1115" : "#9a9ca3",
          }}
        >
          {lit ? "On" : "Off"}
        </button>
      </span>
    </div>
  );
}

/** What I do: a three-channel console. Solo isolates, On blends, Full mix resets. */
export function MixConsole() {
  const { ids, single, full, fullMix } = useMix();

  let label: string;
  let title: string;
  let desc: string;
  let projects: MixItem[] = [];
  let stats: { value: string; label: string }[] = [];
  if (ids.length === 0) {
    label = "NO SIGNAL";
    title = "All channels are off.";
    desc = "Tap Solo on any channel to see one craft, or press Full mix.";
  } else if (single) {
    const ch = CHANNELS[single];
    label = `SOLO · CH ${ch.num}`;
    title = ch.name;
    desc = ch.desc;
    projects = ch.projects;
    stats = ch.stats;
  } else {
    const blend = BLENDS[ids.join("+")];
    label = full ? "MASTER · FULL MIX" : `BLEND · ${ids.map((id) => `CH ${CHANNELS[id].num}`).join(" + ")}`;
    title = blend.title;
    desc = blend.desc;
    projects = blend.projects;
  }

  return (
    <section id="what" aria-labelledby="what-heading" className="scroll-mt-20 lg:scroll-mt-28">
      <div className={cn(SHELL, "py-16 md:py-24")}>
        <p className={EYEBROW}>{"// three crafts, one thread"}</p>
        <h2 id="what-heading" className={H2}>
          Solo a craft, or bring up the full mix.
        </h2>
        <p className="mt-3.5 max-w-[640px] text-base leading-relaxed text-night-muted">
          Each channel is one of my crafts. Turn on two to see how they work together. Pull a fader all the way down to switch it off.
        </p>

        <div className="mt-10 grid gap-7 rounded-3xl border border-night-line bg-night-surface p-3 sm:p-7 lg:grid-cols-[492px_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {ORDER.map((id) => (
                <ChannelStrip key={id} id={id} />
              ))}
            </div>
            <button
              type="button"
              aria-pressed={full}
              onClick={fullMix}
              className="flex min-h-[52px] cursor-pointer items-center justify-center gap-3 rounded-xl border font-mono text-sm"
              style={{
                borderColor: full ? "#ecebe6" : "#3a3f4b",
                background: full ? "#1d212a" : "transparent",
                color: full ? "#ecebe6" : "#9a9ca3",
              }}
            >
              <span aria-hidden="true" className="inline-flex gap-[3px]">
                {ORDER.map((id) => (
                  <span key={id} className="h-1.5 w-[18px] rounded-[3px]" style={{ background: CHANNELS[id].color }} />
                ))}
              </span>
              MASTER · FULL MIX
            </button>
          </div>

          <div className="flex flex-col rounded-2xl border border-night-line bg-night p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[13px] text-signal" aria-live="polite">
                {label}
              </p>
              <span aria-hidden="true" className="flex gap-1.5">
                {ids.map((id) => (
                  <span key={id} className="h-1.5 w-6 rounded-[3px]" style={{ background: CHANNELS[id].color }} />
                ))}
              </span>
            </div>
            <h3 className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.125rem)] font-bold leading-[1.1] tracking-[-0.035em] text-night-fg">
              {title}
            </h3>
            <p className="mt-2.5 text-base leading-relaxed text-night-body">{desc}</p>
            {stats.length > 0 && (
              <dl className="mt-5 flex flex-wrap gap-9">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse">
                    <dt className="mt-0.5 text-[13px] text-night-muted">{s.label}</dt>
                    <dd className="font-display text-3xl font-bold text-signal">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {projects.length > 0 && (
              <ul className="mt-5 flex flex-col">
                {projects.map((p) => (
                  <li
                    key={p.title}
                    className="flex justify-between gap-4 border-t border-night-line py-3 text-[15px] text-night-fg"
                  >
                    <span className="font-medium">{p.title}</span>
                    <span className="shrink-0 font-mono text-[13px] text-night-muted">{p.meta}</span>
                  </li>
                ))}
              </ul>
            )}
            {ids.length > 0 && (
              <a
                href="#work"
                className="mt-auto inline-flex min-h-11 items-center pt-3 font-mono text-sm text-signal"
              >
                see these in the tracklist ↓
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
