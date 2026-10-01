"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { work, workForPillar } from "@/data/work";
import { isPillarId, pillars, type PillarId } from "@/data/pillars";
import { PillarIcon } from "@/components/pillar-icon";
import { WorkCards } from "@/components/work-cards";

const chipBase =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background forced-colors:border forced-colors:aria-pressed:border-3 forced-colors:aria-pressed:underline";

/**
 * The homepage work grid with an All + three pillar filter. The choice lives in
 * `?pillar=` so a filtered view can be shared and survives a refresh. Rendered
 * inside <Suspense>; the fallback is the full grid, so no-JS and crawlers see
 * every card.
 */
export function WorkFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const param = searchParams.get("pillar");
  const active = isPillarId(param) ? param : null;
  const items = active ? workForPillar(active) : work;

  function select(next: PillarId | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("pillar", next);
    else params.delete("pillar");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}#work`, { scroll: false });
  }

  return (
    <>
      <div role="group" aria-label="Filter work by pillar" className="mt-8 flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => select(null)}
          className={cn(
            chipBase,
            active === null
              ? "bg-foreground font-medium text-background"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
          )}
        >
          All work
        </button>
        {pillars.map((pillar) => {
          const pressed = active === pillar.id;
          return (
            <button
              key={pillar.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => select(pillar.id)}
              className={cn(
                chipBase,
                pressed
                  ? cn("font-medium", pillar.accent.solid, pillar.accent.onSolid)
                  : cn(pillar.accent.subtle, pillar.accent.ink, "hover:brightness-95 dark:hover:brightness-110")
              )}
            >
              <PillarIcon
                name={pillar.icon}
                className={cn("size-4 shrink-0", pressed ? pillar.accent.onSolid : pillar.accent.icon)}
              />
              {pillar.short}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {active ? `Showing ${items.length} ${pillarLabel(active)} items` : `Showing all ${items.length} items`}
      </p>
      <WorkCards items={items} className="mt-6" />
    </>
  );
}

function pillarLabel(id: PillarId): string {
  return pillars.find((p) => p.id === id)?.short ?? id;
}
