/**
 * Mix-your-resume content bank. The resume route builds every mix from this
 * file alone: craft sections in fader order, depth set by each fader's tier.
 *
 * Every string traces to personal-ops data/career/resume-master.md (M###) or
 * data/career/experience-bank.md (B###), cited in `src`. Wording follows the
 * approved track resumes in outputs/career/resumes/tracks/. Add nothing that
 * is not there.
 *
 * Kept out on purpose: the retired venture, the unverified Athlete OS
 * architecture claims, and the lab lessons, which are not in resume-master.
 * The independent build stays unnamed. AI stays vague.
 *
 * Approved by Chalece 2026-09-30. REACH left off on her call.
 */

import type { PillarId } from "./pillars";

/** 1 = quiet, 2 = mid, 3 = loud. See levelToTier in resume-mix.ts. */
export type Tier = 1 | 2 | 3;

export type Bullet = {
  text: string;
  src: string;
  /** Only shown when this craft is also on. */
  needs?: PillarId;
};

export type Entry = {
  id: string;
  /** The craft section this entry lives in. Matches the timeline lanes. */
  home: PillarId;
  /** Roles are jobs with dates. Projects carry a venue instead. */
  kind: "role" | "project";
  title: string;
  org: string;
  place?: string;
  dates?: string;
  /** The lowest tier of its home craft at which the entry appears. */
  minTier: Tier;
  /** Ranked. Tier 1 shows the first, tier 2 up to 3, tier 3 all. */
  bullets: Bullet[];
};

export type SkillGroup = {
  label: string;
  items: string;
  src: string;
  /** Left out when this craft is on, since its own skills cover it. */
  unlessOn?: PillarId;
};

export type CraftCopy = {
  /** Section heading on the PDF. */
  section: string;
  /** Full headline when this craft is the only one on. */
  soloHeadline: string;
  /** This craft's title in a blended headline. */
  title: string;
  /** Summary opener when this craft is the loudest. */
  opener: string;
  /** One proof sentence, added for every craft that is on. */
  proof: string;
  /** Ranked. Tier 1 shows the first group, tier 2 two, tier 3 all. */
  skills: SkillGroup[];
};

export const HEADER = {
  name: "Chalece DeLaCoudray",
  /** M17 */
  contact: ["cdelacoudray@gmail.com", "Atlanta, GA", "912-271-6997"],
  links: ["linkedin.com/in/chalecedelacoudray", "chalece-portfolio.vercel.app"],
  /** M17. Shown only when software is on. */
  github: "github.com/ChaDe1922",
};

