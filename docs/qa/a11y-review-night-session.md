# Accessibility Review — Night Session (Homepage, Pillar page, /lab, Fourier lesson, Urgent Request)

**Standard:** WCAG 2.1 Level AA (minimum); AAA noted as enhancement, not failure.
**Scope:** Homepage (`src/app/(site)/page.tsx` + `src/components/night/*`), one pillar page template + its imports, `/lab` index + layout + carousel, the Fourier lesson (`slide-deck.tsx`, `math-formula.tsx`), and the static `public/urgent-request/` scenario.
**Method:** Source read (no browser/AT testing performed). No files were edited — findings only.

---

## Summary table

| # | Finding | Severity | Location | WCAG |
|---|---|---|---|---|
| 1 | Resume timeline region (`tabIndex=0`) has no visible focus indicator | **Should** | `session-resume.tsx:232-237`, `globals.css:296-299` | 2.4.7 Focus Visible (AA) |
| 2 | Math-formula popover (`role="dialog"`) has no accessible name and no focus management | **Should** | `math-formula.tsx:102-121`, `lab-portal.tsx:13-22` | 4.1.2 Name, Role, Value (AA); WAI-ARIA APG non-modal pattern |
| 3 | Report composer nests two `aria-live="polite"` regions, one wrapping the whole step template | **Should** | `urgent-request/index.html:671,689,713`, `script.js:923-930` | 4.1.3 Status Messages (AA) |
| 4 | Back/theme nav buttons are 36×36px (under the product's own 44px target, and the flagged concern) | **Should** | `urgent-request/styles.css:108-146` | 2.5.5 Target Size (AAA) / house 44px standard |
| 5 | Desktop "Email me" nav button is 40px tall, inconsistent with the 44px convention used everywhere else | **Should** | `night-nav.tsx:102` | 2.5.5 Target Size (AAA) / house 44px standard |
| 6 | Carousel/deck pagination dots and Prev/Next/Pause controls are 10–40px | Polish | `lesson-carousel.tsx:264-276`, `slide-deck.tsx:254-270` | 2.5.5 Target Size (AAA) |
| 7 | `/lab/[lesson]` pages have no skip link and no repeated nav chrome (by design) | Polish | `lab/layout.tsx` vs `lab/page.tsx:28-33` | 2.4.1 Bypass Blocks (AA) — mitigated, see note |

**No Blockers identified.** Nothing found fully prevents a screen reader or keyboard user from completing a flow.

---

## Findings

### 1. Resume timeline region has no visible focus state — Should

`session-resume.tsx:232-237`:
```jsx
<div
  tabIndex={0}
  role="region"
  aria-label="Resume timeline"
  className="mt-9 overflow-x-auto rounded-3xl border border-night-line bg-night"
>
```
The only sitewide `:focus-visible` rule is scoped to `:where(button, a)` (`globals.css:296-299`), so this focusable `<div>` never gets the outline. A sighted keyboard user can Tab into the region and scroll it with arrow keys, but has no visual confirmation focus landed there.

**WCAG:** 2.4.7 Focus Visible (AA).
**Fix:** Add an explicit focus style for this element, e.g. `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-night-fg` on the div, or widen the global rule to `:where(button, a, [tabindex])`.

---

### 2. Math-formula popover: unnamed dialog, no focus management — Should

`math-formula.tsx:102-121` renders, via `LabPortal`:
```jsx
<div ref={popRef} role="dialog" className="fixed z-[100] ...">
  <p className="text-sm font-semibold" style={{ color: part.color }}>{part.label}</p>
  ...
</div>
```
Two compounding issues:
- The `role="dialog"` has no `aria-label`/`aria-labelledby`, so a screen reader announces an unlabeled dialog with no indication of its purpose (4.1.2).
- `LabPortal` (`lab-portal.tsx:16-21`) calls `createPortal(..., document.body)`, which inserts the popover as the **last** node in `<body>` — outside the page's natural reading/tab order. Focus is never moved into it on open (confirmed: no `.focus()` call anywhere in the effect at lines 45-61), and it stays on the trigger button. A screen reader user who activates the token gets **no announcement at all** that anything happened — the new content exists in the DOM but is silent and structurally disconnected from where they are.

This is not a Blocker: the trigger button itself is a correctly labeled, keyboard-operable toggle (`aria-pressed`, visible focus ring), Escape and outside-click both close it correctly (lines 46-54), and the popover holds no interactive content a keyboard user could get stuck on. But for AT users the supplementary explanation is effectively invisible.

**WCAG:** 4.1.2 Name, Role, Value (AA); 4.1.3 Status Messages (AA) is also relevant since this behaves more like an announced disclosure than a modal dialog.
**Fix:** Pick one of two patterns and apply it consistently:
- **Non-modal popover (recommended, smallest change):** Drop `role="dialog"`, instead add `id` to the popover and set `aria-describedby={id}` on the trigger button so its content is announced when the token receives focus/activation. Keep the current open/close behavior.
- **True non-modal dialog (WAI-ARIA APG pattern):** Keep `role="dialog"`, add `aria-labelledby` pointing at the `part.label` paragraph, and move focus into the popover on open (mirror the pattern already used correctly in `slide-deck.tsx:88-94`, where focus moves to a `tabIndex={-1}` heading on navigation), returning focus to the trigger on close.

---

### 3. Nested/duplicate live regions in the report composer — Should

`public/urgent-request/index.html`:
- Line 671: `<div class="compose" id="report-compose" aria-live="polite">` — wraps the entire step template: the step counter, the prompt, and every row's slot text, all of which change on every step advance.
- Line 689: `<p class="compose__note" id="report-note" role="status" aria-live="polite"></p>` — nested **inside** that same live container.
- Line 713: `<p class="visually-hidden" id="report-live" role="status" aria-live="polite"></p>` — a third, separate live region, explicitly targeted by `announce()` in `script.js`.

In `script.js`, `setNote()` (lines 926-930) writes to `#report-note`, and `attempt()` (lines 970-998) calls both `announce()` (→ `#report-live`) and `setNote()` (→ `#report-note`) for the same event — e.g. on a correct answer, the rationale text is announced via `#report-live` while also being written into `#report-note`, which is itself inside the outer `aria-live="polite"` `#report-compose`. Because `#report-note` sits inside an ancestor that is also a live region, assistive tech can double-announce the same message, and the outer region additionally picks up unrelated template changes (step counter, prompt, locked-row text clearing) as they update on `renderTemplate()`/`renderStep()`.

**WCAG:** 4.1.3 Status Messages (AA) — status messages should be programmatically determinable without unnecessary noise or duplication.
**Fix:** Remove `aria-live="polite"` from the outer `#report-compose` (line 671) — the template itself doesn't need to be a live region, only the note/rationale does. Keep a single source of truth for the spoken message: either `#report-note` or the hidden `#report-live`, not both, for the same `attempt()` event.

---

### 4. Confirmed: nav back/theme buttons are 36×36px — Should

`public/urgent-request/styles.css:108-128` (`.navback`) and `:129-146` (`.navtheme`):
```css
.navback {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  ...
}
```
This confirms the flagged concern exactly: both circular top-bar buttons are 36×36px. This passes WCAG 2.2's AA minimum (2.5.8, 24×24px) but falls short of the 44×44px convention used everywhere else in this product (see `.btn` at `styles.css:382`, `.choice`/`.option` at `:1003`/`:1289`, and the React side's `min-h-11` pattern throughout).

