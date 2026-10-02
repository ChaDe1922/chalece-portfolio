import { cn } from "@/lib/utils";
import { minLabel, type CourseGroup } from "./course";
import { ChevronIcon } from "./icons";

type Props = {
  /** Keeps ids unique between the desktop and phone copies. */
  idPrefix: string;
  groups: CourseGroup[];
  collapsed: Partial<Record<string, boolean>>;
  selected: string;
  onToggleGroup: (key: string) => void;
  onPick: (id: string) => void;
};

/** The craft groups and their lessons. Each group header hides its section. */
export function OutlineGroups({ idPrefix, groups, collapsed, selected, onToggleGroup, onPick }: Props) {
  return (
    <>
      {groups.map((g) => {
        const off = !!collapsed[g.key];
        const listId = `${idPrefix}-${g.key}`;
        return (
          <div key={g.key} className="mt-3.5">
            <button
              type="button"
              aria-expanded={!off}
              aria-controls={listId}
              aria-label={`${off ? "Show" : "Hide"} ${g.name} lessons`}
              onClick={() => onToggleGroup(g.key)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg pr-2 pl-1 text-left font-mono text-xs transition-opacity duration-200 motion-reduce:transition-none",
                off && "opacity-45"
              )}
              style={{ color: g.color }}
            >
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: g.color }} />
              <span className="flex-1">{g.name}</span>
              <span className="text-night-muted">{g.items.length}</span>
              <span className="text-night-muted">
                <ChevronIcon up={!off} />
              </span>
            </button>
            <ul id={listId} hidden={off}>
              {g.items.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#l-${l.id}`}
                    aria-current={selected === l.id ? "true" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onPick(l.id);
                    }}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-[10px] px-2 py-[7px] hover:bg-night-raised lg:min-h-[46px]",
                      selected === l.id && "bg-night-raised"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-7 shrink-0 place-items-center rounded-full border-[1.5px] font-mono text-[11px]"
                      style={{ borderColor: g.color, color: g.color }}
                    >
                      {l.n}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-[1.3] text-night-fg">{l.short}</span>
                    <span className="font-mono text-xs text-night-muted">{minLabel(l.minutes)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