export const CRAFTS: Record<PillarId, CraftCopy> = {
  curriculum: {
    section: "Learning Design Experience",
    soloHeadline: "Technical Curriculum Developer | Learning Experience Designer | Developer Education",
    title: "Technical Curriculum Developer",
    opener:
      "Technical curriculum developer and learning experience designer who has spent 10+ years helping people learn hard technical things by doing them.",
    proof:
      "Authored and published 10 Coursera courses reaching 48,000+ learners across Unix and Bash, containers, CI/CD and DevOps, operating systems, and web security, owning each from learning architecture through labs, assessments, video, and data-informed revision.",
    skills: [
      {
        label: "Learning design",
        items:
          "learning objectives, course and learning-path design, module sequencing, assessment design, hands-on labs, coding exercises, scenario-based and game-based learning, asynchronous and self-paced learning, instructor-led to e-learning conversion.",
        src: "M33",
      },
      {
        label: "Content and media",
        items:
          "technical writing for developer audiences, scripting, storyboarding, instructional video, screen recording, interactive concept visuals, publishing workflows, learning analytics and data-informed revision.",
        src: "M31, M35, M96",
      },
      {
        label: "Authoring tools",
        items:
          "Codio, Coursera, Articulate Storyline, Articulate 360, GitHub, WordPress, Elementor, Canva, Premiere Pro, Final Cut Pro, Photoshop, Illustrator.",
        src: "M37, M103",
      },
      {
        label: "Technical fluency",
        items:
          "Python, JavaScript, TypeScript, Java, Bash, Unix, SQL, HTML5, CSS, REST APIs, React, PostgreSQL, Git, web security, WCAG and accessibility.",
        src: "M37, M95",
        unlessOn: "software",
      },
    ],
  },
  software: {
    section: "Software Development Experience",
    soloHeadline: "Software Developer | Full-Stack Web Applications | Python, TypeScript, and SQL",
    title: "Software Developer",
    opener:
      "Full-stack developer who builds production web applications and spent years teaching the infrastructure underneath them.",
    proof:
      "Builds and deploys web applications end to end in TypeScript, React, and PostgreSQL, with REST APIs, row-level security, versioned SQL migrations, and automated Playwright and Vitest suites.",
    skills: [
      {
        label: "Languages",
        items: "Python, TypeScript, JavaScript, SQL, Bash, Java, HTML5, CSS.",
        src: "M37, M95",
      },
      {
        label: "Backend and data",
        items:
          "REST APIs, webhooks, PostgreSQL, row-level security, versioned SQL migrations, Supabase Auth and Storage, Zod validation, data dashboards.",
        src: "M97, M162, M169",
      },
      {
        label: "Frontend",
        items: "React, Next.js App Router, Tailwind CSS, shadcn/ui, WCAG and accessibility practice.",
        src: "M37, M97",
      },
      {
        label: "Delivery and testing",
        items:
          "Git, GitHub, GitHub Actions, CI/CD, Vercel, Sentry, Playwright, Vitest, axe-core, cross-browser testing, root-cause debugging.",
        src: "M97, M162, M180, B215",
      },
    ],
  },
  "music-tech": {
    section: "Music Technology Experience",
    soloHeadline: "Audio Quality and Music Technology | Audio Program Management | Music and Code Education",
    title: "Audio Quality and Music Technology",
    opener:
      "Lifelong musician and music technologist who has spent 10+ years where audio, software, and learning meet.",
    proof:
      "Led audio quality and hardware compatibility for Amp, Amazon Music's live audio streaming app, across 50+ device combinations and 1,200+ test scenarios, stood up its Audio Hardware Testing Lab, and holds two music technology degrees.",
    skills: [
      {
        label: "Audio",
        items:
          "Pro Tools, multi-DAW studio recording, audio engineering, mixing and production, perceived audio quality measures, live audio.",
        src: "M37, M56, M100, M153, M219",
      },
      {
        label: "Quality and release",
        items:
          "hardware compatibility testing, release readiness, operating procedures, testing lab setup, stakeholder management, cross-functional coordination.",
        src: "M54, M55, M98, M182",
      },
      {
        label: "Music technology and research",
        items:
          "EarSketch, computational musicology, lyric transcription by ear, analysis of lyricism and spoken rhythm, educational game design in Phaser.",
        src: "M60, M76, M101, M186, B160",
      },
      {
        label: "Programming",
        items: "Python, JavaScript, TypeScript, Bash, SQL, HTML5, CSS, Git.",
        src: "M37",
        unlessOn: "software",
      },
    ],
  },
};

