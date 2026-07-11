# What Is Inside a Sound? Three-lesson redesign (source of truth)

Owner spec for the hands-on Fourier redesign. Pedagogy on every screen: **Notice -> Play -> Name -> Use ->
Check**. Math as simple moves: **sample -> multiply -> add -> compare**. Quizzes replaced by hands-on
micro-challenges. House voice: clear, sectioned, second person; no em dashes, no exclamation points.

Lesson split (3 routes):
- **Lesson 1 - See the recipe** -> `/lab/spectrum` ("The Fourier transform, Part 1")
- **Lesson 2 - Find the recipe** -> `/lab/fourier` ("Part 2")
- **Lesson 3 - Use it, and prove it** -> `/lab/audio-tools` ("Part 3: Use it on your gear"), content Parts 3 + 4

---

# Opening Screen: Same Note, Different Sound (Lesson 1)

Title: **What Is Inside a Sound?** Subtitle: **Why the same note can sound completely different**

Copy: Why does the same song sound thin on cheap earbuds and huge on good headphones? Why do the bass, mid,
and treble sliders in your music app change the feeling of a song? And why can a flute and violin play the
same note, at the same loudness, but still sound different? There is more inside a sound than pitch and
volume. A sound has a hidden recipe: low ingredients, high ingredients, strong ingredients, quiet
ingredients. In this lesson, you will learn how to see that recipe. The main tool is called the **Fourier
Transform**. Fourier is pronounced **FOOR-ee-ay**. It helps answer: **Which frequencies are inside this
sound, and how strong is each one?**

Opening interaction "Same note, different recipe": buttons **Play flute**, **Play violin**, **Play both back
to back**. Label above both: **A4 · same pitch · similar loudness**. Under each, a blurred/locked "recipe
card". Prompt: "Both sounds are playing the same note. What do you notice?" Buttons: **They sound
identical** / **They sound different**. If "different": "Exactly. Pitch and volume are not the whole story.
Something inside the sound is different." (then unlock/reveal the recipe cards). If "identical": "Listen
again, especially to the smoothness, brightness, and texture. They share a pitch, but their tone color is
different."

Learning goals: see waveform vs spectrum; explain a pure tone; build richer sounds by stacking pure tones;
read bass/mids/treble; explain the transform as a frequency test; see where digital samples come from;
calculate one tiny Fourier result step by step; connect frequency recipes to EQ, headphones, voice,
Shazam-style recognition, audio compression.

Path ahead (4 stages, descriptive): **1 See the recipe** (waveform, spectrum, pure tones, harmonics, timbre,
bass/mids/treble); **2 Find the recipe** (test a sound for one frequency at a time); **3 Use the recipe** (EQ,
headphones, voice, everyday tools); **4 Prove you can read a sound** (short sound mysteries). Button: **Start
the sound lab**. Hero image: dark studio, flute + violin same note, label "Same pitch. Different recipe.",
waveform + spectrum previews (flute fewer strong upper harmonics; violin fuller stack).

# Part 1 Intro Screen
Title: **Part 1: See the Recipe**. Copy: before any calculations, learn to see sound two ways. A **waveform**
shows how sound changes over time. A **spectrum** shows what frequencies are inside. Like learning to read a
map, so the later math makes more sense. Button: **Begin Part 1**.

# Screen 1: Sound Is a Moving Shape
Sound is vibration; it pushes and pulls air; a mic turns movement into numbers; a speaker turns numbers back
into movement; drawing those changing numbers over time gives a **waveform** (a picture of how the sound
changes, not the sound itself). Interaction "Draw the vibration": **Tap once**, **Tap repeatedly**, **Hold
and release**; a dot moves up/down like air pressure and draws a line that becomes a waveform. Prompt: which
motion makes a short bump? a repeating wave? a louder-looking wave? Labels: Time moves left to right; higher
line = more positive pressure; lower = more negative; bigger motion = stronger signal. Micro-challenge
"Point to time": waveform with three highlighted moments; drag labels beginning/middle/end; then tap the
loudest-looking section. Takeaway: a waveform answers "what is the sound doing moment by moment?"