**WCAG:** 2.5.5 Target Size (Enhanced, AAA) — not a strict AA failure, but a real inconsistency against the product's own stated 44px standard, and the weakest touch target on the page for two high-frequency navigation actions.
**Fix:** Increase `.navback`/`.navtheme` to `44px × 44px` (keep the icon glyph visually small inside, via padding, to preserve the current compact look).

---

### 5. Desktop "Email me" nav button is 40px tall — Should

`night-nav.tsx:102`:
```jsx
className="hidden h-10 items-center gap-2 rounded-[10px] bg-signal px-4 text-sm font-semibold text-night transition-colors duration-200 lg:inline-flex"
```
`h-10` = 40px. The mobile sheet's equivalent CTA and every other primary action in the nav (`min-h-10`/`h-10` links at line 86, `h-10` shell at 112) actually share this shorter height, so this is a systemic 40px convention in the nav bar specifically, not an isolated outlier — but it is still under the 44px target used in the hero, console, contact, and footer.

**WCAG:** 2.5.5 Target Size (Enhanced, AAA).
**Fix:** Bump nav-bar interactive elements to `h-11` (44px) to match the rest of the site, or accept 40px as an intentional, documented exception for the compact nav bar.

---

### 6. Carousel/deck pagination controls under 44px — Polish

- `lesson-carousel.tsx:264-276`: pagination dots are `size-2.5` (10px).
- `lesson-carousel.tsx` Prev/Next/Pause controls: `size-10` (40px).
- `slide-deck.tsx:254-270`: progress dots are `size-3` (12px), hidden below `sm:`.

