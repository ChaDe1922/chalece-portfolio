import { cn } from "@/lib/utils";
import type { Pillar } from "@/data/pillars";
import { PillarIcon } from "@/components/pillar-icon";

/** Pillar page header: eyebrow, h1, accent rule, and summary. */
export function PillarIntro({ pillar }: { pillar: Pillar }) {
  return (
    <section aria-labelledby="pillar-heading" className="relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-20 md:px-8 md:pb-20 md:pt-28 print:py-4">
        <p className={cn("enter enter-1 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em]", pillar.accent.ink)}>
          <PillarIcon name={pillar.icon} className={cn("size-5", pillar.accent.icon)} />
          {pillar.name}
        </p>
        <h1
          id="pillar-heading"
          className="enter enter-2 mt-5 max-w-4xl text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl"
        >
          {pillar.headline}
        </h1>
        <span aria-hidden="true" className={cn("enter enter-3 mt-6 block h-[3px] w-12 rounded-full", pillar.accent.solid)} />
        <p className="enter enter-3 mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          {pillar.summary}
        </p>
      </div>
    </section>
  );
}
