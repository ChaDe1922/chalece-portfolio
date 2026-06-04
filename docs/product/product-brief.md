# Product Brief: Chalece DeLaCoudray Portfolio Website

**Last updated:** 2026-06-03
**Status:** Draft, ready for build
**Audience / pipeline:** Product Agent → Website Agent → Frontend Agent → Implementation (Next.js) → Deploy (Vercel)
**Owner:** Chalece DeLaCoudray
**Style rule (non-negotiable):** No em dashes anywhere in copy. Use commas, periods, colons, or "to" for ranges.

---

## 0. TL;DR for the build team
Build a lean, fast, accessible personal **resume/portfolio site** for a learning experience designer and technologist who is job searching. One scrolling homepage with anchored sections (Hero, Proof, Work, About, Resume, Contact), plus a downloadable resume PDF. Design vibe: **creative technologist** (professional, with music-tech and design personality). Stack: **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui**, static, **deployed free on Vercel** (custom domain later). No backend, no auth, no CMS for v1. Eat-our-own-dogfood **WCAG 2.2 AA** accessibility (the owner does accessibility work). Ship MVP fast.

---

## 1. Problem / Opportunity
Chalece is running an active job search for remote learning experience design, instructional design, and curriculum roles ($92k+). She has a strong, verifiable record (7 published Coursera courses, 30,630+ learners; Georgia Tech M.S.; Amazon Music; an ACM CHI publication; a portfolio of AI agent systems) but **no single home on the web that proves it**. A clean portfolio gives recruiters a fast, credible way to verify her work, gives her a link to drop in applications and outreach, and supports the "AI tools" and "design" signals her target roles ask for.

This is a **secondary priority** to applications and outreach. The goal is a tasteful MVP shipped quickly, not a sprawling site.

## 2. Positioning
**For** hiring managers and recruiters in learning, curriculum, and EdTech
**who** need to quickly verify a candidate's depth and craft,
**Chalece's portfolio** is a fast, accessible site that shows a decade of turning complex technical concepts into learning that reaches tens of thousands of people,
**unlike** a static PDF or a LinkedIn page, because it pairs verifiable proof (public Coursera courses, a CHI publication, shipped AI systems) with the design and accessibility sensibility the work itself demands.

**Value proposition (one line):** A learning experience designer and technologist who makes complex technical concepts click, with the receipts to prove it.

**Voice and tone:** Confident, warm, precise. Creative-technologist personality (a nod to music tech and building), never gimmicky. Plain language. Short sentences.

## 3. Target users and flows

### Primary user: Recruiter / Hiring Manager
- Context: skimming a candidate during a job search, often on desktop, sometimes mobile, in 2 to 4 minutes.
- Goal: confirm fit fast, see real proof, find the resume and a way to contact.
- Flow: Land on hero, immediately understand role + the 30,630-learner proof, scan featured work, glance at about, download resume or click LinkedIn/email.

### Secondary user: Potential client / collaborator (future-facing)
- Context: exploring whether to engage her for contract or service work.
- Goal: understand range and credibility, find contact.
- Flow: Hero, work, about, contact. (Services content is Phase 2.)

### Tertiary user: Chalece herself
- Goal: a stable link to paste into applications, LinkedIn, and outreach, and a place that updates easily.

## 4. MVP scope

### In scope (v1)
- Single scrolling homepage with anchored sections: **Hero, Proof stats, Featured Work, About, Resume, Contact**.
- Sticky/anchored nav linking to sections.
- Downloadable resume **PDF** (served from /public) plus a "view highlights" block.
- Working contact path (email link + LinkedIn; optional simple form via a free service).
- Responsive (mobile-first), WCAG 2.2 AA, fast (Lighthouse 95+ targets).
- SEO metadata so her name and titles are discoverable.

### Out of scope (v1, note as Phase 2)
- Per-project case-study detail pages (use rich cards in v1).
- Services / Key Point Systems marketing pages.
- Ventures hub (BLACQList, E22).
- Blog / CMS, auth, databases, e-commerce.
- Custom domain (ship on a free Vercel subdomain first).

