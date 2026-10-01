/**
 * The three equal pillars of the portfolio: names, one-liners, headline stats,
 * track resumes, and SEO. Pillar pages, the homepage trio, chips, and filters
 * all read from here.
 *
 * No runtime imports: the check script loads this file directly with Node, so
 * icons are stored by name and mapped to components in pillar-icon.tsx.
 * Accent class strings are full literals so Tailwind's source scan sees them.
 * Never build `bg-pillar-${id}` dynamically.
 *
 * Copy style rule: no em dashes, no parentheses in public copy.
 * Copy source: Marketing OS WF-024 messaging, prepared, awaiting approval. Order
 * follows the umbrella line: create, build, teach.
 */

import type { Stat } from "./stats";

export const pillarIds = ["music-tech", "software", "curriculum"] as const;
export type PillarId = (typeof pillarIds)[number];

export type PillarIconName = "BookOpenText" | "AudioWaveform" | "SquareTerminal";

export type PillarAccent = {
  /** Solid fill: stripe, heading rule, active filter. */
  solid: string;
  /** Text and icon colour on the solid. */
  onSolid: string;
  /** Text-safe pillar colour: chip text, eyebrow. */
  ink: string;
  /** Solid as a text colour, for icons only. */
  icon: string;
  /** Quiet fill: chips, inactive filter, icon well. */
  subtle: string;
};

export type Pillar = {
  id: PillarId;
  /** Full name, for headings. */
  name: string;
  /** Chip and nav label. */
  short: string;
  /** One line for the homepage trio. */
  promise: string;
  icon: PillarIconName;
  accent: PillarAccent;
  /** Pillar page h1. */
  headline: string;
  /** Pillar page intro paragraph. */
  summary: string;
  /** Two or three headline numbers. Verified facts only. */
  stats: Stat[];
  /** Roles this pillar is open to, for the pillar page CTA. */
  roles: string[];
  resumePath: string;
  seo: { title: string; description: string; keywords: string[] };
  /** "YYYY-MM-DD". Bump when the pillar is reviewed or updated. */
  lastReviewed: string;
};

