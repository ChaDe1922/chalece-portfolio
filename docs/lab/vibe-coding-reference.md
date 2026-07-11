# Vibe Coding Lesson — Reference & Talking Points

*A plain-English crib sheet for explaining how the `/lab/vibe-coding` lesson works and what was used to build it. Last updated: 2026-06-25.*

---

## In one sentence

It's a short, hands-on web lesson that teaches "vibe coding" — the idea that you can build real software by **describing what you want in plain language, letting an AI write the first version, then testing it and asking for changes**. The point isn't typing code; it's clear thinking, good description, and knowing what to fix next.

It lives at **`/lab/vibe-coding`** in my portfolio site, takes about 5 minutes, needs no setup, and is aimed at roughly ages 13–15.

---

## What a learner actually experiences (the 5 steps)

1. **The reframe.** "You don't need to know how to code. You need to know what you want." Then they make their *first design decision*: they pick what they'd build — **a game, a music tool, or a school tool**. That single choice quietly personalizes the rest of the lesson.
2. **The loop.** They learn vibe coding as a repeatable cycle: **Say it → Test it → Adjust it** — and that it's a loop you go around again, not a straight line.
3. **A real, working mini-app.** Based on their pick, they get something they can actually play with right there on the page — a **beat maker** that makes real sound, a **clicker game** with a timer and score, or a **flashcards** app they can flip and add to. They poke at it and answer a tiny "what changed when you did that?" check.
4. **Remix it.** They're shown real prompts (e.g. "add a cowbell on beats 6 and 8") and asked to pick the change that interests them and sharpen it. That instinct — taste — is framed as a real skill.
5. **Reflection + wrap-up.** They recap the three things they just did that real developers do, then drag three steps back into the right order (a quick self-check), and finish with contact links.

Running alongside steps 2–4 is a **"Try it for real" panel** that lets them build a prompt and send it straight to **ChatGPT or Claude** to make something themselves.

---

## What was used (in plain terms)

- **Next.js + React + TypeScript** — the framework the whole portfolio runs on; the lesson is just a page in it.
- **Tailwind CSS** — all the styling.
- **Motion** (the popular Framer-Motion library) — the smooth slide transitions and small animations, with a genuine reduced-motion version for anyone who prefers less movement.
- **The browser's built-in Web Audio API** — this is what makes the beat maker actually produce sound. The kick, snare, and hi-hat are *synthesized in the browser*; there are no audio files to download.
- **Lucide** — the icons.
- **Vercel** — where the site is deployed.

Two things worth saying out loud because people assume otherwise:
- **There's no backend and no database.** Nothing the learner does is sent to a server or saved to an account.
- **There's no AI API or API key behind the lesson.** The "Try it for real" step opens the learner's *own* ChatGPT or Claude tab — it pre-fills the prompt in the URL and also copies it to the clipboard as a backup. The lesson never calls an AI itself.
- And no, this lesson doesn't use 3D / Three.js — that's a different lab lesson (recursion). This one is deliberately lightweight.

---

## How it all connects

- All the lesson's words — every heading, example sentence, prompt, and the three personalized "builds" — live in **one data file**. The visible components just read from it, so the content is easy to change in one place.
- The lesson runs on a **reusable "SlideDeck" engine** I built once and share across all my lab lessons (recursion, git, sound, fourier, this one). It handles the full-screen slides, the Next/Prev buttons, keyboard arrows, swipe on mobile, the progress bar, restart, deep-linking to a specific slide, and accessibility.
- A small **shared memory (React context)** remembers which build the learner picked on step 1, so every later slide — and the AI panel — stays personalized to "their" idea.
- The **mini-apps are real components I wrote**, not embedded iframes or screenshots. The beat maker is a genuine 8-step looping sequencer.
- The **"Try it for real" panel** is the bridge to actually doing it: it builds a prompt and hands off to a real AI tool in a new tab, with a safety note reminding learners not to share personal info.

So the shape is: **one content file → reusable slide components → run by a shared deck engine → personalized by a shared context → with a side panel that launches real AI tools.**

---

## Why it's built this way

- **Learn by making, not watching.** Within a minute the learner is touching something real that works — that's the whole pedagogy (it's adapted from a research-backed prototype and brief on using music/creation as an on-ramp to computer science).
- **Personalization buys attention.** Letting them choose game/music/school first means the entire lesson speaks to something they already care about.
- **Success first.** The beat maker loads already sounding decent and "nothing breaks," so the first interaction is a win, not a wall.
- **AI as a tool you direct, not a vending machine.** The closing line is the thesis: "You are not just asking AI for answers. You are learning how to direct ideas."

---

## Quick answers (likely questions)

**Is the AI real?**
Yes — but it's the learner's own ChatGPT or Claude. The lesson opens it in a new tab with the prompt pre-filled. There's no AI running inside the lesson and no API key.

**Does it save any data?**
No. No backend, no database, no accounts. Nothing leaves the browser.

**Is the music real, or just a recording?**
Real. The sounds are generated live in the browser with the Web Audio API — synthesized drums, not audio files.

**Did you build the mini-apps or embed them from somewhere?**
I built them from scratch as React components — the beat maker, the clicker game, and the flashcards.

**Is any of this reusable?**
Yes. The slide engine, the quiz/self-check patterns, and the data-driven structure are shared across all my lab lessons. A new lesson is basically a new content file plus a few components.

**How long did it take a learner / how long is it?**
About 5 minutes, 5 steps, no setup required.
