"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { fourierLab } from "@/data/fourier-lab";
import { RichText } from "@/components/lab/rich-text";

const data = fourierLab.slides.outroOne;

/** Closing slide for Lesson 1: recap what you can do now, then a clickable teaser
 *  card that carries you into Part 2. */
export function OutroOne() {
  return (
    <div className="lesson-stagger space-y-6">
      <p className="text-lg leading-relaxed text-foreground">
        <RichText text={data.lead} />
      </p>

      <div className="rounded-2xl border border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-link">{data.recapLead}</p>
        <ul className="mt-3 space-y-2">
          {data.recap.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
              <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="min-w-0 flex-1">
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={data.nextHref}
        className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-link/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowRight aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-link transition-transform duration-200 group-hover:translate-x-0.5" />
        <div className="space-y-2">
          <p className="font-heading text-base font-semibold text-foreground">{data.nextLead}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{data.nextNote}</p>
          <span className="mt-1 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/80">
            {data.nextCta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </span>
        </div>
      </Link>

      <p className="pt-2 text-sm italic text-muted-foreground">{data.byline}</p>
    </div>
  );
}
