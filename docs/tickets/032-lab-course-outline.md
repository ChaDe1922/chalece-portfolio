# 032 - /lab as a course outline

**Goal:** Replace the /lab carousel with concept D, "Lab course player in an outline" (picked 2026-10-02). The eight lessons read as one short course: a hero with a mix of the three crafts, a sticky outline, and one section per craft with lesson cards.

**Source:** claude.ai canvas `RvDXFUHY8LU9tTRfe3t1zb`, Version 9, boards `D-desktop.dc.html` and `D-phone.dc.html`.

## Scope
- Hero on a surface band: eyebrow, "Learn by doing.", lede, a mono meta line (8 lessons · about 82 minutes · 3 crafts), "Start with lesson 1" and "See all lessons".
- Makeup panel: meters, one per craft, height = craft minutes over the longest craft (58 min). The owner's pick was meters ("4" on the workshop board).
- Contents: a sticky outline on desktop, a "Contents · 8 lessons" toggle on phones. Each craft group header collapses its section.
- Craft sections, in order Learning design, Software, Music technology: a strip with name, lesson count and minutes, a minutes bar on desktop, and a Hide/Show button.
- Lesson cards: a 16:9 thumbnail with a line icon, number badge and time chip; a slide scrubber that marks the checkpoint quiz; eyebrow, title, blurb, meta line; "What you'll learn" toggle and Start.
- The selected lesson, or the only lesson in a craft, renders as a wide card with its objectives and a filled "Start the lesson" button.
- Beliefs restyled as numbered rows beside a heading column; the hire card keeps "If these lessons spark an idea, let's talk."
- Lesson facts live in `src/data/labs.ts`. Objectives are read from each lesson's data file, not copied.

## Acceptance criteria
- [x] Collapsing a craft hides its cards, closes its outline group, dims its strip, and turns its meter to "Off" at 0.
- [x] Choosing a lesson in the outline selects it, opens its craft, and scrolls to its card.
- [x] Minutes, slide counts and checkpoint positions match the lesson decks.
- [x] Every toggle is a button with `aria-expanded`; meters and scrubbers have text labels.
- [x] Meter motion is 200ms on the standard ease and is instant under reduced motion.
- [x] No horizontal overflow at 375, 768 and 1280.
- [x] `check:portfolio`, `tsc --noEmit`, lint on changed files and `build` pass.

## Deviations from the design
- No progress label or bar in the outline. There is no completion tracking, so the site does not show progress it cannot know.
- `lesson-carousel.tsx` was deleted with the owner's OK (2026-10-02).
