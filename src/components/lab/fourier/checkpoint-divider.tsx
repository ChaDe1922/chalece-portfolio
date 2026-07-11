import { Diamond } from "lucide-react";

/** A slim labeled divider that separates "learn" from "try it": a hairline rule
 *  with a centered label. Used before a formative check so the shift from teaching
 *  to practice is clear. */
export function CheckpointDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-border" />
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-link">
        <Diamond aria-hidden="true" className="size-3 fill-current" />
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
