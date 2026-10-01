# Marketing copy pass: Night Session design

- **Date:** 2026-09-30
- **Reader:** Chalece
- **Scope:** The Night Session copy on branch feat/three-pillars, uncommitted. That covers home, the three pillar pages, /lab and the site metadata. I checked source files in `src/` and the prod build at http://localhost:3102.
- **Goal being judged:** hiring conversations from hiring managers in learning design, music technology and software development. The conversion is an email or a LinkedIn message about a role.
- **Method note:** This follows the WF-043 Conversion Diagnostic method, with the WF-025 proof audit for claims. It is **not a recorded workflow run**. The WF-040 funnel file does not exist for this project, so WF-043 has no funnel to attach to. I did not run `scripts/workflow.py`, and I did not change any approval state. The roles applied are cro-analyst, conversion-copywriter, cta-optimization-agent, brand-voice-guardian and proof-credibility-agent.
- **Sources of truth:**
  - `marketing-and-growth-os/projects/chalece-delacoudray/05_messaging/MESSAGING.md`
  - `03_positioning/POSITIONING.md`
  - `16_proof/evidence_inventory.md`
  - `00_intake/source/career/*_excerpt.md`
  - `docs/brand/voice-profile.md`
- **Changes:** Nothing in `src/` was edited. This file is the only output.

---

## 1. Ten-second scan verdicts

| Page | What a hirer gets in 10 seconds | What they miss | Verdict |
|---|---|---|---|
| Home, 1280 and 375 | Her name, "I create, I build, and I teach.", the three fields in the hero label, 48,000+ learners, Amazon Amp, and lessons to try. | **No job titles on screen.** `site.role` shows up only in metadata and JSON-LD. **There is no email path above the fold:** the hero CTAs are "Play the work" and "Try a lesson". The three verbs are solo buttons with no visible cue. The blurb opens with a fragment. | **Partial pass.** Domains are clear, but the role and the next step are not. |
| /music-tech, 1280 | "I create with sound.", three stats, 5 work cards, 4 lessons, and a "Hiring?" close with role chips and an email button. | The roles and the email button sit at the very bottom. The desktop nav has no email link and no pillar links. | **Pass.** This is the strongest page type for conversion. |
| /software, 375 | "I build software people use.", ACM CHI 2020, 8 lessons, and the E22 data systems. | The proof is thinner, and the "5 years" stat is course writing. One role chip, "Frontend Developer", is not in MESSAGING.md. | **Pass with a proof caveat.** See section 5. |
| /lab, 1280 | "Learn by doing." and a carousel of in-browser lessons. | It doesn't say who made these, which roles they prove, or how to get in touch. The only contact path is the footer, and the footer has no email. | **Clear as a lesson hub, weak as a hiring page.** |

**The biggest conversion gap:** MESSAGING.md §2 specifies the hero CTAs as "See the work" and "Email me about a role". The build ships "Play the work" and "Try a lesson" instead, so **the conversion event has no button on the first screen of the home page.**

---

## 2. The two lines you disliked

### 2a. Console H2

- **Current:** "Pick the one you're hiring for." at `src/components/night/mix-console.tsx:124`

| # | Option | Notes |
|---|---|---|
| 1 | Three crafts. Hear them one at a time, or all together. | Pre-drafted. Clear, but long for an H2. It also partly repeats the helper. |
| 2 | Turn up the craft you need. | Pre-drafted. Short, verb-first and hirer-centred, and it keeps the console metaphor. |
| 3 | Solo a craft, or play the full mix. | Pre-drafted. Describes the mechanics, which the helper already does. |
| 4 | What I do, one channel at a time. | Pre-drafted. Warm, but "channel" needs the helper to decode it. |
| 5 | Pick a craft and turn it up. | New. Close to 2, but "pick" echoes the line you disliked. |
| 6 | Hiring for one craft? Turn it up. | New. Speaks to the hirer directly, but it's a question-plus-command pattern and a little salesy. |

**Recommendation: "Turn up the craft you need."**

- It keeps the hiring intent through "you need" without the stiff "hiring for".
- It uses the console verb the page is built on.
- It leaves the explaining to the helper line. Every other option either repeats the helper or needs it anyway.

### 2b. Helper line and empty state

- **Current helper:** "S solos a craft. ON blends crafts together. Full mix brings everything up." at `mix-console.tsx:127`
- **Current empty state:** title "Bring up a channel.", body "Solo one craft, switch two on to blend them, or hit Full mix.", label "NO SIGNAL" at `mix-console.tsx:101-103`

