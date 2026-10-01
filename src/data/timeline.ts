/**
 * Resume timeline: one lane per craft, plus papers. Both degrees are in music
 * technology, so they sit on the Music Tech lane. Every entry traces to
 * personal-ops data/career/resume-master.md, including the owner confirmations
 * of 2026-09-30. Add nothing that is not there.
 *
 * Never credit her musicianship to Georgia Tech: she was a musician long
 * before, and the B.A. predates it. The independent build stays unnamed.
 */

import type { PillarId } from "./pillars";

export type LaneId = PillarId | "published";

export type Clip = {
  id: string;
  /** Short name on the clip. Keep it short: it has to fit on the track. */
  title: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", or "now" for ongoing work. */
  end: string;
  /** Dates as shown on the clip and in the inspector. */
  label: string;
  role: string;
  org: string;
  place?: string;
  points: string[];
  link?: { href: string; label: string };
};

/** Resume timeline axis, in years. */
export const TIMELINE = { from: 2008, to: 2027 };

export const CLIPS: Record<LaneId, Clip[]> = {
  "music-tech": [
    {
      id: "bcu",
      title: "Bethune-Cookman",
      start: "2008-08",
      end: "2012-05",
      label: "B.A. 2008 to 2012",
      role: "B.A., Music Technology",
      org: "Bethune-Cookman University",
      place: "Daytona Beach, FL",
      points: [
        "Earned my B.A. in music technology.",
        "Played in the Marching Wildcat Band and the Symphonic Band.",
        "Served as Parliamentarian of Sigma Gamma Rho Sorority, Inc.",
      ],
    },
    {
      id: "tree-sound",
      title: "Tree Sound Studios",
      start: "2012-11",
      end: "2016-05",
      label: "2012 to 2016",
      role: "Junior Audio Engineer, then Administrator",
      org: "Tree Sound Studios",
      place: "Norcross, GA",
      points: [
        "Worked in a professional recording environment across multiple DAWs, supporting sessions with artists, musicians, producers and engineers.",
        "Worked across the recording process, from session prep and signal flow to tracking, playback and editing, helping move each session toward the sound the artist or producer was after.",
        "As Administrator from 2014, worked with the CEO, CFO and GM to make the most of the studio's resources, and kept the books in QuickBooks.",
      ],
    },
    {
      id: "gt-ms",
      title: "Georgia Tech",
      start: "2018-08",
      end: "2020-05",
      label: "M.S. 2018 to 2020",
      role: "M.S., Music Technology, Cognitive and Computational Musicology",
      org: "Georgia Institute of Technology",
      place: "Atlanta, GA",
      points: [
        "Researched cultural and regional identity in 21st-century rap, through lyricism and spoken rhythm.",
        "Took graduate coursework in educational technology and human-computer interaction.",
        "Co-created Planet Bug, published at ACM CHI 2020.",
        "Awarded the Herbert P. Haley Graduate Fellowship and the OMED Tower Award.",
      ],
    },
    {
      id: "amazon",
      title: "Amazon Amp",
      start: "2021-12",
      end: "2023-05",
      label: "2021 to 2023",
      role: "Program Manager, Audio Quality",
      org: "Amazon Music",
      place: "Atlanta, GA",
      points: [
        "Led audio quality and hardware compatibility for Amp, Amazon's live audio app, across 50+ device combinations and 1,200+ test scenarios.",
        "Set up an Audio Hardware Testing Lab and wrote the procedures partner teams ran every release cycle.",
        "Managed work on objective measures of perceived audio quality, used to judge improvements and release readiness.",
      ],
    },
    {
      id: "gt-workshops",
      title: "GT Workshops",
      start: "2023-01",
      end: "now",
      label: "2023 to now",
      role: "Workshop Facilitator and Panelist",
      org: "Georgia Tech",
      place: "Atlanta, GA",
      points: [
        "Lead hands-on EarSketch workshops that introduce computer science through music and creative coding.",
        "Sit on student panels about paths into computing and music technology.",
        "Use learners' questions from each session to revise the content and how I teach it.",
      ],
    },
  ],
  software: [
    {
      id: "planet-bug",
      title: "Planet Bug",
      start: "2019-01",
      end: "2020-04",
      label: "2019 to 2020",
      role: "Co-creator and developer",
      org: "Georgia Tech",
      points: [
        "An educational game about declining insect populations, played on a custom controller built to look like a camera.",
        "Programmed the microcontrollers and movement sensors inside the controller, and built the game in Phaser.",
        "Published at ACM CHI 2020.",
      ],
      link: { href: "https://dl.acm.org/doi/10.1145/3334480.3381654", label: "Read the paper" },
    },
    {
      id: "full-stack",
      title: "Full-stack web app",
      start: "2020-01",
      end: "now",
      label: "2020 to now",
      role: "Founder and Developer",
      org: "Independent",
      place: "Remote",
      points: [
        "Designed and built a production web application with React, TypeScript and PostgreSQL.",
        "It covers sign-in, payments, media storage, REST APIs, row-level security and cloud deployment.",
        "Tested end to end, with automated accessibility checks.",
      ],
    },
    {
      id: "e22",
      title: "E22",
      start: "2024-01",
      end: "now",
      label: "2024 to now",
      role: "Co-Founder",
      org: "E22 Athletic Development",
      place: "Atlanta, GA",
      points: [
        "Co-founded an athletic development company that supports athletes' performance, development and career growth.",
        "Built its data backbone in Athlete OS: performance and wellness dashboards, game and play-by-play stats, and the data collection behind them.",
      ],
    },
    {
      id: "atlanta-truth",
      title: "Atlanta Truth",
      start: "2026-01",
      end: "now",
      label: "2026 season",
      role: "Volunteer Data Analyst",
      org: "Atlanta Truth women's tackle football",
      place: "Atlanta, GA",
      points: [
        "Built the team's data systems: game and play-by-play stats, plus performance and wellness dashboards.",
        "Built for the coaches and players, and in use this season.",
      ],
    },
    {
      id: "lab",
      title: "Lab lessons",
      start: "2026-01",
      end: "now",
      label: "2026 to now",
      role: "Designer and developer",
      org: "This site",
      points: [
        "Eight interactive lessons I designed and coded, from recursion and Git to building a synth.",
        "Written in TypeScript and React, and they run right in your browser.",
      ],
      link: { href: "/lab", label: "Try a lesson" },
    },
  ],
  curriculum: [
    {
      id: "reach",
      title: "REACH",
      start: "2017-11",
      end: "2019-06",
      label: "2017 to 2019",
      role: "Data Manager",
      org: "REACH Educational Services",
      place: "Fayetteville, GA",
      points: [
        "Adapted the systems for collecting daily student data from each classroom, making monthly performance reports much more accurate.",
        "Worked with administrators and educators to analyze student performance and spot early developmental needs.",
      ],
    },
    {
      id: "ceismc",
      title: "CEISMC",
      start: "2019-06",
      end: "2021-11",
      label: "2019 to 2021",
      role: "STEAM Curriculum Integration Specialist",
      org: "CEISMC, Georgia Tech",
      place: "Atlanta, GA",
      points: [
        "Designed project-based STEAM and computer science curriculum aligned to CSTA standards and Georgia music standards.",
        "Co-taught with classroom teachers, guiding learners from a problem in their own community to an app they designed, built, tested and presented.",
        "Taught and supported projects in Java and JavaScript.",
      ],
    },
    {
      id: "yvip",
      title: "Your Voice Is Power",
      start: "2021-01",
      end: "2021-12",
      label: "2021",
      role: "Creator and lead",
      org: "With Georgia Tech's EarSketch team, Amazon Future Engineer and YELLOW",
      points: [
        "A project-based curriculum and global coding competition where learners remix Pharrell Williams' music in EarSketch, using Python or JavaScript.",
        "I started it and led it from concept through curriculum and build.",
        "Participants joined from four continents.",
        "Published at IEEE RESPECT 2021, with a follow-up study at ASEE 2023.",
      ],
      link: { href: "https://ieeexplore.ieee.org/document/9620583/", label: "Read the paper" },
    },
    {
      id: "codio",
      title: "Codio × Coursera",
      start: "2021-06",
      end: "2026-06",
      label: "2021 to 2026",
      role: "Computer Science Curriculum Developer",
      org: "Codio",
      place: "Remote",
      points: [
        "Wrote and published 10 technical courses on Coursera that reached 48,000+ learners, across Unix and Bash, containers, CI/CD and DevOps, operating systems and web security.",
        "Content lead for a 10-week CI/CD program with a new release every week, and met every deadline.",
        "Used assessment results and cohort data to decide what to revise next.",
      ],
    },
    {
      id: "summer",
      title: "Summer Cohort",
      start: "2022-06",
      end: "2023-08",
      label: "2022 to 2023",
      role: "Designer and lead",
      org: "Summer Creative Coding Intensive, Codio",
      points: [
        "Designed and led two summer cohorts that took near-beginners through Python and Pygame.",
        "Learners finished with group projects and capstone presentations.",
      ],
    },
  ],
  published: [
    {
      id: "chi",
      title: "ACM CHI",
      start: "2020-04",
      end: "2020-04",
      label: "2020",
      role: "Planet Bug: Promoting Awareness of Declining Insect Populations",
      org: "ACM CHI 2020",
      points: ["Co-author. The paper behind Planet Bug, the educational game and its custom controller."],
      link: { href: "https://dl.acm.org/doi/10.1145/3334480.3381654", label: "Read the paper" },
    },
    {
      id: "respect",
      title: "IEEE RESPECT",
      start: "2021-05",
      end: "2021-05",
      label: "2021",
      role: "Your Voice Is Power",
      org: "IEEE RESPECT 2021",
      points: ["Co-author with R. Moore and S. Newton. A peer-reviewed paper on the Your Voice Is Power curriculum."],
      link: { href: "https://ieeexplore.ieee.org/document/9620583/", label: "Read the paper" },
    },
    {
      id: "asee",
      title: "ASEE",
      start: "2023-06",
      end: "2023-06",
      label: "2023",
      role: "Your Voice Is Power study",
      org: "ASEE Annual Conference 2023",
      points: ["Co-author. A study of student and teacher experiences with the Your Voice Is Power curriculum."],
      link: {
        href: "https://peer.asee.org/music-coding-and-equity-an-exploration-of-student-and-teacher-experiences-in-decoding-messaging-and-discussing-equity-with-the-your-voice-is-power-curriculum",
        label: "Read the paper",
      },
    },
  ],
};
