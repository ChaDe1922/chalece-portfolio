import { VolumeX } from "lucide-react";

/**
 * Visual-only sound control for the V2 header. The optional, user-controlled
 * sound layer ships in a later increment; this is a labeled, disabled
 * placeholder so the header composition is final now. It is intentionally
 * non-interactive and announced as unavailable.
 */
export function SoundControl() {
  return (
    <button
      type="button"
      disabled
      aria-label="Sound off. Sound experience coming soon."
      title="Sound experience coming soon"
      className="hidden items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline-flex print:hidden"
    >
      <VolumeX aria-hidden="true" className="size-4" />
      Sound off
    </button>
  );
}
