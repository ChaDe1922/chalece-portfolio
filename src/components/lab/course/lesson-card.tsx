import Link from "next/link";
import type { Ref } from "react";
import { cn } from "@/lib/utils";
import { CRAFTS, metaLine, minLabel, scrubLabel, timeLabel, type CourseLesson } from "./course";
import { ChevronIcon, PlayIcon, ThumbIcon } from "./icons";

type Props = {
  lesson: CourseLesson;
  selected: boolean;
  /** Spans both columns: the selected lesson, or the only one in its craft. */
  wide: boolean;
  onToggle: () => void;
  ref?: Ref<HTMLElement>;
};

const CHIP = "absolute rounded-md bg-[rgba(15,17,21,0.78)] px-2 py-[3px] font-mono text-xs text-night-fg";

function StartLink({ lesson, filled, className }: { lesson: CourseLesson; filled: boolean; className?: string }) {
  const color = CRAFTS[lesson.craft].color;
  const props = {
    className: cn(
      "inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] text-sm font-semibold",
      filled ? "h-12 px-5 text-night" : "h-11 border-[1.5px] px-4 text-night-fg hover:bg-night-raised",
      className
    ),
    style: filled ? { background: color } : { borderColor: color },
    children: (
      <>
        <PlayIcon />
        {filled ? "Start the lesson" : "Start"}
        <span className="sr-only">: {lesson.short}</span>
      </>
    ),
  };
  return lesson.external ? <a href={lesson.href} {...props} /> : <Link href={lesson.href} {...props} />;
}

/** One lesson in the course. The wide layout adds its objectives when selected. */
export function LessonCard({ lesson: l, selected, wide, onToggle, ref }: Props) {
  const craft = CRAFTS[l.craft];
  const detailsId = `l-${l.id}-details`;
  const segments = Array.from({ length: l.slides || 1 }, (_, i) => i + 1);

  return (
    <article
      ref={ref}
      id={`l-${l.id}`}
      tabIndex={-1}
      aria-labelledby={`l-${l.id}-title`}
      className={cn(
        "flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-night-surface outline-none",
        wide && "md:col-span-2 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start md:gap-6 md:p-[18px]"
      )}
      style={{ borderColor: selected ? craft.color : "var(--color-night-line)" }}
    >
      <div>
        <div
          aria-hidden="true"
          className={cn("relative grid aspect-video place-items-center", wide && "md:rounded-[10px]")}
          style={{ background: craft.tint }}
        >
          <ThumbIcon path={l.icon} color={craft.color} />
          <span className={cn(CHIP, "top-3 left-3")}>{l.n}</span>
          <span className={cn(CHIP, "right-3 bottom-3")}>{timeLabel(l.minutes)}</span>
        </div>
        <div className={cn("px-4 pt-3.5 md:px-[18px]", wide && "md:px-0")}>
          <div role="img" aria-label={scrubLabel(l)} className="flex h-1.5 gap-0.5">
            {segments.map((k) => (
              <span
                key={k}
                className="flex-1 rounded-sm"
                style={{ background: k === l.checkpoint ? craft.color : craft.soft }}
              />
            ))}
          </div>
        </div>
        {wide && <p className="mt-2.5 hidden font-mono text-xs text-night-muted md:block">{metaLine(l)}</p>}
      </div>

      <div className={cn("flex flex-1 flex-col px-4 pt-3.5 pb-4 md:px-[18px]", wide && "md:p-0 md:pt-0.5")}>
        <p className="font-mono text-xs" style={{ color: craft.color }}>
          {l.eyebrow}
        </p>
        <h3
          id={`l-${l.id}-title`}
          className={cn(
            "mt-2 font-display text-[21px] font-bold leading-[1.15] tracking-[-0.02em] text-night-fg text-balance md:text-[22px]",
            wide && "md:text-[28px] md:leading-[1.1] md:tracking-[-0.025em]"
          )}
        >
          {l.title}
        </h3>
        <p className={cn("mt-2 flex-1 text-[15px] leading-[1.55] text-night-body text-pretty", wide && "md:mt-2.5 md:leading-[1.6]")}>
          {l.blurb}
        </p>
        <p className={cn("mt-3 font-mono text-xs text-night-muted md:mt-3.5", wide && "md:hidden")}>{metaLine(l)}</p>

        <div id={detailsId} hidden={!selected} className="mt-4 border-t border-night-line pt-4">
          {l.objectives.length > 0 ? (
            <>
              <p className="text-sm font-semibold text-night-fg">By the end, you will be able to:</p>
              <ul className="mt-2.5 grid gap-2">
                {l.objectives.map((o) => (
                  <li key={o} className="flex gap-3 text-[15px] leading-normal text-night-body">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-0.5 w-3 shrink-0 md:mt-[0.75em]"
                      style={{ background: craft.color }}
                    />
                    {o}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-[15px] leading-normal text-night-body">
              Jump straight in. It takes about {minLabel(l.minutes)}.
            </p>
          )}
        </div>
        {selected && <StartLink lesson={l} filled className="mt-4 h-[52px] w-full md:hidden" />}

        <div className={cn("mt-1.5 flex items-center justify-between gap-3 md:mt-2", wide && "md:mt-[18px]")}>
          <button
            type="button"
            aria-expanded={selected}
            aria-controls={detailsId}
            onClick={onToggle}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 px-1 text-sm font-medium text-night-fg"
          >
            {selected ? "Hide details" : "What you'll learn"}
            <ChevronIcon up={selected} />
          </button>
          {selected ? (
            <StartLink lesson={l} filled className="hidden md:inline-flex" />
          ) : (
            <StartLink lesson={l} filled={false} />
          )}
        </div>
      </div>
    </article>
  );
}
