# Writing pass, round 2

**Date:** 2026-09-30
**Scope:** the whole public site, minus lesson slide bodies and the /urgent-request/ scenario body. Section 5 covers the rebuilt timeline, `session-resume.tsx` and the new console fader line.
**Method:** an Author OS line edit for craft, plus a Marketing OS conversion and proof check. The lenses are showing and telling, unity, and rhetoric. The Marketing OS roles are conversion-copywriter, cta-optimization, brand-voice-guardian and proof-credibility.
**Status:** these are proposals only. No project file was edited, no gate was touched, and messaging_approval is still pending.

**Source keys**

| Key | File |
|---|---|
| RM | `house_manager_agent/personal-ops-agent/data/career/resume-master.md`, with the line number, including "Owner confirmations, 2026-09-30" at RM:175 to 181 |
| VP | `docs/brand/voice-profile.md` |
| KF | the Marketing OS known_facts ID |

Every file:line below was checked against the source at 16:50 on 2026-09-30. `src/` is being edited at the same time, so re-check the number before you apply a row.

Owner-chosen lines stay as they are. That covers the H2, the Solo/On/Off controls, the helper, the console empty state, the hero, both hero CTAs, HERO_BLURB, the /lab meta and close, "Download resume", the roles, E22 wording, "8 interactive lessons", "Every year since 2023" and teaching.ts:9. Nothing she declined is proposed again.

---

## 1. Top 5 changes

1. **Fix four accuracy slips.**
   - The lessons are the Fourier *transform*, not the series: W1, W17.
   - "Each one with live audio and quizzes" overclaims: W17.
   - Your Voice Is Power was not "published". She co-authored papers about it: W12, W19.
   - "Running studio administration" stretches the Administrator title: W15.
2. **Fix the two pillar summaries.**
   - Music reads out of order. It goes degrees, then research, then Amazon, then "I started in a recording studio". The rewrite is chronological: W9.
   - Software opens by repeating its own headline: W11.
3. **Turn fragments into first-person sentences.** This covers two of the three contact pitches, the Planet Bug, lab and YVIP work cards, and the workshops card: W5 to W7, W14, W16, W19.
   - W19 also adds a sourced proof point she confirmed today: participants on four continents.
4. **Give empty states one vocabulary.** The tracklist says "All channels are off" and tags filters "S". The console she chose says "Nothing is playing" and "Solo". Match them: W3, W4.
5. **Make shared links read cleanly.**
   - Trim every lesson meta description to 160 characters or less. They currently run 200 to 300 and get cut off in search and link previews: W25 to W27, W29 to W32.
   - Match the Part 2 share title to its subtitle: W28.
   - Bring the Vibe Coding title into line with the other lesson titles: W24.
   - Replace the default Next.js 404: W8.

**Row count: 51.** W34 to W51 are in section 5, Timeline.

---

## 2. Rewrites

### Home: console and blends

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W1 | `src/data/mix.ts:109` | Sound and Fourier series lab lessons | Sound and Fourier transform lab lessons | Accuracy. All three lessons are titled "The Fourier transform". | `src/data/fourier-lab.ts:12, 19, 26` |
| W2 | `src/data/mix.ts:133` | Each craft makes the others better. This is where all three meet. | Projects where I needed all three crafts at once. | Craft. "Makes the others better" is also in LINER_INTRO at mix.ts:144, so a visitor reads it twice. This card should name what is in it. Keep LINER_INTRO as it is. | none; framing only |

### Home: tracklist

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W3 | `src/components/night/tracklist.tsx:16` | filter tag `"S"` | filter tag `"SOLO"`, or keep `"S"` if the chip is too narrow | Conversion. A lone "S" means nothing on first read. "SOLO" matches the console buttons she chose. | none |
| W4 | `src/components/night/tracklist.tsx:156 to 162` | All channels are off. Bring one up on the console, or [go to full mix] | Nothing is playing. Solo a channel on the console, or [play the full mix] | Consistency. This matches the console empty state she chose, "Nothing is playing." / "Tap Solo…", so there is one metaphor and one vocabulary. | none |

### Home: contact pitches

