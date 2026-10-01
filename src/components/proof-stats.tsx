import { cn } from "@/lib/utils";
import type { Stat } from "@/data/stats";
import { StatBlock } from "@/components/stat-block";
import { Reveal } from "@/components/reveal";

/** A band of headline credibility stats. Pillar pages pass their own. */
export function ProofStats({ stats, label = "Proof points" }: { stats: Stat[]; label?: string }) {
  return (
    <section id="proof" aria-label={label} className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-5xl px-4 py-14 md:px-8 md:py-16 print:py-4">
        <Reveal
          className={cn(
            "grid grid-cols-2 gap-8 sm:gap-10",
            stats.length === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4"
          )}
        >
          {stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
