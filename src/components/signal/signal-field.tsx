import { StaticSignalField } from "@/components/signal/static-signal-field";

/**
 * Hero signal field wrapper. Renders the static SVG today. This is the seam a
 * later increment uses to mount an animated <canvas> sibling over the identical
 * SVG structure (capability- and motion-gated), without changing the DOM
 * contract or the semantic order around the hero H1.
 */
export function SignalField({ className }: { className?: string }) {
  return <StaticSignalField className={className} />;
}