These show under "WHAT ARE YOU HIRING FOR?"

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W5 | `src/data/mix.ts:167` | I design technical courses and hands-on learning: 10 published on Coursera, 48,000+ learners, plus live cohorts and workshops. Tell me about your learners. | I design technical courses and hands-on learning. My 10 Coursera courses have reached 48,000+ learners, and I've led live cohorts and workshops too. Tell me about your learners. | Craft. It turns a colon list into sentences joined by periods, per VP rule 5. "I've led" is accurate: the cohorts ran 2022 to 2023 and the workshops are ongoing. | RM:43, RM:113, RM:58 to 60 |
| W6 | `src/data/mix.ts:174` | Georgia Tech M.S., studio-trained, and audio quality across 1,200+ test scenarios for Amazon Music. Tell me what you want people to hear. | I have an M.S. in Music Technology from Georgia Tech, and I started out in a recording studio. At Amazon Music I led audio quality across 1,200+ test scenarios. Tell me what you want people to hear. | Craft: the current line is a fragment and is not first person. Proof: "studio-trained" rests on a 2012 to 2014 internship, while "started out in a recording studio" is her own LINER_INTRO wording. | RM:76, RM:148 to 154, RM:54 |
| W7 | `src/data/mix.ts:181` | Data systems, embedded hardware published at ACM CHI, and interactive lessons in TypeScript and React. Tell me what you are building. | I've built data systems for E22, programmed the controller for a game published at ACM CHI, and coded interactive lessons in TypeScript and React. Tell me what you are building. | Craft: the current line is a fragment. Proof: she programmed the microcontrollers and sensors, but "embedded hardware published" implies she built the hardware. | RM:166, RM:217, RM:77 |

### Home: 404

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W8 | new file `src/app/not-found.tsx`; none exists today | the Next.js default: "404: This page could not be found." | H1: **Nothing on this track.** Body: This page moved or never existed. Head back to the full mix, or try a lesson in the lab. Buttons: **Back to the full mix** linking to `/`, and **Go to the lab** linking to `/lab` | Conversion. A dead end becomes two ways forward, in the Night Session voice. **This needs a new file, which is outside this pass. Build it when the code is next touched.** | confirmed with curl on `:3102/nope-xyz` |

### Pillar pages

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W9 | `src/data/pillars.ts:77`, music summary | I've been a musician since I was 12, and I earned a B.A. … before my M.S. at Georgia Tech. My graduate research … At Amazon Music I led … I started in a recording studio at Tree Sound, and today I teach … | I've been a musician since I was 12. I earned a B.A. in Music Technology at Bethune-Cookman, then started out in a recording studio at Tree Sound. My graduate research at Georgia Tech looked at identity in 21st-century rap through lyricism and spoken rhythm. At Amazon Music I led audio quality and hardware compatibility for Amazon Amp and set up its audio hardware testing lab. Today I teach computer science through music in EarSketch workshops at Georgia Tech. | Craft, for unity of action. The career now runs in order, so the studio no longer comes after Amazon. It is 78 words. Her musicianship is credited to age 12, not to Georgia Tech. | RM:79 for the B.A. 2008 to 2012; RM:148 to 149 for Tree Sound, Nov 2012 onward; RM:76 and RM:186 for the M.S. 2018 to 2020; RM:53 to 55 and RM:119 for Amazon; RM:58 to 60 for the workshops, 2023 onward |
| W10 | `src/data/pillars.ts:92`, music seo.description | Music technologist with a Georgia Tech M.S. Led audio quality for Amazon Amp across 1,200+ test scenarios and teaches code through music. | Music technologist with a Georgia Tech M.S. who led audio quality for Amazon Amp across 1,200+ test scenarios and teaches code through music. | Craft. The second sentence has no subject. One sentence fixes it and keeps the same register as pillars.ts:132 and :179. | RM:76, RM:54, RM:58 to 60 |
| W11 | `src/data/pillars.ts:121`, software summary | I build software people use to learn and to work. At E22 … The lessons in my lab run right in your browser, and I've written 10 Coursera courses on the DevOps, CI/CD and Unix tools I work with. … | The people I build for are coaches, players and learners. At E22 Athletic Development I built our data systems in Athlete OS … *(sentences 2 and 3 unchanged)* The lessons in my lab run right in your browser. I've also written 10 Coursera courses on the DevOps, CI/CD and Unix tools I work with. My everyday stack is … *(unchanged)* | Craft. The opener repeats the H1 "I build software people use." The new opener tells readers who the users are. It also splits two unrelated ideas that were joined with "and". | RM:166, RM:217, RM:43 |
| W12 | `src/data/pillars.ts:162`, final sentence of the curriculum summary | I also design for live rooms: a two-year summer creative coding cohort, and Your Voice Is Power, a curriculum and global coding competition published at IEEE RESPECT and ASEE. | I also design for live rooms, like a two-year summer creative coding cohort and Your Voice Is Power, a curriculum and global coding competition I started. I co-authored papers on it for IEEE RESPECT and ASEE. | Accuracy. The competition was not published; papers about it were, and she co-authored them. "I started" is sourced and is stronger ownership proof. | RM:113, RM:207 to 210, RM:216, RM:85 |
| W13 | `src/components/work-grid.tsx:18` | Work where this is the main skill comes first, then work where it plays a supporting part. | Projects where this is my main craft come first, then ones where it plays a supporting part. | Craft. It removes the doubled "work" and uses the site's word, "craft". | none |

