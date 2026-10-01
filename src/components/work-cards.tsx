import { cn } from "@/lib/utils";
import type { WorkItem } from "@/data/work";
import { WorkCard } from "@/components/work-card";
import { Reveal } from "@/components/reveal";

/** The even card grid: 1 column on mobile, 2 on tablet, 3 on desktop.
 *  Cards stretch to equal heights per row. */
export function WorkCards({ items, className }: { items: WorkItem[]; className?: string }) {
  return (
    <Reveal
      className={cn(
        "work-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 print:mt-4 print:gap-3",
        className
      )}
    >
      {items.map((item) => (
        <WorkCard key={item.title} item={item} />
      ))}
    </Reveal>
  );
}
