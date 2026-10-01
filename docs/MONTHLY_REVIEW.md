# Monthly portfolio review

**Audience:** Chalece, run with Claude in chat.
**When:** first Monday of each month, about 30 minutes.
**Last updated:** 2026-09-30

Start a Claude Code session in this repo and say: **"run the monthly portfolio review."**

---

## Checklist

### 1. What happened this month
- [ ] Read `wins-log.md` in personal-ops for rows since the last review.
- [ ] Any row with "On site = n" that should be on the site? Log it now (see [UPDATING.md](UPDATING.md)).
- [ ] Anything that happened but never got logged? Log it now.

### 2. Per pillar

Repeat for **Curriculum**, **Music Technology**, and **Software**:

- [ ] Are the headline stats still true? Check them against `resume-master.md`.
- [ ] Are the featured cards the strongest current proof? Swap out anything weaker than a newer win.
- [ ] Is the resume content bank current? Compare `src/data/resume-bank.ts` against personal-ops `resume-master.md`.
- [ ] Set `lastReviewed` to today in `src/data/pillars.ts`.

### 3. Balance
- [ ] `npm run check:portfolio` passes. If not, fix it by adding proof to the thin pillar, not by hiding real work.

### 4. Music proof backlog
- [ ] Review [product/music-proof-backlog.md](product/music-proof-backlog.md). Move one item forward, or say why not this month.

### 5. Positioning drift
- [ ] Run Marketing OS `/marketing-monthly` on project `chalece-delacoudray`. Does the umbrella line still fit what you're applying for?
- [ ] Is anything worth a LinkedIn draft? Drafts only.

### 6. Ship
- [ ] One PR for all review changes. Check the preview. Merge only when you say so.

---

## Review log

| Date | Pillars touched | Notes |
|---|---|---|
| | | |
