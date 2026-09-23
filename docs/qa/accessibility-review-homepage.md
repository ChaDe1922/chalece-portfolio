# Accessibility Review: chalece-portfolio marketing homepage (`/`)

Scope: `src/app/layout.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`, `src/app/globals.css`, and the section/nav/footer components listed in the request. Reviewed against WCAG 2.1 AA (2.2 success criteria noted where relevant), with axe-core, contrast, and Lighthouse results already taken as given per the task brief.

Baseline already verified (not re-derived): 0 axe violations/incomplete (light+dark), all text contrast pairs pass AA, Lighthouse A11y 100, reduced motion renders final stat values with no animation. The findings below are things automated tooling does not catch: heading/landmark structure, focus order/visible focus, link purpose, live-region behavior, touch targets, print sanity, and content that could be hidden from AT.

---

## HIGH

### 1. Skip link does not move keyboard focus to the target
**File:** `src/app/(site)/layout.tsx:13-20`

The skip link (`<a href="#main">Skip to content</a>`) is implemented correctly as a pattern, but `<main id="main">` (line 20) has no `tabIndex={-1}`. A `<main>` element is not natively focusable, so on activation many browsers scroll the viewport to `#main` but leave `document.activeElement` on `<body>`/document rather than on `<main>`. The practical effect for a keyboard-only user: pressing Tab again after using the skip link does not reliably resume from the top of the page content: behavior is inconsistent across Chrome/Firefox/Safari, and Safari in particular is known not to move focus to non-focusable fragment targets. This defeats the one mechanism on the page (WCAG 2.4.1 Bypass Blocks) that exists specifically to save keyboard users from tabbing through the nav on every page load.

