import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { site } from "@/data/site";
import { recursionLab } from "@/data/recursion-lab";
import { vibeCodingLab } from "@/data/vibe-coding-lab";

export const metadata: Metadata = {
  title: { absolute: "Interactive Lessons | Chalece DeLaCoudray" },
  description:
    "Hands-on, in-browser lessons by Chalece DeLaCoudray. Step through recursion, or vibe code your first interactive beat maker.",
  alternates: { canonical: "/lab" },
  openGraph: {
    type: "website",
    url: `${site.url}/lab`,
    title: "Interactive Lessons by Chalece DeLaCoudray",
    description: "Hands-on, in-browser lessons. Pick one and learn by doing.",
  },
};

const labs = [
  {
    href: "/lab/vibe-coding",
    eyebrow: "Vibe coding · ages 13 to 15",
    title: vibeCodingLab.meta.title,
    blurb:
      "Pick what to build, then direct, test, and improve a real working example with the say, test, adjust loop.",
  },
  {
    href: "/lab/recursion",
    eyebrow: "Computer science",
    title: recursionLab.meta.title,
    blurb:
      "Step into a mirror, open nested dolls, write your first recursive function, watch the call stack, then grow a fractal tree.",
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

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {labs.map((lab) => (
          <Link
            key={lab.href}
            href={lab.href}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-link/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-link">{lab.eyebrow}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">{lab.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{lab.blurb}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
              Start the lesson
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
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