### Work cards

These show in the tracklist and on the pillar pages.

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W14 | `src/data/work.ts:39`, GT workshops | I lead annual EarSketch and music technology coding workshops and student panels for high school learners at Georgia Tech, returning each year since 2023. … | Every year since 2023 I've led EarSketch and music technology coding workshops and student panels at Georgia Tech. Learners write Python and JavaScript to make music and meet computer science through sound. | Craft: "annual" and "returning each year" say the same thing. Proof: "high school" is not in RM or the KF, so it is held until she confirms. It uses her chosen phrase "Every year since 2023". | RM:58 to 60, RM:123, KF fct_gt-earsketch-workshops_31c73c |
| W15 | `src/data/work.ts:57`, Tree Sound | From Nov 2012 to May 2016 I worked at this Norcross, Georgia recording studio, first as a junior audio engineer recording across multiple DAWs and then running studio administration. I worked with producers and artists to get the sound they were after. | From November 2012 to May 2016 I worked at this recording studio in Norcross, Georgia, first as a junior audio engineer and then as studio administrator. I worked across the recording process, from session prep and signal flow to tracking, playback and editing, and helped move each session toward the sound the artist or producer was after. | Proof: "running studio administration" overstates the Administrator role, and her 9/30 audio wording is the approved source. Craft: it spells out "November" and adds concrete studio verbs. | RM:148 to 154, including her 9/30 verbatim at RM:154; KF fct_tree-sound-studios_ee607a |
| W16 | `src/data/work.ts:79`, Planet Bug | An educational game about insect conservation, played with a custom controller that works like a camera. I programmed … | I co-created Planet Bug, an educational game about insect conservation played with a custom controller that works like a camera. I programmed the embedded microcontrollers and movement sensors, and the game itself was built in Phaser. | Craft: the current opener is a fragment. Proof: "co-created" is her own verb in RM, and it credits her collaborators. | RM:77, RM:217 |
| W17 | `src/data/work.ts:91`, lab lessons | Eight lessons that run right in your browser, from recursion and Git to sound and the Fourier series. I designed and coded each one with animations, live audio and quizzes. | I designed and coded eight lessons that run right in your browser, from recursion and Git to sound and the Fourier transform. Each one is hands-on and animated, and the music lessons play real audio. | Accuracy. The Recursion, Git and Vibe Coding lessons have no live audio. Vibe Coding ends in flashcards and a reflection, not a quiz. The lessons are about the transform, not the series. The current opener is also a fragment. | `src/app/lab/` routes; `src/components/lab/` checks per lesson; `src/data/fourier-lab.ts:12` |
| W18 | `src/data/work.ts:99`, meta | 48k learners | 48,000+ learners | Consistency. Everywhere else the site says "48,000+". | RM:43 |
| W19 | `src/data/work.ts:117`, Your Voice Is Power | A curriculum and global coding competition I started and led with … where learners remix Pharrell's music in code. It was published in the IEEE RESPECT 2021 and ASEE 2023 proceedings. | I started Your Voice Is Power, a curriculum and global coding competition, and led it with Georgia Tech's EarSketch team, Amazon Future Engineer and Pharrell Williams' YELLOW. Learners remix Pharrell's music in code, and it reached participants on four continents. I co-authored papers on it in the IEEE RESPECT 2021 and ASEE 2023 proceedings. | Accuracy: she co-authored the papers; the program was not "published". Craft: the opener is no longer a fragment. Conversion: it adds a reach number she confirmed today. | RM:216, RM:207 to 210, RM:85, RM:181 in the owner confirmations |

