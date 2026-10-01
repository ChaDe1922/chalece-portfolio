"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import { pillarById, type PillarId } from "@/data/pillars";
import { CHANNELS, ORDER } from "@/data/mix";
import { CLIPS, TIMELINE, type Clip, type LaneId } from "@/data/timeline";
import { useMix } from "./mix-provider";
import { ResumeInspector } from "./resume-inspector";
import { EYEBROW, H2, SHELL } from "./shell";

const SPAN = TIMELINE.to - TIMELINE.from;
const MIN_WIDTH = 0.04;
const TICKS = Array.from({ length: Math.floor(SPAN / 2) + 1 }, (_, i) => TIMELINE.from + i * 2);
const AUTOPLAY_MS = 3500;
const INSPECTOR_ID = "resume-inspector";

/** "YYYY-MM" to a 0..1 position on the axis. "now" runs to the end. */
function position(date: string): number {
  if (date === "now") return 1;
  const [year, month] = date.split("-").map(Number);
  return Math.min(1, Math.max(0, (year + ((month || 1) - 1) / 12 - TIMELINE.from) / SPAN));
}

type LaneMeta = { num: number; name: string; color: string; pillar?: PillarId };

const LANE_ORDER: LaneId[] = [...ORDER, "published"];
const LANE_META = {
  ...Object.fromEntries(
    ORDER.map((id) => [id, { num: CHANNELS[id].num, name: CHANNELS[id].short, color: CHANNELS[id].color, pillar: id }])
  ),
  published: { num: 4, name: "Published", color: "#9a9ca3" },
} as Record<LaneId, LaneMeta>;

/*
 * Label-aware packing. Each clip is a label sitting on top of its bar. The clip
 * reserves the wider of the two, so the title and dates never truncate. Widths
 * are estimated for the narrowest track (the 960px scroll content minus padding,
 * label column and gap): a label that fits there fits at every wider size. A
 * label starts at its bar's left edge, or ends at the bar's right edge when it
 * would run off the end of the axis.
 */
const TRACK_MIN_PX = 720; // 960 minus sm:px-8 on both sides, the 160px label column and the gap
const SANS_PX = 7; // IBM Plex Sans 12px semibold, per character, rounded up
const MONO_PX = 6.8; // IBM Plex Mono 11px, per character, rounded up
const LABEL_CHROME_PX = 16; // gap between title and dates, plus a little air
const ROW_PX = 52;
const CLIP_PX = 44; // the whole clip is the hit target

type Placed = Clip & {
  lane: LaneId;
  /** Where the bar starts on the axis, 0..1. The playhead sits here. */
  at: number;
  /** Reserved box on the track, 0..1. The label lives here. */
  left: number;
  width: number;
  /** The bar itself, relative to the reserved box, 0..1. */
  barLeft: number;
  barWidth: number;
  /** A single date, like a paper: drawn as a marker, not a bar. */
  point: boolean;
  alignEnd: boolean;
  row: number;
};

function labelFraction(clip: Clip): number {
  return (clip.title.length * SANS_PX + clip.label.length * MONO_PX + LABEL_CHROME_PX) / TRACK_MIN_PX;
}

/** Greedy packing: each clip goes on the first row its reserved box does not overlap. */
function pack(lane: LaneId): { placed: Placed[]; rows: number } {
  const ends: number[] = [];
  const placed = [...CLIPS[lane]]
    .sort((a, b) => position(a.start) - position(b.start))
    .map((clip) => {
      const point = clip.start === clip.end;
      const span = point ? 0 : Math.max(MIN_WIDTH, position(clip.end) - position(clip.start));
      const barLeft = Math.min(position(clip.start), 1 - span);
      const label = labelFraction(clip);
      const barRight = barLeft + span;
      const alignEnd = barLeft + label > 1;
      const left = alignEnd ? Math.max(0, Math.min(barLeft, barRight - label)) : barLeft;
      const right = alignEnd ? Math.max(barRight, left + label) : Math.max(barRight, barLeft + label);
      const width = right - left;
      let row = ends.findIndex((end) => end <= left);
      if (row === -1) row = ends.push(0) - 1;
      ends[row] = right + 0.01;
      return {
        ...clip,
        lane,
        at: barLeft,
        left,
        width,
        barLeft: (barLeft - left) / width,
        barWidth: span / width,
        point,
        alignEnd,
        row,
      };
    });
  return { placed, rows: ends.length };
}

