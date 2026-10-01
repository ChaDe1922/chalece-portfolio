# Site map

**Last updated:** 2026-09-30
**Audience:** anyone changing pages or navigation on the portfolio.

```
/                      Night Session homepage
├── #top               Hero: create / build / teach, EQ meter, Play the work, Try a lesson
├── #what              Mix console: solo or mute each craft, monitor shows stats and projects
├── #work              Tracklist: 9 featured items, filter by craft, expand for detail and link
├── #about             Liner notes: headshot on a record sleeve, facts, signal chain
├── #resume            Session timeline: one lane per craft, each exports its resume PDF
└── #contact           Role picker, pitch, email with subject, LinkedIn, GitHub, resume card

/music-tech            Craft page (same template for all three):
/software                intro, proof stats, featured work, related lab lessons, roles and resume
/curriculum

/lab                   Interactive lessons index (own layout, outside the Night chrome)
├── /lab/recursion
├── /lab/git
├── /lab/vibe-coding
├── /lab/sound
├── /lab/spectrum
├── /lab/fourier
└── /lab/audio-tools
/urgent-request/       Static security-awareness scenario

/resume/<mix>          Resume PDF for any mix, built at deploy (105 keys, e.g. c3, s3-m2)
/sitemap.xml, /robots.txt, /opengraph-image
```

## Navigation
- **Top nav** (Night chrome): section tabs what-i-do, work, about, resume, contact. On craft pages the tabs link back to `/#section`. Mobile menu adds the three craft pages and Lab.
- **Footer:** the three craft pages, Lab, LinkedIn, GitHub.
- **Shared state:** soloing a craft anywhere on the homepage retunes every section. A craft page is that craft soloed. `/?pillar=<id>` opens the homepage soloed.