### /lab: carousel and teaching block

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W20 | `src/data/labs.ts:85`, Part 1 card | How sound becomes a spectrum. Hear why a flute and a violin … and find bass, mids, and treble. | See how sound becomes a spectrum. Hear why a flute and a violin playing the same note sound different, read a sound as a waveform and a spectrum, build a tone from pure sines and find bass, mids and treble. | Craft. The opener becomes an imperative sentence like the other cards, "Step into…" and "Pick what…". It also drops the serial comma; see Consistency. | `src/data/fourier-lab.ts:13` |
| W21 | `src/data/labs.ts:95`, Part 2 card | How a computer calculates that spectrum. See where samples come from … | Learn how a computer calculates that spectrum. See where samples come from, build a test wave, multiply and add sample by sample, read the DFT formula and calculate one frequency by hand. | Craft: the opener is a fragment. | `src/data/fourier-lab.ts:20` |
| W22 | `src/data/labs.ts:105`, Part 3 card | Use it on your gear. Shape sound with EQ … | Put it to use on your gear. Shape sound with EQ, read a headphone curve, see a spectrogram, meet noise cancelling and song recognition, then solve sound mysteries to prove you can read a sound. | Craft. Out of context, "Use it" has no referent. "Put it to use" works as a lead-in. | `src/data/fourier-lab.ts:27` |
| W23 | `src/data/teaching.ts:25` | … Every lesson states its objectives up front and ends in a real, graded check. | … Every lesson states its objectives up front and ends with a way to check what you learned. | Proof. The Recursion and Git quizzes, the Sound check and the Fourier checkpoints are graded. Vibe Coding ends in flashcards and a reflection, and The Urgent Request was not verified. "Graded" is not true of every lesson. | `src/data/recursion-lab.ts:280`, `src/data/git-lab.ts:275`, `src/components/lab/sound/check.tsx`, `src/components/lab/fourier/checkpoint.tsx`, `src/components/lab/vibe-coding/` |

### Lesson meta

These are the title, description and share title for each lesson page. Titles already get " | Chalece DeLaCoudray" from `lessonTitle()`, so the descriptions can drop her name and spend the characters on the hook. Each proposed description is 160 characters or less.

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W24 | `src/data/vibe-coding-lab.ts:12` and `:15` | title: Vibe Coding: Build by Describing · ogTitle: Vibe Coding: Build by Describing. An interactive lesson by Chalece DeLaCoudray. | title: Vibe coding, build by describing. · ogTitle: Vibe coding, build by describing. An interactive lesson by Chalece DeLaCoudray. | Consistency. It matches "Recursion, watch it run." and "Git internals, made visible.": sentence case, a comma and a period. The title also feeds the carousel H2. | `src/data/recursion-lab.ts:8`, `src/data/git-lab.ts:15` |
| W25 | `src/data/vibe-coding-lab.ts:14` | An interactive first lesson in vibe coding by Chalece DeLaCoudray. Pick what to build, then direct, test, and improve … (about 175 characters) | A first lesson in vibe coding. Pick what to build, then direct, test and improve a real working example, and try it with an AI yourself. (136 characters) | Conversion. It fits in a search snippet. | none |
| W26 | `src/data/fourier-lab.ts:15` | Part 1 of an interactive music-tech lesson by Chalece DeLaCoudray. Hear why two instruments … (about 290 characters) | Hear why two instruments playing one note sound different. See sound as a waveform and a spectrum, then build a tone from pure sines. Part 1 of 3, with audio. (157 characters) | Conversion. The current description is cut off at around 160 characters, so the hook never shows. The hook now leads. | none |
| W27 | `src/data/fourier-lab.ts:22` | Part 2 of an interactive music-tech lesson by Chalece DeLaCoudray. See where digital samples … (about 280 characters) | See where digital samples come from, multiply and add sample by sample, read the DFT formula piece by piece and calculate one frequency by hand. Part 2 of 3. (158 characters) | Same reason as W26. | none |
| W28 | `src/data/fourier-lab.ts:23` | The Fourier transform, Part 2: how a computer finds the recipe. | The Fourier transform, Part 2: how a computer calculates that spectrum. | Consistency. The share title should match the lesson subtitle, the carousel and W21. "The recipe" has not been introduced when someone sees the link cold. | `src/data/fourier-lab.ts:20` |
| W29 | `src/data/fourier-lab.ts:29` | Part 3 of an interactive music-tech lesson by Chalece DeLaCoudray. Use frequency recipes in the real world … (about 300 characters) | Shape sound with EQ, read a headphone curve, see a spectrogram and meet noise cancelling. Then solve sound mysteries to prove you can read a sound. Part 3 of 3. (160 characters) | Same reason as W26. | none |
| W30 | `src/data/git-lab.ts:17` | An interactive Git lesson by Chalece DeLaCoudray. Take snapshots … Beginner friendly, technically honest. (about 250 characters) | Take snapshots and travel back in time, then see what Git does underneath: snapshots, pointers, the commit graph and merge versus rebase. No terminal needed. | Conversion. "No terminal needed" is the strongest beginner hook, and it is already on the card at labs.ts:65. It also drops "really". | `src/data/labs.ts:65` |
| W31 | `src/data/recursion-lab.ts:10` | An interactive recursion lesson by Chalece DeLaCoudray. Step into a mirror … then check what you learned. (about 200 characters) | Step into a mirror, open nested dolls, write your first recursive function, watch the call stack, grow a fractal tree, then check what you learned. (147 characters) | Same reason as W26. | `src/data/recursion-lab.ts:280` has the quiz |
| W32 | `src/data/sound-lab.ts:9` | An interactive music-tech lesson by Chalece DeLaCoudray. See what a sound is, shape its pitch, loudness, waveshape, and envelope … (about 210 characters) | See what a sound is, shape its pitch, loudness, waveshape and envelope, then build a synth and play a short tune. Beginner friendly, with audio in your browser. (160 characters) | Same reason as W26. | none |