# Screen 2: Meet the Pure Tone
A **pure tone** is the simplest sound: one main frequency, a smooth repeating **sine wave** (tuning fork,
test tone, clean whistle). Interaction "One tone, one wave": **Play pure tone**, slider **Pitch** (display
"Pitch: 440 Hz"), waveform + spectrum panels. Higher pitch repeats faster + bar moves right; lower repeats
slower + bar moves left. Vocab: **Frequency** = repeats per second, in **hertz (Hz)**; higher freq = higher
pitch. Micro-challenge "Make it higher": target "Make the tone higher without making it louder" (move only
pitch); then make it lower; then return near 440 Hz. Takeaway: a pure tone = one frequency, one smooth
waveform, one main spectrum bar.

# Screen 3: The Waveform View
A waveform shows change over time: when a sound starts/ends, where it gets stronger/weaker, whether it
repeats smoothly, whether the shape is simple or detailed. Simple tone = smooth; richer sound = more detailed
(several ingredients combining). Interaction "Waveform explorer": **Choose a sound** (Pure tone / Flute-like
/ Violin-like), **Play selected sound**, view = waveform only. Prompt: which looks smoothest? more detailed?
sounds richer? Micro-challenge "Sort the waveforms": three unlabeled waveform cards, drag into order
smoothest -> most detailed; reveal Pure -> flute -> violin. Feedback: smoother = fewer strong ingredients;
detailed = more frequency ingredients combining. Takeaway: the waveform tells you how the sound changes over
time.

# Screen 4: The Spectrum View
A spectrum shows frequency ingredients. Each bar = a frequency area. Left = lower; right = higher; taller =
stronger; shorter = weaker. Pure tone = one main bar; richer sound = more bars. Interaction "Recipe reader":
Choose a sound (Pure / Flute-like / Violin-like), Play selected sound, view = spectrum only. Prompt: which
has one main bar? a few extra? the fullest stack? Micro-challenge "Build the label": drag labels onto the
spectrum (low frequencies to left, high to right, stronger to a tall bar, weaker to a short bar). Takeaway:
the spectrum tells you which frequencies are inside and how strong each is.

# Screen 5: Same Sound, Two Views
The waveform and spectrum are two pictures of the same sound; the sound does not change when you switch,
only the question. Waveform asks "what happens over time?"; spectrum asks "what frequencies are inside?"
Interaction "Flip the view": Choose a sound, Play, toggle Waveform / Spectrum. Micro-challenge "Choose the
better view": drag each task to waveform or spectrum: find when the sound starts -> waveform; find whether it
has high-frequency ingredients -> spectrum; find if it gets louder over time -> waveform; find bass/mid/
treble balance -> spectrum; compare harmonic richness -> spectrum; see the attack of a note -> waveform.
Takeaway: you need both views.

# Screen 6: A Sonic Prism
White light through a prism spreads into colors; the white contained many wavelengths. A Fourier Transform is
a prism for sound: a complex sound goes in, a frequency recipe comes out. It does not physically pull the
sound apart; it calculates which frequencies are present and how strong. The prism is the visual metaphor.
Use the photorealistic prism image. Caption: "One complex wave enters. Its frequency ingredients fan out."
Interaction "Send it through the prism": Choose a sound (Flute-like / Violin-like / Square wave), **Send
through prism**; optional **Play original**, **Solo one ingredient**, **Play all ingredients together**.
Visual rules: spacing shows frequency (closer = higher, wider = lower); height/brightness shows strength
(taller/brighter = stronger). Prompt: flute-like vs violin-like, what changed? more visible ingredients?
stronger highs? Micro-challenge "Read the prism": click the strongest band, then the highest-frequency band,
then the lowest-frequency band (checks frequency and amplitude separately). Takeaway: the fan of tones is the
spectrum, the frequency recipe. Image: glass prism with formula etched + "Fourier Transform" label; output
fan with distinct waves (low = wider spacing, high = closer, mids taller if strong; strength via
amplitude/brightness, not only color).

