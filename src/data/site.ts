/**
 * Single source of truth for site-wide content: identity, links, SEO copy,
 * and nav. Update here, not in component JSX. Per-pillar copy, stats, and
 * track resumes live in pillars.ts.
 * Copy style rule: no em dashes anywhere.
 * Copy source: Marketing OS WF-024 messaging, prepared, awaiting approval.
 */

/** Default subject for role emails from the hero, nav, footer and lab. */
export const ROLE_SUBJECT = "Role inquiry";

export const site = {
  name: "Chalece DeLaCoudray",
  role: "Music Technologist, Software Developer and Learning Designer",
  /** The umbrella line that ties the three pillars together. */
  umbrella: "I create, I build, and I teach.",
  // Used for metadataBase and absolute URLs. Update when the custom domain lands.
  url: "https://chalece-portfolio.vercel.app",
  location: "Atlanta, Remote",
  email: "cdelacoudray@gmail.com",
  headshotPath: "/headshot.png",
  // Flip to true once a real headshot is placed at public/headshot.png.
  // Until then the About section shows a polished monogram placeholder.
  hasHeadshot: true,
  initials: "CD",

  links: {
    linkedin: "https://www.linkedin.com/in/chalecedelacoudray",
    coursera: "https://www.coursera.org/instructor/~88911140",
    github: "https://github.com/ChaDe1922",
    email: "mailto:cdelacoudray@gmail.com",
  },

  seo: {
    title: "Chalece DeLaCoudray | Learning Design, Music Tech, Software",
    description:
      "I create, I build, and I teach. Learning designer with 48,000+ learners on Coursera, music technologist with a Georgia Tech M.S., and software developer.",
    /** Umbrella keywords. Pillar keywords are merged in from pillars.ts. */
    keywords: [
      "Chalece DeLaCoudray",
      "Atlanta",
      "remote",
    ],
  },
  /** Contact line. Names roles in all three pillars. */
  openTo:
    "I'm based in Atlanta and open to remote roles in learning experience design, music technology and software development. Email me about a role, or connect on LinkedIn.",
} as const;

export type NavItem = { label: string; href: string };

/** Route links, so the nav works from every page. Pillar links come first. */
export const navItems: NavItem[] = [
  { label: "Music Tech", href: "/music-tech" },
  { label: "Software", href: "/software" },
  { label: "Learning Design", href: "/curriculum" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

/** A mailto link to Chalece with a subject line. */
export function roleMailto(subject: string = ROLE_SUBJECT): string {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}

/** Browser tab title for a lesson: "Anatomy of a sound | Chalece DeLaCoudray". */
export function lessonTitle(title: string): string {
  return `${title.replace(/\.$/, "")} | ${site.name}`;
}

/**
 * Share image for lesson pages. A lesson sets its own openGraph, and Next merges
 * metadata shallowly, so it has to name the /lab image or it ships without one.
 */
export const LAB_OG_IMAGE = {
  url: "/lab/opengraph-image",
  width: 1200,
  height: 630,
  alt: `Interactive lessons by ${site.name}`,
};