### Site-wide meta, share images and JSON-LD

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W33 | `src/data/site.ts:19`, used only as the home share-image eyebrow in `src/app/opengraph-image.tsx:11` | Atlanta, Remote | Atlanta · open to remote roles | Conversion. "Remote" alone is ambiguous: it could mean she lives remotely. This matches LINER_NOTES "BASED IN" and the contact eyebrow. | KF fct_location-remote_e586a3; `src/data/mix.ts:152` |

JSON-LD at `src/app/layout.tsx:76 to 89` needs no change. jobTitle is `site.role`, and alumniOf lists Bethune-Cookman and Georgia Tech, both matching RM:76 and RM:79. The home and /lab share-image text reads cleanly.

---

## 3. Consistency notes

- **Craft names vary.** The site uses all of these:
  - Learning Design / Learning design / Curriculum and Learning Design / learning experience design / Learning Designer
  - Music Technology / Music Tech / Music tech / music technology

  Each is defensible where it appears: nav, chips, H1s, roles. Proposed rule: channel and nav labels use Title Case, chips and inline copy use sentence case, and "learning experience design" is used only when naming a job title. MESSAGING §6 already sets the SEO order as Learning Design, Music Tech, Software.
- **Serial commas.** Body copy mostly omits them, as in "Python, JavaScript, TypeScript, React, SQL and PostgreSQL". They appear in:
  - `labs.ts:45, 75, 85`
  - the lesson descriptions
  - `about.ts:13`

  The umbrella "I create, I build, and I teach." uses one and is owner-chosen, so treat it as the one exception. The rows above follow the no-serial-comma rule.
- **Apostrophes.** `mix.ts` mixes curly apostrophes, at :144 and :186, with straight ones elsewhere, as in `site.ts:47` and `pillars.ts`. Pick one. Straight is the simpler default in TS source.
- **Blend project titles mix case.** Some are Title Case: "Music Tech Workshops at Georgia Tech" (mix.ts:119), "Coursera Course Catalog at Codio" (:126), "Interactive Lab Lessons" (:127). Others are sentence case: "EarSketch coding workshops" (:110), "Sound and Fourier series lab lessons" (:109). Sentence case matches the work cards.
- **"Full mix" wording.** The console button says "Full mix", while the tracklist link says "go to full mix". W4 aligns them.
- **Share titles for lessons follow two patterns.**
  - Fourier: "Part N: subtitle."
  - The others: "Title. An interactive lesson by Chalece DeLaCoudray."

  Both work. The Sound lesson alone says "music-tech lesson". This note is informational, not a row.
