# Chalece DeLaCoudray: Professional Voice Profile

**Audience:** anyone writing public copy for Chalece. That covers portfolio site copy, resumes, cover letters, LinkedIn drafts, outreach, READMEs and the marketing system.
**Last updated:** 2026-09-30
**Source of truth:** Author OS, at `/Users/chalecedelacoudray/Desktop/agents/author-os/projects/_author/`. The rules are in `author_profile.json`, the accepted preferences in `preferences/`, and the pending voice traits in `candidates/`. This file is a portable snapshot. If the two disagree, Author OS wins. Update Author OS first, then refresh this file.

**Status:** Every entry was transcribed on 2026-09-30 from Chalece's own standing instructions and edits. She has not yet reviewed it inside Author OS. The hard rules come from her direct instructions and hold now. The voice traits marked *pending* are well evidenced, but she has not confirmed them.

---

## 1. Hard rules

These are non-negotiable. A draft that breaks any of them is not ready to show her.

| # | Rule | Notes |
|---|---|---|
| 1 | **No em dashes.** Her own words: "Copy style rule: no em dashes anywhere." | Use a period, comma or colon instead. For ranges, write "to": "2018 to 2020". |
| 2 | **No parentheses in public copy.** | That includes titles and skill badges. Rework the sentence or use a comma or colon. Three exceptions are fine: a phone area code, a "(She/Her)" pronoun sign-off, and lesson content inside the /lab lessons, where math and code notation need them. Owner decision, 2026-09-30. `scripts/check-portfolio.mjs` already skips `src/app/lab/`. |
| 3 | **AI stays vague.** | Fine: "AI-augmented workflows", "generative AI in production", "I use Claude and Claude Code". Off limits: agent systems, multi-agent setups, how her tools are built, how many she runs. In her words: "we still gotta keep some mystery". |
| 4 | **No DEI or equity framing unless she asks** for that specific piece. | Keep the skill and the scope, and describe the audience in general terms. She has approved exceptions before, so ask. |
| 5 | **No sentence starts with a code token.** | Write "The parameter is `name`." and not "`name` is the parameter." |
| 6 | **Register: "I create, I build, and I teach."** | First person, active verbs, confident, all three careers held together. |
| 7 | **Plain, conversational prose.** | Say what a thing does in ordinary words first, then name the stack. Keep the technical substance and cut the density. |
| 8 | **Never invent claims or metrics.** | Use only facts in her records. If something is unconfirmed, flag it and ask her. |
| 9 | **Never mention the retired venture** by name in any material, link or example. The name is in personal-ops `resume-master.md` under RETIRED. | Her own rule, 2026-09-17. Use Athlete OS if a venture or build example is needed. |
| 10 | **Leave out the private Georgia Tech graduation milestone.** | It is recorded in Author OS and stays private unless she asks for it. The rest of her origin story is fine to use: self-taught, studio roots, lifelong musician. |
| 11 | **Never credit her musicianship to Georgia Tech.** | She has been a musician since age 12 and holds a B.A. in Music Technology from Bethune-Cookman. At Georgia Tech she *taught* musicianship, as Lead TA for Fundamentals of Musicianship. |
| 12 | **Name the product as new, not the domain.** | Write "SAP would be new to me." Never write "analytics would be a new domain for me." |

---

## 2. Voice traits

**Overall:** warm, confident and specific. She writes like a person talking to a person, not like a corporate summary.

- **Sentence rhythm** *(pending)*
  - Sentences run short to medium, with one idea each.
  - Join ideas with periods rather than stacked clauses.
  - She is measured, not terse, and never breathless.
  - A light hedge like "to me" is kept when it carries her judgment: "Strong technical curriculum, to me, is more than a subject explained well."
- **Openers**
  - Profile copy starts with a warm, human hook about the work, then concrete proof.
  - Profiles run about three sentences, 60 to 75 words.
  - In a cover letter or profile, every sentence has to answer the job description.
- **Confidence without inflation** *(pending)*
  - No buzzwords.
  - No "world-class" or "best-in-class" unless there is a reason.
  - No motivational fluff.
  - No throat-clearing before the point.
