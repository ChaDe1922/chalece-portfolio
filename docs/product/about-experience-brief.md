# Product Brief: "Meet Chalece" (Interactive Slide Experience / Living Portfolio)

**Last updated:** 2026-06-05
**Status:** Approved by owner, ready for build (naming and scope confirmed 2026-06-05)
**Audience / pipeline:** Product Agent → Website Agent → Frontend Agent → Implementation (Next.js) → Deploy (Vercel)
**Owner:** Chalece DeLaCoudray
**Style rule (non-negotiable):** No em dashes anywhere in copy or code comments. Use commas, periods, colons, or "to" for ranges.
**Depends on:** the shared `SlideDeck` engine defined in `recursion-lab-brief.md` (section 4.3). Build that first; this brief reuses it.

---

## 0. TL;DR for the build team
Build an **interactive slide experience that teaches a visitor about Chalece**, using her own teaching method as the medium. It is both a portfolio and a learning experience: a short deck of full-viewport slides where the visitor does not just read her bio, they interact with it (scrub the proof, watch a hard idea get simple, switch between her facets, flip her published work). It lives at **`/story`** in the portfolio app, is linked prominently from the hero ("Meet me" / "Take the 90-second tour"), and reuses the `SlideDeck` engine. The meta-point: she claims she makes complex things click, and this experience proves it by making *her* click. Same stack, same brand, WCAG 2.2 AA, keyboard and touch, reduced-motion safe.

## 1. Problem / Opportunity
The current portfolio is a strong static scroll, but it tells rather than shows. For learning-design roles (Brilliant and peers), the most persuasive proof is an artifact that demonstrates her craft. An interactive "about me" turns her own story into a tiny interactive lesson: it shows method, range, and build ability in 90 seconds, gives recruiters something memorable, and doubles as a portfolio piece in its own right ("she designed an interactive experience about herself"). It also reuses the deck engine from the Recursion Lab, so the marginal build cost is low.

## 2. Goals and non-goals
**Goals**
- Make a visitor *feel* her core claim (she makes complexity click) by experiencing it.
- Show range (music, CS, data, AI, building) and proof (30,630+ learners, CHI, shipped systems) interactively.
- Be a sharable, memorable front door that complements the static homepage.

**Non-goals**
- Not a replacement for the scroll homepage; it is a linked, optional experience.
- No backend, accounts, or analytics beyond anonymous counts.
- Not a gimmick reel. Every interaction must carry meaning, not decoration.

## 3. Target users and flows
- **Primary: recruiter / hiring manager** who clicks "Meet me" from the hero or lands on a shared `/story` link. 90 seconds, desktop or mobile. Goal: get a vivid, credible sense of her fast.
- **Secondary: potential client / collaborator** exploring range and credibility.
- **Tertiary: Chalece**, a distinctive link to drop in applications, LinkedIn, and outreach.

## 4. The experience

### 4.1 Format
Reuses `<SlideDeck>` (Prev/Next, arrow keys, swipe, progress dots, top bar, hash-deep-linking, reduced-motion cross-fade, full a11y). One idea per slide. Her voice throughout: warm and a little playful in feel, calm and minimal on the page, rigorous underneath. Interactions are light, fast, and meaningful.

### 4.2 Slide-by-slide spec
Final copy is paste-ready and em-dash-free. Content lives in `src/data/story.ts`.

**Slide 1, Hook: the claim, made literal**
- Purpose: state who she is and immediately demonstrate the claim.
- Visual: large heading "I make complex technical concepts click." The word "complex" is rendered as tangled, dense text or a knotted line.
- Interaction: the visitor taps "complex" and it visibly untangles into something simple and clear (reuse/extend `click-word.tsx`). A small caption appears: "See? That is the whole job."
- Copy: name, role line, and the tappable headline. Sub: "Tap the hard word."

**Slide 2, Proof you can feel**
- Purpose: make "30,630+ learners" visceral, not a stat to skim.
- Visual: a field of small dots that assembles; a large running number.
- Interaction: the visitor presses and holds (or scrubs a slider) and the number counts up from 0 to 30,630 as the dot field fills, then settles. Below, 7 small chips (the 7 Coursera courses); tapping a chip names that course and its topic.
- Copy: "Seven published courses. Thirty thousand six hundred and thirty real learners. Hold to count them."
- Reduced motion: number sets instantly, dots fade in without travel.

**Slide 3, How I teach (a 15-second mini-lesson, the meta moment)**
- Purpose: demonstrate her method live, the heart of the experience.
- Visual: a short block of intimidating technical jargon (real, e.g., a dense sentence about container orchestration).
- Interaction: a single toggle labeled "Make it click." Flipping it morphs the jargon into a plain-language, intuitive version with a small visual, in place. The visitor can flip back and forth and feel the difference.
- Copy: heading "This is the whole skill." Caption after flip: "Same idea. Now it is yours. That is what I do, across CS, from intro to AI."

**Slide 4, Range: one person, many threads**
- Purpose: show breadth without a wall of text.
- Visual: a hub with selectable facets: Music Tech, Computer Science, Data, AI, Building.
- Interaction: tapping a facet reconfigures the slide to show that thread with one tight line and a proof point (Music: Georgia Tech M.S., Tree Sound; CS: Codio, 7 courses; Data: E22 / Atlanta Truth dashboards; AI: agent systems, daily practice; Building: BLACQList, shipped software). Only one facet shown at a time, calm and uncluttered.
- Copy: "I am not one lane. Pick a thread."