## 5. Site map (v1)

```
/ (single page, anchored sections)
├── #hero          Name, role, one-line value prop, primary CTA + secondary CTA
├── #proof         3 to 4 headline stats (30,630+ learners, 7 Coursera courses, 10+ yrs, M.S. Georgia Tech)
├── #work          Featured Work grid (4 to 6 cards, each linking out to live proof)
├── #about         Bio + skills snapshot + headshot (optional)
├── #resume        Highlights + Download Resume (PDF) button
└── #contact       Email, LinkedIn, Coursera, optional contact form
Footer: copyright, quick links, "built with Next.js" optional
```
Recommendation: keep it a **single page** for v1 (fast, simple, great for skimming). Promote any card to a `/work/[slug]` detail page in Phase 2 if needed.

## 6. Page / section content (copy is paste-ready; refine in the Website Agent step)

### 6.1 Hero (#hero)
- Eyebrow: `Learning Experience Designer · Technologist · Atlanta, Remote`
- Headline: **"I make complex technical concepts click."**
- Subhead: "Ten years turning complex technical content into learning people actually finish and use. Seven published Coursera courses, 30,630+ learners. M.S. Music Technology, Georgia Tech."
- Primary CTA: `See my work` (scrolls to #work)
- Secondary CTA: `Download resume` (PDF) and/or `Email me`

### 6.2 Proof stats (#proof)
Four stat blocks (big number + label):
- **30,630+** learners reached
- **7** published Coursera courses
- **10+** years in learning and technology
- **M.S.** Music Technology, Georgia Tech (3.75 GPA)
(Optional: animated count-up on scroll, with reduced-motion fallback.)

### 6.3 Featured Work (#work)
Card grid. Each card: title, one-line description, 2 to 3 tags, and a link (external where public). Suggested set:

1. **Coursera Course Catalog (Codio)** — Authored 7 published courses on DevOps, containers, CI/CD, operating systems, Unix, and web security, reaching 30,630+ learners. Tags: Curriculum, Assessment, Technical. Link: https://www.coursera.org/instructor/~88911140
2. **Multi-Agent AI Systems** — Designed and built roughly 14 production-grade multi-agent systems for curriculum development, professional learning, UX accessibility, and venture strategy. Tags: AI, Systems, Prototyping.
3. **Your Voice Is Power** — Curriculum and coding competition with CEISMC, Amazon, Georgia Tech, and Pharrell Williams' YELLOW, connecting computer science, music, and equity on the EarSketch platform. Tags: Curriculum, Equity, Music + Code.
4. **Planet Bug (ACM CHI 2020)** — Published educational conservation game with a custom hardware controller; programmed the embedded microcontrollers and sensors. Tags: Game-based learning, Published, Hardware.
5. **Audio Program Management at Amazon Music** — Led Audio Quality and Hardware Compatibility programs across 50+ device combinations and 1,200+ test scenarios; stood up a testing lab. Tags: Program Management, Audio, Scale.
6. **E22 / Atlanta Truth Data Systems** — Co-founded an athletic development company and built the data and analytics backbone (performance and wellness dashboards) for a women's tackle football team. Tags: Data, Dashboards, Sports.

### 6.4 About (#about)
Bio (about 180 words, paste-ready):
> I am a learning experience designer and technologist who turns complex, technical material into learning that sticks. I started in audio engineering and studio operations, earned a B.A. and an M.S. in Music Technology from Georgia Tech, and built a decade-long career around one idea: that hard things become learnable when you design for the learner, not the spec.
>
> At Codio I authored seven published Coursera courses, on DevOps, containers, CI/CD, operating systems, and more, reaching over thirty thousand learners. At Amazon Music I led technical programs and stood up the systems behind them. Along the way I co-founded an athletics-development venture, mentored young coders, published research at ACM CHI, and built a portfolio of AI agent systems that I use to prototype and ship faster.
>
> I care about clarity, accessibility, and craft. If you have something complex that people need to understand, I can help them get there.

Skills snapshot (chips/badges): Learning experience design · Curriculum and assessment · Adult learning (ADDIE, Bloom's) · Technical content (DevOps, OS, CI/CD) · AI tooling and prototyping · UX and WCAG accessibility · Python, JavaScript, HTML/CSS · Program management.

### 6.5 Resume (#resume)
- Short highlights list (3 to 4 lines pulling the strongest proof).
- **Download Resume (PDF)** button. (Use the ATS-clean resume exported to PDF; place at /public/Chalece-DeLaCoudray-Resume.pdf.)

### 6.6 Contact (#contact)
- Friendly one-liner: "Open to remote roles in learning experience design, instructional design, and curriculum. Let's talk."
- Email: cdelacoudray@gmail.com (mailto)
- LinkedIn: linkedin.com/in/chalecedelacoudray
- Coursera: https://www.coursera.org/instructor/~88911140
- Optional simple contact form via a free service (Formspree or Web3Forms). If a form adds complexity, ship with email + LinkedIn only for v1.

## 7. Design direction (creative technologist)
For the **Frontend Agent** to turn into design tokens.

- **Mood:** modern, confident, a little expressive. Think "studio meets systems." Clean layout, generous whitespace, one expressive display typeface, a restrained accent color, and a subtle audio/waveform or signal motif used sparingly.
- **Color (proposed tokens, adjust for AA contrast):**
  - Ink (text/base): `#14131A`
  - Paper (background): `#F7F5F2`
  - Accent (primary): `#6D5AE6` (electric violet, nods to creative tech)
  - Accent secondary: `#FF6B5E` (warm coral, for highlights/CTAs sparingly)
  - Muted text: `#5A5862`
  - Optional dark mode: invert to ink background with paper text; keep accents.
- **Typography:**
  - Display/headings: an expressive modern grotesque (e.g., Space Grotesk or Clash Display) for personality.
  - Body: a clean, legible sans (e.g., Inter). Load via next/font.
- **Motion:** tasteful and subtle. Fade/slide-in on scroll, count-up for the proof stats, gentle hover states on cards and buttons. Respect `prefers-reduced-motion` (disable non-essential motion).
- **Imagery:** minimal. Optional professional headshot in About. An optional abstract waveform/signal graphic as a hero accent. No stock-photo clutter.
- **Accessibility (required, AA):** color contrast 4.5:1 for text, visible focus rings, full keyboard navigation, semantic landmarks, alt text on all images, reduced-motion support, labeled form fields. This site should pass a WCAG audit; it is part of her brand.

## 8. SEO
- Title (home): `Chalece DeLaCoudray | Learning Experience Designer & Technologist`
- Meta description: "Learning experience designer and technologist in Atlanta. 7 published Coursera courses, 30,630+ learners. M.S. Music Technology, Georgia Tech. Open to remote roles."
- Target keywords: Chalece DeLaCoudray, learning experience designer, instructional designer Atlanta, technical curriculum developer, Coursera instructor, music technologist, AI curriculum designer, remote instructional designer.
- Add Open Graph + Twitter card metadata (next/metadata), a favicon, a sitemap.xml, and JSON-LD Person schema (name, jobTitle, alumniOf Georgia Tech, sameAs LinkedIn + Coursera).

## 9. Technical notes (for App / Frontend agents)
- **Framework:** Next.js (App Router) + TypeScript.
- **Styling:** Tailwind CSS + shadcn/ui components.
- **Rendering:** fully static (no server needed). Single route `/` with sections; optional `/work/[slug]` later.
- **Hosting:** Vercel free tier. Deploy from a GitHub repo. Ship on the default `*.vercel.app` subdomain; add a custom domain (e.g., chalecedelacoudray.com) in Phase 2 (about $12/yr).
- **No backend, no database, no auth** for v1.
- **Contact:** mailto + LinkedIn for v1; optional Formspree/Web3Forms free form (no server code).
- **Assets:** resume PDF and any images in `/public`. Optimize images with next/image. Fonts via next/font.
- **Analytics (optional):** Vercel Web Analytics (free) or Plausible later.
- **Performance targets:** Lighthouse 95+ across Performance, Accessibility, Best Practices, SEO. LCP under 2s.
- **Repo:** keep this project self-contained per the bundle convention (docs/, src/).

## 10. Component inventory (seed list for the Frontend Agent)
- `Nav` (sticky, anchor links, mobile menu)
- `Hero` (eyebrow, headline, subhead, two CTAs, optional waveform accent)
- `StatBlock` + `ProofStats` (count-up, reduced-motion safe)
- `SectionHeading`
- `WorkCard` (title, description, tags, external link) + `WorkGrid`
- `Tag` / `Badge` (shadcn)
- `AboutSection` (bio, skills chips, optional headshot)
- `ResumeBlock` + `DownloadButton`
- `ContactSection` (links + optional `ContactForm`)
- `Footer`
- `Button` (shadcn variants), `ThemeToggle` (optional dark mode)
- Define default/hover/focus/loading/empty states for interactive components.

## 11. Content source map (where the real content lives)
Pull verbatim-where-possible from Chalece's career files (do not invent):
- Resume content: `personal-ops-agent/data/career/resume-master.md` and `outputs/career/resumes/ats/2026-06-03_dbt-labs-resume-template-v2.md`
- Story bank: `personal-ops-agent/data/career/experience-bank.md`
- Profile/positioning: `personal-ops-agent/data/career/career-profile.md`
- Public proof: Coursera instructor page (7 courses, 30,630 learners), ACM CHI 2020 publication, LinkedIn.
- Resume PDF: export the ATS-clean resume to `/public/Chalece-DeLaCoudray-Resume.pdf`.

## 12. Success criteria
- Ships and deploys to a live Vercel URL.
- Lighthouse 95+ (esp. Accessibility and SEO); passes a manual WCAG 2.2 AA pass.
- Mobile responsive; readable and skimmable in under 3 minutes.
- Resume downloads; LinkedIn/email/Coursera links work.
- Discoverable for "Chalece DeLaCoudray" and core role keywords.
- Easy to update (content in typed data files or MDX, not hardcoded everywhere).

## 13. Risks, assumptions, open questions
- **Assumption:** static site is sufficient (true for v1). **Risk:** scope creep into services/ventures; mitigate by deferring to Phase 2.
- **Open question:** include a contact form (Formspree) or just email + LinkedIn for v1? (Recommend: email + LinkedIn to ship faster; add form later.)
- **Open question:** dark mode in v1 or Phase 2? (Recommend: optional, only if cheap.)
- **Open question:** headshot available? (Optional; site works without one.)
- **Open question:** custom domain name preference (chalecedelacoudray.com vs other)? (Phase 2 decision.)

## 14. Build / run sequence (how to execute through this bundle)
1. **Product Agent:** refine this brief into a tight PRD (`docs/product/PRD.md`) and MVP scope; confirm the single-page structure.
2. **Website Agent:** produce `docs/ux/site-map.md`, a `docs/product/copy-deck.md` (all section copy, finalized in her voice, no em dashes), and an `docs/product/seo-map.md`.
3. **Frontend Agent:** produce `docs/design/design-tokens.md`, `docs/ux/component-inventory.md` + component specs, and `docs/ux/layout-spec.md` (responsive breakpoints, states).
4. **Implementation:** scaffold Next.js + Tailwind + shadcn/ui, build the components and the single page, drop in the resume PDF, wire metadata/SEO, run an accessibility + Lighthouse pass.
5. **Deploy:** push to GitHub, connect to Vercel, ship on the free subdomain. Custom domain later.

## 15. Phase 2 (after MVP ships, not now)
- Per-project case-study pages (`/work/[slug]`).
- Services section for Key Point Systems offers (WCAG audits, staff training, etc.).
- Ventures hub (BLACQList, E22).
- Blog or notes (MDX).
- Custom domain + richer analytics.
- Optional CMS for self-serve updates.