**Jargon risk of the "S" and "ON" labels:**

- "S" for solo is mixing-desk shorthand. A music-tech hirer reads it instantly. A curriculum or software hirer, who makes up two thirds of the audience, likely won't.
- The aria-labels already say "Solo {name}" and "{name} on", so screen reader users get the plain words and sighted users don't.
- The current helper also opens both of its first two sentences with a UI token, "S" and "ON". That breaks the rule that no sentence starts with a code token.
- The helper has to do two jobs: say what a channel is and say what S does. Otherwise the console reads as decoration.

| # | Option | Notes |
|---|---|---|
| 1 | Tap S to hear one craft on its own. Switch two on to hear how they work together. Full mix plays everything. | Pre-drafted. Decodes S. "Switch two on" is slightly loose. |
| 2 | Solo one craft, blend two, or bring up the full mix. | Pre-drafted. Tight, but it leaves "S" undecoded. |
| 3 | Each channel is one of my crafts. Solo it, blend it, or play them all. | Pre-drafted. It says what a channel is, but not what the S button does. |
| 4 | Each channel is one of my crafts. Tap S to hear one on its own, turn two on to hear how they work together, or play the full mix. | New. Covers both jobs, and no sentence starts with a token. |
| 5 | Tap Solo to hear one craft on its own. Turn on two to hear how they work together. Full mix plays all three. | New. Only works if the visible button text changes from "S" to "Solo". See rewrite #6. |

**Recommendation: option 4.** "Each channel is one of my crafts. Tap S to hear one on its own, turn two on to hear how they work together, or play the full mix."

- If you are willing to relabel the button, option 5 is cleaner still.

**Empty state proposal:**

- Title: "Nothing is playing."
- Body: "Tap S on any channel to hear one craft, or press Full mix."
- Keep "NO SIGNAL" as the decorative label.
- Also hide "hear these in the tracklist ↓" at `mix-console.tsx:199` while nothing is playing. It currently points at an empty mix.

---

## 3. Rewrite table

Only changes that move clarity, conversion or rule compliance are listed.

