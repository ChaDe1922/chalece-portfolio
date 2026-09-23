import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/data/work";

type WorkCardProps = {
  item: WorkItem;
  /** 1-based position in the grid, rendered as a mono index (01, 02, ...). */
  index: number;
};

/** A single selected-work cell in the hairline grid. With an href it is a
 *  full-cell link whose hover is an inset bronze rule and a moving arrow;
 *  without one it is a non-interactive cell (no fake affordance). */
export function WorkCard({ item, index }: WorkCardProps) {
  const isExternal = item.href?.startsWith("http") ?? false;
  /* Linked cells name their destination next to the arrow so the affordance
   * reads at rest (touch has no hover) and unlinked cells visibly differ. */
  const destination = item.href
    ? isExternal
      ? new URL(item.href).hostname.replace(/^www\./, "")
      : "Open"
    : null;

  const cardBody = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="eyebrow print:text-[10px]">
          {String(index).padStart(2, "0")}
        </span>
        {destination ? (
          <span className="eyebrow flex items-center gap-1 transition-colors group-hover:text-link group-focus-visible:text-link print:text-[10px]">
            {destination}
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5" />
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-xl leading-snug transition-colors group-hover:text-link group-focus-visible:text-link print:mt-3 print:text-[15px]">
        {item.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground print:mt-2 print:text-[11px] print:leading-snug">
        {item.description}
      </p>
      <p className="eyebrow mt-auto pt-5 print:pt-2.5 print:text-[10px]">
        {item.tags.join(" · ")}
      </p>
    </>
  );

  const base =
    "work-card flex h-full flex-col bg-card p-6 transition-colors duration-200 print:p-3";

  if (item.href) {
    return (
      <a
        href={item.href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={cn(
          base,
          "group hover:ring-1 hover:ring-inset hover:ring-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        )}
      >
        {cardBody}
        {isExternal ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </a>
    );
  }

  return <div className={base}>{cardBody}</div>;
}
