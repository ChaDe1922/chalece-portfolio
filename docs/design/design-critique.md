# Design Critique — Night Session (home, music-tech pillar, /lab, recursion lesson)

Reviewed: 2026-09-30 · Against: owner-picked Night Session mockups, Ableton Live session view, Linear dark UI (see `docs/design/design-references.md`)

## Verdict: ITERATE

The Night Session direction is genuinely considered, not generic: the console metaphor is structural (real solo/mute state, a DAW-style resume timeline, per-craft re-accenting on every lesson), the token layer is disciplined and contrast-verified, and motion is tokenized with real `prefers-reduced-motion` handling throughout. The single most important thing to fix is that a handful of components never got pulled into the Night token system and still hardcode raw Tailwind `emerald`/`amber`, plus `--destructive` was left un-redefined in `.theme-night` and now collides almost exactly with the music-tech coral accent. None of this is a redesign; it is finishing the token pass that the rest of the site already committed to.

## Findings

| # | Dimension | Verdict | Issue | Fix |
|---|---|---|---|---|
| 1 | References & standards | ✓ Pass | Owner mockups + 2 real references captured with borrow/avoid; build matches the committed direction | None — references now documented in `design-references.md` |
| 2 | Hierarchy | ✓ Pass | Hero verb buttons, console monitor, and pillar stat blocks each establish one clear focal point per section | None |
| 3 | Type | ✓ Pass | Syne/IBM Plex Sans/IBM Plex Mono is a deliberate pairing; fluid `clamp()` scale held consistently via `H2`/hero classes in `shell.ts` | Watch `display: "swap"` FOUT risk on the large tight-tracking (`-0.03em`) hero at first paint — polish, not a blocker |
| 4 | Spacing & layout | ✓ Pass | One shell (`SHELL`), one section rhythm (`py-16 md:py-24`) reused everywhere via `shell.ts` exports | None |
| 5 | Color | ⚠ Risk | `--formula-*` tokens (violet/blue/coral-red) are defined only in `:root`/`.dark`, not `.theme-night`, so `tone-formula.tsx` renders off-palette hues inside a coral lesson (confirmed in `1280_lab_fourier_2.png`) | Add `--formula-*` overrides inside `.theme-night` in `globals.css`, built from the active craft accent + `--coral`, or have `tone-formula.tsx` read `--signal`/`--coral`/`--foreground` instead of its own fixed palette |
| 6 | Contrast & theming | ⚠ Risk | `--destructive: #ff7a6b` is inherited unchanged from `.dark` inside `.theme-night`; it sits ~1–2° of hue from `--pillar-music`/`--signal` `#ff7a59`, so a wrong-answer state in a music-tech lesson nearly matches the brand accent | Add `--destructive` to the `.theme-night` block in `globals.css` (e.g. a cooler red distinct from coral) and re-verify AA contrast on `#0f1115` |
| 7 | Motion | ✓ Pass | Global reduced-motion kill switch plus component-level handling (`useReducedMotion()` shortens crossfade 0.32s→0.18s in `slide-deck.tsx`; `motion-reduce:` variants in `night-footer.tsx`); decorative effects (cursor trail, click-word bloom) are gated and non-informational | None |
| 8 | Genericness | ⚠ Risk | `recursion/quiz.tsx` and the shared `assessment/card.tsx` hardcode raw `emerald-300/500/600/950` and several lesson files hardcode raw `amber-*` for correct/warning states — the exact untouched-Tailwind-default tell the direction otherwise avoids. `hero.tsx`/`about-section.tsx` also show the shadcn-default pattern but are confirmed dead code (not imported anywhere), so not live-surface risk | Replace hardcoded `emerald-*`/`amber-*` with semantic tokens (e.g. a Night `--success`/`--warning` pair defined in `.theme-night`, mirroring how wrong-answers already correctly use `text-destructive`/`border-destructive/50`). Delete or clearly quarantine `hero.tsx`/`about-section.tsx` |
| 9 | Trend-fit / longevity | ✓ Pass | Fluid type and OKLCH dark ramp will age well; decorative micro-interactions stay optional and reduced-motion-safe | None |
| 10 | Component polish | ⚠ Risk | `session-resume.tsx`: the 160px craft-label column lives inside the same `min-w-[720px]` horizontally-scrolling container as the timeline track, so scrolling right on a 375px screen carries the label (and the "Export resume" button) off-screen with it; the `sm:hidden` "scroll the timeline →" hint doesn't solve the lost-label problem | Make the label column sticky: split the grid so the 160px column uses `sticky left-0 z-10 bg-night` (or `bg-night-surface` to match the card) while only the tick/track region scrolls, so the craft name stays pinned during horizontal scroll |

