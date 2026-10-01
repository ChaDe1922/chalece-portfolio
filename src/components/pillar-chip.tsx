import { cn } from "@/lib/utils";
import { pillarById, type PillarId } from "@/data/pillars";
import { PillarIcon } from "@/components/pillar-icon";

/** A pillar label: icon plus name on the pillar's quiet fill. The icon and the
 *  text carry the pillar, so it never relies on colour alone. */
export function PillarChip({ id, className }: { id: PillarId; className?: string }) {
  const pillar = pillarById[id];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium forced-colors:border",
        pillar.accent.subtle,
        pillar.accent.ink,
        className
      )}
    >
      <PillarIcon name={pillar.icon} className={cn("size-3.5 shrink-0", pillar.accent.icon)} />
      {pillar.short}
    </span>
  );
}