/** Newest first within each craft. Projects after roles. */
export const ENTRIES: Entry[] = [
  // ── Software ──────────────────────────────────────────────────────────
  {
    id: "full-stack",
    home: "software",
    kind: "role",
    title: "Founder and Developer",
    org: "Independent Full-Stack Development",
    place: "Remote",
    dates: "2020 to Present",
    minTier: 1,
    bullets: [
      {
        text: "Build and maintain a production web application and its REST API layer using Next.js, React, TypeScript, PostgreSQL, authentication, and media storage, deployed on Vercel.",
        src: "M71, M97",
      },
      {
        text: "Maintain 50+ versioned SQL migrations with row-level security, and validate data at the API boundary with Zod schemas.",
        src: "M97, M162",
      },
      {
        text: "Maintain automated Vitest and Playwright coverage across authentication, onboarding, API contracts, cross-browser behavior, and accessibility through axe-core.",
        src: "M71, M162",
      },
      {
        text: "Built the API routes for subscription billing, with checkout sessions and webhook handling for new, updated, and canceled subscriptions and failed payments.",
        src: "M97, M162",
      },
      {
        text: "Investigate production issues through Sentry and application logs, trace failures to root cause, and add regression coverage for durable fixes.",
        src: "M97, M180",
      },
      {
        text: "Use AI-assisted development inside a review gate where every change is read, tested, and verified in the browser before merge.",
        src: "M72, M99",
      },
    ],
  },
  {
    id: "e22",
    home: "software",
    kind: "role",
    title: "Co-Founder",
    org: "E22 Athletic Development",
    place: "Atlanta, GA",
    dates: "Jan 2024 to Present",
    minTier: 1,
    bullets: [
      {
        text: "Built the data-collection systems, game and play-by-play statistics, and performance and wellness dashboards for coaches and players.",
        src: "M169, M218, B64",
      },
      {
        text: "Design differentiated curriculum for women's tackle football athletes of every experience level, spanning football IQ, data literacy, onboarding, and brand and media skills.",
        src: "B94",
      },
      {
        text: "Co-founded an athletic development company that supports athletes' performance, development, and career growth.",
        src: "M168",
      },
    ],
  },
  {
    id: "planet-bug",
    home: "software",
    kind: "project",
    title: "Planet Bug",
    org: "ACM CHI 2020",
    minTier: 2,
    bullets: [
      {
        text: "Co-created an interactive educational game built in Phaser, programming the microcontrollers and movement sensors inside a camera-emulating controller.",
        src: "M217",
      },
    ],
  },

  // ── Learning design ──────────────────────────────────────────────────
  {
    id: "codio",
    home: "curriculum",
    kind: "role",
    title: "Computer Science Curriculum Developer",
    org: "Codio",
    place: "Remote",
    dates: "Jun 2021 to Jun 2026",
    minTier: 1,
    bullets: [
      {
        text: "Authored and published 10 self-paced technical courses on Coursera reaching 48,000+ learners across Unix and Bash, containers and orchestration, CI/CD and DevOps, operating systems, and web security, owning each from research and learning architecture through labs, assessments, quality review, and publication.",
        src: "M43",
      },
      {
        text: "Defined action-based learning objectives and built formative and summative assessments, with asynchronous labs and coding exercises designed to stand alone without a live instructor.",
        src: "M45, M115",
      },
      {
        text: "Served as content lead for a 10-week software and CI/CD program in which learners built and deployed applications through GitHub Actions, releasing a module every week and meeting every deadline.",
        src: "M47, B215, B216",
      },
      {
        text: "Used assessment performance, platform reporting, and cohort-level data to prioritize revisions and guide later content development.",
        src: "M49, M96",
      },
      {
        text: "Built a four-course operating-systems specialization as a sequenced learning path, and authored Data Security for Web Developers.",
        src: "M44",
      },
      {
        text: "Designed and led the Summer Creative Coding Intensive in 2022 and 2023, taking near-beginners through Python and Pygame fundamentals to group projects and capstone presentations.",
        src: "M50, M113, B47",
      },
      {
        text: "Scripted, storyboarded, produced, and edited instructional video, and built interactive visuals for concepts such as process scheduling and container orchestration.",
        src: "M48, M116",
      },
      {
        text: "Partnered with engineering, product, and subject-matter experts to validate technical accuracy and find where learners got stuck.",
        src: "M46",
      },
      {
        text: "Developed creative coding curriculum in EarSketch that teaches programming through music.",
        src: "M60, M114",
        needs: "music-tech",
      },
    ],
  },
  {
    id: "ceismc",
    home: "curriculum",
    kind: "role",
    title: "STEAM Curriculum Integration Specialist",
    org: "CEISMC, Georgia Institute of Technology",
    place: "Atlanta, GA",
    dates: "Jun 2019 to Nov 2021",
    minTier: 1,
    bullets: [
      {
        text: "Designed and co-taught project-based STEAM and computer science curriculum aligned to CSTA standards and Georgia music standards at the same time.",
        src: "M65, M128",
      },
      {
        text: "Guided GoSTEAM learners from a problem in their own community through application design, development, testing, and presentation.",
        src: "M66, M127",
      },
      {
        text: "Taught and supported technical projects in Java and JavaScript.",
        src: "M129",
      },
      {
        text: "Integrated computer science, visual arts, audio-video technology, and music in one curriculum.",
        src: "M128",
      },
    ],
  },
  {
    id: "lead-ta",
    home: "curriculum",
    kind: "role",
    title: "Lead Teaching Assistant",
    org: "Georgia Institute of Technology",
    place: "Atlanta, GA",
    dates: "May 2019 to Aug 2019",
    minTier: 3,
    bullets: [
      {
        text: "Led a cohort of teaching assistants supporting Fundamentals of Musicianship and Survey of Music Technology, and tutored learners one-on-one to build confidence with unfamiliar music software.",
        src: "M135, M136",
      },
    ],
  },
  {
    id: "yvip",
    home: "curriculum",
    kind: "project",
    title: "Your Voice Is Power",
    org: "Creator and Lead",
    minTier: 1,
    bullets: [
      {
        text: "Originated and led a project-based curriculum and global coding competition in which learners remix Pharrell Williams' music in EarSketch with Python and JavaScript.",
        src: "M216, B54",
      },
      {
        text: "Built it with subject-matter experts and partners at Georgia Tech EarSketch, Amazon Future Engineer, and YELLOW, reaching participants on four continents.",
        src: "M181, M216",
      },
      {
        text: "Co-authored the peer-reviewed paper at IEEE RESPECT 2021, with a related study at ASEE 2023.",
        src: "M207, M210",
      },
    ],
  },
  {
    id: "mentoring",
    home: "curriculum",
    kind: "project",
    title: "Youth Mentoring",
    org: "Black Girls CODE and Girls Rock Camp ATL",
    minTier: 3,
    bullets: [
      {
        text: "Ran virtual Python and EarSketch coding workshops for 30+ learners with Black Girls CODE, and supervised the audio-visual team and mentored teens at Girls Rock Camp ATL.",
        src: "M219, B186",
      },
    ],
  },

  // ── Music tech ───────────────────────────────────────────────────────
  {
    id: "amazon",
    home: "music-tech",
    kind: "role",
    title: "Program Manager, Audio Quality",
    org: "Amazon Music",
    place: "Atlanta, GA",
    dates: "Dec 2021 to May 2023",
    minTier: 1,
    bullets: [
      {
        text: "Led Audio Quality and Hardware Compatibility programs for Amp, Amazon Music's live audio streaming app, spanning 50+ device combinations and 1,200+ test scenarios.",
        src: "M54, M119, B103",
      },
      {
        text: "Partnered with security and facilities teams to allocate, outfit, and write operating procedures for a new Audio Hardware Testing Lab, covering the equipment and testing workflows partner teams ran each release cycle to prevent regressions.",
        src: "M55, M120",
      },
      {
        text: "Managed the work defining objective measures of perceived audio quality used to benchmark product improvements and release readiness.",
        src: "M56",
      },
      {
        text: "Coordinated product, engineering, security, and facilities partners against recurring release schedules.",
        src: "M54",
      },
    ],
  },
  {
    id: "gt-workshops",
    home: "music-tech",
    kind: "role",
    title: "Workshop Facilitator and Panelist, Contract",
    org: "Georgia Institute of Technology",
    place: "Atlanta, GA",
    dates: "2023 to Present",
    minTier: 1,
    bullets: [
      {
        text: "Facilitate annual hands-on EarSketch coding workshops that introduce high school learners to computer science through music creation.",
        src: "M60, M123, B194",
      },
      {
        text: "Serve on student panels about pathways into computing and music technology.",
        src: "M124",
      },
      {
        text: "Use participant questions and live-instruction observations to revise learning content and delivery.",
        src: "M61",
      },
    ],
  },
  {
    id: "tree-sound",
    home: "music-tech",
    kind: "role",
    title: "Junior Audio Engineer, then Administrator",
    org: "Tree Sound Studios",
    place: "Norcross, GA",
    dates: "Nov 2012 to May 2016",
    minTier: 2,
    bullets: [
      {
        text: "Worked in a professional recording environment across multiple DAWs, supporting sessions with artists, musicians, producers, and engineers.",
        src: "M153, verbatim",
      },
      {
        text: "Worked across the recording process, including session preparation, signal flow, tracking, playback, editing, and helping move a session toward the sound the artist or producer was trying to reach.",
        src: "M154, verbatim",
      },
      {
        text: "Developed an early understanding of creative software from the user side: which tools disappear into the work, which interrupt it, and how small workflow decisions can either support or break a creative process.",
        src: "M155, verbatim",
      },
      {
        text: "As Administrator from 2014 to 2016, worked with the CEO, CFO, and GM to optimize studio resources, and prepared and reconciled bank statements and general ledgers in QuickBooks.",
        src: "M150",
      },
    ],
  },
];