**Fix:** add `tabIndex={-1}` to the `<main id="main">` element (and optionally a `focus:outline-none` since you don't want a visible ring on programmatic focus of a landmark). This is the standard WAI-recommended pattern for skip-link targets.

```tsx
<main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
```

---

## MEDIUM

### 2. Featured Work grid has no list semantics for a 9-item, numbered collection
**File:** `src/components/work-grid.tsx:22-26`, `src/components/work-card.tsx:1-65`

`WorkGrid` renders nine `WorkCard`s directly inside a `<div className="work-grid ... grid ...">` (via `Reveal`). Each card is visually numbered ("01"–"09") and represents one item in an enumerated collection, but the DOM has no `<ul>`/`<li>` wrapper. Every other repeated collection on the page (`about-section.tsx:61-70` focus areas, `resume-section.tsx:32-43` highlights, `contact-section.tsx:49-75` channels, `nav.tsx:58-84` and `106-121` nav links) correctly uses `<ul>`/`<ol>` + `<li>`. This one is the outlier. Screen reader users lose the "list, 9 items" announcement and per-item list navigation (e.g., NVDA/JAWS quick-nav by list item) that would otherwise let them jump through the featured-work items efficiently.

**Fix:** wrap the grid in `<ul className="work-grid ...">` and give each `WorkCard` an `<li>` wrapper (use `display: contents` or move the grid-item classes onto the `<li>` so the CSS grid layout is unaffected):

```tsx
<ul className="work-grid mt-12 grid ...">
  {work.map((item, i) => (
    <li key={item.title} className="contents">
      <WorkCard item={item} index={i + 1} />
    </li>
  ))}
</ul>
```
(Lower-priority, same pattern: `src/components/proof-stats.tsx:14-18` also renders 4 stat blocks as a bare grid with no list markup. Less critical since it reads more like a set of captions than an enumerated list, but worth the same treatment for consistency.)

### 3. Non-interactive work cards still carry `group`, producing a false "this is clickable" hover cue
**File:** `src/components/work-card.tsx:28, 40-41, 64`

`base` (line 40-41) includes the class `group` unconditionally: `"work-card group flex h-full flex-col ..."`. This `base` string is used for **both** the linked (`<a>`) and non-linked (`<div>`) card variants. The card title (`h3`, line 28) uses `group-hover:text-link`. Because `group` is present even on the plain `<div>` cards (4 of the 9 items have no `href`: "AI-Assisted Curriculum Development," "Creative Coding Summer Cohort," "Music Tech Workshops at Georgia Tech," "Audio Programs for Amazon Amp"), hovering over these **non-interactive** cards still shifts the title to the link/bronze color, exactly mimicking the hover affordance of the clickable cards. This misleads sighted mouse users (and anyone relying on the color-change as the "is this clickable?" signal, which the codebase's own comment on line 13 says it's trying to avoid: "without one it is a non-interactive cell (no fake affordance)") into thinking there's a destination. The arrow icon and ring/background hover are correctly gated on `item.href` (lines 21-26, 51-54): only the title's `group-hover` was missed.

**Fix:** only apply `group` when the card is actually a link:
```tsx
const base = cn(
  "work-card flex h-full flex-col bg-card p-6 transition-colors duration-200 print:p-3",
  item.href && "group",
);
```

### 4. Count-up stat numerals have no stable accessible name decoupled from the animating text
**File:** `src/components/stat-block.tsx:14-75`

The `<p ref={ref} className="stat-numeral">{text}</p>` (line 67) has its text content mutated by `setText` up to ~60 times over 1.4s once the block scrolls into view (lines 32-45), going from `"0+"` up to the final value. There's no `aria-live`, which is actually correct for *suppressing* announcement of every intermediate frame: but it also means the element's accessible name is whatever transient string happens to be in the DOM at the moment an AT (or anything reading the accessibility tree, e.g. a braille display refresh, or a SR user who tabs/navigates to this exact node mid-animation) inspects it. Because `ProofStats` sits directly below the hero and can already be in-viewport on load on common desktop heights (confirmed in the 1440 screenshot: the stat row is visible without scrolling), the animation can start almost immediately on page load, widening the window in which a fast AT/keyboard user could land on a mid-count value like `"27,412+"` instead of the true `"48,000+"`.

**Fix:** decouple the announced value from the animated one: hide the animating numeral from the accessibility tree and expose the final value as a stable label on the wrapping element:
```tsx
<p ref={ref} className="stat-numeral" aria-hidden="true">{text}</p>
<p className="sr-only">{finalText}</p>
```
or set `aria-label={finalText}` on a parent that wraps the visually-animating `aria-hidden` numeral.

### 5. Contact channel values use `truncate`, risking clipped content under text-spacing/zoom
**File:** `src/components/contact-section.tsx:59-64`

The value span (`cdelacoudray@gmail.com`, `in/chalecedelacoudray`, `10 published courses`) has `truncate` (= `overflow-hidden; text-overflow-ellipsis; white-space-nowrap`), inside a `min-w-0 flex-1` container that becomes a fixed `10rem` + `1fr` grid at `sm:`. At the current breakpoint/zoom levels it renders fully (confirmed in screenshots), but `truncate`'s `white-space: nowrap` also overrides any user-applied text-spacing/letter-spacing overrides (WCAG 1.4.12) and will silently clip the visible text with no ellipsis-adjacent affordance to reveal the rest for a sighted low-vision user zooming or widening letter-spacing: the full string stays in the accessible name for SR users, but a sighted user relying on their own spacing/zoom settings could lose visual access to part of an email address they're trying to read or copy by eye. These values are short, single-line strings inside a row with `min-h-14`, so there's no layout reason to force `nowrap`.

**Fix:** drop `truncate` in favor of natural wrapping (`break-all` for the email specifically, or just allow wrap):
```tsx
<span className="text-base transition-colors group-hover:text-link sm:text-lg break-words">
```

### 6. Theme toggle doesn't expose its state
**File:** `src/components/theme-toggle.tsx:26-37`

`aria-label="Toggle dark mode"` (line 31) is static regardless of `resolvedTheme`. A screen reader user gets the same announcement whether the site is currently light or dark, and the label describes the mode you're toggling *to* only when starting from light: after switching to dark, the same "Toggle dark mode" label now reads as if pressing it again would (still) turn dark mode on, when it will actually turn it off. There's also no `aria-pressed` to expose the current on/off state per WCAG 4.1.2.

**Fix:**
```tsx
aria-pressed={resolvedTheme === "dark"}
aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
```

### 7. Mobile sheet close button is well under the 44px touch-target guidance
**File:** `src/components/ui/sheet.tsx:62-77` (uses `size="icon-sm"` → `src/components/ui/button.tsx:31`, `size-7` = 28px)

The visible hamburger trigger (`nav.tsx:95`, `size-11` = 44px) and the sheet's nav links (`nav.tsx:113`, `min-h-11`) both correctly hit 44px. The sheet's own dismiss control: the `X` in the top-right of the open panel, the control a mobile user taps most often to close the menu: is `icon-sm` (28×28px). It passes the WCAG 2.2 AA minimum (24×24, SC 2.5.8) but is well short of the 44px target this file uses everywhere else for primary mobile controls, and it sits in a corner (harder to hit precisely) rather than inline in a list.

**Fix:** bump `SheetContent`'s close button to `size="icon"` (32px) at minimum, or wrap it with enough padding to reach a 44×44 hit area while keeping the visual icon small:
```tsx
<Button variant="ghost" className="absolute top-3 right-3 size-11" size="icon">
```

### 8. Verify: focus destination after using a mobile-sheet nav link
**File:** `src/components/nav.tsx:107-119` (`SheetClose` wrapping `<a href="#about">`, etc.)

Each mobile nav item is simultaneously (a) an in-page anchor link that should move focus/scroll to a section, and (b) a `SheetClose`, which closes the dialog and: per typical accessible-dialog behavior: returns focus to the trigger button (the hamburger icon) on close. These two focus-management behaviors can race: it's possible for the dialog's close-return-focus logic to run after the browser has already jumped to the `#about` anchor, snapping focus back to the now-hidden hamburger button in the header instead of leaving the keyboard/SR user positioned at the section they just chose. This wasn't verified live and depends on `@base-ui/react/dialog`'s internal ordering, so it isn't asserted as a confirmed bug: but it's a common failure mode for "close-on-navigate" sheet patterns and should be manually tested: open the mobile menu with keyboard, activate "About," and confirm focus lands in/near the About section rather than back on the (now off-screen) menu button.

**Fix if confirmed broken:** on the nav link's `onClick`, after closing, explicitly move focus to the target section (e.g., `document.getElementById('about')?.focus()` with `tabIndex={-1}` on each `<section>`, or focus the section's `h2`).

