import { stats } from "@/data/stats";
import { StatBlock } from "@/components/stat-block";
import { Reveal } from "@/components/reveal";

/** Four headline credibility stats. */
export function ProofStats() {
  return (
    <section
      id="proof"
      aria-label="Proof points"
      className="border-y border-border/60 bg-secondary/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-16 print:py-6">
        <Reveal className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
