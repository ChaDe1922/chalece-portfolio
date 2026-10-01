import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { roleMailto, site } from "@/data/site";
import { labs } from "@/data/labs";
import { TeachingBeliefs } from "@/components/teaching-beliefs";
import { LessonCarousel } from "@/components/lab/lesson-carousel";
import { NightNav } from "@/components/night/night-nav";
import { NightFooter } from "@/components/night/night-footer";
import { EYEBROW, H2, SHELL } from "@/components/night/shell";

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
        <div className={cn(SHELL, "py-16 md:py-24")}>
          <p className={EYEBROW}>{"// lab · interactive lessons"}</p>
          <h1 className={H2}>Learn by doing.</h1>
          <p className="mt-3.5 max-w-[640px] text-lg leading-relaxed text-night-body">
            Short, hands-on lessons that run right in your browser. No setup, no account. Pick one and
            start clicking.
          </p>

          {/* The lessons, as a spotlight carousel. */}
          <LessonCarousel labs={labs} />

          {/* Andragogy beliefs, below the lessons, as interactive dropdowns. */}
          <div className="mt-16 border-t border-night-line pt-10">
            <div className="max-w-3xl">
              <TeachingBeliefs />
            </div>
          </div>

          <section
            aria-labelledby="hire-heading"
            className="mt-16 flex flex-col items-start gap-6 rounded-3xl border border-night-line bg-night-surface p-6 sm:p-10 md:flex-row md:items-center md:justify-between"
          >
            <h2
              id="hire-heading"
              className="max-w-[560px] font-display text-[clamp(1.5rem,3vw,2rem)] font-bold leading-[1.15] tracking-[-0.035em] text-night-fg"
            >
              Want someone who can build lessons like these? Email me about a role.
            </h2>
            <a
              href={roleMailto()}
              className="inline-flex h-[52px] shrink-0 items-center gap-2.5 rounded-[10px] bg-signal px-6 text-base font-semibold text-night"
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