These are small, secondary navigation controls (a primary path exists via swipe/Prev-Next/keyboard), so this is Polish rather than Should, but worth widening the hit area (padding) even if the visible dot stays small.

**WCAG:** 2.5.5 Target Size (Enhanced, AAA).
**Fix:** Keep the visual dot size, but wrap each in a `min-h-11 min-w-11` hit-target (e.g., `padding` on the button, dot rendered as a smaller inner element).

---

### 7. `/lab/[lesson]` pages have no skip link or repeated nav — Polish

`lab/layout.tsx` intentionally omits the skip link and `NightNav`/`NightFooter` that `lab/page.tsx:28-33` and `(site)/layout.tsx` provide, per the code comment ("Lessons stay full screen"). This is a reasonable design choice — there's no repeated boilerplate to skip before the deck's content — but it does mean a keyboard user landing on a lesson page (e.g., via direct link or the carousel) has no "back to lab index" landmark or skip target before the deck's own controls. Since `SlideDeck` correctly moves focus to a `tabIndex={-1}` heading on slide change, first-load focus order is still reasonable.

**WCAG:** 2.4.1 Bypass Blocks (AA) — effectively satisfied since there's no repeated block to bypass; noting as Polish for consistency/orientation rather than a violation.
**Fix:** Optional — consider a lightweight "All lessons" link near the top of the deck's first slide for orientation (the deck's footer already has this per the earlier review of `slide-deck.tsx:273-280`).

---

## Confirmed passes worth noting

- **Contrast:** `#0f1115` text on all three pillar-color fills (coral/teal/yellow), and `fg`/`body`/`muted` text on `#0f1115`/`#1d212a`, are self-documented in `globals.css` and `urgent-request/styles.css` with ratios from 5.88:1 to 15.83:1 — all comfortably pass AA for both normal and large text.
- **Reduced motion:** Exemplary on both sides — React uses `useReducedMotion()` plus a global kill-switch in `globals.css`; the static scenario gates every animation behind `@media (prefers-reduced-motion: no-preference)` in `styles.css:1781-1877` and a `REDUCE` JS flag that disables timers/animations (`script.js:24-26` and throughout).
- **Focus management on screen change:** `slide-deck.tsx:88-94` and the static scenario's `focusHeading()` (`script.js:224-227`, targeting `tabindex="-1"` headings confirmed at `index.html:60,100,235,322,347,373,398,418,517,658,726`) both correctly move focus to the new screen's heading — a strong, consistent pattern.
- **Download links / accessible names:** `ExportLink`, `MixDownload` (`session-resume.tsx`), `TrackLink` (`tracklist.tsx`), and the footer's external links all append an `sr-only` suffix (e.g., "`: Software, PDF`", "`, opens in a new tab`") so their accessible names are unambiguous even though the visible label is shared across instances.
- **Tabs and disclosure patterns:** The Learn screen's tabs (`index.html:110-197`, roving `tabindex`, arrow-key navigation in `script.js:684-720`) and the hotspot disclosure pattern (`aria-expanded`/`aria-controls` + `role="status"`, `script.js:751-790`) are both correctly implemented — the hotspot pattern in particular is a cleaner reference implementation than the math-formula popover (Finding 2).
- **Heading order:** Homepage, pillar page template (h1 in `PillarIntro` → h2 in each subsequent section via `SectionHeading`), and `/lab` index all have a single `<h1>` with no skipped levels.
- **Semantics:** No `<div onClick>`/`<span onClick>` interactive elements found without proper `role`/keyboard handling in any file reviewed; `<button>` vs `<a>` usage is consistently correct (action vs. navigation) across both the React components and the static HTML.

---

## Prioritized fix list

**Should** (fix before this ships as a portfolio-quality reference):
1. Add a visible focus style to the resume timeline region (`session-resume.tsx:232-237`).
2. Give the math-formula popover an accessible name and a real focus/disclosure pattern (`math-formula.tsx:102-121`).
3. De-duplicate the report composer's live regions (`urgent-request/index.html:671,689,713`; `script.js:923-930`).
4. Grow `.navback`/`.navtheme` to 44×44px (`urgent-request/styles.css:108-146`) — resolves the flagged concern.
5. Grow the desktop "Email me" nav button to 44px tall (`night-nav.tsx:102`), or document the 40px nav-bar exception.

**Polish** (nice to have, AAA-leaning):
6. Widen the hit area on carousel/deck pagination dots and Prev/Next/Pause controls.
7. Consider an orientation link on individual `/lab/[lesson]` pages.
