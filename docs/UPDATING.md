# Keeping the portfolio current

**Audience:** Chalece, and any Claude session working on this repo.
**Last updated:** 2026-09-30

The site tells three equal stories: curriculum and learning design, music technology, and software development. It stays current in two ways: log wins as they happen, and do a review once a month.

---

## 1. Log a win as it happens

In Claude Code chat, from this repo, say something like:

> log an update: [what happened], [month], [link if there is one]

Claude follows the `log-update` skill (`.claude/skills/log-update/SKILL.md`):

1. Confirms which pillar it belongs to and the facts. It asks rather than guesses.
2. Writes it to the career source of truth in personal-ops (`wins-log.md`, plus `experience-bank.md` and `resume-master.md` if it is a big one).
3. Updates the site data files (see the table below).
4. Checks balance and copy with `npm run check:portfolio`.
5. Updates the resume content bank if the resume changed. The build regenerates every resume mix.
6. Drafts a LinkedIn post if you ask. It is only a draft.
7. Opens a PR with a preview link. **Nothing goes live until you say "merge it."**

## Where content lives

| Content | File |
|---|---|
| The three pillars: names, one-liners, headline stats, SEO, `lastReviewed` | `src/data/pillars.ts` |
| Featured work cards | `src/data/work.ts` |
| Interactive lessons on /lab | `src/data/labs.ts` |
| Name, role, links, nav | `src/data/site.ts` |
| About section copy and skills | `src/data/about.ts` |
| Resumes (PDF, every mix) | `src/data/resume-bank.ts`, rendered by `src/lib/resume-pdf.ts` at build to `/resume/<mix>` |
| Voice rules for all copy | `docs/brand/voice-profile.md` |

Copy lives in data files, not in components. If you change a data file by hand, run `npm run check:portfolio` before you commit.

## The balance rule

Each pillar should be 30 to 36% of featured work, with at least 2 items. `check:portfolio` fails outside that band. When one pillar grows, feature something new in another pillar or retire an older card from the one that grew. Music is currently the thinnest pillar. New music proof comes from [product/music-proof-backlog.md](product/music-proof-backlog.md).

## What the check catches

- a pillar outside the 30 to 36% band, or under 2 items
- a pillar not reviewed in 45 days (a warning)
- em dashes in copy
- any mention of the retired venture
- stale figures (the old 7 courses / 30,630 learners)

## 2. Monthly review

On the first Monday of each month, follow [MONTHLY_REVIEW.md](MONTHLY_REVIEW.md).
