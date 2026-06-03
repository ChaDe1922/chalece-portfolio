# 001 - Nav & Theme Toggle

**Goal:** Sticky top nav with anchor links to every section, a mobile menu, and a light/dark theme toggle.

## Acceptance criteria
- [ ] Sticky nav with the name/wordmark and anchor links: Work, About, Resume, Contact.
- [ ] Smooth-scroll to in-page anchors; active section gets `aria-current="page"` (scroll-spy via `IntersectionObserver`).
- [ ] Mobile: links collapse into a shadcn `Sheet` (hamburger), trigger >= 44x44px, focus trapped while open, focus returns to trigger on close.
- [ ] Theme toggle button with accessible label (`aria-label`), sun/moon icon swaps, choice persists.
- [ ] Keyboard operable end to end; visible focus on every control.
- [ ] Optional: subtle backdrop blur on the nav only (verify text contrast over it).

## States
- Default / hover / focus on links and toggle. Active-link indicator (not color alone, e.g. underline + weight).
