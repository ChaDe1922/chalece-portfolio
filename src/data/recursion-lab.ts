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
      title: "Inside Recursion",
      meta: "Interactive lesson · about 6 minutes · no setup",
      promise:
        "In this short hands-on lesson, you will explore recursion by moving through nested patterns, naming the parts that make recursion work, building a recursive function in Python, watching it run, and checking what you learned.",
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
      title: "Step into recursion",
      lead: "Have you ever looked into two mirrors facing each other?",
      intro:
        "Each mirror shows the whole scene again, but smaller. Then that smaller scene appears again inside itself, and again after that. The pattern does not spread out across the room. It moves inward.",
      instruction:
        "Use the **Step inside** and **Step back out** buttons to travel through a tunnel of nested reflections. Watch the depth change as each new reflection appears inside the one before it.",
      maxDepth: 7,
      stepIn: "Step inside",
      stepOut: "Step back out",
      prompt:
        "A reflection inside a smaller version of itself is a visual example of recursion. In this lesson, you will learn how that same idea shows up in code.",
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
      title: "The two rules of recursion",
      teachLead:
        "A program cannot repeat forever. To make recursion useful, it needs two parts: one part that keeps the pattern going, and one part that tells it when to stop.",
      interactLead:
        "Now open the nested dolls and watch both parts happen. Each doll holds a smaller one, which is the recursive case, until you reach the smallest doll with nothing inside, which is the base case.",
      intro:
        "Something that never stops is useless in a program. Open these nested dolls. Each one holds a smaller one, until you reach a doll with nothing inside.",
      openInstr: "Open each doll to find the smaller one inside.",
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
          text: "The smallest doll. There is nothing left to open, so the answer is already known. Stop here. Without a base case, the dolls would keep opening forever.",
        },
        {
          id: "recursive",
          term: "Recursive case",
          text: "Every bigger doll. Each one contains a smaller version of itself, and each step moves closer to the base case.",
        },
      ],
      definition:
        "This structure is called recursion. Recursion means something is defined using a smaller version of itself, with a clear rule for when to stop.",
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
      recap:
        "Remember the two rules: a **recursive case** that keeps going, and a **base case** that stops it. The **base case** is the stop sign that keeps a recursion from running forever. Take it away and nothing tells the calls to stop.",
      intro:
        "The dolls always had a smallest one. But what if a function never stops? Here is `countdown` with the base case removed.",
      broken: "def countdown_broken(n):\n    print(n)\n    countdown_broken(n - 1)   # no base case",
      brokenNote:
        "There is no `if`, so there is no condition to check. And with no condition, nothing ever tells the function to stop. Every call just calls the next one, and none of them ever returns.",
      runLead: "Press Run and watch the calls pile up.",
      expectNote:
        "Heads up: we expect a RecursionError here, on purpose. With no base case the calls never stop, so Python steps in. Watch the stack of calls grow until it crashes.",
      run: "Run countdown_broken(3)",
      running: (n: number) => `countdown_broken(${n})`,
      traceback:
        'Traceback (most recent call last):\n  File "countdown.py", line 3, in countdown_broken\n    countdown_broken(n - 1)\n  [Previous line repeated 996 more times]\nRecursionError: maximum recursion depth exceeded',
      reframe:
        "This is not a sign you broke something. Python limits recursion to about 1,000 calls by design, to protect your computer's memory. It is a safety net. Python is telling you something useful: your function did not know when to stop.",
      fixIntro:
        "We already know the solution to this problem. An `if` statement gives us our base case: our smallest acceptable input, `n <= 0`, the point where the answer is known and the function stops instead of calling itself again.",
      fixed:
        'def countdown_fixed(n):\n    if n <= 0:        # base case: stop here\n        print("Go!")\n    else:\n        print(n)\n        countdown_fixed(n - 1)',
      fixedLines: [
        { text: "def countdown_fixed(n):" },
        { text: "    if n <= 0:        # base case: stop here", base: true },
        { text: '        print("Go!")', base: true },
        { text: "    else:" },
        { text: "        print(n)" },
        { text: "        countdown_fixed(n - 1)" },
      ],
    },

    // 5. Payoff: the fractal tree.
    fractal: {
      id: "fractal",
      title: "Recursion draws the world around us",
      teachLead:
        "Let's explore one last idea. A **fractal** is a shape built from a single rule repeated at smaller and smaller scales.",
      stepsLead: "The fractal rule for a tree could be:",
      steps: [
        "Draw a branch.",
        "From its tip, draw two smaller, angled branches.",
        "Do the same thing to each of those.",
        "Stop when `depth` reaches zero, the base case.",
      ],
      selfSimilar:
        "Repeating the same rule at smaller and smaller scales is called self similarity.",
      intro:
        "Now, let's grow our own tree. Drag the sliders to shape it, then drag the tree to rotate around it.",
      prompt: "Why does this look like a real tree?",
      nature:
        "Because recursion, like fractals, draws the world around us. The same rule appears in your lungs, in ferns, in river deltas, in snowflakes. Da Vinci sketched the math of tree branching around 1508, about 467 years before the word fractal existed.",
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
      intro: "A few quick checks, then say it in your own words. This is how we know it clicked.",
      questions: [
        {
          id: "base-case-check",
          kind: "mc-code" as const,
          objective: "Spot the two parts every recursion needs: a base case and a recursive case.",
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
          objective: "Predict what happens when the base case is missing.",
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
          objective: "Write and trace a simple recursive function in Python.",
          prompt: "Call `countdown(3)`. What gets printed, in order?",
          labels: ["First print", "Second print", "Third print", "Fourth print"],
          answers: ["3", "2", "1", "Go!"],
          feedbackCorrect:
            "Exactly right. The output is produced on the way in to the deepest call, not on the way back out.",
          feedbackIncorrect:
            "Not quite. countdown(3) prints 3, then countdown(2) prints 2, then countdown(1) prints 1, then countdown(0) is the base case and prints Go!.",
        },
        {
          id: "define-recursion",
          kind: "mc-text" as const,
          objective: "Explain what recursion is, in plain language.",
          prompt: "Last one. Which of these best describes recursion?",
          options: [
            {
              key: "A",
              text: "A function that solves a problem by calling itself on a smaller version of the same problem, until it reaches a base case it can answer directly.",
              correct: true,
              feedback:
                "That is it. Recursion is self reference with a stopping point: it calls itself on something smaller until it hits a base case. You have got it.",
            },
            {
              key: "B",
              text: "A loop that repeats a block of code a fixed number of times.",
              correct: false,
              feedback:
                "That describes a loop. Recursion does not count out a fixed number of repeats: it calls itself on a smaller input until it reaches a base case.",
            },
            {
              key: "C",
              text: "A function that calls a different helper function to finish its work.",
              correct: false,
              feedback:
                "Close, but the key is that a recursive function calls itself, not a different function, and it shrinks the problem each time until a base case stops it.",
            },
            {
              key: "D",
              text: "Code that keeps running until you force it to stop.",
              correct: false,
              feedback:
                "That is recursion without a base case, which crashes. Real recursion has a base case so it stops on its own.",
            },
          ],
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

    // 7. Conclusion: wrap the lesson and offer contact.
    outro: {
      id: "outro",
      title: "That is recursion.",
      lead: "You stepped into a mirror, opened the dolls, wrote `countdown` in Python, watched the call stack, broke it on purpose, then grew a fractal tree. That is the whole idea: something defined in terms of a smaller version of itself, with a base case that stops it.",
      recapLead: "What you can do now:",
      recap: [
        "Explain what recursion is, in plain language.",
        "Spot the base case and the recursive case.",
        "Write and trace a simple recursive function in Python.",
        "Describe the call stack, and why a base case is required.",
        "Predict the RecursionError when the base case is missing.",
      ],
      contactLead:
        "I am Chalece DeLaCoudray, a learning experience designer and technologist. If this is the kind of learning you want to build, let's talk.",
      backToPortfolio: "Back to portfolio",
      resume: "Download resume",
      byline: "Thanks for playing.",
    },
  },
} as const;
