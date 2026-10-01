/**
 * Night Session homepage data: the mixing-console metaphor. Channels, blends,
 * the About liner notes, and contact copy per role. The resume timeline lives in timeline.ts.
 *
 * Source: Style B "Night Session" design, Home-B-Combined, picked 2026-09-30.
 * Facts come from pillars.ts, work.ts and about.ts; add nothing that is not
 * in personal-ops resume-master.md or experience-bank.md.
 *
 * Copy style rule: no em dashes, no parentheses in public copy.
 * Type-only imports: keep this file loadable without a bundler.
 */

import type { PillarId } from "./pillars";

/** Console order: create, build, teach. */
export const ORDER: PillarId[] = ["music-tech", "software", "curriculum"];

/** Accent used when no single pillar is soloed. */
export const MASTER_ACCENT = "#ff7a59";

export type MixItem = { title: string; meta: string };

export type Channel = {
  num: number;
  name: string;
  short: string;
  verb: string;
  color: string;
  /** Hero paragraph when this pillar is soloed or previewed. */
  blurb: string;
  /** Console monitor paragraph. */
  desc: string;
  stats: { value: string; label: string }[];
  projects: MixItem[];
};

export const CHANNELS: Record<PillarId, Channel> = {
  "music-tech": {
    num: 1,
    name: "Music Technology",
    short: "Music Tech",
    verb: "create",
    color: "#ff7a59",
    blurb:
      "Audio quality for Amazon Music, a recording studio background, and computer science taught through sound.",
    desc: "I work where sound meets code: audio quality at scale, the recording studio, and teaching computer science through music.",
    stats: [
      { value: "1,200+", label: "Amazon Amp test scenarios" },
      { value: "M.S.", label: "Georgia Tech" },
    ],
    projects: [
      { title: "Amazon Amp Audio Quality and Testing Lab", meta: "Amazon Music" },
      { title: "Tree Sound Studios", meta: "2012 to 2016" },
      { title: "Music Tech Workshops at Georgia Tech", meta: "Since 2023" },
    ],
  },
  software: {
    num: 2,
    name: "Software Development",
    short: "Software",
    verb: "build",
    color: "#5ad1c8",
    blurb:
      "Data systems for E22, embedded hardware published at ACM CHI 2020, and eight interactive lessons you can try here.",
    desc: "I build data systems, embedded hardware and interactive lessons, and I teach the tools behind them.",
    stats: [
      { value: "8", label: "Interactive lab lessons" },
      { value: "CHI ’20", label: "Planet Bug, published" },
    ],
    projects: [
      { title: "E22 and Athlete OS Data Systems", meta: "Co-founder" },
      { title: "Planet Bug", meta: "ACM CHI 2020" },
      { title: "Interactive Lab Lessons", meta: "8 lessons" },
    ],
  },
  curriculum: {
    num: 3,
    name: "Learning Design",
    short: "Learning Design",
    verb: "teach",
    color: "#f5c542",
    blurb:
      "10 published Coursera courses reaching 48,000+ learners, plus live cohorts and workshops.",
    desc: "I design technical courses and hands-on learning, from self-paced Coursera catalogs to live cohorts and workshops.",
    stats: [
      { value: "48,000+", label: "Learners on Coursera" },
      { value: "10", label: "Published courses" },
    ],
    projects: [
      { title: "Coursera Course Catalog at Codio", meta: "10 courses" },
      { title: "Your Voice Is Power", meta: "IEEE · ASEE" },
      { title: "Creative Coding Summer Cohort", meta: "2022 to 2023" },
    ],
  },
};

/** Hero paragraph when no single pillar is showing. */
export const HERO_BLURB =
  "I work across music technology, software and learning design. I’ve written 10 Coursera courses that have reached 48,000+ learners, led audio quality for Amazon Amp at Amazon Music, and built interactive lessons you can try right here.";

export type Blend = { title: string; desc: string; projects: MixItem[] };