const LANES = Object.fromEntries(LANE_ORDER.map((id) => [id, pack(id)])) as Record<LaneId, ReturnType<typeof pack>>;

/** Every clip in time order, lane order breaking ties. Prev, next and play walk this. */
const SEQUENCE: Placed[] = LANE_ORDER.flatMap((id) => LANES[id].placed).sort(
  (a, b) => a.at - b.at || LANE_ORDER.indexOf(a.lane) - LANE_ORDER.indexOf(b.lane)
);
const COUNT = SEQUENCE.length;

const laneHeight = (rows: number) => rows * ROW_PX - (ROW_PX - CLIP_PX) + 16;

// Today's month on the axis, read on the client only so the server render is stable.
const noopSubscribe = () => () => {};
function todayPosition(): number {
  const now = new Date();
  return position(`${now.getFullYear()}-${now.getMonth() + 1}`);
}

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const pad = (n: number) => String(n).padStart(2, "0");
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Track label with its export button, then the clips.
const LANE_GRID = "grid grid-cols-[124px_1fr] gap-4 sm:grid-cols-[160px_1fr]";

function DownloadIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function ExportLink({ id, hot }: { id: PillarId; hot: boolean }) {
  const ch = CHANNELS[id];
  return (
    <a
      href={pillarById[id].resumePath}
      download
      className="inline-flex min-h-11 items-center gap-2 justify-self-start whitespace-nowrap rounded-[10px] border px-3 text-[13px] font-medium"
      style={{ borderColor: ch.color, background: hot ? ch.color : "transparent", color: hot ? "#0f1115" : ch.color }}
    >
      <DownloadIcon />
      <span className="sm:hidden">
        <span className="sr-only">Download </span>Resume
      </span>
      <span className="hidden sm:inline">Download resume</span>
      <span className="sr-only">: {ch.name}, PDF</span>
    </a>
  );
}

type LaneProps = {
  id: LaneId;
  selectedId: string;
  onSelect: (clip: Placed) => void;
  onKey: (event: KeyboardEvent<HTMLButtonElement>, clip: Placed) => void;
  register: (id: string, el: HTMLButtonElement | null) => void;
};