export type EducationEntry = {
  degree: string;
  school: string;
  place: string;
  dates: string;
  details: Bullet[];
};

/** Always on the resume. Details with `needs` follow the mix. */
export const EDUCATION: EducationEntry[] = [
  {
    degree: "Master of Science, Music Technology, Cognitive and Computational Musicology",
    school: "Georgia Institute of Technology",
    place: "Atlanta, GA",
    dates: "2018 to 2020",
    details: [
      {
        text: "Graduate research on cultural and regional identity in 21st-century rap, transcribing lyrics by ear and analyzing lyricism and spoken rhythm across artists.",
        src: "M186, B160",
        needs: "music-tech",
      },
      {
        text: "Graduate coursework in educational technology and human-computer interaction.",
        src: "M77, M187",
      },
      {
        text: "Herbert P. Haley Graduate Fellowship and OMED Tower Award.",
        src: "M186",
      },
    ],
  },
  {
    degree: "Bachelor of Arts, Music Technology",
    school: "Bethune-Cookman University",
    place: "Daytona Beach, FL",
    dates: "2008 to 2012",
    details: [
      {
        text: "Performed with the Marching Wildcat Band and the Symphonic Band.",
        src: "M188",
        needs: "music-tech",
      },
    ],
  },
];

/**
 * Roles the mix leaves out still appear as one line each under this heading,
 * so a single-craft resume never shows a gap in employment.
 */
export const ADDITIONAL_HEADING = "Additional Experience";

/** Always on the resume. */
export const PUBLICATIONS: Bullet[] = [
  { text: "IEEE RESPECT 2021. Your Voice Is Power, co-author.", src: "M85, M207" },
  { text: "ASEE Annual Conference and Exposition 2023. Your Voice Is Power curriculum study, co-author.", src: "M85, M210" },
  { text: "ACM CHI 2020. Planet Bug: Promoting Awareness of Declining Insect Populations, co-author.", src: "M85, M212" },
];
