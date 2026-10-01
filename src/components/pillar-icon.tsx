import { AudioWaveform, BookOpenText, SquareTerminal, type LucideIcon } from "lucide-react";
import type { PillarIconName } from "@/data/pillars";

/** pillars.ts stores icons by name (it has no runtime imports), mapped here. */
const icons: Record<PillarIconName, LucideIcon> = {
  BookOpenText,
  AudioWaveform,
  SquareTerminal,
};

export function PillarIcon({ name, className }: { name: PillarIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className={className} />;
}
