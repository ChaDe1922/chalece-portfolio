---
name: log-update
description: Log a new career win (curriculum, music tech, or software) and carry it through the career source of truth, the portfolio data, the track resume, and a PR. Use when Chalece says "log an update", "add this to my portfolio", "I just shipped / published / presented / got…", or similar.
---

# Log an update

One chat message from Chalece becomes a checked, reviewable portfolio PR. Nothing is invented, nothing merges or deploys, and nothing is posted.

Full human-readable version: [docs/UPDATING.md](../../../docs/UPDATING.md).

## Paths

| What | Path |
|---|---|
| Portfolio repo | `/Users/chalecedelacoudray/Desktop/agents/software-agent-bundle/projects/chalece-portfolio` |
| Career source of truth | `/Users/chalecedelacoudray/Desktop/agents/house_manager_agent/personal-ops-agent/data/career/` |
| Wins log | `…/personal-ops-agent/data/career/wins-log.md` |
| Resume content bank | `src/data/resume-bank.ts` (every item cites its resume-master or experience-bank line) |
| Voice profile | `docs/brand/voice-profile.md` (source in Author OS) |
| Marketing OS project | `/Users/chalecedelacoudray/Desktop/agents/marketing-and-growth-os/projects/chalece-delacoudray/` |

## Steps

1. **Classify and confirm.** Decide the pillar (`curriculum`, `music-tech`, `software`) and any `alsoIn`. Restate the facts back: what, when (YYYY-MM), numbers, link. Ask only for what is missing. Never fill a gap with a guess; use `<!-- add metric -->` in career files and leave it off the site.
2. **Source of truth first.** Append a row to `wins-log.md`. If the win is substantial, add or extend a story in `experience-bank.md` (with its `Track:` line) and the matching bullet in `resume-master.md`. Follow personal-ops CLAUDE.md rules.
3. **Site data.** Edit only data files:
   - new or updated project: `src/data/work.ts` (`pillar`, `alsoIn`, `date`)
   - new headline number: that pillar's `stats` in `src/data/pillars.ts`
   - new lesson: `src/data/labs.ts`
   - set the touched pillar's `lastReviewed` to today
   Check copy against the voice profile: no em dashes, no parentheses, AI only vaguely, plain and conversational.
4. **Balance.** Run `npm run check:portfolio`. If a pillar leaves the 30 to 36% band, propose which item to feature or unfeature. Do not silently drop work.
5. **Resume.** If resume content changed, add or edit the item in `src/data/resume-bank.ts` with its source comment and a `minTier`. `npm run build` re-renders every mix to `/resume/<mix>`. Spot-check a few keys (for example `c3`, `s3`, `m3`, `c3-s3-m3`) with pdftotext and confirm each is 2 pages or less.
6. **Optional LinkedIn draft.** If Chalece wants one, draft it through Marketing OS `linkedin-adapter` into the project folder. Draft only; never post.
7. **Verify and PR.** Run `npm run check:portfolio`, `npx tsc --noEmit`, `npm run lint`, `npm run build`. Branch `content/<yyyy-mm-dd>-<slug>` off `main`, commit, push, open a PR, and report the Vercel preview URL.
8. **Stop.** Merging to `main` deploys to production. Merge only when Chalece says so.

## Hard rules

- Never name the retired venture, including links. `check:portfolio` scans for it.
- Never use the private Georgia Tech milestone.
- Never credit her musicianship to Georgia Tech.
- Canonical stats: 10 published Coursera courses, 48,000+ learners, 10+ years.
- Use her email only to identify her.
