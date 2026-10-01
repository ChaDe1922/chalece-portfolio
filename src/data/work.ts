/**
 * Featured work for the #work grid and the pillar pages. Copy is paste-ready
 * (no em dashes, no parentheses). `href` is optional; cards without a link
 * render as non-interactive.
 *
 * Balance rule: each pillar holds 30 to 36% of this list and at least 2 items.
 * `npm run check:portfolio` enforces it. Only `import type` is allowed here so
 * the check script can load this file directly.
 */

import type { PillarId } from "./pillars";

export type WorkItem = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  /** The pillar this card counts toward for balance. */
  pillar: PillarId;
  /** Other pillars whose pages also show this card. Does not count for balance. */
  alsoIn?: PillarId[];
  /** When the work started, "YYYY" or "YYYY-MM". Leave unset until confirmed. */
  date?: string;
  /** Short mono label for the homepage tracklist, like "ACM CHI 2020". */
  meta: string;
  /** What the link opens, shown on the tracklist. Only used when `href` is set. */
  linkLabel?: string;
};

export const work: WorkItem[] = [
  // Music Technology
  {
    title: "Music Tech Workshops at Georgia Tech",
    meta: "Since 2023",
    pillar: "music-tech",
    alsoIn: ["curriculum"],
    date: "2023",
    description:
      "I lead annual EarSketch and music technology coding workshops and student panels for high school learners at Georgia Tech, returning each year since 2023. Learners write Python and JavaScript to make music and meet computer science through sound.",
    tags: ["Workshops", "EarSketch", "Music and Code"],
  },
  {
    title: "Amazon Amp Audio Quality and Testing Lab",
    meta: "Amazon Music",
    pillar: "music-tech",
    date: "2021-12",
    description:
      "I led the Audio Quality and Hardware Compatibility programs for Amazon Amp, Amazon Music's live audio app, across 50+ device combinations and 1,200+ test scenarios. I also set up the audio hardware testing lab and wrote the procedures partner teams ran each release.",
    tags: ["Audio Quality", "Program Management", "Testing Lab"],
  },
  {
    title: "Tree Sound Studios",
    meta: "2012 to 2016",
    pillar: "music-tech",
    date: "2012-11",
    description:
      "From Nov 2012 to May 2016 I worked at this Norcross, Georgia recording studio, first as a junior audio engineer recording across multiple DAWs and then running studio administration. I worked with producers and artists to get the sound they were after.",
    tags: ["Recording", "Audio Engineering", "Studio"],
  },

  // Software Development
  {
    title: "E22 and Athlete OS Data Systems",
    meta: "Co-founder",
    pillar: "software",
    date: "2026",
    description:
      "I co-founded E22 Athletic Development and built its data systems in Athlete OS: game and play-by-play stats, performance and wellness dashboards, and the data collection behind them. Coaches and players on the Atlanta Truth women's tackle football team use them this season.",
    tags: ["Data Systems", "Dashboards", "Sports"],
  },
  {
    title: "Planet Bug",
    meta: "ACM CHI 2020",
    linkLabel: "read the paper",
    pillar: "software",
    alsoIn: ["curriculum"],
    date: "2020-04",
    description:
      "An educational game about insect conservation, played with a custom controller that works like a camera. I programmed the embedded microcontrollers and movement sensors, and the game itself was built in Phaser.",
    tags: ["Embedded Systems", "Game-Based Learning", "Published"],
    href: "https://dl.acm.org/doi/10.1145/3334480.3381654",
  },
  {
    title: "Interactive Lab Lessons",
    meta: "8 lessons",
    linkLabel: "try the lessons",
    pillar: "software",
    alsoIn: ["curriculum", "music-tech"],
    date: "2026",
    description:
      "Eight lessons that run right in your browser, from recursion and Git to sound and the Fourier series. I designed and coded each one with animations, live audio and quizzes.",
    tags: ["TypeScript", "React", "Interactive Learning"],
    href: "/lab",
  },

  // Curriculum and Learning Design
  {
    title: "Coursera Course Catalog at Codio",
    meta: "48k learners",
    linkLabel: "see the courses",
    pillar: "curriculum",
    alsoIn: ["software"],
    date: "2021-06",
    description:
      "I wrote 10 published Coursera courses on DevOps, containers, CI/CD, operating systems, Unix, Bash scripting and web security. Together they have reached 48,000+ learners.",
    tags: ["Course Design", "Assessment", "Technical"],
    href: "https://www.coursera.org/instructor/~88911140",
  },
  {
    title: "Your Voice Is Power",
    meta: "IEEE · ASEE",
    linkLabel: "visit the program",
    pillar: "curriculum",
    alsoIn: ["music-tech"],
    date: "2021",
    description:
      "A curriculum and global coding competition I started and led with Georgia Tech's EarSketch team, Amazon Future Engineer and Pharrell Williams' YELLOW, where learners remix Pharrell's music in code. It was published in the IEEE RESPECT 2021 and ASEE 2023 proceedings.",
    tags: ["Curriculum", "EarSketch", "Published"],
    href: "https://www.amazonfutureengineer.co.uk/your-voice-is-power",
  },
  {
    title: "Creative Coding Summer Cohort",
    meta: "2022 to 2023",
    pillar: "curriculum",
    alsoIn: ["software"],
    date: "2022",
    description:
      "I designed and ran a summer creative coding cohort in 2022 and 2023. High school juniors through college freshmen went from Python and Pygame basics to group games and capstone presentations.",
    tags: ["Python and Pygame", "Game Design", "Cohort"],
  },
];

/** Work that counts toward a pillar, primary cards first. */
export function workForPillar(pillar: PillarId): WorkItem[] {
  const primary = work.filter((item) => item.pillar === pillar);
  const secondary = work.filter((item) => item.pillar !== pillar && item.alsoIn?.includes(pillar));
  return [...primary, ...secondary];
}
