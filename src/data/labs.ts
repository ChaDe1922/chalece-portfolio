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
  },
];

/** Labs that belong to a pillar, primary or secondary. */
export function labsForPillar(pillar: PillarId): Lab[] {
  return labs.filter((lab) => lab.pillar === pillar || lab.alsoIn?.includes(pillar));
}
