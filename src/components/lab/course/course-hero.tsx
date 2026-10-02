import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SHELL } from "@/components/night/shell";
import type { CourseLesson } from "./course";
import { PlayIcon } from "./icons";

type Props = {
  first: CourseLesson;
  count: number;
  crafts: number;
  total: number;
  /** The craft meters. */
  children: ReactNode;
};

const PRIMARY =
  "inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[10px] bg-night-fg px-6 text-base font-semibold text-night";

/** The /lab hero: the pitch on the left, the mix of crafts on the right. */
export function CourseHero({ first, count, crafts, total, children }: Props) {
  const start = (
    <>
      <PlayIcon />
      Start with lesson 1
    </>
  );

  return (
    <section aria-labelledby="lab-heading" className="border-b border-night-line bg-night-surface">
      <div
        className={cn(
          SHELL,
          "pt-10 pb-8 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-14 lg:pt-[72px] lg:pb-16"
        )}
      >
        <div>
          <p className="font-mono text-[13px] text-night-muted lg:text-sm">{"// lab · interactive lessons"}</p>
          <h1
            id="lab-heading"
            className="mt-3.5 font-display text-5xl leading-[0.98] font-bold tracking-[-0.045em] text-night-fg lg:mt-4 lg:text-[76px]"
          >
            Learn by doing.
          </h1>
          <p className="mt-4 max-w-[540px] text-[17px] leading-[1.6] text-night-body lg:mt-5 lg:text-lg">
            Short, hands-on lessons that run right in your browser. No setup, no account. Pick one and start
            clicking.
          </p>
          <p className="mt-4 font-mono text-xs text-night-muted lg:text-[13px]">
            {count} lessons · about {total}
            <span className="lg:hidden"> min · {crafts} crafts</span>
            <span className="hidden lg:inline"> minutes · {crafts} crafts · no setup, no account</span>
          </p>
          <div className="mt-[22px] flex gap-3 lg:mt-7">
            {first.external ? (
              <a href={first.href} className={cn(PRIMARY, "w-full lg:w-auto")}>
                {start}
              </a>
            ) : (
              <Link href={first.href} className={cn(PRIMARY, "w-full lg:w-auto")}>
                {start}
              </Link>
            )}
            <a
              href="#contents"
              className="hidden h-[52px] items-center rounded-[10px] border border-night-line-strong px-[22px] text-base font-medium text-night-fg hover:bg-night-raised lg:inline-flex"
            >
              See all lessons
            </a>
          </div>
        </div>
        <div className="mt-6 lg:mt-0">{children}</div>
      </div>
    </section>
  );
}