# Screen 7: Build a Sound from Pure Tones
Title **Run the Prism Backward** / **Build a sound by stacking pure tones**. The prism went finished sound ->
ingredients; now run it backward: start with pure tones, stack them, build a new sound = **additive
synthesis**. Interaction "Harmonic mixer": **Play your sound**, toggle Waveform / Spectrum, sliders **H1
Fundamental..H6**, presets Pure tone / Flute-like / Violin-like / Bright synth, live recipe
`y(t) = 1.00·sin(2πft)` updating as harmonics are added. Guidance: start H1 (fundamental, sets pitch); raise
H2, H3, H4; watch sound change, spectrum gain bars, waveform get detailed. Vocab: **Fundamental** (first,
lowest, sets pitch); **Harmonic** (H2 = 2x, H3 = 3x, H4 = 4x); **Amplitude** (strength of each harmonic);
**Timbre** (character/color; same pitch different feel; harmonic mix is a major part). Micro-challenge "Make
it brighter": goal "make the sound brighter without changing the fundamental" (raise upper harmonics, leave
H1); then "make it smoother" (lower uppers); then "match the target recipe" (ghost spectrum to match).
Takeaway: same note, different recipe, different timbre.

# Screen 8: One Pure Tone as a Formula
Title **A Pure Tone Formula You Can Touch**. Every added pure tone follows the same pattern:
`y(t) = A · sin(2πft + φ)`. Each piece has a simple job; tap a piece, change its value, watch the wave.
Interaction "Formula touch lab": clickable pieces y(t), A, sin, 2π, f, t, φ; sliders Amplitude A, Frequency
f, Time t, Phase φ; **Play this tone**; live graph updates. Explanations: y(t) = the wave's value at one
moment ("where is the wave right now?"); A = amplitude (tall/strong); sin = smooth repeating shape; 2π = one
full cycle around the sine's circle; f = frequency (cycles per second); t = time (the moment); φ = phase
(where the wave starts in its cycle). Micro-challenge "Fix the wave": target wave; adjust sliders to make it
taller, repeat faster, slide its starting point (checks amplitude/frequency/phase without definitions).
Takeaway: one formula term = one pure tone; a full sound recipe adds several together.

# Screen 9: Square Waves Are Sines in Disguise
A square wave jumps high/low/high/low, sounds bright/buzzy/electronic, but can be built from smooth sine
waves: **odd harmonics only** (H1, H3, H5, H7, H9...). Interaction 1 "Smooth vs buzzy": **Play sine wave**,
**Play square wave** (same fundamental), waveform + spectrum side by side; prompt: why does the square sound
brighter? look at the spectrum. Interaction 2 "Build the square": **Start with H1**, **Add H3**, **Add H5**,
**Add H7**, **Add H9**, **Reset**; each lights the new bar + adds the sine into the combined waveform. Step
text: H1 only (smooth sine); Add H3 (flattens, brighter); Add H5 (steeper edges, buzzier); Add H7 (closer to
square); Add H9 (pattern continues, odd only, each quieter). Formula reveal (after building):
`y(t) = 4/π [sin(2πft) + 1/3 sin(2π·3ft) + 1/5 sin(2π·5ft) + 1/7 sin(2π·7ft) + ...]`. Optional drawer "Why do
little ripples appear?": the **Gibbs phenomenon** (no need to memorize); sharp edges need many high-frequency
ingredients; a few harmonics get close but not perfect. Micro-challenge "Odd one out": bars H1..H8; turn on
only the square's harmonics (H1, H3, H5, H7); then lower each in pattern (H1 strongest, then smaller).
Takeaway: a square wave is smooth sine waves stacked in a precise pattern.