function Lane({ id, selectedId, onSelect, onKey, register }: LaneProps) {
  const { on, single } = useMix();
  const meta = LANE_META[id];
  const { placed, rows } = LANES[id];
  const lit = meta.pillar ? on[meta.pillar] : true;

  return (
    <li className={cn(LANE_GRID, "items-center")}>
      {/* Pinned while the timeline scrolls sideways on small screens. */}
      <div data-lane-label className="sticky left-0 z-30 flex flex-col items-start gap-2 self-stretch justify-center bg-night">
        <div>
          <p className="font-mono text-[11px]" style={{ color: meta.color }}>
            TRACK {pad(meta.num)}
          </p>
          <h3 className="mt-1 font-display text-[17px] font-bold text-night-fg">{meta.name}</h3>
        </div>
        {meta.pillar && <ExportLink id={meta.pillar} hot={single === meta.pillar} />}
      </div>
      <ul
        aria-label={`${meta.name} timeline`}
        className="relative rounded-[10px] border border-night-line bg-night-surface transition-opacity duration-300"
        style={{ height: laneHeight(rows), opacity: lit ? 1 : 0.35 }}
      >
        {placed.map((clip) => {
          const selected = clip.id === selectedId;
          return (
            <li key={clip.id} className="absolute" style={{ left: pct(clip.left), width: pct(clip.width), top: 8 + clip.row * ROW_PX, height: CLIP_PX }}>
              <button
                ref={(el) => register(clip.id, el)}
                id={`clip-${clip.id}`}
                type="button"
                data-clip
                tabIndex={selected ? 0 : -1}
                aria-current={selected ? "true" : undefined}
                aria-controls={INSPECTOR_ID}
                aria-describedby="resume-timeline-keys"
                onClick={() => onSelect(clip)}
                onKeyDown={(event) => onKey(event, clip)}
                className="group relative block size-full cursor-pointer overflow-hidden rounded-md text-left text-night-fg"
              >
                <span className={cn("flex h-5 whitespace-nowrap", clip.alignEnd && "justify-end")}>
                  {/* Painted over the today marker and playhead so labels stay legible. */}
                  <span
                    className={cn(
                      "relative z-20 inline-flex items-baseline gap-1.5 bg-night-surface text-xs font-semibold",
                      clip.alignEnd ? "pl-1" : "pr-1"
                    )}
                  >
                    <span className="underline-offset-4 group-hover:underline" style={{ color: selected ? meta.color : undefined }}>
                      {clip.title}
                    </span>
                    <span className="sr-only">,</span>
                    <span className="font-mono text-[11px] font-normal text-night-body">{clip.label}</span>
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute bottom-2 border transition-opacity duration-200 motion-reduce:transition-none",
                    clip.point ? "size-3 rotate-45 rounded-[2px]" : "h-3 rounded-[3px]",
                    selected ? "opacity-100" : "opacity-45 group-hover:opacity-80"
                  )}
                  style={{
                    left: clip.point ? `calc(${pct(clip.barLeft)} + 2px)` : pct(clip.barLeft),
                    width: clip.point ? undefined : pct(clip.barWidth),
                    borderColor: meta.color,
                    background: meta.color,
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

function TransportButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-controls={INSPECTOR_ID}
      onClick={onClick}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[10px] text-night-fg transition-colors duration-200 hover:bg-night-raised"
    >
      {children}
    </button>
  );
}

const ICON = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;

/** Sequence position of the clip that starts nearest `at`. Ties keep the current clip. */
function nearestStart(at: number, current: number): number {
  let best = current;
  let gap = Math.abs(SEQUENCE[current].at - at);
  SEQUENCE.forEach((clip, i) => {
    const d = Math.abs(clip.at - at);
    if (d < gap - 1e-9) {
      best = i;
      gap = d;
    }
  });
  return best;
}

/** Nearest clip in another lane, by where the bars start. */
function nearestIn(lane: LaneId, at: number): Placed {
  return LANES[lane].placed.reduce((best, clip) => (Math.abs(clip.at - at) < Math.abs(best.at - at) ? clip : best));
}

/** Resume: a DAW multitrack. Each clip opens its details below; every craft lane exports its own PDF. */
export function SessionResume() {
  const today = useSyncExternalStore<number | null>(noopSubscribe, todayPosition, () => null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [announce, setAnnounce] = useState("");
  /** Where the playhead sits while it is being dragged, 0..1. Null when it rests on a clip. */
  const [scrub, setScrub] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const handle = useRef<HTMLSpanElement>(null);
  const grab = useRef<number | null>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const current = SEQUENCE[index];
  const meta = LANE_META[current.lane];

  const register = (id: string, el: HTMLButtonElement | null) => {
    if (el) buttons.current.set(id, el);
    else buttons.current.delete(id);
  };

  /** Scroll the timeline sideways so a clip clears the pinned label column. Never scrolls the page. */
  function reveal(id: string) {
    const box = scroller.current;
    const el = buttons.current.get(id);
    const labels = box?.querySelector("[data-lane-label]");
    if (!box || !el || !labels) return;
    const view = box.getBoundingClientRect();
    const clip = el.getBoundingClientRect();
    const floor = labels.getBoundingClientRect().right + 16;
    let delta = 0;
    if (clip.left < floor) delta = clip.left - floor - 12;
    else if (clip.right > view.right) delta = Math.min(clip.right - view.right + 12, clip.left - floor);
    if (delta) box.scrollBy({ left: delta, behavior: reducedMotion() ? "auto" : "smooth" });
  }

  /** Select by sequence position. `focus` moves keyboard focus along with it. */
  function go(next: number, how: { focus?: boolean; speak?: boolean } = {}) {
    const clip = SEQUENCE[(next + COUNT) % COUNT];
    setIndex(SEQUENCE.indexOf(clip));
    if (how.focus) buttons.current.get(clip.id)?.focus({ preventScroll: true });
    if (how.speak) setAnnounce(`${clip.title}, ${clip.label}`);
    reveal(clip.id);
  }

  function stop() {
    setPlaying(false);
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, clip: Placed) {
    const at = SEQUENCE.indexOf(clip);
    const lane = LANE_ORDER.indexOf(clip.lane);
    let target: number | null = null;
    if (event.key === "ArrowRight") target = at + 1;
    else if (event.key === "ArrowLeft") target = at - 1;
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = COUNT - 1;
    else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const other = LANE_ORDER[lane + (event.key === "ArrowDown" ? 1 : -1)];
      if (other) target = SEQUENCE.indexOf(nearestIn(other, clip.at));
      else target = at;
    }
    if (target === null) return;
    event.preventDefault();
    stop();
    go(target, { focus: true });
  }

  function fractionAt(clientX: number): number {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return current.at;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  /** Drag the playhead, or press on the ruler to jump there. Selection snaps to the nearest clip start. */
  function startScrub(event: PointerEvent<HTMLElement>, fromHandle: boolean) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    handle.current?.focus({ preventScroll: true });
    stop();
    // Grabbing the handle keeps it under the pointer; the ruler jumps straight to the pointer.
    grab.current = fromHandle ? fractionAt(event.clientX) - current.at : 0;
    moveScrub(event);
  }

  function moveScrub(event: PointerEvent<HTMLElement>) {
    if (grab.current === null) return;
    const at = Math.min(1, Math.max(0, fractionAt(event.clientX) - grab.current));
    setScrub(at);
    setIndex(nearestStart(at, index));
  }

  function endScrub() {
    if (grab.current === null) return;
    grab.current = null;
    setScrub(null);
    setAnnounce(`${current.title}, ${current.label}`);
    reveal(current.id);
  }

  const scrubHandlers = {
    onPointerMove: moveScrub,
    onPointerUp: endScrub,
    onPointerCancel: endScrub,
    onLostPointerCapture: endScrub,
  };

  function onPlayheadKey(event: KeyboardEvent<HTMLSpanElement>) {
    let target: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") target = Math.min(COUNT - 1, index + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") target = Math.max(0, index - 1);
    else if (event.key === "Home") target = 0;
    else if (event.key === "End") target = COUNT - 1;
    if (target === null) return;
    event.preventDefault();
    stop();
    go(target);
  }

  // Play walks the session one clip at a time and stops on the last one.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (index >= COUNT - 1) setPlaying(false);
      else go(index + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
    // go only reads refs and stable module data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index]);

  function togglePlay() {
    if (playing) return stop();
    if (index >= COUNT - 1) go(0);
    setPlaying(true);
  }

  return (
    <section
      id="resume"
      aria-labelledby="resume-heading"
      className="scroll-mt-20 lg:scroll-mt-28 border-y border-night-line bg-night-surface"
    >
      <div className={cn(SHELL, "py-16 md:py-24")}>
        <p className={EYEBROW}>{"// resume · the session"}</p>
        <h2 id="resume-heading" className={H2}>
          The short version.
        </h2>
        <p className="mt-3.5 max-w-[640px] text-base leading-relaxed text-night-muted">
          Download a resume for any track, or shape your own mix in the{" "}
          <a href="#contact" className="text-night-fg underline decoration-night-line-strong underline-offset-4 hover:decoration-night-fg">
            contact section
          </a>
          . Select any clip to read what I did there.
        </p>

        <div
          ref={scroller}
          role="region"
          aria-label="Resume timeline"
          className="mt-9 overflow-x-auto rounded-3xl border border-night-line bg-night"
        >
          <div className="min-w-[960px] px-5 py-6 sm:px-8 sm:py-7">
            <div aria-hidden="true" className={LANE_GRID}>
              <span className="sticky left-0 z-30 -mr-4 bg-night" />
              {/* The ruler: press anywhere on it to move the playhead there. */}
              <div
                onPointerDown={(event) => startScrub(event, false)}
                {...scrubHandlers}
                className="relative h-7 cursor-pointer touch-none select-none border-b border-night-line-strong font-mono text-[11px] text-night-muted"
              >
                {TICKS.map((year) => (
                  <span key={year} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: pct((year - TIMELINE.from) / SPAN) }}>
                    {year}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className={cn(LANE_GRID, "pointer-events-none absolute inset-0 z-10")}>
                <span />
                <span ref={track} className="relative">
                  {today !== null && (
                    <span aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-night-fg opacity-50" style={{ left: pct(today) }} />
                  )}
                  {/* Playhead: follows the selected clip, and drags to scrub through the session. */}
                  <span
                    data-playhead
                    className={cn(
                      "absolute -top-3.5 bottom-0 w-0.5",
                      scrub === null &&
                        "transition-[left] duration-300 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
                    )}
                    style={{ left: pct(scrub ?? current.at), background: meta.color }}
                  >
                    <span
                      ref={handle}
                      role="slider"
                      tabIndex={0}
                      aria-label="Playhead"
                      aria-valuemin={1}
                      aria-valuemax={COUNT}
                      aria-valuenow={index + 1}
                      aria-valuetext={`${current.title}, ${current.label}`}
                      aria-controls={INSPECTOR_ID}
                      onPointerDown={(event) => startScrub(event, true)}
                      {...scrubHandlers}
                      onKeyDown={onPlayheadKey}
                      className={cn(
                        "group/playhead pointer-events-auto absolute -left-[21px] -top-4 flex size-11 touch-none select-none justify-center rounded-lg",
                        scrub === null ? "cursor-grab" : "cursor-grabbing"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-4 size-3 rotate-45 rounded-[2px] transition-transform duration-200 motion-reduce:transition-none",
                          scrub === null ? "group-hover/playhead:scale-125" : "scale-125"
                        )}
                        style={{ background: meta.color }}
                      />
                    </span>
                  </span>
                </span>
              </div>
              <ul className="mt-3.5 flex flex-col gap-3">
                {LANE_ORDER.map((id) => (
                  <Lane
                    key={id}
                    id={id}
                    selectedId={current.id}
                    onSelect={(clip) => {
                      stop();
                      go(SEQUENCE.indexOf(clip));
                    }}
                    onKey={onKey}
                    register={register}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div role="group" aria-label="Timeline transport" className="inline-flex gap-1 rounded-[14px] border border-night-line bg-night p-1">
            <TransportButton label="Previous clip" onClick={() => { stop(); go(index - 1, { speak: true }); }}>
              <svg {...ICON}><path d="M6 5h2v14H6zM20 5v14L9.5 12z" /></svg>
            </TransportButton>
            <TransportButton label={playing ? "Pause" : "Play the session"} onClick={togglePlay}>
              {playing ? (
                <svg {...ICON}><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
              ) : (
                <svg {...ICON}><path d="M8 5v14l11-7z" /></svg>
              )}
            </TransportButton>
            <TransportButton label="Next clip" onClick={() => { stop(); go(index + 1, { speak: true }); }}>
              <svg {...ICON}><path d="M16 5h2v14h-2zM4 5v14l10.5-7z" /></svg>
            </TransportButton>
          </div>
          <p className="font-mono text-[13px] text-night-muted">
            <span aria-hidden="true">
              {pad(index + 1)} / {pad(COUNT)}
            </span>
            <span className="sr-only">
              Clip {index + 1} of {COUNT}
            </span>
          </p>
          <p aria-hidden="true" className="hidden font-mono text-xs text-night-muted md:block">
            drag the playhead · ← → move through time · ↑ ↓ change tracks
          </p>
          <p aria-hidden="true" className="font-mono text-xs text-night-muted md:hidden">
            drag the playhead or scroll the timeline →
          </p>
          <p id="resume-timeline-keys" className="sr-only">
            Left and right arrows move through time. Up and down arrows change tracks.
          </p>
          <p aria-live={playing ? "off" : "polite"} className="sr-only">
            {announce}
          </p>
        </div>

        <ResumeInspector id={INSPECTOR_ID} clip={current} lane={meta} />
      </div>
    </section>
  );
}