- **Pillar share-image alt** (`[pillar]/opengraph-image.tsx:6`) is the same "one craft of three" for all three pillars. It is a static export, so per-pillar alt text would need a code change. Low priority.
- **`src/data/about.ts` is dead copy.** Nothing imports it. It is not public, but it is a place where old claims survive.
- **The pillar CTA mailto** (`pillar-cta.tsx:41`) has no subject line. She declined per-pillar subjects, so this is a note only.
- **Author OS.** `library/editing/` is empty, holding only `.gitkeep`, so this pass used the craft and rhetoric lenses. The BLENDS line "Code that makes sound, and sound that teaches code." at mix.ts:107 is a clean chiasmus. Keep it.

---

## 4. Proof gaps

These are logged, not fixed. Nothing was invented to fill them.

| Gap | Where it shows | What would close it |
|---|---|---|
| No usage or outcome number for E22 Athlete OS | software pillar, E22 card | the metric listed under `mis_e22-usage-metric_af8411`, such as games tracked, players, or dashboard use |
| The "5 years" stat on the software page counts course writing, which is curriculum evidence | `pillars.ts:125` | a software-only number: lessons built, a repo, E22 scale. Or accept it as cross-craft proof |
| "High school learners" for the GT workshops is not in RM or KF | `work.ts:39`, which W14 drops; MESSAGING 4.1 | her confirmation of the audience. RM:113 confirms high school juniors only for the Codio summer cohort |
| "Graded check" and "quizzes" on every lesson | `teaching.ts:25`, `work.ts:91` | confirm whether Vibe Coding and The Urgent Request end in a scored check. W17 and W23 soften the wording in the meantime |
| "Studio-trained" rests on the 2012 to 2014 junior engineer internship | `mix.ts:174` | W6 uses "started out in a recording studio" instead |
| No counts for the workshops or cohorts: sessions run, learners taught | workshops card, curriculum pillar | numbers from her records. There is a sourced option not used on the site: Black Girls CODE volunteer workshops, 30+ students (RM:219). It is her call whether to use it |
| The site description gives "software developer" no proof beside it | `site.ts:37` | adding "builder of eight interactive lessons" pushes it to 171 characters, so it was not proposed. Revisit if the description gets restructured |
| The GitHub profile audit is still open | footer and software pillar link | finish the audit before the software pillar leans on the repo |

---

## 5. Timeline

This covers `src/data/timeline.ts`, the new UI strings in `src/components/night/session-resume.tsx`, the fader sentence in `mix-console.tsx:204`, and `night-contact.tsx:27`. Lines were re-checked at 17:40 on 2026-09-30. The E22 date note from the earlier placeholder is dropped: the clip now starts at 2024-01, which matches RM:177.

**Style call.** Almost every clip point is a subjectless resume bullet that opens with a past-tense verb, like "Designed and built…" or "Co-founded…". The rows below fix fragments by giving them that same verb opening, rather than switching single lines to "I". The one "I" line, YVIP at :229, is folded into the verb style by W41.

### Clips: education and music-tech lanes

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W34 | `src/data/timeline.ts:61`, gt-ms | Researched cultural and regional identity in 21st-century rap, through lyricism and spoken rhythm. | Researched cultural and regional identity in 21st-century rap through lyricism and spoken rhythm. | Craft. The comma splits the verb from how the research was done. It also matches W9 on the music pillar. | RM:186 |
| W35 | `src/data/timeline.ts:63`, gt-ms | Co-created Planet Bug, published at ACM CHI 2020. | Co-created Planet Bug, presented at ACM CHI 2020. | Optional. RM:77 uses both verbs, but "presented" is the one it attaches to the game, and the paper itself gets its own clip in the Published lane. This keeps "published" for papers only across the timeline. | RM:77, RM:212 |

No change: bcu :46 to 48, gt-ms :62 and :64, tree-sound :79 to 81, amazon :94 to 96 and gt-workshops :109 to 111. All trace to RM:79, RM:188, RM:186 to 187, RM:148 to 154, RM:53 to 55, RM:119, RM:124 and RM:61. The gt-workshops points use present tense, which is correct because the work is ongoing.