# Screen 10: Bass, Mids, and Treble
The spectrum moves low -> high. **Bass** = low end; **Mids** = middle; **Treble** = high end. Approximate
map: Bass ~20-250 Hz; Mids ~250 Hz-4 kHz; Treble ~4 kHz-20 kHz. Interaction "Frequency road trip": **Play
sweeping tone**, slider **Frequency**, marker crosses bass/mids/treble, display "200 Hz · bass region". Move
slowly low -> high; bass feels deep/heavy, mids present/voice-like, treble bright/sharp/piercing. Examples -
Bass: kick weight, bass guitar, 808s, low synths. Mids: voice body, guitar, piano, melodies. Treble: cymbal
shimmer, air, breath, sparkle, sharpness. Micro-challenge "Place the sound": play kick drum, vocal vowel,
cymbal shimmer, bass guitar, snare crack; drag each onto Bass / Mids / Treble / Spreads across more than one
(the last matters: real sounds occupy multiple regions). Takeaway: bass/mids/treble are regions of the
frequency map.

# Screen 11: See Your Own Voice
Your voice has a recipe too. Use mic or sample; hum a steady "aah"; try a whistle; speak your name; watch the
spectrum. Controls: **Use your mic**, **Play sample vowel**, **Play sample whistle**, **Pause analysis**.
Privacy: audio stays on your device, nothing recorded or sent. A whistle ~ one strong bar; a sung vowel = a
fundamental plus harmonics; the mouth shapes the sound so some regions get stronger (formants), helping
create vowels. Micro-challenge "Voice detective": create the simplest spectrum you can; the richest; a higher
pitch; a lower pitch. Feedback: "You made the main bar move right, so pitch went up." / "You added more
energy above the fundamental, so the sound became richer or brighter." Takeaway: the transform reveals the
recipe of a real sound while it is happening.

# Screen 12: Part 1 Checkpoint
Title **Checkpoint: Can You Read the Recipe?** Pause before the math. Recap: pure tone = one main frequency;
waveform = change over time; spectrum = frequency ingredients; fundamental = main pitch; harmonics = richness;
amplitude = strength; timbre = character. Assessment 1 "Label the sound map": label a combined display
(waveform, spectrum, time axis, frequency axis, tall bar, short bar, fundamental, harmonics). Assessment 2
"Recipe match": two unlabeled spectra (flute-like, violin-like); drag labels "smoother / fewer strong
harmonics" and "richer / more harmonic energy". Assessment 3 "One-sentence check": "In your own words, why
can two instruments play the same note but sound different?" Rubric: same pitch/fundamental + different
harmonics/recipe + different timbre. Transition: now you can read the recipe; next, how a computer finds it.
Button: **Continue to Part 2**.

---

# Part 2: Find the Recipe (Lesson 2)

# Part 2 Intro Screen
Title **Part 2: How Does a Computer Find the Recipe?** You can read a spectrum; how does a computer create
one? A computer sees numbers, not sound. A digital sound is a list of samples. The whole method: choose a
frequency, make a test wave, multiply sample by sample, add the results, see if the total is big or small.
Button: **Start the frequency test**.

# Screen 13: Where Do Samples Come From?
Title **A Computer Sees Sound as Dots**. A mic captures a changing wave; a computer cannot store every point,
so it takes quick measurements called **samples**; a digital sound is a list of samples; like snapshots of a
moving object; more snapshots = clearer picture. Interaction "Sample the wave": smooth sine on a labeled
graph (x = time, y = signal value); control **Number of samples** (4 / 8 / 16 / 32); **Animate sampling**.
Animation: smooth wave appears; vertical scan line moves left -> right; at each sample time a glowing dot
appears on the curve and drops into a table (columns n, time, x[n]). Example (8 samples, a cosine starting at
top): x[0]=1.00, x[1]=0.71, x[2]=0.00, x[3]=-0.71, x[4]=-1.00, x[5]=-0.71, x[6]=0.00, x[7]=0.71. Explain:
sample number = n; sample value = x[n]; x[3] = the sound value at sample 3. Micro-challenge "Catch the
sample": animation pauses at a glowing dot; click the matching table row (e.g. dot at sample 4 -> x[4] =
-1.00). Takeaway: a computer starts with samples (dots from the wave); the transform works with those dots.

