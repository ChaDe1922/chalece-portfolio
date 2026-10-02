import { cn } from "@/lib/utils";
import { countLabel, minLabel, type CourseGroup } from "./course";
import { ChevronIcon } from "./icons";

type Props = {
  group: CourseGroup;
  off: boolean;
  longest: number;
  headingId: string;
  cardsId: string;
  onToggle: () => void;
};

const DIM = "transition-opacity duration-200 motion-reduce:transition-none";

/** A craft's channel strip: name, size, a minutes bar and the Hide/Show button. */
export function CraftStrip({ group: g, off, longest, headingId, cardsId, onToggle }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-night-line bg-night-strip py-2.5 pr-2.5 pl-3.5 md:flex-nowrap md:gap-3.5 md:pl-[18px]">
      <span
        aria-hidden="true"
        className={cn("size-2.5 shrink-0 rounded-full", DIM, off && "opacity-45")}
        style={{ background: g.color }}
      />
      <h2
        id={headingId}
        className={cn(
          "font-display text-xl font-bold tracking-[-0.02em] text-night-fg md:text-[22px]",
          DIM,
          off && "opacity-45"
        )}
      >
        {g.name}
      </h2>
      <p className="font-mono text-xs text-night-muted">
        {countLabel(g.items.length)} · {minLabel(g.minutes)}
      </p>
      <span aria-hidden="true" className={cn("ml-2 hidden h-1 flex-1 rounded-sm bg-night-line md:block", DIM, off && "opacity-45")}>
        <span
          className="block h-full rounded-sm transition-[width] duration-200 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
          style={{ width: off ? "0%" : `${(g.minutes / longest) * 100}%`, background: g.color }}
        />
      </span>
      <button
        type="button"
        aria-expanded={!off}
        aria-controls={cardsId}
        aria-label={`${off ? "Show" : "Hide"} ${g.name} lessons`}
        onClick={onToggle}
        className="ml-auto inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-[10px] border border-night-line-strong px-3 font-mono text-xs font-medium text-night-muted hover:text-night-fg md:ml-0"
      >
        <ChevronIcon up={!off} />
        {off ? "Show" : "Hide"}
      </button>
    </div>
  );
}
