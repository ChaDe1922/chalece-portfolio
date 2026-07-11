import { stats } from "@/data/stats";
import { StatBlock } from "@/components/stat-block";
import { Reveal } from "@/components/reveal";

/**
 * Slim proof strip. Reuses the verified stats and the count-up StatBlock.
 * Note: the brief's "14+ AI and multi-agent systems" is intentionally NOT shown
 * here yet, because that number is not in the verified data (see the
 * verified:false metric on the ai-curriculum-systems project). Add it once
 * confirmed.
 */
export function MetricStrip() {
  return (
    <section aria-label="Proof points" className="border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-14">
        <Reveal className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatBlock key={stat.label} stat={stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