/** Keyed by pillar ids in ORDER, joined with "+". */
export const BLENDS: Record<string, Blend> = {
  "music-tech+software": {
    title: "Music × Software",
    desc: "Code that makes sound, and sound that teaches code.",
    projects: [
      { title: "Sound and Fourier series lab lessons", meta: "Interactive" },
      { title: "EarSketch coding workshops", meta: "Python · JS" },
      { title: "Amazon Amp testing procedures", meta: "Amazon Music" },
    ],
  },
  "music-tech+curriculum": {
    title: "Music × Learning Design",
    desc: "Teaching computer science through the music learners already love.",
    projects: [
      { title: "Your Voice Is Power", meta: "IEEE · ASEE" },
      { title: "Music Tech Workshops at Georgia Tech", meta: "Since 2023" },
    ],
  },
  "software+curriculum": {
    title: "Software × Learning Design",
    desc: "Technical courses and learning tools I built myself.",
    projects: [
      { title: "Coursera Course Catalog at Codio", meta: "DevOps · Unix" },
      { title: "Interactive Lab Lessons", meta: "8 lessons" },
      { title: "Planet Bug", meta: "ACM CHI 2020" },
    ],
  },
  "music-tech+software+curriculum": {
    title: "The full mix",
    desc: "Each craft makes the others better. This is where all three meet.",
    projects: [
      { title: "Your Voice Is Power", meta: "Code + music + curriculum" },
      { title: "EarSketch workshops", meta: "Code + music + teaching" },
      { title: "Sound and Fourier lab lessons", meta: "Built + taught" },
    ],
  },
};

/** About section opening paragraph. */
export const LINER_INTRO =
  "I’ve been a musician since I was 12, and I started out in a recording studio. My work has moved between three crafts ever since, and each one makes the others better.";

/** Liner notes facts, from about.ts. */
export const LINER_NOTES: { term: string; detail: string }[] = [
  { term: "FIRST TRACKS", detail: "Musician since age 12" },
  { term: "B.A.", detail: "Music Technology, Bethune-Cookman University" },
  { term: "M.S.", detail: "Music Technology, Georgia Tech" },
  { term: "RESEARCH", detail: "Identity in 21st-century rap through lyricism and spoken rhythm" },
  { term: "PUBLISHED", detail: "ACM CHI 2020 · IEEE RESPECT 2021 · ASEE 2023" },
  { term: "BASED IN", detail: "Atlanta, GA · open to remote roles" },
];

/** A preset is a saved mix: one level per channel, 0 to 100. */
export type RoleCopy = { label: string; subject: string; preset: Record<PillarId, number>; pitch: string };

/** Contact section, in the order the role picker shows them. */
export const ROLE_ORDER: PillarId[] = ["curriculum", "music-tech", "software"];

export const ROLE_COPY: Record<PillarId, RoleCopy> = {
  curriculum: {
    label: "Learning design",
    subject: "Learning experience design role",
    preset: { curriculum: 100, software: 60, "music-tech": 35 },
    pitch:
      "I design technical courses and hands-on learning: 10 published on Coursera, 48,000+ learners, plus live cohorts and workshops. Tell me about your learners.",
  },
  "music-tech": {
    label: "Music technology",
    subject: "Music technology role",
    preset: { "music-tech": 100, software: 55, curriculum: 40 },
    pitch:
      "Georgia Tech M.S., studio-trained, and audio quality across 1,200+ test scenarios for Amazon Music. Tell me what you want people to hear.",
  },
  software: {
    label: "Software development",
    subject: "Software development role",
    preset: { software: 100, curriculum: 60, "music-tech": 35 },
    pitch:
      "Data systems, embedded hardware published at ACM CHI, and interactive lessons in TypeScript and React. Tell me what you are building.",
  },
};

export const DEFAULT_PITCH =
  "Want to learn more about my experience? Set the mix to what matters to you, and download my resume.";

export const TABS: { id: string; label: string }[] = [
  { id: "what", label: "what-i-do" },
  { id: "work", label: "work" },
  { id: "about", label: "about" },
  { id: "resume", label: "resume" },
  { id: "contact", label: "contact" },
];

/** Length of the page, as a song, for the nav timecode. */
export const SESSION_SECONDS = 330;
