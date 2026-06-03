# 000 - Setup & Scaffold

**Goal:** Stand up a Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui project with dark mode, variable fonts, and design tokens, so section work can begin.

## Acceptance criteria
- [ ] Next.js (App Router) + TypeScript project builds and runs (`npm run dev`).
- [ ] Tailwind v4 configured CSS-first (`@import "tailwindcss"` + `@theme`).
- [ ] shadcn/ui initialized; `button`, `badge`, `sheet` added.
- [ ] `next-themes` wired: `ThemeProvider attribute="class"`, `prefers-color-scheme` default + persisted toggle, `suppressHydrationWarning` on `<html>`.
- [ ] `motion` installed; app wrapped in `<MotionConfig reducedMotion="user">`; only `m` + `LazyMotion` used.
- [ ] Space Grotesk (display) + Inter (body) loaded via `next/font` as variable fonts, exposed as CSS vars, wired into `@theme`.
- [ ] Semantic color tokens defined for light + `.dark`: `--background`, `--foreground`, `--accent`, `--coral`, `--muted` (+ shadcn tokens).
- [ ] Global reduced-motion kill-switch in `globals.css`.
- [ ] `public/` holds resume PDF, headshot, favicon (placeholders acceptable until real assets land).

## Tokens (from brief §7)
- Light: ink `#14131A`, paper `#F7F5F2`, accent `#6D5AE6`, coral `#FF6B5E`, muted `#5A5862`.
- Dark: near-black background (not `#000`), paper-ish text, accents retained, AA re-verified.

## Notes
- Fully static, single `/` route. No backend, no env vars.
