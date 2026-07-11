import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { leadershipThesis, leadershipPrinciples } from "@/data/leadership";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Leadership",
  description:
    "How Chalece DeLaCoudray directs learning work: a quality bar built into strategy, workflow, medium, feedback, and the definition of done.",
  path: "/leadership",
});

export default function LeadershipPage() {
  return (
    <div data-scene="ivory" className="bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          eyebrow={leadershipThesis.eyebrow}
          title={leadershipThesis.title}
          description={leadershipThesis.intro}
        />

        <ol className="mt-12 grid gap-6 sm:grid-cols-2">
          {leadershipPrinciples.map((principle, i) => (
            <li
              key={principle.id}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 font-heading text-xl font-semibold">
                {principle.title}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {principle.prompt}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-2xl font-mono text-xs uppercase tracking-widest text-muted-foreground">
          The interactive quality-bar operating system is in production.
        </p>
      </section>
    </div>
  );
}
