/**
 * Mix keys for the resume route. A key names the crafts that are on, loudest
 * first, each with its tier: "c3-s2-m1". Order follows the raw level, so a
 * tier never rises along a key. Every reachable key is prerendered at build
 * as /resume/<key>, so the download link always points at a file that exists.
 */

import type { PillarId } from "./pillars";
import type { Tier } from "./resume-bank";
import { ORDER } from "./mix";

const LETTER: Record<PillarId, string> = { "music-tech": "m", software: "s", curriculum: "c" };
const BY_LETTER: Record<string, PillarId> = { m: "music-tech", s: "software", c: "curriculum" };

/** 1 to 33 is quiet, 34 to 66 is mid, 67 to 100 is loud. */
export function levelToTier(level: number): Tier {
  if (level <= 33) return 1;
  if (level <= 66) return 2;
  return 3;
}

export type MixPart = { id: PillarId; tier: Tier };

/** The crafts that are on, loudest first. Ties follow the console order. */
export function mixParts(levels: Record<PillarId, number>, on: Record<PillarId, boolean>): MixPart[] {
  return ORDER.filter((id) => on[id] && levels[id] > 0)
    .map((id, i) => ({ id, i, level: levels[id] }))
    .sort((a, b) => b.level - a.level || a.i - b.i)
    .map(({ id, level }) => ({ id, tier: levelToTier(level) }));
}

export function partsToKey(parts: readonly MixPart[]): string {
  return parts.map((p) => `${LETTER[p.id]}${p.tier}`).join("-");
}

/** The key for a console state, or null when every channel is off. */
export function mixKey(levels: Record<PillarId, number>, on: Record<PillarId, boolean>): string | null {
  const parts = mixParts(levels, on);
  return parts.length ? partsToKey(parts) : null;
}

/** The parts a key names, or null when the key is not a valid mix. */
export function parseMixKey(key: string): MixPart[] | null {
  const parts: MixPart[] = [];
  for (const token of key.split("-")) {
    const m = /^([msc])([123])$/.exec(token);
    if (!m) return null;
    const id = BY_LETTER[m[1]];
    const tier = Number(m[2]) as Tier;
    if (parts.some((p) => p.id === id)) return null;
    if (parts.length && tier > parts[parts.length - 1].tier) return null;
    parts.push({ id, tier });
  }
  return parts.length ? parts : null;
}

function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [items.slice()];
  return items.flatMap((x, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [x, ...rest]));
}

function subsets<T>(items: readonly T[]): T[][] {
  return items.reduce<T[][]>((acc, x) => acc.concat(acc.map((s) => [...s, x])), [[]]).filter((s) => s.length > 0);
}

const TIERS: Tier[] = [1, 2, 3];

/** Every reachable mix: 9 solos, 36 pairs, 60 full mixes. */
export const ALL_MIX_KEYS: string[] = subsets(ORDER).flatMap((set) =>
  permutations(set).flatMap((order) =>
    order
      .reduce<MixPart[][]>(
        (acc, id) =>
          acc.flatMap((parts) =>
            TIERS.filter((t) => !parts.length || t <= parts[parts.length - 1].tier).map((tier) => [...parts, { id, tier }]),
          ),
        [[]],
      )
      .map(partsToKey),
  ),
);

export function resumeHref(key: string): string {
  return `/resume/${key}`;
}

/** What the contact mixer draws as its page thumbnail: titles and counts only. */
export type PreviewEntry = { title: string; kind: "role" | "project"; minTier: Tier; bullets: number };
export type CraftPreview = { section: string; title: string; soloHeadline: string; skills: number; entries: PreviewEntry[] };
export type ResumePreview = Record<PillarId, CraftPreview>;