# Screen 14: The Mystery Sound
Title **The Reverse Problem**. In Part 1 you went pure tones -> finished sound; now the computer goes
backward: finished sound -> pure tones inside. Here is a mystery sound made from a few hidden pure tones; find
them. Controls: **Play mystery sound**; views waveform + hidden recipe locked. The waveform shows the
finished sound but not which tones are inside, so we need a test: "how much of this frequency is in the
sound?" Micro "Prediction pin": before testing, place prediction pins on a blank spectrum (not graded;
builds curiosity). Takeaway: the transform tests for frequencies, one at a time.

# Screen 15: Make a Test Wave
Title **Ask the Sound One Question**. To find a frequency the computer makes a pure **test wave** that asks
"are you in here?" Low frequency -> low test wave; high -> high test wave; then compare to the sound.
Interaction "Test wave maker": slider **Test frequency**; **Play mystery sound**, **Play test wave**; top
graph = mystery sound, middle = test wave, bottom = empty match meter. Low test wave = cycles spread out;
high = cycles close together. Micro "Match the spacing": a target wave behind the test wave; adjust test
frequency until spacing matches (visual frequency matching before math). Takeaway: a test wave is a pure tone
used to check for one frequency.

# Screen 16: Multiply, Then Add
Title **The Frequency Test: Multiply, Then Add**. For one test frequency: take a sound sample, take the
matching test-wave sample, multiply them, add to a running total, repeat for every sample. Large total = this
frequency matches; small total = probably not strong. Interaction "Sample-by-sample scanner": top = sound
samples as glowing dots; middle = test-wave samples as glowing dots; bottom = multiplication tiles + running
total bucket; buttons **Next sample**, **Auto-play calculation**, **Reset**. Per-sample animation: sound dot
lights, test dot lights, values move into a multiplication tile (e.g. n=0: 1.00 × 1.00 = 1.00), result drops
into the running total bucket, total updates; n=1: 0.71 × 0.71 = 0.50, total grows. Visual metaphor: a
**positive bucket** and a **negative bucket**; positive products add upward, negative pull downward; the
match score is what remains. When the test matches, most products work together and the total grows; when it
does not, positives/negatives cancel and the total stays small. Micro "Predict the product": before the
product appears, choose positive / negative / near zero (based on the two sample signs); then reveal.
Takeaway: for one frequency, the transform is basically multiply samples then add the products.

# Screen 17: When Frequencies Match
Title **A Match Adds Up**. Test a frequency that really is inside the sound; many products point the same way,
they add instead of cancel, the total grows. Interaction: **Test matching frequency**, **Test wrong
frequency**, **Compare totals**; two side-by-side lanes (A matching, B wrong), each with product bars + a
running total line. Matching lane total grows large; wrong lane products fight (some +, some -) and cancel.
Micro "Which one is hiding?": three test lanes at different frequencies; drag a badge "most likely present"
onto the lane with the largest final total. Takeaway: a large total = evidence the frequency is present;
near-zero = weak or absent.

# Screen 18: Phase Can Hide a Match
Title **The Same Wave Can Start in a Different Place**. Two waves can share a frequency but start in different
places = **phase**. If the test wave starts in the wrong place, a single test can miss a frequency that is
there (frequency right, timing shifted). Interaction "Slide the wave": slider **Phase**; views signal wave,
test wave, match total. Slide phase; frequency stays the same while the starting position changes; sometimes
the match total shrinks even though frequency did not change. Micro "Same frequency or new frequency?": three
shifted waves; sort into "same frequency, different phase" vs "different frequency". Takeaway: phase is where
the wave starts in its cycle; a good frequency test must handle phase.

# Screen 19: Cosine and Sine Work as a Team
Title **Two Test Waves Catch the Match**. To avoid missing a shifted wave, use two test waves, **cosine** and
**sine**, same frequency but starting at different positions, like two spotlights from different angles;
together they catch the frequency no matter where it starts. Controls: **Change phase**; displays **Cosine
total C**, **Sine total S**, **Combined amount** `amount = √(C² + S²)`. Visual metaphor: a point on a 2D map,
horizontal = C, vertical = S; as phase changes the point moves around a circle, distance from center stays
the same = the amount. Move phase; C and S trade strength; the combined amount stays steady when the
frequency is present. Micro "Keep the amount": with the phase slider, can you make C small while keeping the
amount large? (S catches what C misses.) Takeaway: cosine and sine together measure a frequency's strength
even when phase shifts.

