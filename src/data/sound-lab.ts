// Single source of truth for the Anatomy of a Sound lab (/lab/sound). Copy is
// the approved L1 draft (curriculum-dev-agent/courses/music-intro). Voice matches
// the published lessons: plain, assured, warm. No em dashes.

export const soundLab = {
  meta: {
    title: "Anatomy of a sound.",
    description:
      "An interactive music-tech lesson by Chalece DeLaCoudray. See what a sound is, shape its pitch, loudness, waveshape, and envelope, then build a synth and play a short tune. Beginner friendly, audio in the browser.",
    ogTitle: "Anatomy of a sound. An interactive music-tech lesson by Chalece DeLaCoudray.",
  },

  slides: {
    intro: {
      id: "start",
      title: "Make your first sound",
      meta: "Music technology · beginner friendly · about 10 minutes · no setup",
      promise:
        "You do not need to read music or know any math. In the next ten minutes you will see what a sound actually is, shape one yourself, and play a short tune on a synth you built. Headphones help. Press the button to begin.",
      objectivesLead: "By the end, you will be able to:",
      objectives: [
        "Explain that a sound is a vibration moving through the air.",
        "Tell pitch and loudness apart.",
        "Hear how the shape of a wave changes its character.",
        "Shape how a sound begins and ends.",
        "Build a simple synth sound and play a short tune on it.",
      ],
      begin: "Press to hear it",
      byline: "An interactive lesson by Chalece DeLaCoudray",
    },

    whatIsSound: {
      id: "what-is-sound",
      title: "What is a sound?",
      lead: "A sound is a fast vibration moving through the air. To **vibrate** is to move back and forth quickly. A speaker cone moves out and in, hundreds of times a second. Each push shoves the air in front of it, and that push travels across the room to your ear.",
      detail:
        "Watch the air between the speaker and the ear. Where the dots bunch together, the air is squeezed tight. That squeeze is a **compression**. Where they spread apart, the air is thin. That gap is a **rarefaction**. The pattern of squeeze and spread travels left to right, reaches your eardrum, and your brain calls the whole thing sound.",
      instruction:
        "Press play to send a wave from the speaker to the ear. Drag the pitch slider and the squeezes pack closer together. Drag the loudness slider and each push grows bigger.",
      baseFreq: 220,
      connector:
        "The moving air is the real thing. Drawn as a graph over time, that same push and pull is the line below.",
      insight:
        "That line is called a **waveform**. Left to right is time. Up and down is the push of the air, with the compressions above the middle and the rarefactions below. Every sound you have ever heard is a version of this wave.",
    },

    pitch: {
      id: "pitch",
      title: "Pitch is how fast it vibrates",
      lead: "Vibrate faster and the sound is higher. Vibrate slower and it is lower. How fast it vibrates is the **frequency**, measured in hertz (Hz), which means vibrations per second. Each vibration is one of those compressions reaching your ear, so more of them per second reads as a higher note.",
      instruction: "Drag the slider. Listen, and watch the wave tighten as the pitch rises.",
      min: 110,
      max: 880,
      defaultFreq: 330,
      insight:
        "One rule is worth knowing. Double the frequency and you rise one **octave**, the same note higher. The note A is 440 Hz. Double it to 880 Hz and it is A again, higher up.",
    },

    loudness: {
      id: "loudness",
      title: "Loudness is how big the wave is",
      lead: "Loudness is not pitch. Loudness is how big the wave is, not how fast. A bigger wave moves more air, so it sounds louder. The size of the wave is its **amplitude**. A larger amplitude is a harder push of air against your eardrum.",
      instruction:
        "Drag the loudness slider. The wave grows taller and shorter, but the pitch does not change.",
      fixedFreq: 330,
      insight:
        "Pitch and loudness are two separate controls. The same note can be quiet or loud, and any note can be high or low at any loudness. Our ears do not hear every pitch as equally loud, which is part of why mixing music is a craft.",
    },

    timbre: {
      id: "timbre",
      title: "Why a flute and a violin sound different",
      lead: "Play the same note, at the same loudness, on a flute and a violin. You can still tell them apart at once. That difference is **timbre**. **Wave shape is one major part of timbre**: two instruments can vibrate at the very same speed and still trace very different shapes. The envelope, which you shape next, also changes how a sound feels.",
      instruction: "Same pitch, same loudness. Tap each shape and hear how different it feels.",
      fixedFreq: 330,
      shapes: [
        { type: "sine", label: "Sine", character: "smooth" },
        { type: "square", label: "Square", character: "buzzy" },
        { type: "sawtooth", label: "Sawtooth", character: "bright" },
        { type: "triangle", label: "Triangle", character: "mellow" },
      ],
      instruments: {
        lead: "Now hear two real instruments. A flute and a violin on the same note, A. Same pitch, same loudness, yet your ear knows them apart at once. That is timbre.",
        fluteSample: "/audio/flute-a4.m4a",
        violinSample: "/audio/violin-a4.m4a",
        fluteLabel: "Flute",
        violinLabel: "Violin",
      },
      insight:
        "The pitch is identical. The loudness is identical. They still sound nothing alike. That is timbre, and it lives in the shape of the wave. Hold one question for the next lesson. The square sounds buzzy and busy. Why would so plain a shape sound so complex?",
    },

    envelope: {
      id: "envelope",
      title: "How a sound begins and ends",
      lead: "Pluck a guitar string and the sound jumps in and fades. Lean on an organ key and it swells and holds. Same note, very different feel. That shape over time is the **envelope**. Envelope is not the note's pitch. It is the shape of the sound's loudness over time, how it rises when it starts and falls when it ends.",
      instruction:
        "Drag the two handles. Attack is how fast the sound arrives. Decay is how fast it fades. Try the Pluck and Pad presets, then make your own.",
      playLabel: "Play it",
      presets: [
        { id: "pluck", label: "Pluck", attack: 0.005, decay: 0.25 },
        { id: "pad", label: "Pad", attack: 0.6, decay: 1.2 },
      ],
      insight:
        "Envelope is loudness over time. A short, sharp envelope reads as a pluck or a drum; a slow, long one reads as a pad or a held note. The envelope is a large part of how your ear names an instrument, even before the timbre.",
    },

    synth: {
      id: "synth",
      title: "Build your synth, play a tune",
      lead: "You have the pieces now: a pitch, a loudness, a waveshape, and an envelope. Put them together and you have an instrument. That is what a synthesizer is. Nothing here is new to you. You have already shaped every one of these by hand.",
      instruction:
        "Pick your sound, then play. Use the keys on screen or your keyboard. Follow the suggested notes, or play freely.",
      // One octave, C major, with computer-key bindings.
      keys: [
        { note: "C4", freq: 261.63, key: "a" },
        { note: "D4", freq: 293.66, key: "s" },
        { note: "E4", freq: 329.63, key: "d" },
        { note: "F4", freq: 349.23, key: "f" },
        { note: "G4", freq: 392.0, key: "g" },
        { note: "A4", freq: 440.0, key: "h" },
        { note: "B4", freq: 493.88, key: "j" },
        { note: "C5", freq: 523.25, key: "k" },
      ],
      tuneLabel: "Suggested tune (Twinkle, Twinkle)",
      tune: ["C4", "C4", "G4", "G4", "A4", "A4", "G4"],
      doneHint: "Play a note to continue. Try the suggested tune, or play your own.",
      insight:
        "That is a synth. You set how fast it vibrates (pitch), how big the wave is (loudness), the shape of the wave (timbre), and how it starts and stops (envelope). Every synthesizer, from a phone app to a festival stage, is built on these four ideas.",
    },

    check: {
      id: "check",
      title: "What did you hear?",
      intro: "A few quick checks, some by ear, then say it in your own words.",
      progressLead: "Sound skills checked",
      badges: [
        { id: "heardPitch", label: "Heard pitch" },
        { id: "namedShape", label: "Named shape" },
        { id: "matchedControls", label: "Matched controls" },
        { id: "builtMystery", label: "Built mystery sound" },
        { id: "explainedTimbre", label: "Explained timbre" },
      ],
      reflectionMarkLabel: "Mark this as explained",

      earHigherLower: {
        label: "Listen 1",
        prompt: "Press play to hear two notes. Which one is higher?",
        playLabel: "Play the two notes",
        // played in order: low then high
        lowFreq: 220,
        highFreq: 330,
        options: [
          { key: "first", label: "The first note", correct: false, feedback: "Listen again. The higher note vibrates faster, and it is the second one here." },
          { key: "second", label: "The second note", correct: true, feedback: "Right. The second note vibrates faster, so it is higher. Higher pitch means more hertz." },
        ],
        objective: "Tell pitch (how fast) from loudness (how big).",
      },

      earShape: {
        label: "Listen 2",
        prompt: "Press play. Which shape is this?",
        playLabel: "Play the sound",
        targetType: "square",
        options: [
          { key: "sine", label: "Sine (smooth)", correct: false, feedback: "Sine is smooth and pure. This one buzzes." },
          { key: "square", label: "Square (buzzy)", correct: true, feedback: "Yes. That buzzy, hollow tone is the square wave." },
          { key: "sawtooth", label: "Sawtooth (bright)", correct: false, feedback: "Sawtooth is bright and brassy. This one is more hollow." },
          { key: "triangle", label: "Triangle (mellow)", correct: false, feedback: "Triangle is soft and mellow. This one is buzzier." },
        ],
        objective: "Recognize that waveshape creates timbre.",
      },

      matchPairs: {
        label: "Match",
        prompt: "Match each control to what it changes about the sound.",
        pairs: [
          { id: "pitch", left: "Pitch", right: "How fast the wave vibrates" },
          { id: "loudness", left: "Loudness", right: "How big the wave is" },
          { id: "timbre", left: "Timbre", right: "The shape of the wave" },
          { id: "envelope", left: "Envelope", right: "How the sound starts and ends" },
        ],
      },

      matchSound: {
        label: "Game",
        prompt: "Match the mystery sound. Set the shape and the envelope until yours matches the target.",
        playTargetLabel: "Play the target",
        playYoursLabel: "Play yours",
        target: { type: "square", attack: 0.005, decay: 0.25 },
        revealLabel: "Reveal the target",
        success: "That is it. Same shape, same envelope, same sound.",
        objective: "Build a sound to match a target.",
      },

      classic: {
        id: "waveform-mcq",
        kind: "mc-text" as const,
        objective: "Explain that a waveform is a vibration over time.",
        prompt: "A waveform (the line you watched) is a picture of what?",
        options: [
          { key: "A", text: "A sound's vibration over time.", correct: true, feedback: "Yes. Left to right is time, up and down is the push of the air. Every sound is a version of that wave." },
          { key: "B", text: "How loud the sound is, and nothing else.", correct: false, feedback: "Loudness is only the height of the wave. The waveform shows the whole vibration over time." },
          { key: "C", text: "The musical notes written on a staff.", correct: false, feedback: "That is notation. A waveform is the physical vibration, not the sheet music." },
          { key: "D", text: "The color of the speaker.", correct: false, feedback: "Not quite. The waveform is the air vibration drawn over time." },
        ],
      },

      reflection: {
        prompt: "In one sentence, explain to a friend what timbre is.",
        placeholder: "Aim for one sentence, clear and specific.",
        instruction:
          "Check it against the rubric. What matters is whether your sentence captures that timbre is what remains when pitch and loudness are the same, and that it comes from the shape, or character, of the sound.",
        rubric: [
          { level: "Excellent", criteria: "Says timbre is what makes two sounds differ even at the same pitch and loudness, and ties it to the shape or character of the sound." },
          { level: "Good", criteria: "Captures one of the two ideas, but not both." },
          { level: "Keep going", criteria: "Describes timbre as just loudness or just pitch, or as how high or quiet a sound is." },
        ],
      },
    },

    outro: {
      id: "outro",
      title: "That is a sound",
      lead: "You saw the wave, changed its speed and its size, heard how its shape makes timbre, gave it an envelope, and played a tune on a synth you built.",
      recapLead: "What you can do now:",
      recap: [
        "Explain that a sound is a vibration, and a waveform is that vibration over time.",
        "Tell pitch (frequency) apart from loudness (amplitude).",
        "Hear how the shape of a wave changes its timbre.",
        "Shape how a sound begins and ends with an envelope.",
        "Build a synth from pitch, loudness, shape, and envelope.",
        "Play a short tune on the instrument you built.",
      ],
      teaser:
        "Remember the buzzy square wave. It looked plain but sounded busy. The reason is that it is not one sound. It is many pure tones stacked together. In the next lesson you will pull a sound apart into its ingredients and meet the most useful idea in audio: the Fourier transform.",
      aboutLead: "About the designer",
      contactLead:
        "I am Chalece DeLaCoudray, a learning experience designer and technologist. If this is the kind of learning you want to build, let's talk.",
      backToPortfolio: "Back to portfolio",
      resume: "Download resume",
      byline: "Thanks for visiting.",
    },
  },
} as const;
