/**
 * The /lab lessons, in carousel order. Each lesson is tagged with the pillar it
 * proves; every lesson is also curriculum work, so `alsoIn` says so.
 * Copy style rule: no em dashes anywhere.
 */

import type { LessonId } from "@/components/lab/lesson-animation";
import { vibeCodingLab } from "@/data/vibe-coding-lab";
import { recursionLab } from "@/data/recursion-lab";
import { gitLab } from "@/data/git-lab";
import { soundLab } from "@/data/sound-lab";
import { fourierLab } from "@/data/fourier-lab";
import type { PillarId } from "@/data/pillars";

export type Lab = {
  id: LessonId;
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
  pillar: PillarId;
  alsoIn?: PillarId[];
  external?: boolean;
  /** Outline label. */
  short: string;
  /** About how long the lesson takes. */
  minutes: number;
  /** Slides in the deck. 0 means one scenario, not a deck. */
  slides: number;
  /** Slide that holds the checkpoint quiz. 0 means none. */
  checkpoint: number;
  /** Read from the lesson's own data, never copied. */
  objectives: readonly string[];
  /** Line icon for the card thumbnail, in a 160 by 90 box. */
  icon: string;
};

export const labs: Lab[] = [
  {
    id: "urgent",
    // Explicit index.html: works in both `next dev` and on Vercel. A bare
    // `/urgent-request/` 308-redirects to a 404 under `next dev` (public/ dir-index quirk).
    href: "/urgent-request/index.html",
    eyebrow: "Security awareness",
    title: "The Urgent Request",
    blurb:
      "Read a real-looking urgent message from your CFO, decide how to respond, and learn to spot the social-engineering red flags before you act.",
    pillar: "curriculum",
    external: true,
    short: "The Urgent Request",
    minutes: 3,
    slides: 0,
    checkpoint: 0,
    objectives: [],
    icon: "M40 28h80v44H40z M40 28l40 26 40-26 M136 14v18 M136 40v1",
  },
  {
    id: "vibe",
    href: "/lab/vibe-coding",
    eyebrow: "Vibe coding · ages 13 to 15",
    title: vibeCodingLab.meta.title,
    blurb:
      "Pick what to build, then direct, test, and improve a real working example with the say, test, adjust loop.",
    pillar: "software",
    alsoIn: ["curriculum"],
    short: "Vibe Coding",
    minutes: 5,
    slides: 5,
    checkpoint: 0,
    objectives: [],
    icon: "M22 24h56v32H46L34 66V56H22z M104 28L92 45l12 17 M124 28l12 17-12 17",
  },
  {
    id: "recursion",
    href: "/lab/recursion",
    eyebrow: "Computer science",
    title: recursionLab.meta.title,
    blurb:
      "Step into a mirror, open nested dolls, write your first recursive function, watch the call stack, then grow a fractal tree.",
    pillar: "software",
    alsoIn: ["curriculum"],
    short: "Recursion",
    minutes: 6,
    slides: 10,
    checkpoint: 9,
    objectives: recursionLab.slides.intro.objectives,
    icon: "M40 12h80v66H40z M52 22h56v46H52z M63 31h34v28H63z M73 39h14v12H73z",
  },
  {
    id: "git",
    href: "/lab/git",
    eyebrow: "Engineering · beginner friendly",
    title: gitLab.meta.title,
    blurb:
      "No terminal needed. Take snapshots on a timeline and travel back, then see what Git really does: photos, movable labels, and merge versus rebase, all animated.",
    pillar: "software",
    alsoIn: ["curriculum"],
    short: "Git internals",
    minutes: 10,
    slides: 11,
    checkpoint: 10,
    objectives: gitLab.slides.intro.objectives,
    icon: "M30 62H130 M56 62C68 62 68 30 82 30H108 M26 62a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M52 62a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M96 62a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M126 62a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M78 30a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M104 30a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  },
  {
    id: "sound",
    href: "/lab/sound",
    eyebrow: "Music technology · beginner friendly",
    title: soundLab.meta.title,
    blurb:
      "Hear what a sound actually is. Shape its pitch, loudness, waveshape, and envelope, then build a synth and play a short tune. Real audio, right in your browser.",
    pillar: "music-tech",
    alsoIn: ["curriculum"],
    short: "Anatomy of a sound",
    minutes: 10,
    slides: 9,
    checkpoint: 8,
    objectives: soundLab.slides.intro.objectives,
    icon: "M10 45C25 12 40 12 55 45S85 78 100 45S130 12 150 45",
  },
  {
    id: "spectrum",
    href: "/lab/spectrum",
    eyebrow: "Music technology · signals · Part 1",
    title: fourierLab.lessonOne.title,
    blurb:
      "How sound becomes a spectrum. Hear why a flute and a violin playing the same note sound different, read a sound as a waveform and a spectrum, build a tone from pure sines, and find bass, mids, and treble.",
    pillar: "music-tech",
    alsoIn: ["curriculum"],
    // Part 1 objectives cover the whole series; the first three are this part.
    short: "Fourier, Part 1",
    minutes: 15,
    slides: 15,
    checkpoint: 14,
    objectives: fourierLab.slides.intro.objectives.slice(0, 3),
    icon: "M30 76V56 M45 76V30 M60 76V46 M75 76V18 M90 76V50 M105 76V38 M120 76V60 M135 76V66",
  },
  {
    id: "fourier",
    href: "/lab/fourier",
    eyebrow: "Music technology · signals · Part 2",
    title: fourierLab.lessonTwo.title,
    blurb:
      "How a computer calculates that spectrum. See where samples come from, build a test wave, multiply and add sample by sample, read the DFT formula, and calculate one frequency by hand.",
    pillar: "music-tech",
    alsoIn: ["curriculum"],
    short: "Fourier, Part 2",
    minutes: 18,
    slides: 12,
    checkpoint: 11,
    objectives: fourierLab.slides.introTwo.objectives,
    icon: "M10 45C25 15 40 15 55 45S85 75 100 45S130 15 150 45 M25 45V26 M40 45V22 M70 45V64 M85 45V68 M115 45V26 M130 45V22",
  },
  {
    id: "audio-tools",
    href: "/lab/audio-tools",
    eyebrow: "Music technology · signals · Part 3",
    title: fourierLab.lessonThree.title,
    blurb:
      "Use it on your gear. Shape sound with EQ, read a headphone curve, see a spectrogram, meet noise cancelling and song recognition, then solve sound mysteries to prove you can read a sound.",
    pillar: "music-tech",
    alsoIn: ["curriculum"],
    short: "Fourier, Part 3",
    minutes: 15,
    slides: 13,
    checkpoint: 6,
    objectives: fourierLab.slides.introThree.objectives,
    icon: "M10 52C35 52 40 26 60 26S80 62 100 62S125 38 150 38 M56 26a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M96 62a4 4 0 1 0 8 0a4 4 0 1 0-8 0",
  },
];

/** Labs that belong to a pillar, primary or secondary. */
export function labsForPillar(pillar: PillarId): Lab[] {
  return labs.filter((lab) => lab.pillar === pillar || lab.alsoIn?.includes(pillar));
}
