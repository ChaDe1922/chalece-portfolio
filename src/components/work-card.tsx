import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { WorkItem } from "@/data/work";

/** A single featured-work tile. With an href it is a full-card link with a
 *  hover lift; without one it is a non-interactive card (no fake affordance). */
export function WorkCard({ item }: { item: WorkItem }) {
  const cardBody = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold leading-tight print:text-[15px]">
          {item.title}
        </h3>
        {item.href ? (
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link"
          />
        ) : null}
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground print:mt-2 print:text-[11px] print:leading-snug">
        {item.description}
      </p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-4 print:gap-1.5 print:pt-2.5">
        {item.tags.map((tag) => (
          <li key={tag}>
            <Badge variant="secondary" className="font-normal">
              {tag}
            </Badge>
          </li>
        ))}
      </ul>
    </>
  );

  const base =
    "work-card group flex h-full flex-col rounded-2xl border p-5 transition-all duration-200 print:rounded-xl print:p-3";

  if (item.href) {
    const isExternal = item.href.startsWith("http");
    return (
      <a
        href={item.href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={cn(
          base,
          // Gentle violet wash + soft violet border so linked cards read as clickable.
          "border-link/30 bg-[color-mix(in_oklch,var(--link)_6%,var(--card))] hover:-translate-y-1 hover:border-link/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {cardBody}
        {isExternal ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </a>
    );
  }

  return <div className={cn(base, "border-border bg-card")}>{cardBody}</div>;
}
