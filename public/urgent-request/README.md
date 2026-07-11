# The Urgent Request, interactive security-awareness demo

A short, scenario-based, branching security-awareness module (Business Email Compromise / executive
impersonation), built as a Storyline/Rise-class experience in **vanilla HTML/CSS/JS** with no framework,
no build step, and no dependencies. This is the source-of-truth build, living next to its design specs.
Chalece owns and edits it directly.

The full design contract is the spec set in this folder (`source_spec.md`, `instructional_handoff.md`,
`interactive_build_spec.md`, `screen_state_map.md`, `branching_logic.md`, `accessibility_requirements.md`,
`qa_test_plan.md`, `developer_handoff.md`, and `bridge_handoff/`).

> **Copy style:** no em dashes anywhere in the experience (they read as an AI tell). Use commas, colons, or
> short rewrites instead. This file follows the same rule.

## Files

| File | What it holds |
|---|---|
| `index.html` | All eight screens and every learner-facing string. |
| `styles.css` | Brand tokens (light + dark), the work-laptop scene + email styling, the learn tabs, the red-flag sort bins, the two-column decision cards (gradient image blend), the report composer, the click-word bloom, hotspots (with pulsing pins), the address breakdown, the top bar + stepper, badge, confetti, and the motion rules. |
| `script.js` | The eight-screen state machine plus reusable interaction modules (learn tabs, the red-flag drag-to-categorize sort + grading, the report composer, address breakdown, hotspots, click-word bloom, the synthesized notification sound, countdown, confetti), page navigation, branching, the completion event, and restart. |
| `assets/blankLaptop.png` | The blank-screen laptop photo used as the scenario backdrop (see Image asset below). |
| `assets/assessment-images/` | The four decision-branch character photos (see Image asset below). The bundled `ChatGPT Image ... .png` is the styling reference only and is not used by the page. |
| `README.md` | This file. |

## The experience (teach, apply, reinforce)

A Tell, Show, Do arc so learners are never asked to act on something that was not taught first:

1. **Title** hook, an **animated "urgent ping" icon** (a brief intro burst on arrival, then it rests; ripples
   speed up as the cursor nears, and it pops on click), and a short **learning-objectives** list ("By the end,
   you will be able to:
   spot the red flags / verify through a trusted channel / report to protect your team").
2. **Learn (teach):** an instruction subtitle ("Explore all three tabs below...") sits above **stylized tabs**
   for three sections (How the scam works, Red flags to spot, The safe move), all three labels always visible.
   Unread tabs show a pulsing dot; a read tab shows a check; a live "X of 3 read" counter tracks progress, and
   **"See the message" stays dim and locked until all three tabs have been opened**, then it lights up and
   pops. The Red flags tab opens with a subtitle, then five flags that each reveal a fresh example (not the
   ones in the email) on hover or focus; the "not a red flag" note is a calm green callout. The safe-move tab
   leads with a **stop icon** beside "Do not act on the message itself."
3. **Scenario (apply) on a work laptop:** a **photo of a blank-screen laptop on an office desk** (zoomed) fades
   in; after a ~2-second beat a notification **pops in with a soft arrival sound** over the laptop. Clicking it
   makes the notification **disappear**, the photo **dims**, and the **email opens** in a readable panel
   (external-sender banner, From/Subject with the highlighted lookalike domain, body, a ticking 15-minute
   countdown). Instead of asking what to do, it invites the learner to **spot the red flags**.
4. **Spot the red flags (drag to categorize):** "Do you see any red flags in this message?" with a
   **"Select all 4 that apply."** subheader. The learner **drags each red-flag phrase from the message into
   the box that explains why it is suspicious** (Urgency / Secrecy / Fake sender / Money request); a
   keyboard/click path (select a phrase, then select a box) and a touch path work the same way. Graded as an
   exact match: each of the four real flags in its correct box, and the **two** benign decoys (the "Thanks,
   Daniel." sign-off and "I'll forward the invoice after.") left unsorted.
5. **Anatomy of the attack (reinforce):** the same message re-shown with clickable hotspots on all five red
   flags. Each hotspot carries a **pulsing pin** that signals "click me" and calms once found (a "found X / 5"
   tracker), plus a **side-by-side address breakdown** that shows the real internal address next to the spoofed
   one with a tap-to-reveal "how to read a domain" tip.
6. **Decision (plus coaching):** three choices. Each decision state is a **two-column card** (text on the left,
   a character whose expression matches the outcome on the right, blended in with a soft gradient): a thoughtful
   figure for the prompt, an alarmed one for A, a wary one for B, a relieved one for C. A and B give corrective
   coaching and a Try again; C is the protective move, sets `score = 1`, and continues.
7. **Report it (apply):** a **step-by-step drag-and-drop composer on the laptop background**. Across three
   steps (To, then Subject, then Message) the learner **drags the right line into the active slot** of a report
   template (or taps it; full keyboard path too). Each field offers **three length-matched options**, and
   **every option has a rationale** (a green confirmation for the correct line, a corrective note for each
   decoy like replying to the attacker or pasting card details). Only the correct line fills the slot and
   reveals **Next**; the last step's button is **Send report**, which plays a **success animation** ("Report
   sent...") before continuing.
8. **Results + outro:** a recap of **what you found / what you learned**, a completion badge, a celebratory
   burst, and the conditional closing message, followed by an **outro** that plugs the author's contact links
   (Email / LinkedIn / Coursera cards) and offers **Back to portfolio** (`/`) and **More lesson examples**
   (`/lab`), plus Restart.

Every screen change plays a sequenced exit-then-enter transition (the outgoing screen eases out, the
incoming one rises in with a beat of emphasis on the headline) for a more immersive feel. Under reduced
motion it is an instant swap.

## Interactions and keyboard controls

| Interaction | Where | Keyboard |
|---|---|---|
| **Cover ping icon** | Title | Decorative; mouse only. A brief intro burst on load, then rests; ripples faster as the cursor nears, pops on click. Static under reduced motion |
| **Tabs** | Learn | Tab to the tablist; ArrowLeft/Right (or Up/Down), Home/End move between tabs (selection follows focus); each flag reveals its example on hover or focus |
| **Laptop notification** | Scenario | Arrives after a ~2s beat with a soft sound; a real button, focused on arrival, Enter/Space opens the email. The fade/pop + countdown freeze under reduced motion (the wait shortens, the sound still plays) |
| **Report composer** | Report it | Step-by-step (To, Subject, Message). Drag a chip into the active slot, or Tab to a chip and Enter/Space to place it; only the correct line advances; each pick shows a rationale; Next/Send move forward. Moves announced via a live region |
| **Hotspots** | Anatomy | Tab to each marker (each shows a pulsing pin), Enter/Space to reveal; the "found X/5" count is announced |
| **Address breakdown** | Anatomy | Real vs. fake address shown together; Tab to "Why is this one fake?", Enter/Space reveals the tip |
| **Sort red flags into bins** | Spot the red flags | Drag a phrase onto a box, or: Tab to a phrase, Enter/Space to pick it up, Tab to a box, Enter/Space to drop (Escape cancels). Tab to a placed chip, Enter to remove it. Every move is announced via a live region |
| **Bloom words** | Learn / Spot / Decision | The highlighted key words ("urgent-request", "red flags", "respond") are real buttons; Enter/Space (or click) blooms a soft halo. Decorative; silent under reduced motion |
| **Page navigation** | throughout | A Back button (top-left) and a clickable progress bar; jump to any page already reached |
| Choices, buttons | throughout | Tab to focus, Enter/Space to activate |

## How it behaves (the locked rules)

- **Learn gate:** "See the message" is dim and disabled until all three tabs have been opened, then it
  lights up and pops; a visible hint and a screen-reader announcement accompany the unlock. This is the only
  gated step; the decision and knowledge check stay non-punitive.
- **Decision:** Choice C is the only path forward and sets `score = 1`. A and B show coaching and a Try again
  that returns to the choices (never punitive, no attempt limit).
- **Spot the red flags (drag to categorize):** comes right after reading the message and before the decision.
  Each real flag must be dropped into the box that names why it is suspicious (Urgency / Secrecy / Fake
  sender / Money request); exact match is all four real flags in their correct boxes and the two benign decoys
  ("Thanks, Daniel." and "I'll forward the invoice after.") left unsorted. One re-submission; the second
  submission always advances. No third attempt, and no per-item right/wrong markers (the Anatomy screen
  explains each flag later). Placements are preserved on retry and frozen after the final submission.
- **Results:** a conditional message follows `score`. A single `urgent-request:complete` event fires once on
  first arrival, with `{ score, kcPassed }`, and is not gated on score. SCORM/xAPI are out of scope, but this
  one named event keeps it LMS-ready.
- **Navigation:** a Back button (top-left) and a clickable progress bar let learners revisit any page they
  have already reached; forward stays on the gated flow buttons, so the gates (open all tabs, submit the
  red-flag question) are never bypassed.
- **Restart** resets all state (score, knowledge check, layers, report, completion, navigation high-water mark)
  and every interaction (learn tabs and gate, address tip, hotspots, countdown, the report composer, badge,
  confetti) and returns to
  the title.

## Accessibility

Target WCAG 2.1 AA. Every interaction is keyboard-operable with a visible focus ring; focus moves to each
screen's heading on transition; the red-flag sort is **not drag-only** (phrases, boxes, and placed chips are
all real `<button>`s, so select-then-place and remove work by keyboard and touch, and each move is announced
through an `aria-live` region); the report composer's options are real buttons, placeable by click or
keyboard (not drag-only), and each placement is announced; the
address breakdown and hotspots likewise expose text equivalents; the learn tabs are real tabs
(`aria-selected`) and the flag examples live in the DOM (collapsed) so screen readers always get them; the
lookalike domain is distinguished by more than color; and all entrance/decorative motion (screen transitions,
tab and example reveals, the notification fade/pop, the click-word bloom, the hotspot pins, countdown, badge
draw, process reveal, confetti, the unread-tab pulse, the button light-up) is wrapped in
`@media (prefers-reduced-motion: no-preference)` or skipped in JS under reduced motion, so reduced-motion and
no-JS users always get complete, static content. The notification sound is a brief, one-time chime, never
looped. Light and dark themes match the portfolio.

## Image assets

All images are **owner-supplied** (Chalece provided them; the four branch characters are AI-generated).
Confirm usage rights are cleared before any public/commercial use, and consider compressing the PNGs for the
web before shipping; the page works as-is.

**`assets/blankLaptop.png`** is the scenario backdrop (a blank-screen laptop on an office desk).

- **Dimensions:** 1448 x 1086 PNG (~1.8 MB).
- **How it renders:** an `<img class="deskscene__photo">` inside `.deskscene`. The `.deskscene` box locks the
  image aspect ratio (`1448 / 1086`) so the whole photo shows, and the **zoom** is a single tunable pair on
  `.deskscene__photo`: `transform: scale(1.32)` with `transform-origin: center 40%` (raise the scale to zoom
  more, nudge the origin to re-frame). `--surface-2` is the no-image fallback.
- **The message:** the notification pops in over the upper-center of the screen; when the email opens,
  `.deskscene__stage` gains `is-reading`, which dims the photo so the themed email panel reads cleanly on top.
- **To swap it:** drop a replacement at `assets/blankLaptop.png`. If its proportions differ, update the
  `aspect-ratio` on `.deskscene` to match so it still shows without cropping.

**`assets/assessment-images/`** holds the four decision-branch character photos (each 748 x 512 PNG), shown
on the right side of each two-column decision card with `object-fit: cover`:

| File | Branch | Expression |
|---|---|---|
| `01_thoughtful_woman_at_desk.png` | "How do you respond?" prompt | thoughtful |
| `02_stressed_man_at_desk.png` | Choice A ("That is what the attacker wanted.") | stressed |
| `03_risky_move_man_at_desk.png` | Choice B ("Risky move.") | wary |
| `04_confident_woman_at_desk.png` | Choice C ("Exactly right.") | confident |

- **To swap one:** replace the file at the same path (the `<img src>` in each decision state points at it).
  Nudge `object-position` on `.coaching__img` if a face crops oddly.
- `ChatGPT Image ... .png` in that folder is the **styling reference screenshot only** and is not loaded by
  the page; it can be deleted before publish.

## Local preview

No tooling required. Open `index.html` directly, or serve the folder:

```bash
cd projects/urgent-request-scenario
npx serve .        # or: python3 -m http.server 8787
```

Then open the printed URL.

## Deploy to Vercel (standalone static site)

```bash
cd projects/urgent-request-scenario
vercel          # preview deployment plus a shareable URL
vercel --prod   # promote to production
```

Vercel auto-detects a static site (framework preset "Other") and serves `index.html` at `/`, with no
`vercel.json` or build command needed. Deploy from **this** folder so `index.html` sits at the site root.
You can also drag-and-drop the folder onto the Vercel dashboard.

## Supplemental copy, added in this build, pending ID review

The locked learner-facing strings (`instructional_handoff.md` section 10) are unchanged in meaning. The
immersive layer added new supplemental copy, written in the spec's voice. Please review:

- **Learn intro:** the definition line ("An urgent-request scam is a message that uses pressure and a trusted
  name to rush you into sending money or data before you stop to check.") and, as a separate instruction
  subtitle above the tabs, "Explore all three tabs below to learn more about this social-engineering attack."
- **Work-laptop scene:** the scenario screen heading ("A new message on your work laptop") and the
  notification toast text ("Mail", "Urgent", "New message from Daniel Okafor, CFO", "Click to open").
- **Scenario lead-in:** the caption is now "Does anything look off?" and the button is "Spot the red flags"
  (replacing the locked "What do you do?" caption and the "See my options" button).
- **Learn tabs:** the three section titles and their teaching text; the five Red-flags example lines that
  reveal on hover/focus (all different from the email: "Wire this in the next 10 minutes before the window
  closes.", "Keep this between us until I tell you it is done.", "a note from payroll@acme-hr-portal.com",
  "Send the card number and CVV so I can pay the vendor.", "Open the attached invoice and enable editing to
  approve."); the Red-flags subtitle "Five tells show up again and again. Hover or focus each one to see an
  example."; and the green "Not a red flag" callout text.
- **Learn gate:** the "Open all three tabs to continue." / "You're all set." hint and the "X of 3 read"
  progress text.
- **Email on the laptop:** the external-sender banner and the countdown label.
- **Anatomy screen:** the heading/intro, the five hotspot explanations, and the address-breakdown copy (the
  "Check the address" lead-in, the real vs. fake rows using the placeholder real domain
  `daniel.okafor@yourcompany.com`, and the "Why is this one fake?" reveal tip).
- **Results recap:** the "What you found / What you learned" labels and the found summary line (the "What you
  did" block was removed as redundant with "What you learned").
- **Spot the red flags (drag to categorize):** the question ("Do you see any red flags in this message?")
  with the **"Select all 4 that apply."** subheader; the hint ("Drag each red flag into the box that explains
  why it is suspicious. On a keyboard, select a phrase, then select a box. Two of these lines are normal and
  belong in no box."); the **four box labels** ("Urgency", "Secrecy", "Fake sender", "Money request"); and
  the reworded feedback ("Yes. Urgency, secrecy, a lookalike sender, and a money or data request are the
  classic combination." / "Not quite. Put each red flag in the box that says why it is suspicious, and leave
  the two normal lines out."). The two benign decoys (the "Thanks, Daniel." sign-off and "I'll forward the
  invoice after.") remain.
- **Title learning objectives:** "By the end, you will be able to" + "Spot the red flags of an urgent-request
  scam.", "Verify money or data requests through a channel you already trust.", "Report it, to protect your
  whole team." A learner-facing breakdown of the locked §1 objective (`instructional_handoff.md`).
- **Bloom key words:** three highlighted, clickable key words: "urgent-request" (Learn heading) and "respond"
  (Decision heading) carry the violet bloom; **"red flags" (the question) turns red and glows red on click**.
  Decorative; no copy meaning added.
- **Report it (new activity, now drag + steps):** the heading "Report it the right way" ("Report" blooms), the
  instruction "Build the report on the laptop. Drag each piece into the message, or tap it. Two of the three
  choices in each step are wrong.", the field labels (To / Subject / Message), **three options per field with
  a rationale for each** (correct and decoys), and the send confirmation "Report sent. Security can warn the
  team and block the sender." Correct lines: To `security@yourcompany.com`; Subject "Reporting a suspected
  phishing email"; Message "I received a suspicious message from a lookalike address asking me to wire money. I
  did not reply, click, or pay." (decoys + rationales live in `REPORT_STEPS` in `script.js`).
- **Learn safe move:** a decorative stop icon now precedes "Do not act on the message itself." (no copy
  change).
- **Notification sound:** a short synthesized two-note chime plays once when the message arrives (no asset;
  gesture-gated; silent if the browser blocks audio).
- **Results:** the "Module complete" label.

If any of this should change (or the legitimate-domain example should use a real internal domain), edit
`index.html`; if you change a knowledge-check phrase, also update its `data-flag` on the `.select-flag`
button so it still matches the bin key it grades against (`urgency`/`secrecy`/`domain`/`money`) in
`script.js`.

## Notes for the instructional designer (flagged, not resolved here)

1. **`score = 0` message is unreachable.** Choice C is the only way past the decision screen, so every
   learner reaches results with `score = 1`; the `score = 0` line never shows. The locked logic is
   implemented exactly (both messages present; `score` set only by Choice C). If that message should appear,
   change the source upstream (for example, tie the closing message to `kc_passed`).
2. **"Advance" vs. "no timed auto-advance."** Advancement out of the knowledge check is always a user click
   ("Continue"), never a timer.
3. **Knowledge check reworked and reordered (locked elements).** Per owner direction: (a) it is now a
   **drag-to-categorize sort** (drag each red-flag phrase into the box naming why it is suspicious), replacing
   the earlier checkbox list and in-message toggle; (b) it runs **before** the A/B/C decision (read the
   message, spot the flags, then decide); (c) the prompt is split into a question plus a "Select all 4 that
   apply." subheader; (d) there are **two** benign decoys ("Thanks, Daniel." and "I'll forward the invoice
   after."), which must be left unsorted. Grading is now an exact match of each real flag in its correct box
   (urgency/secrecy/domain/money) with both decoys unsorted; one-retry-then-advance and no-per-item-markers
   are preserved, and the feedback strings were reworded to fit the sort (see the supplemental-copy list).
   The four box labels are new supplemental copy. A full keyboard/click/touch path exists alongside drag.
4. **Screen-2 caption changed (locked).** The "What do you do?" caption is replaced by "Does anything look
   off?" so the learner goes into spotting the flags rather than the decision at that point.
5. **One locked punctuation edit.** Choice B's feedback now reads "...install malware, even if they look
   legitimate." (a comma where the spec had an em dash), to honor the no-em-dashes rule. Please sync
   `instructional_handoff.md` sections 7 and 10 and the knowledge-check answer key upstream to match items 3,
   4, and 5.
6. **New "Report it" screen added (locked screen map).** Per owner direction a new activity sits **between
   Decision and Results**, so the flow and `screen_state_map.md` now have **8 screens** (Choice C's Continue
   leads here, not straight to Results). It is a **step-by-step drag-and-drop composer** on the laptop
   background (To, Subject, Message), three length-matched options per field, a rationale for each option, and
   a send success animation. All-new copy (see the supplemental-copy list). Please add it to the locked screen
   map and instructional handoff.
7. **"What you did" recap block removed.** Per owner direction the Results recap drops "What you did" as
   redundant with "What you learned"; "What you found" remains. Sync the recap copy upstream.
8. **Title objectives added.** A learner-facing objectives list (a faithful breakdown of the locked §1
   objective) was added to the title screen; please confirm the phrasing or replace with the canonical
   objective text from `instructional_handoff.md` §1.

Note: the teach and reinforce beats grow the runtime past the locked "3-minute" tagline; the tagline copy is
left as written (locked).
