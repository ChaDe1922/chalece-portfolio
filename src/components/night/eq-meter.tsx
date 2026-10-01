import { cn } from "@/lib/utils";

const HEIGHTS = ["60%", "100%", "45%", "80%"];

/** Four bouncing bars in the signal colour. Still under reduced motion. */
export function EqMeter({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("eq-live inline-flex h-3.5 items-end gap-0.5", className)}>
      {HEIGHTS.map((h, i) => (
        <span key={i} className="w-[3px] bg-signal transition-colors duration-200" style={{ height: h }} />
      ))}
    </span>
  );
}
