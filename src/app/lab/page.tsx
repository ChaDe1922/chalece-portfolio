import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { site } from "@/data/site";
import { recursionLab } from "@/data/recursion-lab";
import { vibeCodingLab } from "@/data/vibe-coding-lab";
import { gitLab } from "@/data/git-lab";
import { soundLab } from "@/data/sound-lab";
import { fourierLab } from "@/data/fourier-lab";
import { TeachingBeliefs } from "@/components/teaching-beliefs";
import { LessonCarousel, type Lab } from "@/components/lab/lesson-carousel";

export const metadata: Metadata = {
  title: { absolute: "Interactive Lessons | Chalece DeLaCoudray" },
  description:
    "Hands-on, in-browser lessons by Chalece DeLaCoudray. Spot the red flags in a phishing scenario, step through recursion, see what Git really does underneath, or vibe code your first interactive beat maker.",
  alternates: { canonical: "/lab" },
  openGraph: {
    type: "website",
    url: `${site.url}/lab`,
    title: "Interactive Lessons by Chalece DeLaCoudray",
    description: "Hands-on, in-browser lessons. Pick one and learn by doing.",
  },
};

const labs: Lab[] = [
  {
    id: "urgent",
    // Explicit index.html: works in both `next dev` and on Vercel. A bare
    // `/urgent-request/` 308-redirects to a 404 under `next dev` (public/ dir-index quirk).
    href: "/urgent-request/index.html",
    eyebrow: "Security awareness",
    title: "The Urgent Request",
    blurb:
      "Read a real-looking urgent message from your CFO, decide how to respond, and learn to spot the social-engineering red flags before you act.",
    external: true,
  },
  {
    id: "vibe",
    href: "/lab/vibe-coding",
    eyebrow: "Vibe coding · ages 13 to 15",
    title: vibeCodingLab.meta.title,
    blurb:
      "Pick what to build, then direct, test, and improve a real working example with the say, test, adjust loop.",
  },
  {
    id: "recursion",
    href: "/lab/recursion",
    eyebrow: "Computer science",
    title: recursionLab.meta.title,
    blurb:
      "Step into a mirror, open nested dolls, write your first recursive function, watch the call stack, then grow a fractal tree.",
  },
  {
    id: "git",
    href: "/lab/git",
    eyebrow: "Engineering · beginner friendly",
    title: gitLab.meta.title,
    blurb:
      "No terminal needed. Take snapshots on a timeline and travel back, then see what Git really does: photos, movable labels, and merge versus rebase, all animated.",
  },
  {
    id: "sound",
    href: "/lab/sound",
    eyebrow: "Music technology · beginner friendly",
    title: soundLab.meta.title,
    blurb:
      "Hear what a sound actually is. Shape its pitch, loudness, waveshape, and envelope, then build a synth and play a short tune. Real audio, right in your browser.",
  },
  {
    id: "spectrum",
    href: "/lab/spectrum",
    eyebrow: "Music technology · signals · Part 1",
    title: fourierLab.lessonOne.title,
    blurb:
      "How sound becomes a spectrum. Hear why a flute and a violin playing the same note sound different, read a sound as a waveform and a spectrum, build a tone from pure sines, and find bass, mids, and treble.",
  },
  {
    id: "fourier",
    href: "/lab/fourier",
    eyebrow: "Music technology · signals · Part 2",
    title: fourierLab.lessonTwo.title,
    blurb:
      "How a computer calculates that spectrum. See where samples come from, build a test wave, multiply and add sample by sample, read the DFT formula, and calculate one frequency by hand.",
  },
  {
    id: "audio-tools",
    href: "/lab/audio-tools",
    eyebrow: "Music technology · signals · Part 3",
    title: fourierLab.lessonThree.title,
    blurb:
      "Use it on your gear. Shape sound with EQ, read a headphone curve, see a spectrogram, meet noise cancelling and song recognition, then solve sound mysteries to prove you can read a sound.",
  },
];

export default function LabIndexPage() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-3xl flex-col justify-center px-5 py-16 md:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">Interactive lessons</p>
      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Learn by doing.
      </h1>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Short, hands-on lessons that run right in your browser. No setup, no account. Pick one and
        start clicking.
      </p>

      {/* The lessons, as a spotlight carousel. */}
      <LessonCarousel labs={labs} />

      {/* Andragogy beliefs, below the lessons, as interactive dropdowns. */}
      <div className="mt-16 border-t border-border pt-10">
        <TeachingBeliefs />
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
