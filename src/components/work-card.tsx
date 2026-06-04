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
        <h3 className="font-heading text-xl font-semibold leading-tight">
          {item.title}
        </h3>
        {item.href ? (
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-link"
          />
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
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
    "work-card group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 print:p-4";

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
          "hover:-translate-y-1 hover:border-link/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