# Screen 20: The Formula Is a Shortcut
Title **The Formula Is the Same Test in One Line**. You did it by feel: test wave, multiply, add, check
total. The DFT: `X[k] = Σ x[n] · e^(-i2πkn/N)`. Looks intense but is a shortcut for "for this frequency,
multiply every sample by the test wave, then add the products." Interaction "Translate the formula":
clickable pieces X[k], Σ, x[n], n, k, N, e^(-i2πkn/N); each opens a plain-language card. Cards: x[n] = the
sound sample (x[3] = value at sample 3); n = the sample number (moves through all); N = how many samples
(8 -> N=8); k = the frequency bin being tested ("how much of bin k is in this sound?"); e^(-i2πkn/N) = the
test wave (packs cosine and sine); · = multiply; Σ = add everything up; X[k] = the answer for bin k (size =
strength, angle = phase). Micro "Build the formula from blocks": drag plain-language blocks into a sentence
(For frequency k / take each sound sample x[n] / multiply by the test wave / add all products / get X[k]);
then the symbolic formula fades in underneath. Takeaway: the formula is the compact version of the idea you
already understand.

# Screen 21: Calculate One Frequency by Hand
Title **Calculate One Frequency by Hand**. Use 8 samples from a simple wave that starts at the top: x[0]=1.00,
x[1]=0.71, x[2]=0.00, x[3]=-0.71, x[4]=-1.00, x[5]=-0.71, x[6]=0.00, x[7]=0.71 (one smooth cycle, 8 even
points). Visual: graph (x = sample number n, y = value), smooth wave behind, 8 glowing dots, dotted lines to
the table. Test bin **k = 1** (one cycle across 8 samples -> bin 1 matches strongly). Step: take sound sample,
take test-wave sample, multiply, add to running total. Controls: **Step through samples**, **Auto-animate**,
**Reset**; toggles **Cosine test**, **Sine test**; displays C, S, raw amount, normalized amount. Example n=0:
x[0]=1.00; cos(2π·1·0/8)=1.00; 1.00×1.00=1.00; C=1.00; sin(2π·1·0/8)=0.00; product 0.00; S=0.00; amount
√(1²+0²)=1.00. Full table columns: n, x[n], cos test, x[n]·cos, running C, sin test, -x[n]·sin, running S
(rounded). Expected final: C=4.00, S=0.00, raw amount=4.00. Normalize: raw grows with more samples; for this
one-cycle example normalized amount = 2·raw/N = 2·4/8 = 1.00 (bin 1 strongly matches). Friendly note: the raw
total grows with more samples; normalization lets us compare fairly; main idea is still matching frequency ->
large total. Mismatch: test bin **k=2** (animate faster) -> positives/negatives cancel, amount near zero;
bin 2 asks "is there a two-cycle wave hiding here?" answer no. Micro 1 "Light up the next step": at each step,
click the sound sample dot, then the test-wave sample dot, then the multiplication tile, then the bucket
(calculation as guided animation). Micro 2 "Error detective": a completed step with one mistake (x[1]=0.71,
cos=0.71, shown 0.71×0.71=0.71); click the mistake; reveal 0.71×0.71 ≈ 0.50. Takeaway: you computed one
frequency result by hand; the computer does the same, faster, across many frequencies.

# Screen 22: Part 2 Checkpoint
Title **Checkpoint: Can You Find the Recipe?** The transform is a repeated test: for each frequency, make a
test wave, multiply sample by sample, add the products, measure the result. Assessment 1 "Method maze": drag
a character through the correct path tiles: Choose frequency, Make test wave, Multiply samples, Add products,
Read amount, Repeat. Distractor tiles: Turn up volume, Guess instrument, Delete bass, Change headphones.
Assessment 2 "Cancellation builder": positive and negative product blocks; stack them on a balance scale;
prompt strong match or weak match (cancel = weak; same direction = strong). Assessment 3 "Explain the formula
with icons": icons sample dot, test wave, multiplication sign, adding bucket, spectrum bar; drag under formula
pieces x[n], e^..., ·, Σ, X[k]. Transition: now use it on audio tools you know. Button: **Continue to Part
3**.

