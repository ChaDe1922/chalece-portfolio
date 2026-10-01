# 030 - Night Session homepage and site chrome

**Goal:** Replace the light/dark three-pillar homepage with the Style B "Night Session" design (Home-B-Combined, picked 2026-09-30). One mixing-console metaphor ties the three crafts together: solo a craft anywhere on the page and every section follows it.

**Source:** claude.ai design artifact `EhybdGUTZfEP44uugAqoex`, file `Home-B-Combined.dc.html`.

## Scope
- Chrome for the `(site)` group: `MixProvider` (dark, `.theme-night`, Syne + Plex fonts, `--signal` accent), `NightNav`, `NightFooter`. Cursor trail, click ripple and the theme toggle leave the chrome. Their files stay.
- Homepage sections, in order: `NightHero` (#top), `MixConsole` (#what), `Tracklist` (#work), `LinerNotes` (#about), `SessionResume` (#resume), `NightContact` (#contact).
- Shared mix state (`useMix`): which crafts are on, solo, full mix, open tracklist row. `?pillar=` preselects a solo. Pillar routes force their pillar solo, so the footer meters and accent follow.
- All copy lives in `src/data/mix.ts`. Facts come from `pillars.ts`, `work.ts` and `about.ts`.

## Acceptance criteria
- [x] Soloing a craft in the console, tracklist filter or contact role picker updates the accent, tracklist rows, resume lanes, contact card and footer meters together.
- [x] Contact role picker changes the pitch, the mailto subject and the recommended resume download.
- [x] Each resume lane exports its own PDF from the generated `/resume/<mix>` route (`c3`, `s3`, `m3`).
- [x] No horizontal page overflow at 375, 768 and 1280. The resume timeline scrolls inside its own region; on phones the three export buttons sit below it.
- [x] Every toggle is a real button with `aria-pressed` or `aria-expanded`; live regions announce the console monitor, pitch and signal-chain detail.
- [x] Timeline clips are not links, since they have no destination yet.
- [x] `check:portfolio`, `tsc --noEmit` and `build` pass; lint has no new errors.
- [ ] design-critic and accessibility-agent pass (Phase 6).
- [ ] Lighthouse at the current bar: Perf 95+, A11y/BP/SEO 100.

## Deviations from the design
- Contact role picker uses `aria-pressed` buttons in a group, not a radiogroup, so a second press returns to the full mix.
- The "DATES NEEDED" timeline row is not shipped.
- One visual world: the light theme is dropped on the main site. /lab keeps its own theme.

## States
- Tracklist with every craft muted: empty state with a "go to full mix" button.
- Today playhead on the timeline renders on the client only, so the server HTML stays stable.
