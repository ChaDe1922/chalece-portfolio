// Single source of truth for the Vibe Coding Lab (/lab/vibe-coding): a five
// step, hands-on first lesson for ages 13 to 15, adapted from
// curriculum-dev-agent/projects/vibe-coding-resource/beat-maker-v2.html.
// Framing: you direct, test, and improve a first draft. The skill is clear
// thinking, precise describing, testing, and iteration, not typing code.
// Tone: clear, economical, supportive, focused on doing and practicing.
// The lesson adapts to what the learner picks on slide 1 (game / music /
// school). All per-build content lives in `builds`. No em dashes.

export const vibeCodingLab = {
  meta: {
    title: "Vibe Coding: Build by Describing",
    description:
      "An interactive first lesson in vibe coding by Chalece DeLaCoudray. Pick what to build, then direct, test, and improve a real working example, and try it with an AI yourself.",
    ogTitle: "Vibe Coding: Build by Describing. An interactive lesson by Chalece DeLaCoudray.",
  },

  slides: {
    // 0. Hook: you are the director. First design decision before any code.
    hook: {
      id: "hook",
      title: "You don't need to know how to code. You need to know what you want.",
      meta: "Interactive lesson · 5 steps · about 5 minutes · no setup",
      body: "Vibe coding means you describe an idea in plain language, then use AI to build a first version. You are not just watching. You are directing.",
      decideLead: "You decide:",
      decide: [
        "What should it do?",
        "Who is it for?",
        "What should happen when someone clicks, taps, types, or plays?",
      ],
      decideClose: "The AI can write the code. The creative thinking is your job.",
      promptLabel: "Pick a build below, and this becomes your starting sentence:",
      choiceLead: "Pick the type of thing you would build first.",
      choices: [
        { id: "game", label: "Game" },
        { id: "music", label: "Music" },
        { id: "school", label: "School tool" },
      ],
      choiceFeedback: "Good. You already made your first design decision. The rest of the lesson follows your pick.",
      begin: "See what that made",
      byline: "An interactive lesson by Chalece DeLaCoudray",
    },

    // 1. The loop: say it, test it, remix it. Examples come from `builds`.
    framework: {
      id: "framework",
      title: "Vibe Coding in 3 Steps.",
      intro: "Vibe coding is not a straight line. It is a loop you repeat.",
      cycleHint: "Tap the highlighted step to move around the loop.",
      repeatLabel: "repeat",
      steps: [
        {
          id: "say",
          num: "1",
          label: "Say it",
          head: "Describe what you want",
          body: "Describe it like you are texting a smart helper. Specific beats vague.",
          question: "What details would make this clearer?",
        },
        {
          id: "test",
          num: "2",
          label: "Test it",
          head: "Try to break it",
          body: "Use what the AI made. Click things. Notice what feels fun, confusing, boring, or missing. Testing is how you learn what to ask for next.",
          question: "What should you try first?",
        },
        {
          id: "remix",
          num: "3",
          label: "Remix it",
          head: "Ask for one change",
          body: "Change one thing at a time, then test again. That back and forth is the real skill.",
          question: "What would you change?",
        },
      ],
      loopNote: "Then you do it again. Test, remix, test. That loop is how everything gets built.",
      personalizedLabel: (build: string) => `Example for your ${build} idea`,
      defaultHint: "Pick a build on the first step to make these match your idea.",
      defaultBuild: "music",
    },

    // 2. The artifact slide. Renders the matching mini-app from `builds`.
    artifact: {
      id: "build-it",
      title: "Here is what that sentence made.",
    },

    // 3. Remix prompts. Title and prompts come from `builds`; shared UI copy here.
    remix: {
      id: "remix",
      eyebrow: "Your turn",
      titlePrefix: "Remix your",
      dek: "These are real prompts. If you gave one to an AI, it could make a new version. Pick the change that sounds most interesting to you. That instinct is taste, and taste is a real skill.",
      voteFeedback: "You picked a direction. Now make it clearer.",
      followupQuestion: "What detail would make this prompt better?",
      followupExamples: ["What color?", "How fast?", "How many?", "What happens when clicked?"],
      followupPlaceholder: "Add the missing detail, then send it to an AI.",
      send: "Send to AI",
      yourIdeaTag: "Your idea",
      yourIdeaHint: "Write it like this:",
      yourIdeaTemplate: ["Add...", "Change...", "Make...", "When I click..., it should..."],
      yourIdeaPlaceholder: "What would you add or change?",
    },

    // 4. Conclusion + outro: recap the skills, order the loop, then wrap up.
    reflection: {
      id: "reflection",
      eyebrow: "What just happened",
      takeawaysLead: "You did three things real developers do.",
      takeaways: [
        {
          head: "You described a goal.",
          body: "You started with a specific idea. Real projects begin the same way: someone explains what the tool should do.",
        },
        {
          head: "You tested the result.",
          body: "You clicked, played, noticed, and reacted. That feedback loop is how software gets better.",
        },
        {
          head: "You directed the next version.",
          body: "You did not have to write the code to shape the product. You used clear language, judgment, and taste.",
        },
      ],
      // Parsons self-check: put the loop back in order. `steps` is the answer.
      parsons: {
        lead: "Put the loop back together.",
        instruction: "Use the arrows to order the three steps the way you would actually do them.",
        steps: [
          { id: "say", label: "Say it", body: "Describe what you want." },
          { id: "test", label: "Test it", body: "Try it and notice what to change." },
          { id: "remix", label: "Remix it", body: "Ask for one change, then test again." },
        ],
        check: "Check order",
        success: "That is the loop. Say it, test it, remix it, then go again.",
        retry: "Not yet. The loop starts by describing what you want.",
      },
      closing:
        "You may not have written every line of code, but you decided what to build, tested it, and made it better. That part is always yours.",
      recapLead: "You can now:",
      recap: [
        "Describe what you want with specific details.",
        "Test something and notice what to change.",
        "Direct an AI to build it and improve it.",
      ],
      contactLead: "Want to talk learning design, AI, or building things? Reach out.",
      backToPortfolio: "Back to the portfolio",
      resume: "Resume",
      byline: "An interactive lesson by Chalece DeLaCoudray",
    },
  },

  // Per-build content: drives slide 1 sentence, slide 2 examples, slide 3
  // artifact + check, and slide 4 remix prompts. One coherent story per pick.
  builds: {
    music: {
      label: "music",
      noun: "beat maker",
      sentence: "Make me a drum machine with 3 sounds and 8 beats I can click on and off.",
      weak: "Make a music thing.",
      framework: {
        test: "Press Play. Does it sound good? Too fast? Is a sound missing?",
        remix: "Add a cowbell. Make it faster. Change the colors.",
      },
      artifact: {
        kind: "beat-maker",
        intro: "Play with it. Nothing breaks.",
        patternLead: "You do not need music experience. You only need to notice patterns.",
        pattern: [
          "A kick, snare, and hi-hat sound different.",
          "The squares turn sounds on and off.",
          "The pattern loops, so you can hear your choices repeat.",
        ],
        makerTitle: "Beat Maker",
        makerSub: "Click the squares to turn sounds on or off. Press Play to hear your pattern loop.",
        play: "Play",
        stop: "Stop",
        clear: "Clear",
        surprise: "Surprise me",
        speedLabel: "Speed",
        rows: ["Kick", "Snare", "Hi-hat"],
        tip: "Try this: press Play. While it runs, click one square. Listen for what changes.",
        check: {
          prompt: "What changed when you clicked a square?",
          button: "What changed?",
          options: [
            { text: "The sound stopped or started on that beat.", correct: true },
            { text: "The whole song disappeared.", correct: false },
            { text: "The speed doubled.", correct: false },
          ],
          feedbackCorrect:
            "Yes. You changed one small part of the pattern. That is how most digital tools are built: small choices that add up.",
          feedbackIncorrect: "Not quite. Press Play and click one square again, then look at that single beat.",
        },
      },
      remixPrompts: [
        { tag: "Sound", text: "Add a cowbell sound that plays on beats 6 and 8." },
        { tag: "Sound", text: "Add a 4th row called Clap that sounds like a hand clap." },
        { tag: "Visual", text: "Change the active square color to bright orange." },
        { tag: "Visual", text: "Make the currently playing column glow green." },
        { tag: "Behavior", text: "Add a Double Time button that plays the pattern twice as fast." },
        { tag: "Behavior", text: "Make Surprise Me create a random pattern every time." },
      ],
    },

    game: {
      label: "game",
      noun: "game",
      sentence: "Make me a clicker game where I tap a target and my score goes up by 1 each tap.",
      weak: "Make a game.",
      framework: {
        test: "Play it. Can you win? Can you lose? Is it too easy or too hard?",
        remix: "Add a timer. Make the target move. Save a high score.",
      },
      artifact: {
        kind: "clicker-game",
        intro: "Play with it. Nothing breaks.",
        patternLead: "You do not need to be a gamer. You only need to notice what reacts to you.",
        pattern: [
          "Tap the target to score a point.",
          "A timer counts down each round.",
          "When time runs out, you see your score.",
        ],
        gameTitle: "Clicker Game",
        gameSub: "Press Start, then tap the target as fast as you can before time runs out.",
        start: "Start",
        reset: "Reset",
        again: "Play again",
        target: "Tap me",
        scoreLabel: "Score",
        timeLabel: "Time",
        bestLabel: "Best",
        duration: 12,
        overLead: "Time up.",
        tip: "Try this: start a round and tap the target a few times. Watch the score react.",
        check: {
          prompt: "What made your score go up?",
          button: "What changed?",
          options: [
            { text: "Tapping the target.", correct: true },
            { text: "Waiting for the timer.", correct: false },
            { text: "Pressing Reset.", correct: false },
          ],
          feedbackCorrect:
            "Yes. Each tap was one event the program reacted to. Real apps are full of little events like that.",
          feedbackIncorrect: "Not quite. Start a round and watch the score the moment you tap the target.",
        },
      },
      remixPrompts: [
        { tag: "Behavior", text: "Add a 10 second timer that ends the game." },
        { tag: "Behavior", text: "Make the target jump to a random spot after each tap." },
        { tag: "Visual", text: "Change the target color to bright orange." },
        { tag: "Visual", text: "Make the score bounce when it goes up." },
        { tag: "Behavior", text: "Save the high score and show it at the top." },
        { tag: "Sound", text: "Play a pop sound each time I tap the target." },
      ],
    },

    school: {
      label: "study tool",
      noun: "study tool",
      sentence: "Make me a flashcard app where I type a question and answer, then flip the card to check myself.",
      weak: "Make a study app.",
      framework: {
        test: "Add a card. Does it save? Is anything confusing to fill in?",
        remix: "Shuffle the cards. Add a score. Make the text bigger.",
      },
      artifact: {
        kind: "flashcards",
        intro: "Play with it. Nothing breaks.",
        patternLead: "You do not need to study anything real. You only need to notice what reacts to you.",
        pattern: [
          "Click a card to flip it and see the answer.",
          "Next moves to the next card.",
          "Type a question and answer to add your own.",
        ],
        cardTitle: "Flashcards",
        cardSub: "Click a card to flip it. Add your own with the form below.",
        flipHintFront: "Click to see the answer",
        flipHintBack: "Click to see the question",
        next: "Next",
        shuffle: "Shuffle",
        cardCount: (i: number, total: number) => `Card ${i} of ${total}`,
        addLead: "Add a card",
        questionLabel: "Question",
        answerLabel: "Answer",
        questionPlaceholder: "What is the capital of France?",
        answerPlaceholder: "Paris",
        addButton: "Add card",
        starter: [
          { q: "What is 7 x 8?", a: "56" },
          { q: "What planet is known as the Red Planet?", a: "Mars" },
          { q: "What does CPU stand for?", a: "Central Processing Unit" },
        ],
        tip: "Try this: click a card to flip it, then press Next. Watch what changes.",
        check: {
          prompt: "What does clicking a card do?",
          button: "What changed?",
          options: [
            { text: "It flips to show the answer.", correct: true },
            { text: "It deletes the card.", correct: false },
            { text: "It adds a new card.", correct: false },
          ],
          feedbackCorrect:
            "Yes. One click changed what the card shows. That is the program reacting to you, the same idea behind every app.",
          feedbackIncorrect: "Not quite. Click the card itself and watch it turn over.",
        },
      },
      remixPrompts: [
        { tag: "Behavior", text: "Shuffle the cards each time I start." },
        { tag: "Visual", text: "Flip the card with a smooth animation." },
        { tag: "Behavior", text: "Add a score for how many I got right." },
        { tag: "Visual", text: "Make the text bigger and easier to read." },
        { tag: "Behavior", text: "Add a button to delete a card I do not need." },
        { tag: "Sound", text: "Play a soft chime when I flip a card." },
      ],
    },
  },

  // Persistent side panel: the "Try it for real" hub. Where students actually
  // run a prompt in a real, free AI tool.
  aiPanel: {
    title: "Try it for real",
    intro: "Build something small with an AI right now. Open a tool, then put it beside this lesson.",
    toolLabel: "Send prompts to",
    openLabel: "Open",
    tools: [
      { id: "chatgpt", label: "ChatGPT", url: "https://chatgpt.com/", query: "https://chatgpt.com/?q=" },
      { id: "claude", label: "Claude", url: "https://claude.ai/new", query: "https://claude.ai/new?q=" },
    ],
    builderLead: "Build a prompt",
    builderHelp: "Fill in the blanks. Keep it small.",
    builderFields: [
      { id: "thing", before: "I want to build a", placeholder: "study timer" },
      { id: "let", before: "It should let the user", placeholder: "start, pause, and reset a countdown" },
      { id: "include", before: "It should include", placeholder: "a big number and two buttons" },
      { id: "click", before: "When the user clicks start, it should", placeholder: "begin counting down from 5 minutes" },
      { id: "look", before: "Make it look", placeholder: "clean, with large friendly buttons" },
    ],
    ideasLead: "Need an idea? Keep it small.",
    ideas: [
      "study timer",
      "random joke button",
      "mini quiz",
      "scoreboard",
      "mood tracker",
      "beat maker",
      "flashcard game",
      "character creator",
    ],
    quickLead: "Or send a remix prompt",
    send: "Send",
    copy: "Copy",
    copied: "Copied",
    safetyTitle: "Stay safe",
    safety:
      "Do not include private information like your full name, address, school login, phone number, or passwords.",
    footnote:
      "Opens in a new tab. Drag it beside this window to work side by side. Free tiers need a quick sign-in, and if you are under 18, ask a parent first.",
    closing: "You are not just asking AI for answers. You are learning how to direct ideas.",
  },
} as const;
