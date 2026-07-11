import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { leadershipThesis, leadershipPrinciples } from "@/data/leadership";

/** Preview of the leadership operating system: the thesis, the six principles,
 *  and a route to the full page. */
export function LeadershipPreview() {
  return (
    <section aria-labelledby="leadership-heading">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            id="leadership-heading"
            eyebrow={leadershipThesis.eyebrow}
            title={leadershipThesis.title}
            description={leadershipThesis.intro}
          />
        </Reveal>

        <Reveal className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {leadershipPrinciples.map((principle, i) => (
            <div key={principle.id} className="flex gap-4">
              <span className="font-mono text-sm text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {principle.prompt}
                </p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12">
          <Link
            href="/leadership"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            See my leadership operating system
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