---

# Part 3: Use the Recipe (Lesson 3, content Part 3)

# Part 3 Intro Screen
Title **Part 3: Use It on Your Gear**. You can read a recipe and explain how a computer finds it; now connect
it to the real world. Frequency recipes show up in EQ, headphones, microphones, noise cancelling,
compression, song recognition, pitch correction, voice tools. Button: **Open the audio toolbox**.

# Screen 23: EQ Is Recipe Editing
An equalizer (EQ) changes the balance of frequencies; it does not rewrite the melody, it reshapes the recipe.
Boost bass -> lows stronger; cut treble -> highs softer; boost mids -> voices/instruments forward. Interaction
"EQ rescue lab": scenario cards - "The song sounds thin" (goal fuller, try bass), "The vocal is buried" (goal
clearer, try mids), "The mix sounds dull" (goal brighter, try treble). Controls: **Play loop**; sliders
Bass, Mids, Treble; **Reset flat**; visual = live spectrum with EQ curve overlay. Micro "Fix the mix": give a
problem, let them adjust - Too thin (success: bass up moderately); Too harsh (success: treble down); Voice
hidden (success: mids up). Feedback: "You changed the region that matches the problem." Takeaway: EQ works
because sounds have frequency recipes; EQ reshapes that recipe.

# Screen 24: Headphones Have Recipes Too
Title **Read a Headphone Curve**. Headphones/speakers do not play every frequency equally; a **frequency-
response curve** shows how strongly the gear plays each region. Rise in bass = low end emphasized; rise in
treble = brightness; dip in mids = vocals/instruments less forward. Interaction "Choose the tuning":
Neutral-like / Bass-emphasized / Bright / V-shaped; **Play sample through this curve**; visual = response
curve; audio = same sample filtered. Prompt: do not look first; listen and guess which curve, then reveal.
Micro "Curve detective": play a processed sample; drag a label onto it (bass-heavy / bright / balanced /
V-shaped); then reveal what the curve did to the spectrum. Takeaway: a headphone curve is like an EQ profile
built into the gear, the fit, and the listening system.

# Screen 25: Your Voice as a Moving Spectrum
Title **From Spectrum to Spectrogram**. A spectrum shows frequencies in one moment; many sounds change over
time (speech, music, drums). A **spectrogram** stacks spectra over time: time left -> right, frequency bottom
-> top, strength by brightness/color; a movie of the spectrum. Controls: **Play spoken phrase**, **Play sung
note**, **Play drum hit**; spectrogram appears as audio plays. Prompt: a steady sung note makes horizontal
bands; a drum hit makes a sudden burst; speech makes changing shapes. Micro "Match sound to spectrogram":
three spectrogram cards; play three sounds; drag each label (steady note / drum hit / spoken word) to its
spectrogram. Takeaway: a spectrum shows frequency content; a spectrogram shows how it changes over time.
Image: begin with one spectrum bar chart, then stack many spectra into a scrolling spectrogram.

# Screen 26: Where Frequency Thinking Lives
Title **Where Else Does This Show Up?** Frequency analysis is everywhere; the tools differ but share a big
idea: when we can see frequency patterns, we can measure, compare, compress, or change sound. Four
interactive cards:
- **Noise Cancelling**: a mic listens to outside noise; headphones estimate what reaches your ear; they
  create a carefully timed anti-noise signal to reduce it (uses phase; two similar waves in opposite
  directions can partially cancel). Interaction: **Play noise**, **Add anti-noise**; visual wave + inverted
  wave becomes smaller. Assessment: drag the anti-noise wave left/right until cancellation is strongest.
- **Song Recognition**: looks for strong frequency patterns over time = a fingerprint; compares to known
  songs. Interaction: **Play noisy clip**, **Show fingerprint peaks**. Assessment: click the strongest peak
  points on a spectrogram; the fingerprint connects like a constellation.