| # | Location (file:line) | Current | Proposed | Reason | Source | Priority |
|---|---|---|---|---|---|---|
| 1 | `components/night/night-hero.tsx:81` and `:87` | "Play the work" and "Try a lesson" | "See the work" and "Email me about a role". Keep "Try a lesson" as a quieter text link if you want it. | The conversion event has no first-screen button. This also matches the approved-draft spec. | MESSAGING.md §2 Hero CTAs | Must |
| 2 | `components/night/mix-console.tsx:124` | Pick the one you're hiring for. | Turn up the craft you need. | Owner dislikes it. It's also clearer as an instruction. | Section 2a | Must |
| 3 | `mix-console.tsx:127` | S solos a craft. ON blends crafts together. Full mix brings everything up. | Each channel is one of my crafts. Tap S to hear one on its own, turn two on to hear how they work together, or play the full mix. | Sentences start with UI tokens, and the jargon is opaque to two of the three audiences. | voice-profile.md rule 5 | Must |
| 4 | `data/pillars.ts:127` | roles: "Learning Engineer", "Frontend Developer" | "Learning Engineer", "Technical Curriculum Developer", "Technical Program Manager". Add "Software Developer" only after you confirm it. | "Frontend Developer" is not in MESSAGING.md. "Software Developer" is itself labeled requires confirmation there. | MESSAGING.md §3.2 roles; career-profile_excerpt Lanes A and B; mis_target-role-list_f6bb33 | Must, requires confirmation |
| 5 | `data/mix.ts:53, 92, 246 to 258` and `data/work.ts:53, 123` | "2012–2016", "2022–2023", "2023–now", "2021–2026", and similar | "2012 to 2016", "2022 to 2023", "2023 to now", "2021 to 2026" | En-dash ranges. The rule is to use "to" for ranges. | voice-profile.md | Must |
| 6 | `mix-console.tsx:65` and `:75`, the visible button text | S / ON / OFF | Solo / On / Off, keeping the current aria-labels | Removes the jargon for non-audio hirers. Optional if #3 ships. | Section 2b | Could |
| 7 | `mix-console.tsx:102-103` | Bring up a channel. / Solo one craft, switch two on to blend them, or hit Full mix. | Nothing is playing. / Tap S on any channel to hear one craft, or press Full mix. | Plainer, and it pairs with the new helper. | Section 2b | Should |
| 8 | `mix-console.tsx:199` | hear these in the tracklist ↓, shown even with no signal | Hide it when no channel is on | Right now it points to an empty tracklist. | UI state | Could |
| 9 | `data/mix.ts:98-99` HERO_BLURB | Across music technology, software and learning design. I've written 10 Coursera courses ... | I work across music technology, software and learning design. I've written 10 Coursera courses that have reached 48,000+ learners, led audio quality for Amazon Amp at Amazon Music, and built interactive lessons you can try right here. | It opens with a fragment. The facts and your Amazon Amp wording are unchanged. | fct_codio-courses-learners_2dbe82, fct_amazon-amp-audio-quality_37c1ca, fct_lab-lessons_fffb8d | Should |
| 10 | `components/night/session-resume.tsx:122` | Export resume | Download resume | "Export" is tool jargon. A hirer downloads a file. | Plain language rule | Should |
| 11 | `session-resume.tsx:203` | Every track exports as its own resume, formatted for applicant tracking systems. | Download a resume for any craft. Each one is formatted for applicant tracking systems. | The "track" metaphor hides a useful fact: there are three tailored resumes. | night-contact resume card, "Three resumes, one for each craft" | Should |
| 12 | `components/pillar/pillar-cta.tsx:41` | Email button uses `site.links.email` with no subject | Add the per-pillar subject line the home contact block already uses | The inbox can then show which pillar converted. That is the only attribution you have until WF-090. | night-contact.tsx mailto pattern | Should |
| 13 | `components/night/night-nav.tsx`, desktop | Anchor tabs and a timecode only | Add an "Email me" button, and add the three pillar links plus Lab, which mobile already has | There is no persistent contact path on desktop, and pillar pages are hard to find. | CTA method | Should |
| 14 | `components/night/night-footer.tsx` | LinkedIn and GitHub links, no email | Add "Email" first in that link row | Every page ends here, including /lab. | MESSAGING.md §5 links | Should |
| 15 | `app/lab/page.tsx`, after TeachingBeliefs | No hiring close | A short close: "Want someone who can build lessons like these? Email me about a role." plus the email button | /lab is proof. It needs a way to act on that proof. | MESSAGING.md §5 contact line | Should |
| 16 | `data/pillars.ts:87` | roles: "Audio Program Manager", "Music Technologist" | Keep "Audio Program Manager". Confirm "Music Technologist" as a hiring title before it ships. | Music hiring titles are an open gap. | MESSAGING.md §3.1; mis_music-hiring-titles_22f089 | Should, requires confirmation |
| 17 | `data/teaching.ts:9` | ...whether the learner is twelve or a staff engineer. | ...whether the learner is new to code or already works in tech. **Requires confirmation.** | Nothing in the fact files supports "twelve" or "staff engineer". The youngest sourced learners are high school, and the vibe-coding lesson is tagged ages 13 to 15. | resume-master_excerpt; fct_gt-earsketch-workshops_31c73c | Could, requires confirmation |
| 18 | `components/work-grid.tsx:24` | Courses, audio programs and software that shipped. | Courses, audio programs and software I've built. | "ship" is on the avoid list. Only the pillar branch of WorkGrid renders today, so this is dead copy, but fix it before it gets reused. | voice-profile.md avoid list | Could |

---

## 4. Voice-rule violations

| Rule | File:line | Exact text |
|---|---|---|
| No en or em dash ranges; use "to" | `src/data/mix.ts:53` | `meta: "2012–2016"` |
| same | `src/data/mix.ts:92` | `meta: "2022–2023"` |
| same | `src/data/mix.ts:246` | `label: "2012–2016"` |
| same | `src/data/mix.ts:247` | `label: "2021–2023"` |
| same | `src/data/mix.ts:248` | `label: "2023–now"` |
| same | `src/data/mix.ts:252` | `label: "2026–now"` |
| same | `src/data/mix.ts:253` | `label: "2026–now"` |
| same | `src/data/mix.ts:257` | `label: "2021–2026"` |
| same | `src/data/mix.ts:258` | `label: "2022–2023"` |
| same | `src/data/work.ts:53` | `meta: "2012–2016"` |
| same | `src/data/work.ts:123` | `meta: "2022–2023"` |
| No sentence starts with a code or UI token | `src/components/night/mix-console.tsx:127` | "S solos a craft. ON blends crafts together." |
| Avoid list: "ship" | `src/components/work-grid.tsx:24` | "software that shipped" |
| No parentheses in public copy. This one is your call. | `src/data/sound-lab.ts:50, 125, 129, 157, 166-169, 200, 229`; `src/data/git-lab.ts:89, 399, 419` | e.g. "measured in hertz (Hz)", "Sine (smooth)", "Take a photo (commit)" |

