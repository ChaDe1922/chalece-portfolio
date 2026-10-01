import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Lab } from "@/data/labs";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const cardClass =
  "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** The /lab lessons that prove a pillar, as a small card grid. */
export function PillarLessons({ labs }: { labs: Lab[] }) {
  if (labs.length === 0) return null;
  return (
    <section id="lessons" aria-labelledby="lessons-heading" className="scroll-mt-24 lg:scroll-mt-32 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-20 md:px-8 md:py-24 print:hidden">
        <Reveal>
          <SectionHeading
            id="lessons-heading"
            eyebrow="Try it"
            title="Lessons you can use right now."
            description="Each one runs in your browser. No setup and no account."
          />
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => {
            const body = (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-link">{lab.eyebrow}</p>
                <h3 className="mt-2 flex items-start justify-between gap-3 font-heading text-lg font-semibold leading-tight">
                  {lab.title}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{lab.blurb}</p>
              </>
            );
            return lab.external ? (
              <a key={lab.id} href={lab.href} className={cardClass}>
                {body}
              </a>
            ) : (
              <Link key={lab.id} href={lab.href} className={cardClass}>
                {body}
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
