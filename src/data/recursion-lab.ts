// Single source of truth for the Recursion Lab (/lab/recursion): a complete,
// taught lesson adapted from curriculum-dev-agent/courses/recursion-intro
// (M1 L1). Arc: experience (mirror) to name it (dolls) to code (countdown) to
// mental model (call stack) to payoff (fractal) to assessment. No em dashes.

export const recursionLab = {
  meta: {
    title: "Recursion, watch it run.",
    description:
      "An interactive recursion lesson by Chalece DeLaCoudray. Step into a mirror, open nested dolls, write your first recursive function, watch the call stack, grow a fractal tree, then check what you learned.",
    ogTitle: "Recursion, watch it run. An interactive lesson by Chalece DeLaCoudray.",
  },

  slides: {
    // 0. Cover: what you will learn and the objectives.
    intro: {
      id: "start",
      title: "Recursion, watch it run.",
      meta: "Interactive lesson · about 6 minutes · no setup",
      promise:
        "A short, hands-on lesson. You will play with recursion, name its parts, build it in Python, watch it run, then check what you learned.",
      objectivesLead: "By the end, you will be able to:",
      objectives: [
        "Explain what recursion is, in plain language.",
        "Spot the two parts every recursion needs: a base case and a recursive case.",
        "Write and trace a simple recursive function in Python.",
        "Describe the call stack, and why a base case is required.",
        "Predict what happens when the base case is missing.",
      ],
      begin: "Begin the lesson",
      byline: "An interactive lesson by Chalece DeLaCoudray",
    },

    // 1. Hook: self-reference, before the word "recursion".
    mirror: {
      id: "mirror",
      title: "Have you ever seen yourself forever?",
      intro:
        "Some things contain a smaller version of themselves. Two mirrors facing each other show it: each reflection is the whole scene again, smaller, placed inside the one before it. It goes inward, not sideways. Hold that idea, then step inside and watch it happen.",
      maxDepth: 7,
      stepIn: "Step inside",
      stepOut: "Step back out",
      prompt: "Each reflection sits inside the one before it. That nesting, a thing inside a smaller copy of itself, is what the rest of this lesson is about.",
      depthNote: (d: number, max: number) =>
        d === 0
          ? "Standing at the entrance."
          : d >= max
            ? `You are ${d} reflections deep. Too deep to see, but the pattern continues.`
            : `You are ${d} reflection${d === 1 ? "" : "s"} deep.`,
    },

    // 2. Name it: base case + recursive case, via nested dolls.
    dolls: {
      id: "dolls",
      title: "Two rules that keep it from going forever",
      teachLead:
        "Something that never stops is useless in a program. So every recursion has exactly two parts: one that keeps it going, and one that ends it.",
      interactLead:
        "Now open these nested dolls and watch both parts happen: each doll holds a smaller one (the recursive case), until you reach a doll with nothing inside (the base case).",
      intro:
        "Something that never stops is useless in a program. Open these nested dolls. Each one holds a smaller one, until you reach a doll with nothing inside.",
      openInstr: "Open each doll to find a smaller one inside.",
      open: "Open doll",
      reassemble: "Put them back",
      reset: "Reset",
      baseLabel: "base case: nothing inside, the answer is just this",
      narrate: {
        open: (i: number, total: number) => `Opening doll ${i} of ${total}. This is a recursive call.`,
        base: "This is the base case. There is nothing inside, so we stop here.",
        ret: (i: number) => `Returning from doll ${i}. Each waiting call can now finish.`,
        done: "You opened until one was too small to open, then you came back out. That is recursion.",
      },
      rules: [
        {
          id: "base",
          term: "Base case",
          text: "The smallest doll. Nothing inside, the answer is already known, stop here. Without it, you would open dolls forever.",
        },
        {
          id: "recursive",
          term: "Recursive case",
          text: "Every bigger doll. Each one holds a smaller version of itself, and each step moves closer to the base case.",
        },
      ],
      definition:
        "That structure has a name: recursion. Recursion is something defined in terms of a smaller version of itself, with a rule for when to stop. You just felt both parts: the recursive case that keeps going, and the base case that ends it.",
    },

    // 2.5 Define + motivate: what recursion is, why it matters, where you see it.
    why: {
      id: "why",
      title: "What is recursion and where will I find it?",
      definition:
        "Recursion: a function that solves a problem by calling itself on a smaller version of the same problem, until it reaches a case simple enough to answer directly.",
      why: "It is how we handle anything that nests, or breaks into smaller copies of itself. Once you can write one, a whole class of problems gets simple. You describe one step and the stopping point, and the repetition takes care of itself.",
      instruction: "Tap each one. Notice the same shape: a thing that contains a smaller version of itself.",
      apps: [
        { id: "folders", label: "Folders inside folders", hint: "a folder can hold folders, which hold more folders" },
        { id: "threads", label: "Reply threads", hint: "a comment has replies, and each reply can have replies" },
        { id: "nature", label: "Patterns in nature", hint: "trees, ferns, lungs, the same branch shape at every scale" },
        { id: "divide", label: "Divide and conquer", hint: "to search a sorted list, check the middle, then search the smaller half the same way" },
      ],
    },

    // 3. Code: countdown, chunked, then predict the output.
    code: {
      id: "code",
      title: "Writing a recursive function in Python.",
      intro:
        "Every recursive function follows the same recipe. Learn the recipe once, and you can write any of them.",
      cardsLead: "Hover or tap a step to highlight it in the code below.",
      recipe: [
        {
          id: "base",
          highlight: "base",
          step: "1. Base case",
          text: "The stopping point: the one input simple enough to answer on the spot, with no more calls. Without it, the function never stops.",
          snippet: "if n <= 0:",
        },
        {
          id: "recursive",
          highlight: "recursive",
          step: "2. Recursive case",
          text: "The part that calls itself. It does one small piece of the work, then calls the same function on a smaller input.",
          snippet: "countdown(n - 1)",
        },
        {
          id: "move",
          highlight: "move",
          step: "3. Move toward the base",
          text: "Each call must shrink the input toward the base case. Here that is n - 1, so every call heads to 0 and the stop is reached.",
          snippet: "n - 1",
        },
      ],
      buildIntro:
        "Let us use the recipe to write `countdown(n)`: it counts down from `n` to zero, printing each step. Write each part, then predict what it prints.",
      // The function as structured lines: the single source for the live code
      // panel. `part` groups lines for the reveal and the card highlighting;
      // `move` marks the token that is the step toward the base case.
      codeLines: [
        { text: "def countdown(n):", part: "signature" },
        { text: "    if n <= 0:", part: "base" },
        { text: '        print("Go!")', part: "base" },
        { text: "    else:", part: "recursive" },
        { text: "        print(n)", part: "recursive" },
        { text: "        countdown(n - 1)", part: "recursive", move: "n - 1" },
      ],
      chunks: [
        {
          part: "signature",
          label: "The signature",
          note: "`def` means here comes a new function. It takes one input, `n`, the number we start from.",
        },
        {
          part: "base",
          label: "The base case",
          note: "This is the base case: the stopping point. When `n` reaches `0` (or less), the function prints `Go!` and does not call itself again, so the recursion ends right here.",
        },
        {
          part: "recursive",
          label: "The recursive case",
          note: "This is the recursive case: print `n`, then call `countdown` again. The `n - 1` is the move toward the base case: each call shrinks `n` by one, so it steps closer to `0` every time.",
        },
      ],
      full: "def countdown(n):\n    if n <= 0:\n        print(\"Go!\")\n    else:\n        print(n)\n        countdown(n - 1)",
      predict: {
        prompt: "If we call `countdown(n)` with n = 3, that runs `countdown(3)`. What does it print, in order?",
        blanks: ["3", "2", "1", "Go!"],
        labels: ["First print", "Second print", "Third print", "Fourth print"],
        correctNote:
          "Right. The function prints n first, then calls itself, so the numbers print on the way in, and Go! prints at the base case.",
        wrongNote:
          "Not quite. countdown(3) prints 3 then calls countdown(2), which prints 2, then countdown(1) prints 1, then countdown(0) is the base case and prints Go!.",
      },
    },

    // 4. Mental model: the call stack (countdown).
    callStack: {
      id: "call-stack",
      title: "Wait, what is a call stack?",
      framing:
        "The **call stack** is Python's memory of what is running. Each call is a plate stacked on top, holding its own value of `n`. The top plate is the function running right now. It is last in, first out: the plate added last is the first one removed.",
      dek: "Every call waits while the one below it runs. Press Step and watch the calls stack up, hit the base case, then finish in reverse.",
      glossaryLead: "Two words you will see a lot:",
      glossary: [
        {
          term: "Calls and waits",
          def: "To call a function is to run it. While that inner call runs, the function that called it pauses and waits, holding its place until the answer comes back.",
        },
        {
          term: "Returns",
          def: "When a function finishes, it returns: it hands its result back to whoever called it, and that waiting call picks up right where it left off.",
        },
      ],
      nRange: [2, 3, 4, 5] as const,
      defaultN: 3,
      captions: {
        ready: (n: number) => `Ready. Press Step to call \`countdown(${n})\`.`,
        call: (k: number) =>
          k <= 0
            ? "`countdown(0)` is the base case. It prints `Go!` and returns. No more calls."
            : `\`countdown(${k})\` prints \`${k}\`, then calls \`countdown(${k - 1})\` and waits.`,
        ret: (k: number) =>
          `\`countdown(${k})\` is done and returns. The call that was waiting can now finish.`,
        result: "Done. Output printed on the way in: the numbers, then `Go!`.",
      },
    },

    // 4.5 Teach the error before the assessment.
    noBaseCase: {
      id: "no-base-case",
      title: "What if there is no base case?",
      intro:
        "The dolls always had a smallest one. But what if a function never stops? Here is `countdown` with the base case removed.",
      broken: "def countdown_broken(n):\n    print(n)\n    countdown_broken(n - 1)   # no base case",
      brokenNote: "No `if`. No stopping condition. Every call just calls the next one. Nothing ever returns.",
      run: "Run countdown_broken(3)",
      running: (n: number) => `countdown_broken(${n})`,
      traceback:
        'Traceback (most recent call last):\n  File "countdown.py", line 3, in countdown_broken\n    countdown_broken(n - 1)\n  [Previous line repeated 996 more times]\nRecursionError: maximum recursion depth exceeded',
      reframe:
        "This is not a sign you broke something. Python limits recursion to about 1,000 calls by design, to protect your computer's memory. It is a safety net. Python is telling you something useful: your function did not know when to stop.",
      fixIntro: "The fix is the base case you already know. One `if` statement is all it takes.",
      fixed:
        'def countdown_fixed(n):\n    if n <= 0:        # base case: stop here\n        print("Go!")\n    else:\n        print(n)\n        countdown_fixed(n - 1)',
    },

    // 5. Payoff: the fractal tree.
    fractal: {
      id: "fractal",
      title: "Recursion draws the world",
      teach:
        "One last idea, then you play. A fractal is a shape built from a single rule repeated at smaller and smaller scales. The rule for a tree: draw a branch, then draw two smaller branches from its tip, and do the same thing to each of those. `depth` is the base case. When `depth` reaches zero, the branching stops. That repeating-at-smaller-scale property is called self similarity.",
      intro: "Now drag the sliders and grow your own. The same rule, a branch that splits into two smaller branches, draws all of this.",
      prompt: "Why does this look like a real tree?",
      explain:
        "Because that is how trees actually grow. Mandelbrot called shapes built from the same rule at smaller and smaller scales fractals. The key property is self similarity: zoom into any part and you find the same structure. The depth slider is the base case. When depth reaches zero, the branching stops.",
      nature:
        "The same rule appears in your lungs, in ferns, in river deltas, in snowflakes. Da Vinci sketched the math of tree branching around 1508, about 467 years before the word fractal existed.",
      codeBase: "def draw_branch(length, depth):\n    if depth == 0:\n        return",
      codeRec: "    draw_branch(length * 0.7, depth - 1)\n    draw_branch(length * 0.7, depth - 1)",
      codeNote:
        "There it is again. When `depth` hits zero, `return` and stop. Otherwise, two smaller branches at 70 percent length, one level deeper. Left and right. That is the whole tree.",
      presets: [
        { id: "sapling", label: "Sapling", depth: 4, angle: 20, ratio: 68, lean: 0, leaves: true },
        { id: "oak", label: "Oak", depth: 8, angle: 28, ratio: 73, lean: 0, leaves: true },
        { id: "windswept", label: "Windswept", depth: 7, angle: 32, ratio: 78, lean: 18, leaves: true },
      ],
      randomize: "Surprise me",
    },

    // 6. Assessment finale.
    quiz: {
      id: "quiz",
      title: "Check what you learned",
      intro: "Three quick checks, then say it in your own words. This is how we know it clicked.",
      questions: [
        {
          id: "base-case-check",
          kind: "mc-code" as const,
          prompt: "Which of these functions is missing a base case?",
          options: [
            {
              key: "A",
              code: 'def countdown(n):\n    if n <= 0:\n        print("Go!")\n    else:\n        print(n)\n        countdown(n - 1)',
              correct: false,
              feedback:
                "Option A has a working base case: if n <= 0 it prints Go! and does not call itself again. This function stops.",
            },
            {
              key: "B",
              code: "def countdown(n):\n    print(n)\n    countdown(n - 1)",
              correct: true,
              feedback:
                "Right. There is no if check at all. Every call immediately calls countdown(n - 1) with no condition. Without a base case it calls itself until Python hits its recursion limit.",
            },
            {
              key: "C",
              code: "def countdown(n):\n    if n == 0:\n        return\n    countdown(n - 1)",
              correct: false,
              feedback:
                "Option C has a base case: if n == 0 it returns without calling itself again. It stops, even though it prints nothing useful.",
            },
            {
              key: "D",
              code: 'def countdown(n):\n    if n < 0:\n        print("Done")\n    else:\n        print(n)\n        countdown(n - 1)',
              correct: false,
              feedback:
                "Option D has a base case: if n < 0 it prints Done and does not recurse. It stops.",
            },
          ],
        },
        {
          id: "recursive-case-check",
          kind: "mc-text" as const,
          prompt: "What happens if you call `countdown_broken(5)`, where it has no base case?",
          options: [
            {
              key: "A",
              text: "It prints 5, 4, 3, 2, 1 and then stops on its own",
              correct: false,
              feedback:
                "Functions do not stop on their own without a base case. There is nothing telling it when to stop, so no call ever returns.",
            },
            {
              key: "B",
              text: "Python gives you a RecursionError: maximum recursion depth exceeded",
              correct: true,
              feedback:
                "Exactly. Python limits recursion to about 1,000 calls by design and stops the program with a RecursionError, protecting your memory. Python is doing its job.",
            },
            {
              key: "C",
              text: "Python keeps running forever and you have to restart your computer",
              correct: false,
              feedback:
                "Python will not run forever. It stops after about 1,000 calls with a RecursionError. Your computer is safe.",
            },
            {
              key: "D",
              text: "The function prints nothing and exits silently",
              correct: false,
              feedback:
                "It does print, and not just 5 numbers. It prints past 0 into negative numbers until Python stops it with a RecursionError.",
            },
          ],
        },
        {
          id: "trace-countdown",
          kind: "fill" as const,
          prompt: "Call `countdown(3)`. What gets printed, in order?",
          labels: ["First print", "Second print", "Third print", "Fourth print"],
          answers: ["3", "2", "1", "Go!"],
          feedbackCorrect:
            "Exactly right. The output is produced on the way in to the deepest call, not on the way back out.",
          feedbackIncorrect:
            "Not quite. countdown(3) prints 3, then countdown(2) prints 2, then countdown(1) prints 1, then countdown(0) is the base case and prints Go!.",
        },
      ],
      reflection: {
        prompt: "In one sentence, explain recursion to someone who has never heard of it. Your words.",
        placeholder: "Aim for one sentence, clear and specific.",
        instruction:
          "After you write it, check it against the rubric. There is no right phrasing. What matters is whether your sentence captures two ideas: something that calls itself, and something that knows when to stop.",
        rubric: [
          {
            level: "Excellent",
            criteria:
              "Captures self reference (the thing calls itself or contains a smaller version of itself) AND a stopping condition (it ends when something happens). Both ideas are present.",
          },
          {
            level: "Good",
            criteria: "Captures one of the two: either self reference or a stopping condition, but not both.",
          },
          {
            level: "Keep going",
            criteria:
              "Describes plain repetition or a loop without self reference, or uses the word recursion to define itself.",
          },
        ],
      },
    },
  },
} as const;
