# Audio sample credits

These instrument recordings are used in the music lessons (`/lab/sound`, `/lab/fourier`) for the
flute-vs-violin comparisons. They are public-domain (CC0), so no attribution is legally required; this
file documents provenance per the project's asset rules.

| File | Instrument | Note | Source | License |
|---|---|---|---|---|
| `flute-a4.m4a` | Flute (sustain vibrato) | A4 (440 Hz) | VSCO-2 Community Edition, `Woodwinds/Flute/susvib/LDFlute_susvib_A3_v1_1.wav` | CC0 1.0 |
| `violin-a4.m4a` | Solo violin (arco vibrato, piano) | A4 (440 Hz) | VSCO-2 Community Edition, `Strings/Solo Violin/Arco Vib/LLVln_ArcoVib_A4_p.wav` | CC0 1.0 |
| `violin-a3.m4a` | Solo violin (arco vibrato, forte) | A3 (220 Hz) | VSCO-2 Community Edition, `Strings/Solo Violin/Arco Vib/LLVln_ArcoVib_A3_f.wav` | CC0 1.0 |
| `kick.m4a` | Bass drum (bass example) | percussion | VSCO-2 Community Edition, `Percussion/bassdrum_rub1_v1.wav` (downmixed mono, trimmed ~1.4 s) | CC0 1.0 |
| `cymbal.m4a` | Crash cymbal (treble example) | percussion | VSCO-2 Community Edition, `Percussion/cymbal-crash1_mf_rr1.wav` (downmixed mono, trimmed ~2.2 s) | CC0 1.0 |

## Generated pure tones (public domain)

A pure tone is, by definition, a single sine wave, so these are rendered directly (there is no more
"authentic" recording of a pure tone than the sine itself). Generated for this project with a short Python
script and encoded to AAC with `afconvert`; released as public domain.

| File | What | Details |
|---|---|---|
| `pure-tone-a4.m4a` | Pure sine tone | 440 Hz (A4), ~1.6 s, mono, 20 ms/150 ms fades. The "pure tone" choice in the view screens (matches the flute/violin A4). |
| `whistle.m4a` | Whistle-like tone | ~1200 Hz sine with gentle 5 Hz vibrato + a faint 2nd harmonic, ~1.6 s. The see-your-voice sample whistle (a real whistle is close to a single frequency). |

- Project: Versilian Studios Chamber Orchestra 2, Community Edition (VSCO-2 CE).
- Repository: https://github.com/sgossner/VSCO-2-CE
- License: Creative Commons Zero 1.0 Universal (public domain dedication).
- Accessed: 2026-06-25.

**Which file is used where, and why two octaves of violin:**

- The intro slide and the Sound lesson compare `flute-a4` and `violin-a4` (both **A4, 440 Hz**) so the
  "same note A, same pitch, different timbre" point is literally true. A4 is the orchestral tuning A.
- The "sonic prism" slide and the "name that sound" check use `flute-a4` (pure) against `violin-a3`
  (**A3, 220 Hz**, rich). They are an octave apart on purpose: harmonic richness lives in the **low**
  register, and a concert flute cannot play A3 (its lowest note is ~B3/C4), so a same-note flute-vs-violin
  pair shows almost no difference. The slide says so honestly ("the violin plays a lower A; lower notes
  carry more harmonics"). Both notes are still an A.

Note: the VSCO-2 flute files labeled "A3" actually sound A4 (440) (the wind/brass labels are an octave
high in this set); the string files are labeled at concert pitch (A3 = 220, A4 = 440).

Processing: each source WAV was downmixed to mono, trimmed to ~3 seconds from after the attack (with a
30 ms fade in/out), and encoded to AAC (.m4a, ~38 KB) for the web with macOS `afconvert`. The lessons
also keep a synthesized fallback that plays if a sample fails to load.

## Pronunciation

- `fourier-pronounce.m4a`: the word "Fourier", used by the click-to-hear pronunciation on the Fourier
  intro. Generated with the macOS `say` command (Samantha voice), so it is original synthesized speech
  (no third-party license). Replace with a human recording if a more precise pronunciation is preferred.
