import { cn } from "@/lib/utils";
import { countLabel, minLabel, type CourseGroup } from "./course";

type Props = {
  groups: CourseGroup[];
  collapsed: Partial<Record<string, boolean>>;
  total: number;
};

/** The makeup of the course as three channel meters. A hidden craft reads Off. */
export function CourseMeters({ groups, collapsed, total }: Props) {
  const longest = Math.max(...groups.map((g) => g.minutes));

  return (
    <div className="rounded-2xl border border-night-line bg-night p-[18px] lg:p-6">
      <p className="font-mono text-xs uppercase text-night-muted">The mix · {minLabel(total)}</p>
      <ul className="mt-[18px] grid grid-cols-3 gap-2.5 lg:gap-4">
        {groups.map((g) => {
          const off = !!collapsed[g.key];
          return (
            <li key={g.key} className="flex flex-col items-center gap-2.5">
              <span className="sr-only">
                {g.name}, {off ? "off" : `${countLabel(g.items.length)} · ${minLabel(g.minutes)}`}
              </span>
              <span aria-hidden="true" className={cn("font-mono text-xs", off ? "text-night-muted" : "text-night-fg")}>
                {off ? "Off" : minLabel(g.minutes)}
              </span>
              <span aria-hidden="true" className="relative h-[110px] w-7 overflow-hidden rounded-md bg-night-line lg:h-[140px]">
                <span
                  className="absolute inset-x-0 bottom-0 transition-[height] duration-200 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
                  style={{ height: off ? "0%" : `${(g.minutes / longest) * 100}%`, background: g.color }}
                />
              </span>
              <span aria-hidden="true" className="text-center font-mono text-xs" style={{ color: g.color }}>
                {g.name}
              </span>
              <span aria-hidden="true" className="text-xs text-night-muted">
                {countLabel(g.items.length)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