**About the parentheses:**

- These are inside lesson content. They gloss terms for learners, and some are quiz feedback.
- If the no-parentheses rule covers lessons, they need a rewrite pass.
- If it covers only marketing copy, record that as an exception in voice-profile.md so the pre-publish grep stops flagging them.

**Checked and clean:**

- No em dashes in rendered copy.
- "Students" appears only in the program name "student panels".
- No "ramp", "resonated" or "My approach is simple".
- No mention of the retired venture.
- No private milestone, and no DEI or equity framing.
- Musicianship is not credited to Georgia Tech.
- "Led audio quality for Amazon Amp" is intact everywhere.

---

## 5. Proof gaps and claims needing confirmation

| # | Claim on the site | Where | Status | What's needed |
|---|---|---|---|---|
| 1 | "built our data systems in Athlete OS", the E22 card, and "2026" / "2026–now" | `data/pillars.ts:120`, `data/work.ts:64-68`, `data/mix.ts:252` | **Requires confirmation.** MESSAGING.md §8.1 flags both the Athlete OS wording and the 2026 date. The resume excerpt gives E22 no start date. | Confirm the wording and the date. |
| 2 | E22 impact | work.ts E22 card | No usage metric exists, mis_e22-usage-metric_af8411. The copy correctly adds none. | A number, if you have one. It is the single biggest lift for the software pillar. |
| 3 | "8 interactive lessons" | pillars.ts software stat, the software blurb in mix.ts, and the lab card | 8 routes exist locally. MESSAGING.md §8.4 asks you to confirm all 8 are live on the deployed site before "8" is published. | A deploy check. |
| 4 | Software role chips | `data/pillars.ts:127` | "Frontend Developer" has no source. "Software Developer" is labeled requires confirmation. | Your confirmed title list, mis_target-role-list_f6bb33. |
| 5 | Music role chip "Music Technologist" | `data/pillars.ts:87` | Requires confirmation, mis_music-hiring-titles_22f089. | Same. |
| 6 | Software pillar stat "5 years writing technical courses..." | pillars.ts software stats | Sourced, from resume-master Codio June 2021 to June 2026. But it's curriculum evidence standing in for software proof, so the software pillar still has only 1 strong item. | No copy change needed. Treat it as a known weakness until E22 or GitHub proof exists. |
| 7 | "twelve or a staff engineer" | `data/teaching.ts:9` | **Requires confirmation.** Not in any fact file. | Confirm or soften, per rewrite #17. |
| 8 | "Every year since 2023 I have led music tech coding workshops" | `data/about.ts`, paragraph 2 | The source says "recurring" and "2023 to present", fct_gt-earsketch-workshops_31c73c. "Every year" is slightly stronger. | Confirm there was a workshop each year, or use "Since 2023 I have led recurring...". |
| 9 | Research topic | the RESEARCH liner note in `data/mix.ts`, and pillars.ts | The **site is correct**: identity in 21st-century rap, per resume-master_excerpt. **voice-profile.md is wrong.** Its About example describes early-literacy research. | Fix voice-profile.md so a future pass doesn't "correct" the site the wrong way. |
| 10 | GitHub | footer | Profile link only, which is correct until the repo audit, mis_github-repo-audit_43109c. | No change. |

**Sourced and fine:**

- 48,000+ learners and 10 courses
- 1,200+ scenarios and 50+ device combinations
- the testing lab and "procedures partner teams ran each release"
- the M.S. and B.A.
- ACM CHI 2020 and the microcontroller role
- IEEE RESPECT 2021 and ASEE 2023
- the 10-week CI/CD program
- the 2022 and 2023 cohorts
- Tree Sound 2012 to 2016
- E22 co-founder
- Atlanta Truth "this season"

These trace to fct ids in `16_proof/evidence_inventory.md` or to resume-master_excerpt.md.

---

## 6. Metadata and OG review

Checked against the prod build on :3102.