export const pillars: Pillar[] = [
  {
    id: "music-tech",
    name: "Music Technology",
    short: "Music tech",
    promise:
      "I work where sound meets code: audio quality at scale, the recording studio, and teaching computer science through music.",
    icon: "AudioWaveform",
    accent: {
      solid: "bg-pillar-music",
      onSolid: "text-pillar-music-foreground",
      ink: "text-pillar-music-ink",
      icon: "text-pillar-music",
      subtle: "bg-pillar-music-subtle",
    },
    headline: "I create with sound.",
    summary:
      "I've been a musician since I was 12, and I earned a B.A. in Music Technology from Bethune-Cookman before my M.S. at Georgia Tech. My graduate research looked at identity in 21st-century rap through lyricism and spoken rhythm. At Amazon Music I led audio quality and hardware compatibility for Amazon Amp, and I set up its audio hardware testing lab. I started in a recording studio at Tree Sound, and today I teach computer science through music in EarSketch workshops at Georgia Tech.",
    stats: [
      { value: null, display: "M.S.", label: "Music Technology, Georgia Tech" },
      {
        value: 1200,
        suffix: "+",
        label: "Audio test scenarios for Amazon Amp, across 50+ device combinations",
      },
      { value: null, display: "Since 2023", label: "Annual music tech coding workshops at Georgia Tech" },
    ],
    roles: ["Audio Program Manager", "Music Technologist"],
    resumePath: "/resume/m3",
    seo: {
      title: "Music Technology",
      description:
        "Music technologist with a Georgia Tech M.S. Led audio quality for Amazon Amp across 1,200+ test scenarios and teaches code through music.",
      keywords: [
        "music technologist",
        "music technology",
        "audio quality program manager",
        "audio engineer",
        "audio hardware testing",
        "computational musicology",
        "creative coding with music",
        "EarSketch",
      ],
    },
    lastReviewed: "2026-09-30",
  },
  {
    id: "software",
    name: "Software Development",
    short: "Software",
    promise: "I build data systems, embedded hardware and interactive lessons, and I teach the tools behind them.",
    icon: "SquareTerminal",
    accent: {
      solid: "bg-pillar-software",
      onSolid: "text-pillar-software-foreground",
      ink: "text-pillar-software-ink",
      icon: "text-pillar-software",
      subtle: "bg-pillar-software-subtle",
    },
    headline: "I build software people use.",
    summary:
      "I build software people use to learn and to work. At E22 Athletic Development I built our data systems in Athlete OS, with play-by-play stats and performance and wellness dashboards for a women's tackle football team. For Planet Bug, published at ACM CHI 2020, I programmed the microcontrollers and movement sensors inside a custom game controller. The lessons in my lab run right in your browser, and I've written 10 Coursera courses on the DevOps, CI/CD and Unix tools I work with. My everyday stack is Python, JavaScript, TypeScript, React, SQL and PostgreSQL.",
    stats: [
      { value: 8, label: "Interactive lessons you can try in the lab" },
      { value: null, display: "ACM CHI 2020", label: "Planet Bug, published" },
      { value: 5, suffix: " years", label: "Writing technical courses on DevOps, CI/CD, containers and Unix" },
    ],
    roles: ["Learning Engineer", "Technical Curriculum Developer", "Technical Program Manager", "Software Developer"],
    resumePath: "/resume/s3",
    seo: {
      title: "Software Development",
      description:
        "Software developer building data systems, embedded hardware and interactive lessons. Planet Bug at ACM CHI 2020 and 8 lessons you can try.",
      keywords: [
        "software developer",
        "TypeScript developer",
        "React developer",
        "Python developer",
        "Next.js developer",
        "educational software developer",
        "interactive learning developer",
        "data dashboard developer",
      ],
    },
    lastReviewed: "2026-09-30",
  },
  {
    id: "curriculum",
    name: "Curriculum and Learning Design",
    short: "Learning design",
    promise:
      "I design technical courses and hands-on learning, from self-paced Coursera catalogs to live cohorts and workshops.",
    icon: "BookOpenText",
    accent: {
      solid: "bg-pillar-curriculum",
      onSolid: "text-pillar-curriculum-foreground",
      ink: "text-pillar-curriculum-ink",
      icon: "text-pillar-curriculum",
      subtle: "bg-pillar-curriculum-subtle",
    },
    headline: "I teach through design.",
    summary:
      "For five years at Codio I wrote and revised technical courses for Coursera, covering DevOps, containers, CI/CD, operating systems, Unix, Bash and web security. I was content lead for a 10-week CI/CD program with a new release every week, and learners finished by deploying their own apps with CI/CD through GitHub Actions. I also design for live rooms: a two-year summer creative coding cohort, and Your Voice Is Power, a curriculum and global coding competition published at IEEE RESPECT and ASEE.",
    stats: [
      { value: 48000, suffix: "+", label: "Learners reached on Coursera" },
      { value: 10, label: "Published Coursera courses" },
      { value: 2, label: "Conference publications, IEEE RESPECT and ASEE" },
    ],
    roles: [
      "Curriculum Developer",
      "Instructional Designer",
      "Learning Experience Designer",
      "Technical Curriculum Developer",
      "Learning Engineer",
    ],
    resumePath: "/resume/c3",
    seo: {
      title: "Curriculum and Learning Design",
      description:
        "Curriculum developer and learning designer. 10 published Coursera courses reaching 48,000+ learners, plus live cohorts and coding workshops.",
      keywords: [
        "learning experience designer",
        "instructional designer",
        "technical curriculum developer",
        "curriculum developer",
        "Coursera instructor",
        "developer education",
        "technical learning designer",
        "remote instructional designer",
      ],
    },
    lastReviewed: "2026-09-30",
  },
];

export const pillarById = Object.fromEntries(pillars.map((p) => [p.id, p])) as Record<PillarId, Pillar>;

export function isPillarId(value: string | null | undefined): value is PillarId {
  return !!value && (pillarIds as readonly string[]).includes(value);
}