## Prioritized fixes

1. **[Blocker]** None — nothing here breaks the direction or requires a rebuild.
2. **[Should]** Remap `--formula-*` tokens into `.theme-night` (or source `tone-formula.tsx` from the active craft accent) — `src/app/globals.css` (`.theme-night` block, ~L203–262) + `src/components/lab/fourier/tone-formula.tsx`. Safe to apply without owner input — token-value fix, no copy or layout change.
3. **[Should]** Redefine `--destructive` inside `.theme-night` so it stops colliding with the music-tech coral — `src/app/globals.css` (`.theme-night` block). Safe to apply without owner input — verify new hex against AA on `#0f1115` before committing.
4. **[Should]** Replace hardcoded `emerald-*`/`amber-*` with Night semantic tokens — `src/components/lab/assessment/card.tsx` (L24, 31, 44, 46, 51), `src/components/lab/recursion/quiz.tsx` (L27, 34, 45, 59, 61, 65, 192, 262), plus amber instances in `vibe-coding/remix-prompts.tsx:31`, `vibe-coding/ai-panel.tsx:180,182`, `assessment/parsons-problem.tsx:165`, `git/snapshot.tsx:91,98`, `git/rebase.tsx:88,89`, `assessment/match-spectrum.tsx:127`, `assessment/find-the-frequency.tsx:119`, `git/commit-object.tsx:59,66,96,136`. Needs owner decision only on the exact success/warning hex; the token-wiring itself is safe to apply.
5. **[Should]** Make the timeline label column sticky at mobile widths — `src/components/night/session-resume.tsx` (grid/scroll container). Safe to apply without owner input.
6. **[Polish]** Delete or clearly quarantine `src/components/hero.tsx` and `src/components/about-section.tsx` (confirmed unused, untouched-shadcn pattern) to remove future copy-paste risk. Safe to apply without owner input.
7. **[Polish]** Verify the hero H1 renders correctly at 1280px under real network conditions (a downscaled screenshot showed possible text garbling, "Lorezte, I" vs. expected "I create, I"; the 375px shot and the music-tech pillar H1 both rendered cleanly, so this reads as a FOUT/thumbnail artifact rather than a confirmed bug) — tied to the already-pending hero-font workshop, not scored as a blocker.

## Iterate

Apply fixes 2–5 (all token-level, no new components, no copy changes) and re-critique dimensions 5, 6, 8, and 10 only. Fix 7 is a verification step, not a design change — resolve it opportunistically during the hero-font workshop. Once the formula/quiz/timeline items clear, Night Session is ready to ship as-is; the console, resume timeline, and lesson deck chrome are already studio-grade and do not need another pass.

---

## Iterate log, 2026-09-30

| Fix | Change | Re-check |
|---|---|---|
| 2 Formula colours | `--formula-*` redefined in `.theme-night` (globals.css): signal #ecebe6, neutral #9a9ca3, amp #f5c542, sin #e8a6c8, freq #ff7a59, time #5ad1c8, phase #8fb3ff | Pass. Spectrum formula slide at 1280 reads on-palette; popover follows the token |
| 3 Destructive | `--destructive: #ff5f79` in `.theme-night`, 5.9:1 on #0f1115, clearly cooler than the #ff7a59 coral | Pass |
| 4 Emerald/amber | Tailwind `--color-emerald-*` and `--color-amber-*` ramps redefined in `.theme-night` (OKLCH; success at hue 135, clear of the software teal; caution at the Night yellow). Built CSS confirmed: utilities read `var(--color-emerald-600)`, so every lesson follows with no per-file edits. Owner signed off on the hex values, 2026-09-30 | Pass |
| 5 Timeline label | Label column is `sticky left-0 z-30 bg-night` | Pass. At 375 with the track scrolled 400px, the craft name and Export stay pinned; zero truncated clips at 375/768/1280 |

Dimensions 5, 6, 8 and 10 move from Risk to Pass. Remaining: Polish items and dead-code deletions, both owner decisions.

Owner sign-off, 2026-09-30: the formula tokens (fix 2) and the emerald and amber quiz ramps (fix 4) are approved as built.