### 9. Featured-work card index numeral is read aloud by screen readers; card link names are very long
**File:** `src/components/work-card.tsx:18` (compare `src/components/resume-section.tsx:35`)

The `"01"`–`"09"` index badge is not `aria-hidden` here, unlike the equivalent index badge in `resume-section.tsx:35` which correctly is. Because the whole card is one `<a>` for linked items, the anchor's accessible name concatenates the index + full title + full description sentence + the tag list (e.g. "01 Coursera Course Catalog (Codio) Authored 10 published courses on DevOps, containers, CI/CD, operating systems, Unix, Bash scripting, and web security, reaching 48,000+ learners. Curriculum · Assessment · Technical"): a full paragraph is announced for every one of the 9 cards when tabbing through, with "01" spoken first as a bare number. This isn't a WCAG failure (long link names aren't prohibited), but it's real friction for screen reader/switch users tabbing through the grid.

**Fix:** `aria-hidden="true"` on the index span (quick win, matches the resume-section pattern), and consider trimming the announced name with `aria-label` on the anchor (e.g. `` `${item.title}. View project.` ``) while keeping the full description visible for sighted users.

### 10. Footer nav links have no explicit touch-target sizing
**File:** `src/components/footer.tsx:14-27`

`<nav aria-label="Footer">` links (line 18-24) have no padding/`min-h`: the tappable area is just the `text-sm` line box, well under 44px, on a `<nav>` that appears on every page at the very bottom where users are likely to be on mobile after scrolling the whole page.

**Fix:** add a comfortable hit area, e.g. `inline-flex min-h-11 items-center` on each footer link.

---

## LOW

### 11. Desktop nav links fall short of 44px on touch-capable tablets
**File:** `src/components/nav.tsx:58-84`

`px-3 py-2 text-sm` gives roughly a 36px-tall hit target. This nav is `hidden md:flex` (768px+), a width many tablets in landscape use with touch rather than a mouse. Mobile phones already get a compliant 44px target via the sheet nav (`nav.tsx:113`), so this only affects the tablet/touch-laptop range. Low priority; consider `py-2.5` or `min-h-11` if analytics show tablet traffic.

### 12. `aria-current="page"` used for same-page anchor scroll-spy
**File:** `src/components/nav.tsx:66`

`aria-current="page"` is intended for indicating the current page among a set of *pages* (e.g., breadcrumbs, pagination). Here it's applied to in-page anchor links tracking scroll position within one page. This is a widely-tolerated convention, not a hard WCAG failure, but the ARIA Authoring Practices' more precise value for this pattern is `aria-current="location"` (or `"true"`).

### 13. Résumé download link's `aria-label` overrides rather than supplements the visible label
**File:** `src/components/hero.tsx:41-48`, `src/components/resume-section.tsx:46-53`

Visible text is `Résumé (PDF)`; `aria-label="Résumé, PDF download"` replaces it entirely for AT users. It still contains the visible text as a normalized substring so it passes WCAG 2.5.3 (Label in Name), but the two labels drifting apart is unnecessary: the visible text already conveys "this is a PDF," and `download` is already exposed natively as a link property in most AT. Consider dropping the `aria-label` and letting the visible text serve as the accessible name, or at minimum keep the label's wording aligned with the visible text (e.g. `"Résumé (PDF), download"`).

### 14. Eyebrow labels are small (12px), uppercase, and heavily tracked
**File:** `src/app/globals.css:216-223`

`.eyebrow` is `font-size: 0.75rem` (12px) with `letter-spacing: 0.14em` and `text-transform: uppercase`. Contrast is already confirmed fine (muted-foreground ≥ 6:1). The combination of small size + all-caps + wide tracking is a mild legibility tax for low-vision readers (uppercase removes word-shape cues; used here for section eyebrows, card indices, and the tag lists on every work card, e.g. `work-card.tsx:34`, which can run to 3 multi-word tags). Not a WCAG failure (no minimum font-size SC), but worth a look given how many places on the page use it. Consider 0.8125rem (13px) or dropping tracking slightly for the longer tag-list instances.

### 15. Instrument Serif's fixed 400 weight is used down to small heading sizes
**File:** `src/app/globals.css:160-172` (`h1,h2,h3,h4 { font-weight: 400; font-synthesis-weight: none; }`), applied to `src/components/ui/sheet.tsx:108` (`SheetTitle`, `text-base` ≈16px) and `src/components/work-card.tsx:28` (`h3`, `text-xl` ≈20px)

Instrument Serif is a thin, high-contrast display face. At display sizes (hero `h1`, `display-2` section titles) a light weight is a deliberate, legible editorial choice. At smaller sizes: the mobile sheet's "Menu" title and each work card's 20px title: the same thin weight is harder to scan than a heavier or sans-serif treatment would be, and because `font-synthesis-weight: none` explicitly blocks the browser from ever bolding it, there's no fallback path to a heavier rendering at any size. This is an inclusive-design note (contrast itself is unaffected and already verified), not a WCAG SC failure. Consider excluding small in-component headings (`SheetTitle`, card `h3`) from the global `h1–h4` serif rule and letting them use the sans face instead.

### 16. About bio contains one long, multi-clause sentence
**File:** `src/components/about-section.tsx:34-43`

The first paragraph is a single ~60-word sentence with three embedded clauses ("...earned a B.A. ... and an M.S. ..., where my graduate research ..., and built a decade-long career..."). Plain-language guidance favors shorter sentences for readability, particularly for users with cognitive disabilities or non-native English readers. Consider splitting into two or three sentences.

### 17. Print output doesn't expose destination URLs for linked work/contact items
**File:** `src/components/work-card.tsx:43-61`, `src/components/contact-section.tsx:52-57`, contrast with `src/components/hero.tsx:30-35`

The hero deliberately adds a print-only paragraph with a visible absolute URL for `/lab` (`hero.tsx:30-35`) since a printed page can't be clicked. The same courtesy isn't extended to the external `href`s on work cards (Coursera, Instagram, ACM DOI, etc.) or contact channels (LinkedIn, Coursera): in the printed/PDF output, those become plain unclickable text with no visible URL. Informational only; print output isn't itself governed by WCAG, but it undercuts the "resume-as-print-artifact" intent already established elsewhere on the page.

---

## Notes on what's working well (no action needed)

- Heading outline is clean and correctly nested across the whole page: one `h1` (hero), sibling `h2`s per section (`work-heading`, `about-heading`, `resume-heading`, `contact-heading`), with `h3` only used as a genuine subsection (Focus areas; each work card title): no skipped levels.
- Every section correctly pairs `aria-labelledby` on the `<section>` with a matching heading `id` (`section-heading.tsx:28`); `ProofStats` correctly uses `aria-label` since it has no visible heading.
- `.reveal` scroll animation (`globals.css:228-247`) is transform-only, never touches opacity/visibility, and is gated behind both `prefers-reduced-motion: no-preference` and `@supports (animation-timeline: view())`: content is never hidden from AT or reduced-motion users, and unsupported browsers get full visibility with zero animation. This is a solid progressive-enhancement pattern.
- External-link `sr-only` "(opens in a new tab)" pattern is applied consistently (`work-card.tsx:57-59`, `contact-section.tsx:69-71`).
- Print stylesheet (`globals.css:568-649`) forces the light theme in both `:root` and `.dark`, neutralizes transforms/animations so reveal offsets can't shift print layout, and hides nav/theme-toggle/CTA chrome that has no print purpose.
- Focus-visible styles are present and use real replacement rings/outlines everywhere checked (`cta-link.tsx:40`, `work-card.tsx:53`, `contact-section.tsx:57`, `nav.tsx:52,68,113`, `button.tsx:7`): no bare `outline: none` without a replacement was found.
- Skip link markup itself (visible on focus, `print:hidden`, correct copy) is a proper pattern aside from the missing focus target (see High #1).