| Page | Title | Description | OG image and card | Issues |
|---|---|---|---|---|
| / | Chalece DeLaCoudray \| Learning Design, Music Tech, Software | Matches MESSAGING.md §6 word for word | `/opengraph-image`, summary_large_image | The image is still the **old purple palette** (`#2a2350`, `#9b8cf0` in `app/opengraph-image.tsx:24, 33`), not Night Session. It also prints `site.location`, "Atlanta, Remote". |
| /music-tech | Music Technology \| Chalece DeLaCoudray | Matches MESSAGING.md §3.1 | **No og:image**, and twitter:card is "summary" | Shared links show no image. The likely cause is that `generateMetadata` in `app/(site)/[pillar]/page.tsx` sets its own `openGraph`, which replaces the root one. |
| /software | Software Development \| Chalece DeLaCoudray | Matches MESSAGING.md §3.2 | No og:image, card "summary" | Same. |
| /curriculum | Curriculum and Learning Design \| Chalece DeLaCoudray | Matches MESSAGING.md §3.3 | No og:image, card "summary" | Same. |
| /lab | Interactive Lessons \| Chalece DeLaCoudray | "Hands-on, in-browser lessons by Chalece DeLaCoudray. Build a synth ... spot the red flags in a phishing scenario." | **summary_large_image with no og:image** | twitter:title falls back to the home title. The description doesn't name her crafts or say she designed and coded them. |
| /lab/recursion, and other lessons | "Recursion, watch it run." | Good, and names her | summary_large_image, no image seen | The `<title>` has no name, so a browser tab or search result doesn't say whose lesson it is. |

**Other metadata:**

- `app/layout.tsx:66-68`: themeColor is still the old light and dark values, `#f7f5f2` and `#17161d`. It should match the Night background.
- JSON-LD `alumniOf` at `app/layout.tsx:87` lists Georgia Tech only. Bethune-Cookman, B.A. Music Technology 2008 to 2012, is sourced in resume-master_excerpt and could be added. Could.
- The home title orders the fields Learning Design, Music Tech, Software, while the umbrella runs create, build, teach. MESSAGING.md §6 sanctions this order, so it's not a defect.

**Is /lab balanced across the three crafts?**

- **By primary tag, no.**
  - 4 lessons are music tech: sound, spectrum, fourier, audio-tools.
  - 3 are software: vibe-coding, recursion, git.
  - 1 is curriculum: urgent-request.
- **By alsoIn, yes.** Every lesson is also tagged curriculum, so the curriculum pillar lists all 8, music tech 4, and software 3.
- **The honest framing:** every lesson is learning-design proof, and the topics lean music and software. The page never says so. A curriculum hirer sees "Music tech" tags on the carousel and may not connect the lessons to her design work.
- **Proposed /lab meta description, 162 characters:** "Interactive lessons I designed and coded, across music tech, software and learning design. Build a synth, step through recursion, or see what Git does underneath."
  - Source: fct_lab-lessons_fffb8d and the MESSAGING.md §4.6 card, "I designed and coded each one".
- **Proposed /lab lede addition:** "I design and code every lesson here. Each one is a small example of how I teach." This is sourced from the same card.

---

## 7. Approval mismatch (reported, not fixed)

The site comments claim approval that the Marketing OS records do not show.

| Where | What it says |
|---|---|
| `src/data/site.ts:6` | "Copy source: Marketing OS WF-024 messaging, approved 2026-09-30." |
| `src/data/pillars.ts:12` | approved 2026-09-30 |
| `src/data/about.ts`, header comment | approved 2026-09-30 |
| `05_messaging/MESSAGING.md`, header | "PREPARED, AWAITING messaging_approval. Not approved and not published." |
| `05_messaging/messaging_system.json` | `status: prepared_awaiting_approval` |
| `19_workflow_runs/run_20260930_29070d/run.json`, WF-024 | `state: waiting_for_approval`, `outcome: pending` |
| `19_workflow_runs/INDEX.md` | WF-024 shown as `planned`. The index is stale versus run.json. |
| `STATUS.md` | "Approvals required: None". It was generated at 15:19:40Z, before WF-024 started at 15:21:59Z, so it's stale. |
| `03_positioning/positioning.json` | `status: prepared_awaiting_approval` |
| `03_positioning/POSITIONING.md`, header | "RECOMMENDATION, AWAITING OWNER APPROVAL" |
| `19_workflow_runs/run_20260930_075bb3/run.json`, WF-020 | `state: completed`, `outcome: success`. MESSAGING.md says option C "was approved by the operator". |

**What this means:**

- Either your approval of positioning option C and of the messaging happened in chat but was never recorded, or the site comments are ahead of the record.
- In both cases, the Marketing OS still treats the copy as unapproved. `positioning.json` was not updated when WF-020 closed.

**Two ways to resolve it, your call:**

- Record the approvals through the workflow tool.
- Or change the three code comments to "prepared, awaiting approval" until you do.

This pass did neither.
