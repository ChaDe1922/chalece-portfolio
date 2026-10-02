import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { roleMailto, site } from "@/data/site";
import { labs } from "@/data/labs";
import { TeachingBeliefs } from "@/components/teaching-beliefs";
import { LabCourse } from "@/components/lab/course/lab-course";
import { courseOrder } from "@/components/lab/course/course";
import { NightNav } from "@/components/night/night-nav";
import { NightFooter } from "@/components/night/night-footer";
import { SHELL } from "@/components/night/shell";

export const metadata: Metadata = {
  title: { absolute: "Interactive Lessons | Chalece DeLaCoudray" },
  description:
    "Interactive lessons I designed and coded, across music tech, software and learning design. Build a synth, step through recursion, or see what Git does underneath.",
  alternates: { canonical: "/lab" },
  openGraph: {
    type: "website",
    url: `${site.url}/lab`,
    title: "Interactive Lessons by Chalece DeLaCoudray",
    description:
      "Interactive lessons I designed and coded, across music tech, software and learning design. Build a synth, step through recursion, or see what Git does underneath.",
  },
};

// Plain props only, so the client course never bundles the lesson decks.
const lessons = courseOrder(
  labs.map((lab) => ({
    id: lab.id,
    href: lab.href,
    external: !!lab.external,
    eyebrow: lab.eyebrow,
    title: lab.title,
    blurb: lab.blurb,
    craft: lab.pillar,
    short: lab.short,
    minutes: lab.minutes,
    slides: lab.slides,
    checkpoint: lab.checkpoint,
    objectives: [...lab.objectives],
    icon: lab.icon,
  }))
);

export default function LabIndexPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-night-fg focus:px-4 focus:py-2 focus:text-night focus:shadow-lg print:hidden"
      >
        Skip to content
      </a>
      <NightNav />
      <main id="main" className="flex-1">
        <LabCourse lessons={lessons} defaultSelected="git" />
        <div className={cn(SHELL, "pb-16 md:pb-24")}>
          <TeachingBeliefs />

          <section
            aria-labelledby="hire-heading"
            className="mt-14 flex flex-col items-start gap-5 rounded-[20px] border border-night-line bg-night-surface p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:rounded-3xl md:p-10 lg:mt-[72px]"
          >
            <h2
              id="hire-heading"
              className="max-w-[560px] text-balance font-display text-[26px] font-bold leading-[1.15] tracking-[-0.035em] text-night-fg md:text-[32px]"
            >
              If these lessons spark an idea, let&apos;s talk.
            </h2>
            <a
              href={roleMailto()}
              className="inline-flex h-[52px] w-full shrink-0 items-center justify-center gap-2.5 rounded-[10px] bg-night-fg px-6 text-base font-semibold text-night md:w-auto"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email me
            </a>
          </section>
        </div>
      </main>
      <NightFooter />
    </>
  );
}