### Clips: software lane

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W36 | `src/data/timeline.ts:125`, planet-bug | An educational game about declining insect populations, played on a custom controller built to look like a camera. | Co-created an educational game about declining insect populations, played on a custom controller built to look like a camera. | Craft: the line is a fragment with no verb. Proof: "co-created" is her RM verb and credits her collaborators, as in W16. | RM:77, RM:212, RM:217 |
| W37 | `src/data/timeline.ts:127`, planet-bug | Published at ACM CHI 2020. | Co-authored the paper on it, published at ACM CHI 2020. | Accuracy. As a bullet, "Published" reads as if she published the game. What was published is a paper she co-authored. The link below it already says "Read the paper". | RM:85, RM:212 |
| W38 | `src/data/timeline.ts:143`, full-stack | Tested end to end, with automated accessibility checks. | Tested it end to end, including automated accessibility checks. | Optional craft. "Tested" has no object, and the comma plus "with" reads as a second thought. | `personal-ops-agent/outputs/career/resumes/tracks/software-resume.html` for Vitest, Playwright and axe-core; RM:179 |
| W39 | `src/data/timeline.ts:183`, lab | Eight interactive lessons I designed and coded, from recursion and Git to building a synth. | Designed and coded eight interactive lessons, from recursion and Git to building a synth. | Craft: the line is a noun-phrase fragment. The verb opening matches the rest of the lane. "Eight" stays, per her chosen "8 interactive lessons". | `src/app/lab/` routes |
| W40 | `src/data/timeline.ts:184`, lab | Written in TypeScript and React, and they run right in your browser. | Seven are built in TypeScript and React, and all eight run right in your browser. | Accuracy. The Urgent Request is plain HTML, CSS and JavaScript, not TypeScript and React. Craft: "Written…, and they run" is a dangling construction with no subject for "Written". | `public/urgent-request/` holds `index.html`, `script.js` and `styles.css` |

No change: full-stack :141 to 142, e22 :156 to 157 and atlanta-truth :170 to 171. Full-stack stays unnamed; it traces to the sanctioned unnamed version in the software track resume and to the RM:179 confirmation, while RM:160 retires the named version. E22 traces to RM:166 to 169 and RM:177. Atlanta Truth traces to RM:218, where "current" supports "in use this season". The link labels "Read the paper" and "Try a lesson" read well.

### Clips: curriculum and published lanes

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W41 | `src/data/timeline.ts:228 to 229`, yvip | A project-based curriculum and global coding competition where learners remix Pharrell Williams' music in EarSketch, using Python or JavaScript. / I started it and led it from concept through curriculum and build. | Started a project-based curriculum and global coding competition where learners remix Pharrell Williams' music in EarSketch, using Python or JavaScript. / Led it from concept through curriculum and build. | Craft. The first line is a fragment. Moving "started" into it fixes that and turns :229 into a clean second bullet, so "I started it" is no longer said twice. | RM:216 |
| W42 | `src/data/timeline.ts:231`, yvip | Published at IEEE RESPECT 2021, with a follow-up study at ASEE 2023. | Co-authored papers on it for IEEE RESPECT 2021 and ASEE 2023. | Accuracy. The curriculum and competition were not published. Papers about them were, and she co-authored both. This matches W12 and W19. | RM:85, RM:207 to 210, RM:216 |
| W43 | `src/data/timeline.ts:246`, codio | Content lead for a 10-week CI/CD program with a new release every week, and met every deadline. | Served as content lead for a 10-week CI/CD program with a new release every week, and met every publishing deadline. | Craft. "Content lead… and met" joins a noun phrase to a verb. "Served as" gives both halves a verb. "Publishing deadline" is RM's exact term. | RM:47 |
| W44 | `src/data/timeline.ts:273`, chi | Co-author. The paper behind Planet Bug, the educational game and its custom controller. | Co-authored the paper behind Planet Bug, the educational game and its custom controller. | Craft. Two fragments become one sentence in the lane's verb style. | RM:85, RM:212 |
| W45 | `src/data/timeline.ts:284`, respect | Co-author with R. Moore and S. Newton. A peer-reviewed paper on the Your Voice Is Power curriculum. | Co-authored this peer-reviewed paper on the Your Voice Is Power curriculum with R. Moore and S. Newton. | Same reason as W44. The author list matches the citation. | RM:207, RM:85 |
| W46 | `src/data/timeline.ts:295`, asee | Co-author. A study of student and teacher experiences with the Your Voice Is Power curriculum. | Co-authored this study of student and teacher experiences with the Your Voice Is Power curriculum. | Same reason as W44. "Study" stays because it matches the paper title. | RM:210, RM:85 |

