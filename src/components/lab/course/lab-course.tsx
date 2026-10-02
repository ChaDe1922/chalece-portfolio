"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SHELL } from "@/components/night/shell";
import { groupLessons, type CourseLesson } from "./course";
import { CourseMeters } from "./course-meters";
import { OutlineGroups } from "./course-outline";
import { CraftStrip } from "./craft-strip";
import { CourseHero } from "./course-hero";
import { LessonCard } from "./lesson-card";
import { ChevronIcon } from "./icons";

type Props = { lessons: CourseLesson[]; defaultSelected: string };

/**
 * The /lab course: hero with the craft meters, an outline, and one section per
 * craft. Hiding a craft anywhere hides it everywhere: strip, outline and meter.
 */
export function LabCourse({ lessons, defaultSelected }: Props) {
  const groups = groupLessons(lessons);
  const longest = Math.max(...groups.map((g) => g.minutes));
  const total = groups.reduce((t, g) => t + g.minutes, 0);

  const [selected, setSelected] = useState(defaultSelected);
  const [collapsed, setCollapsed] = useState<Partial<Record<string, boolean>>>({});
  const [contentsOpen, setContentsOpen] = useState(false);
  // A fresh object per pick, so picking the same lesson twice still scrolls.
  const [jump, setJump] = useState<{ id: string } | null>(null);
  const cards = useRef(new Map<string, HTMLElement>());

  const toggleGroup = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const pick = (id: string) => {
    const craft = lessons.find((l) => l.id === id)?.craft;
    if (craft) setCollapsed((c) => ({ ...c, [craft]: false }));
    setSelected(id);
    setContentsOpen(false);
    setJump({ id });
  };

  // Scroll after the pick renders, so an opened section and the wide card are in place.
  useEffect(() => {
    if (!jump) return;
    const card = cards.current.get(jump.id);
    if (card) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      card.focus({ preventScroll: true });
      history.replaceState(null, "", `#l-${jump.id}`);
    }
  }, [jump]);

  const outline = (idPrefix: string) => (
    <OutlineGroups
      idPrefix={idPrefix}
      groups={groups}
      collapsed={collapsed}
      selected={selected}
      onToggleGroup={toggleGroup}
      onPick={pick}
    />
  );

  return (
    <>
      <CourseHero first={lessons[0]} count={lessons.length} crafts={groups.length} total={total}>
        <CourseMeters groups={groups} collapsed={collapsed} total={total} />
      </CourseHero>

      <div id="contents" className={cn(SHELL, "scroll-mt-24 pt-14 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10")}>
        <aside
          aria-label="Lesson outline"
          className="sticky top-24 hidden rounded-2xl border border-night-line bg-night-surface px-3.5 pt-5 pb-3 lg:block"
        >
          <p className="mx-1 font-mono text-xs uppercase text-night-muted">Contents</p>
          {outline("outline")}
        </aside>

        <div>
          <div className="lg:hidden">
            <button
              type="button"
              aria-expanded={contentsOpen}
              aria-controls="contents-panel"
              onClick={() => setContentsOpen((o) => !o)}
              className="flex min-h-[60px] w-full cursor-pointer items-center justify-between rounded-xl border border-night-line-strong bg-night-surface px-4 text-[15px] font-semibold text-night-fg"
            >
              Contents · {lessons.length} lessons
              <ChevronIcon up={contentsOpen} />
            </button>
            <nav
              id="contents-panel"
              aria-label="Lesson outline"
              hidden={!contentsOpen}
              className="mt-2 rounded-xl border border-night-line px-1.5 pb-1.5"
            >
              {outline("contents")}
            </nav>
          </div>

          {groups.map((g) => {
            const off = !!collapsed[g.key];
            const headingId = `craft-${g.key}`;
            const cardsId = `craft-${g.key}-lessons`;
            return (
              <section key={g.key} aria-labelledby={headingId} className="mt-9 lg:mt-0 lg:mb-11">
                <CraftStrip
                  group={g}
                  off={off}
                  longest={longest}
                  headingId={headingId}
                  cardsId={cardsId}
                  onToggle={() => toggleGroup(g.key)}
                />
                <div id={cardsId} hidden={off} className="mt-3 grid gap-3.5 md:mt-4 md:grid-cols-2 md:gap-4">
                  {g.items.map((l) => (
                    <LessonCard
                      key={l.id}
                      lesson={l}
                      selected={selected === l.id}
                      wide={selected === l.id || g.items.length === 1}
                      onToggle={() => setSelected((s) => (s === l.id ? "" : l.id))}
                      ref={(el) => {
                        if (el) cards.current.set(l.id, el);
                        else cards.current.delete(l.id);
                      }}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
