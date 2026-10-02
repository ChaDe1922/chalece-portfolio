/**
 * The /lab index as one short course: lessons grouped by craft, in course
 * order. Pure data helpers, safe for both the server page and client parts.
 * Copy style rule: no em dashes anywhere.
 */

import { CHANNELS } from "@/data/mix";
import type { PillarId } from "@/data/pillars";

/** Course order: the short scenario first, then software, then music. */
export const CRAFT_ORDER: PillarId[] = ["curriculum", "software", "music-tech"];

const CRAFT_NAMES: Record<PillarId, string> = {
  curriculum: "Learning design",
  software: "Software",
  "music-tech": "Music technology",
};

/** A hex colour at an alpha, for tinted thumbnails and soft scrubber steps. */
function alpha(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export type Craft = { name: string; color: string; tint: string; soft: string };

export const CRAFTS = Object.fromEntries(
  CRAFT_ORDER.map((id) => {
    const color = CHANNELS[id].color;
    return [id, { name: CRAFT_NAMES[id], color, tint: alpha(color, 0.14), soft: alpha(color, 0.38) }];
  })
) as Record<PillarId, Craft>;

/** One lesson, as plain props the server page hands to the client. */
export type CourseLesson = {
  id: string;
  href: string;
  external: boolean;
  eyebrow: string;
  title: string;
  blurb: string;
  craft: PillarId;
  short: string;
  minutes: number;
  slides: number;
  checkpoint: number;
  objectives: string[];
  icon: string;
  /** Position in the course, "01" to "08". */
  n: string;
};

export type CourseGroup = Craft & { key: PillarId; items: CourseLesson[]; minutes: number };

export function groupLessons(lessons: CourseLesson[]): CourseGroup[] {
  return CRAFT_ORDER.map((key) => {
    const items = lessons.filter((l) => l.craft === key);
    return { key, ...CRAFTS[key], items, minutes: items.reduce((t, l) => t + l.minutes, 0) };
  });
}

/** Lessons in course order, numbered. */
export function courseOrder(lessons: Omit<CourseLesson, "n">[]): CourseLesson[] {
  return CRAFT_ORDER.flatMap((key) => lessons.filter((l) => l.craft === key)).map((l, i) => ({
    ...l,
    n: String(i + 1).padStart(2, "0"),
  }));
}

export const minLabel = (min: number) => `${min} min`;
export const timeLabel = (min: number) => `${String(min).padStart(2, "0")}:00`;
export const countLabel = (n: number) => `${n} ${n === 1 ? "lesson" : "lessons"}`;

export function metaLine(l: CourseLesson): string {
  const slides = l.slides ? `${l.slides} slides` : "1 scenario";
  return `${minLabel(l.minutes)} · ${slides}${l.checkpoint ? " · checkpoint quiz" : ""}`;
}

export function scrubLabel(l: CourseLesson): string {
  if (!l.slides) return "One scenario";
  return l.checkpoint ? `${l.slides} slides, checkpoint at slide ${l.checkpoint}` : `${l.slides} slides`;
}