No change: reach :200 to 201, ceismc :214 to 216, yvip :230 for four continents, codio :245 and :247, and summer :259 to 260. These trace to RM:143 to 146, RM:63 to 66, RM:127 to 129, RM:181, RM:43, RM:96, RM:113 and RM:50.

### Resume timeline UI: `session-resume.tsx`

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W47 | `session-resume.tsx:381`, helper shown while blend PDFs are not live | Every track exports as its own resume, formatted for applicant tracking systems. Select any clip to read what I did there. | Every craft track has its own resume to download, formatted for applicant tracking systems. Select any clip to read what I did there. | Accuracy. Education and Published are tracks too, and they have no download. "Craft track" is true and points at the Download resume buttons. The second sentence is good as is. | `session-resume.tsx:140 to 155`; ExportLink renders on craft lanes only |
| W48 | `session-resume.tsx:461 to 466`, hints | desktop `hidden md:block` "← → move through time · ↑ ↓ change tracks"; phone `sm:hidden` "scroll the timeline →"; both `aria-hidden` | Keep both strings. **Code note:** change the phone hint to `md:hidden` so the 640 to 767px range shows a hint; today it shows neither. Add sr-only text tied to the region with `aria-describedby`: "Use the left and right arrow keys to move through time, and the up and down arrow keys to change tracks." | Conversion and access. Clips use a roving tabindex with arrow keys at :220 to 224 and :335 to 338, but both hints are hidden from screen readers, so keyboard users on a screen reader never learn the keys exist. | `session-resume.tsx:220, 224, 335 to 338` |
| W49 | `session-resume.tsx:151 to 153`, ExportLink | phone text "Resume" plus sr-only ": {name}, PDF", so a screen reader hears "Resume: Music Technology, PDF" | Keep the visible text. **Code note:** add an sr-only "Download " before the phone label, so the accessible name reads "Download Resume: Music Technology, PDF" at every size. | Optional, touches an owner-chosen line, "Download resume". The visible wording does not change. Without a verb, a link list reads like a heading. | none |

No change: the lane names "Education" and "Published", which matches LINER_NOTES "PUBLISHED". The transport labels "Previous clip", "Play the session", "Pause" and "Next clip" are also fine. The readout "03 / 18" with sr-only "Clip 3 of 18" is clear, and "Play the session" keeps the Night Session voice without costing clarity.

### Console and contact

| # | Location | Current | Proposed | Why | Source |
|---|---|---|---|---|---|
| W50 | `mix-console.tsx:204`, third sentence of the helper | Pull a fader all the way down to switch it off. | Keep it, or tighten to: Pull a fader to the bottom to switch it off. | Optional, touches an owner-chosen line. The first two sentences are hers, and this third one still needs her approval. It is accurate: the fader's bottom position is off. | `mix-console.tsx:17`, "Bottom is off" |
| W51 | `night-contact.tsx:27`, contact card with no mix on | Pick a role to see the right one, or download any track above. | Pick a role to see the right one, or download a craft resume above. | Optional. The line still works: the resume timeline sits directly above contact, and each craft lane has its own Download resume button. "Any track" slightly overclaims for the same reason as W47. | `src/app/(site)/page.tsx` section order; `session-resume.tsx:140 to 155` |

### Timeline proof gaps

| Gap | Where it shows | What would close it |
|---|---|---|
| The YVIP clip dates, 2021-01 to 2021-12, are not in RM. RM only dates the RESPECT paper to 2021. | `timeline.ts:222 to 223` | her dates for the program run |
| The lab clip start, 2026-01, is not in RM | `timeline.ts:177` | her confirmation, or the first lesson's commit date |
| Atlanta Truth also starts 2026-01, and RM:218 says only "current" | `timeline.ts:163` | her confirmation of the season start |
