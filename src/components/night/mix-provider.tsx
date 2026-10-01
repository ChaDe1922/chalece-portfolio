"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { pillarIds, type PillarId } from "@/data/pillars";
import { CHANNELS, MASTER_ACCENT, ORDER } from "@/data/mix";

type OnMap = Record<PillarId, boolean>;
/** Fader positions, 0..100. A channel that is off keeps its level for when it comes back on. */
type LevelMap = Record<PillarId, number>;
type MixState = { on: OnMap; levels: LevelMap; open: number | null };

const ALL_ON: OnMap = { "music-tech": true, software: true, curriculum: true };
export const DEFAULT_LEVEL = 75;
/** Below this, a channel coming back on returns to the default level instead. */
const MIN_RESTORE = 30;
const DEFAULT_LEVELS: LevelMap = { "music-tech": DEFAULT_LEVEL, software: DEFAULT_LEVEL, curriculum: DEFAULT_LEVEL };
const INITIAL: MixState = { on: ALL_ON, levels: DEFAULT_LEVELS, open: null };

function soloMap(id: PillarId): OnMap {
  return { "music-tech": id === "music-tech", software: id === "software", curriculum: id === "curriculum" };
}

function isPillarId(value: string | null | undefined): value is PillarId {
  return !!value && (pillarIds as readonly string[]).includes(value);
}

/*
 * A tiny module store so the homepage can read ?pillar= on first client
 * render without a setState-in-effect, and so every section shares one mix.
 * The server snapshot is always the full mix.
 */
let current: MixState | null = null;
const listeners = new Set<() => void>();

function readInitial(): MixState {
  const param = new URLSearchParams(window.location.search).get("pillar");
  return isPillarId(param) ? { ...INITIAL, on: soloMap(param) } : INITIAL;
}

function getSnapshot(): MixState {
  if (!current) current = readInitial();
  return current;
}

function getServerSnapshot(): MixState {
  return INITIAL;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Levels with any channel that is coming back on lifted to an audible level. */
function restore(on: OnMap, levels: LevelMap): LevelMap {
  const next = { ...levels };
  for (const id of ORDER) if (on[id] && next[id] < MIN_RESTORE) next[id] = DEFAULT_LEVEL;
  return next;
}

function write(next: MixState) {
  const prev = current;
  current = next;
  // Keep a soloed pillar shareable on the homepage only. Only touch the URL when
  // the set of channels changes: a fader drag writes many times a second, and
  // browsers throttle replaceState.
  const changed = !prev || ORDER.some((id) => prev.on[id] !== next.on[id]);
  if (changed && window.location.pathname === "/") {
    const ids = ORDER.filter((id) => next.on[id]);
    const url = new URL(window.location.href);
    if (ids.length === 1) url.searchParams.set("pillar", ids[0]);
    else url.searchParams.delete("pillar");
    window.history.replaceState(window.history.state, "", url);
  }
  listeners.forEach((l) => l());
}

type MixContextValue = {
  on: OnMap;
  levels: LevelMap;
  /** Pillars switched on, in console order. */
  ids: PillarId[];
  /** The one pillar on, if exactly one is. */
  single: PillarId | null;
  full: boolean;
  /** Soloed pillar colour, or the master coral. */
  accent: string;
  open: number | null;
  solo: (id: PillarId) => void;
  fullMix: () => void;
  toggle: (id: PillarId) => void;
  /** Move a fader. 0 switches the channel off, anything above switches it on. */
  setLevel: (id: PillarId, level: number) => void;
  setOpen: (index: number | null) => void;
  /** Solo if not soloed, else back to the full mix. */
  soloOrFull: (id: PillarId) => void;
  /** Recall a saved mix. A level of 0 switches that channel off. */
  applyPreset: (levels: LevelMap) => void;
};

const MixContext = createContext<MixContextValue | null>(null);

export function useMix(): MixContextValue {
  const ctx = useContext(MixContext);
  if (!ctx) throw new Error("useMix must be used inside MixProvider");
  return ctx;
}

/** Night Session theme wrapper and shared console state. */
export function MixProvider({ className, children }: { className?: string; children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();
  const routeSegment = pathname.split("/")[1];
  const routePillar = isPillarId(routeSegment) ? routeSegment : null;

  const solo = useCallback((id: PillarId) => {
    const on = soloMap(id);
    write({ on, levels: restore(on, getSnapshot().levels), open: null });
  }, []);
  const fullMix = useCallback(() => write({ on: ALL_ON, levels: restore(ALL_ON, getSnapshot().levels), open: null }), []);
  const toggle = useCallback((id: PillarId) => {
    const prev = getSnapshot();
    const on = { ...prev.on, [id]: !prev.on[id] };
    write({ on, levels: restore(on, prev.levels), open: null });
  }, []);
  const setLevel = useCallback((id: PillarId, level: number) => {
    const prev = getSnapshot();
    const value = Math.round(Math.min(100, Math.max(0, level)));
    const lit = value > 0;
    if (prev.on[id] === lit && (!lit || prev.levels[id] === value)) return;
    write({
      on: { ...prev.on, [id]: lit },
      levels: lit ? { ...prev.levels, [id]: value } : prev.levels,
      open: prev.on[id] === lit ? prev.open : null,
    });
  }, []);
  const setOpen = useCallback((index: number | null) => write({ ...getSnapshot(), open: index }), []);
  const applyPreset = useCallback((preset: LevelMap) => {
    const prev = getSnapshot();
    const on = { ...prev.on };
    const levels = { ...prev.levels };
    for (const id of ORDER) {
      const value = Math.round(Math.min(100, Math.max(0, preset[id])));
      on[id] = value > 0;
      if (value > 0) levels[id] = value;
    }
    write({ on, levels, open: null });
  }, []);

  const value = useMemo<MixContextValue>(() => {
    // A pillar page is that pillar soloed.
    const on = routePillar ? soloMap(routePillar) : state.on;
    const ids = ORDER.filter((id) => on[id]);
    const single = ids.length === 1 ? ids[0] : null;
    return {
      on,
      levels: state.levels,
      ids,
      single,
      full: ids.length === 3,
      accent: single ? CHANNELS[single].color : MASTER_ACCENT,
      open: state.open,
      solo,
      fullMix,
      toggle,
      setLevel,
      setOpen,
      soloOrFull: (id) => (single === id ? fullMix() : solo(id)),
      applyPreset,
    };
  }, [routePillar, state, solo, fullMix, toggle, setLevel, setOpen, applyPreset]);

  return (
    <MixContext.Provider value={value}>
      <div
        className={`dark theme-night flex min-h-full flex-1 flex-col font-sans ${className ?? ""}`}
        style={{ "--signal": value.accent } as CSSProperties}
      >
        {children}
      </div>
    </MixContext.Provider>
  );
}