**Slide 5, Published and shipped**
- Purpose: hard credibility.
- Visual: three flip cards: Planet Bug (ACM CHI 2020), Your Voice is Power (IEEE RESPECT 2021), Agent Systems (a portfolio of file-based multi-agent builds).
- Interaction: tap a card to flip and reveal one line plus a link (CHI DOI, IEEE Xplore, portfolio work item). External links open safely.
- Copy: "Not just claims. Receipts."

**Slide 6, What I am building now**
- Purpose: show she is a builder, not only a designer (a differentiator for modern learning roles).
- Visual: a compact "now" panel: The BLACQList (digital products + AI agents) and the agent systems that run her own work.
- Interaction: tap to expand each into one sentence; a subtle live touch (e.g., a tiny animated node graph for "agent systems").
- Copy: "I design learning, and I build the software around it. Right now: The BLACQList and a fleet of AI agent systems."

**Slide 7, What I believe**
- Purpose: values, her non-negotiables, briefly and warmly.
- Visual: three tappable belief chips: "Meet learners where they are", "Build their autonomy", "Level the field".
- Interaction: tap each to reveal a one-line story behind it (e.g., differentiated curriculum for athletes of every level at Atlanta Truth; Black Girls CODE; Your Voice is Power equity work).
- Copy: "What I will not compromise on."

**Slide 8, Close: let's talk**
- Purpose: clear, warm call to action.
- Visual: quiet card with her monogram or headshot.
- Interaction: buttons, View resume (PDF), LinkedIn, Email, and "See my work" (back to the homepage work grid) and "Try my recursion lab" (`/lab/recursion`).
- Copy: "That is me. If you are building learning that should actually click, let's talk." Email and links.

### 4.3 Engine reuse and new pieces
- Reuse `<SlideDeck>`, its nav, hash sync, reduced-motion, and a11y wholesale.
- New slide bodies in `src/components/story/` (one per slide). Reuse `click-word.tsx`, `reveal.tsx`, `magnetic-button.tsx`, `stat-block.tsx`, and `work-card.tsx` patterns where they fit.
- Content in `src/data/story.ts`, pulling facts already in `src/data/site.ts`, `stats.ts`, and `work.ts` (do not duplicate, import and extend).

## 5. Architecture and files
- **Route:** `src/app/story/page.tsx` (server shell) → client `<SlideDeck slides={storySlides} deckId="story" />`.
- **Hero link:** add a primary action in `src/components/hero.tsx`, "Meet me (90-second tour)", linking to `/story`. Keep the existing scroll homepage intact.
- **Data:** `src/data/story.ts` (typed slide content, em-dash-free).
- **Components:** `src/components/story/*` for the 8 slide bodies.
- **Constraint:** Next.js 16 with breaking changes; read `node_modules/next/dist/docs/` before routing/component work (`AGENTS.md`). Client components marked `"use client"`.

## 6. Visual and brand
- Same tokens as the site (`globals.css`): paper, ink, violet primary, coral accent sparingly, Space Grotesk headings, Inter body, Geist Mono for numbers and code. Dark mode via `next-themes`.
- Warm and a little playful in motion and microcopy; calm and spare in layout; one idea per slide. Music-tech personality welcome (subtle), never gimmicky.

## 7. Accessibility (WCAG 2.2 AA)
- Every interaction has a keyboard and touch path (Slide 2 hold-to-count has a keyboard alternative such as a slider or a "count" button; Slide 1 untangle works on Enter/Space).
- `prefers-reduced-motion` honored (counts and morphs become instant, no translate).
- Color never the sole signal; visible focus; semantic headings; labelled controls; external links `rel="noopener noreferrer"`.

## 8. Sharing, SEO, analytics
- Distinct OG image and title for `/story` ("Meet Chalece DeLaCoudray, a 90-second interactive tour").
- Anonymous `@vercel/analytics` events: tour start, per-slide reach, completion, and CTA clicks.
- Canonical URL, metadata, add to `sitemap.ts`.

## 9. Build plan (tickets)
In `docs/tickets/`, numbered format (Goal, Content, Acceptance criteria, States). Assumes 020-deck-engine from the recursion brief exists.
- **030-story-route-and-data** `/story` route + `src/data/story.ts` + hero link.
- **031-slide-hook-untangle** Slide 1 (tap to untangle "complex").
- **032-slide-proof-counter** Slide 2 (hold/scrub to count 30,630 + course chips).
- **033-slide-make-it-click** Slide 3 (jargon to plain toggle, the meta lesson).
- **034-slide-range-facets** Slide 4 (facet switcher).
- **035-slide-published-cards** Slide 5 (three flip cards with links).
- **036-slide-building-now** Slide 6 (BLACQList + agent systems).
- **037-slide-beliefs** Slide 7 (three belief chips with stories).
- **038-slide-close-cta** Slide 8 (contact, resume, links, cross-link to /lab/recursion).
- **039-a11y-reduced-motion-seo** Audit + OG + analytics.

## 10. Acceptance criteria
- [ ] `/story` runs through 8 slides via buttons, arrows, swipe, dots; hash tracks the slide; hero links to it.
- [ ] Every slide interaction is operable by keyboard and by touch.
- [ ] Slide 1 untangle, Slide 2 counter, and Slide 3 jargon-to-plain all work and reverse cleanly.
- [ ] `prefers-reduced-motion` removes all translate/scrub motion.
- [ ] Facts match `site.ts` / `stats.ts` / `work.ts` (no contradictions, no invented numbers).
- [ ] Lighthouse: Performance 90+, Accessibility 100.
- [ ] Zero em dashes in any copy, data file, or comment.
- [ ] Distinct OG card on share.

## 11. Out of scope (Phase 2)
- Replacing the homepage with the deck (keep both).
- A guided audio voiceover or video.
- Per-facet deep pages (link to existing work items instead).
