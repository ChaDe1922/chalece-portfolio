import { stats } from "@/data/stats";
import { StatBlock } from "@/components/stat-block";
import { Reveal } from "@/components/reveal";

/** Four headline credibility stats, set as a hairline-divided row. */
export function ProofStats() {
  return (
    <section
      id="proof"
      aria-label="Proof points"
      className="border-y border-border bg-background"
    >
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-14 print:py-4">
        <Reveal className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