- **Gaps, claim first**
  - Lead with a strength that reframes the gap.
  - Give the evidence.
  - Name the gap briefly, as readiness.
  - Tie it back to her core skill.
  - Example: "I have not yet held a director title, and I am ready to step into one."
- **Correspondence**
  - Gracious and focused on the other person.
  - Complete, lightly formal sentences.
  - Close with "With gratitude," and her full name.
- **People she teaches** are "learners", not "students". The exception is a literal program name such as "student panels".

**Phrases she uses:**
- "I create, I build, and I teach."
- "When I say I build, I mean it."
- "I'm all in."
- "I'm excited to get rolling."
- "set us up for success"
- "really useful"
- "respecting a learner's time and intelligence"
- "support retention, not just completion"
- "exactly the kind of work I want to do"
- "That work closely mirrors this role:"
- "I learn new tools and systems quickly."
- "I'd get fluent fast."

---

## 3. Per-career vocabulary

These three sections are pending candidates in Author OS. They are well sourced but not yet confirmed. Use only facts already on the live site or in her records.

### Curriculum and learning design

- **Frame:** from the learner's side. Experience comes before vocabulary: "see it, then do it."
- **Method:**
  - Start from what a learner must be able to do.
  - Design the shortest path.
  - Measure whether it worked.
  - Revise from evidence rather than instinct.
- **Words:** learners, learning that sticks, hands-on, real skill, retention, capable learners, clarity, accessible.
- **Anchors:**
  - 10 published Coursera courses at Codio.
  - 48,000+ learners.
  - DevOps, containers, CI/CD and operating systems content.
  - Adult learning with ADDIE and Bloom's.
- **Feel:** warm and playful to experience, calm and spare to look at, rigorous in what it says.

### Music technology

- **Frame:** a lifelong practice, not a credential.
  - A musician since 12.
  - B.A. in Music Technology, Bethune-Cookman.
  - M.S. in Music Technology, Georgia Tech.
  - Roots in the studio and audio engineering.
- **Words:** audio engineering, studio operations, sound, creative coding, programming as a creative medium, teaching computer science through music.
- **Anchors:**
  - Audio programs at Amazon Music.
  - Three years leading EarSketch and music technology coding workshops at Georgia Tech. EarSketch uses Python and JavaScript.
  - Lead TA for Fundamentals of Musicianship.
  - Graduate research using music to build early literacy.
- **Terminology:** use terms the industry itself uses. Novelty for its own sake does not belong.

### Software development

- **Frame:** real, end-to-end building. What sets her apart is that she can code and she can teach.
- **Words:** build, prototype, end to end, working systems, Python, JavaScript, TypeScript.
- **Anchors:**
  - Planet Bug, ACM CHI 2020.
  - Data and media systems for E22.
  - Athlete OS as the venture or engineering example.
  - AI tools like Claude, described vaguely per rule 3.
- **Order:** lead with what the thing does for people. Name the stack second.

---

## 4. Avoid list

| Avoid | Why or instead |
|---|---|
| The em dash character | Hard rule 1 |
| Parentheses in public copy | Hard rule 2 |
| "This role resonated with me, both the craft and the why", or any "resonated with me" or "the craft and the why" variant | She strongly dislikes it. Open with her register line or a concrete hook. |
| "My approach is simple" | She edited it out. State the approach directly. |
| "ramp", "easy ramp" | Say "I learn new tools and systems quickly" or "I'd get fluent fast". |
| "ship the thing", "shipped the thing", and by extension "ship faster" | Say "build", "launch" or "deliver". |
| "I do both for real" | Too slangy. Show both with facts. |
| "I want to be straightforward about..." and other apologetic hedges | Use claim-first gap framing. |
| "unlock your potential", "transform your journey", "ignite your passion", "level up your career" | Motivational fluff |
| "world-class", "unparalleled", "best-in-class" with no reason given | Inflation |
| "students" for the people she teaches | Say "learners". |
| "the video landed", "talk soon" | Say "you enjoyed the video", "With gratitude," |
| "I trained my ear at Georgia Tech..." | Hard rule 11 |
| DEI, equity or anti-racism framing | Hard rule 4, unless she asks |
| Agent, multi-agent or architecture detail about her AI work | Hard rule 3 |
| The retired venture's name | Hard rule 9 |