- **Audio Compression**: streaming needs smaller files; compression uses hearing models to reduce details
  less likely to be noticed; works with frequency info over short time windows. Interaction: **Original**,
  **Compressed**, **Difference**. Assessment: choose which version is acceptable at different bitrates by
  listening, not reading.
- **Pitch Correction**: estimates the main pitch, then nudges it toward a target note. Interaction: **Play
  sung note**, **Show detected pitch line**, **Snap to target note**. Assessment: drag the target note and
  hear the correction change.
Takeaway: frequency recipes help tools understand what is inside a sound; once visible, a tool can change,
compare, shrink, or respond to it.

# Screen 27: Part 3 Checkpoint
Title **Checkpoint: Can You Use the Recipe?** Assessment 1 "Audio repair cards": cards Too muddy / Too dull /
Too thin; drag each to a likely adjustment (cut some low mids / boost treble slightly / boost bass or low
mids). Assessment 2 "Curve prediction": show a response curve before audio; predict more bass / brighter /
vocals less forward; then play to check. Assessment 3 "Tool sorting": sort tools by what they do with
frequency info - change it (EQ, Pitch correction); measure it (Spectrum analyzer, Tuner); compare it (Song
recognition); reduce or remove it (Noise cancelling, Compression). Transition: now finish by solving sound
puzzles. Button: **Start final challenge**.

---

# Part 4: Lock It In (Lesson 3, content Part 4)

# Screen 28: Sound Detective Challenge
Title **Decode the Sound**. You have the tools to read sound. Solve the puzzles: listen, look, adjust,
explain. (Five gated challenge screens.)
- **Challenge 1: Find the Hidden Tone** - controls **Play mystery**, **Play test wave**, slider **Test
  frequency**, meter **Match strength**; tune until match strength peaks, then **Lock it in**. Feedback: you
  found the hidden tone; the score peaked because the test wave lined up with a frequency inside the sound.
  (Exploratory tuning task = reuse FindTheFrequency.)
- **Challenge 2: Match the Recipe** - target spectrum + your spectrum + harmonic sliders H1-H6; move sliders
  to match; buttons **Play target**, **Play yours**, **Check closeness**. Feedback: compare bar by bar; the
  closer the amplitudes, the closer the timbre. (Constructive matching = reuse MatchSpectrum.)
- **Challenge 3: Sample Calculation Replay** - eight-dot sampled wave; complete a guided calculation for one
  sample; the system highlights n=2; drag correct values into slots x[2]=___, test[2]=___, product=___; then
  the animation continues. (Interactive calculation completion with visual support.)
- **Challenge 4: Formula Translator** - show `X[k] = Σ x[n] · e^(-i2πkn/N)`; drag plain-language labels:
  answer for one frequency, add them up, sound sample, test wave, frequency being tested, total number of
  samples. (Formula annotation.)
- **Challenge 5: Gear Fix** - scenario: your headphones sound exciting but vocals feel pushed back; curve =
  bass boosted, treble boosted, mids dipped; choose adjustment: bring mids forward, or pick a better curve
  for vocal clarity. (Applied diagnosis.)

# Final Screen: You Can Read a Sound
Title **You Can Read a Sound**. Return to the beginning: a flute and violin can play the same note at similar
loudness; now you know why they still sound different - their frequency recipes are different. The fundamental
helps set pitch; the harmonics help shape timbre; the waveform shows change over time; the spectrum shows
which frequencies are inside; the Fourier Transform connects those views and finds the recipe by testing
frequencies one at a time (make a test wave, multiply sample by sample, add the products, measure the
result). It powers EQ, headphones, voice analysis, song recognition, audio compression, noise cancelling,
pitch correction. Final interaction: **Play flute**, **Play violin**, **Show spectra**; prompt: look at the
spectra now; what do you understand that you did not at the beginning? Text box: **Explain the difference in
one or two sentences.** Rubric (strong answer): same pitch + different harmonic recipes + that difference
creates timbre. Final takeaway: sound has a recipe; a spectrum helps you read it; the Fourier Transform helps
you find it; once you can read the recipe, you can understand and reshape sound. Buttons: **Restart**,
**Continue**.