---

## 5. Examples

These before/after pairs come from real source copy: her edits and the live site as of 2026-09-23.

**1. Musicianship credit**
- Before: "I trained my ear at Georgia Tech under Fundamentals of Musicianship."
- After: "I was the Lead Teaching Assistant for Fundamentals of Musicianship at Georgia Tech."

**2. Cover letter opener**
- Before: "This role resonated with me, both the craft and the why."
- After: "I create, I build, and I teach. This role asks for all three."

**3. Gap framing**
- Before: "I want to be straightforward about..." followed by a concession.
- After: "Leadership is a skill I have practiced at every level of my career, no matter the title. I have not yet held a director title, and I am ready to step into one."

**4. Correspondence**
- Before: "...the video landed... talk soon"
- After: "...you enjoyed the video... With gratitude, Chalece DeLaCoudray"

**5. Site About, paragraph one: a 60-plus word run-on becomes short sentences**
- Before: "I am a learning experience designer and technologist who turns complex, technical material into learning that sticks. I started in audio engineering and studio operations, earned a B.A. from Bethune-Cookman University and an M.S. in Music Technology from Georgia Tech, where my graduate research used music to help toddlers build early literacy, and built a decade-long career around one idea: that hard things become learnable when you design for the learner, not the spec."
- After: "I'm a learning experience designer and technologist. I turn complex, technical material into learning that sticks. I started in audio engineering and studio operations. I earned a B.A. from Bethune-Cookman University and an M.S. in Music Technology from Georgia Tech, where my research used music to help toddlers build early literacy. One idea runs through all of it: hard things become learnable when you design for the learner, not the spec."

**6. Site labels and the AI line: parentheses, tense shift and "ship"**
- Before, three separate site strings:
  - "Adult learning (ADDIE, Bloom's)"
  - "Coursera Course Catalog (Codio)"
  - "...published research at ACM CHI, and work fluently with AI tooling to prototype and ship faster."
- After:
  - "Adult learning with ADDIE and Bloom's"
  - "Coursera Course Catalog at Codio"
  - "...and published research at ACM CHI. I use AI tools like Claude every day to research and prototype."

---

## 6. Pre-publish checklist

Run this on every piece of public copy before it goes to Chalece or out the door. Commands assume the draft is saved as `draft.md`.

- [ ] **No em dashes:** `grep -n "$(printf '\342\200\224')" draft.md` returns nothing.
- [ ] **No parentheses:** `grep -n "(" draft.md` returns nothing, apart from an area code, a "(She/Her)" sign-off, or lesson content.
- [ ] **No sentence starts with a code token:** `` grep -nE '(^|[.:?][[:space:]]+)`' draft.md `` returns nothing, and for HTML `grep -nE '(\.|:|\?)[[:space:]]*<code' draft.html` returns nothing.
- [ ] **No retired venture:** `npm run check:portfolio` passes, which scans for the name.
- [ ] **AI is mentioned only at a high level.** No agents, systems or architecture.
- [ ] **No DEI or equity framing**, unless she asked for it in this piece.
- [ ] **No private Georgia Tech milestone. No musicianship credited to Georgia Tech.**
- [ ] **Every claim, number, title and date appears in her records** or on the live site. Unconfirmed items are flagged, not smoothed over.
- [ ] **Nothing from the avoid list**, including "resonated", "ramp", "ship", "My approach is simple" and "students".
- [ ] **Plain and conversational.** What it does comes before the stack. Sentences are short to medium. Nothing chained.
- [ ] **Profile copy is a warm hook plus concrete proof**, about 60 to 75 words, and every sentence answers the job description.
- [ ] **Register check:** it sounds like someone who creates, builds and teaches, speaking in the first person.
