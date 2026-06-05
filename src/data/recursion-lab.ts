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
    // 1. Hook: self-reference, before the word "recursion".
    mirror: {
      id: "mirror",
      title: "Have you ever seen yourself forever?",
      intro:
        "Two mirrors facing each other make a hallway of you, each smaller than the last, going inward until they vanish. Step inside and look.",
      maxDepth: 7,
      stepIn: "Step inside",
      stepOut: "Step back out",
      prompt: "What do you notice? Each reflection sits inside the one before it. It goes inward, not sideways.",
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
    },

    // 3. Code: countdown, chunked, then predict the output.
    code: {
      id: "code",
      title: "Your first recursive function",
      intro:
        "Here is that same idea in Python. We build the countdown function one piece at a time. Reveal each piece, then predict what it prints.",
      chunks: [
        {
          label: "The signature",
          code: "def countdown(n):",
          note: "def means here comes a new function. It takes one input, n, the number we start from.",
        },
        {
          label: "The base case",
          code: "    if n <= 0:\n        print(\"Go!\")",
          note: "When n reaches 0, stop calling and just answer. This check runs first, every time.",
        },
        {
          label: "The recursive case",
          code: "    else:\n        print(n)\n        countdown(n - 1)",
          note: "Print n, then call countdown again with n - 1. Each call gets one step closer to the base case.",
        },
      ],
      full: "def countdown(n):\n    if n <= 0:\n        print(\"Go!\")\n    else:\n        print(n)\n        countdown(n - 1)",
      predict: {
        prompt: "Call countdown(3). What gets printed, in order?",
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
      dek: "Every call waits while the one below it runs. Press Step and watch the calls stack up, hit the base case, then finish in reverse. Last in, first out.",
      nRange: [2, 3, 4, 5] as const,
      defaultN: 3,
      captions: {
        ready: (n: number) => `Ready. Press Step to call countdown(${n}).`,
        call: (k: number) =>
          k <= 0
            ? "countdown(0) is the base case. It prints Go! and returns. No more calls."
            : `countdown(${k}) prints ${k}, then calls countdown(${k - 1}) and waits.`,
        ret: (k: number) =>
          `countdown(${k}) is done and returns. The call that was waiting can now finish.`,
        result: "Done. Output printed on the way in: the numbers, then Go!.",
      },
    },

    // 5. Payoff: the fractal tree.
    fractal: {
      id: "fractal",
      title: "Recursion draws the world",
      intro: "Drag the sliders. The same rule, a branch that splits into two smaller branches, draws this.",
      prompt: "Why does this look like a real tree?",
      explain:
        "Because that is how trees actually grow. Mandelbrot called shapes built from the same rule at smaller and smaller scales fractals. The key property is self similarity: zoom into any part and you find the same structure. The depth slider is the base case. When depth reaches zero, the branching stops.",
      nature:
        "The same rule appears in your lungs, in ferns, in river deltas, in snowflakes. Da Vinci sketched the math of tree branching around 1508, about 467 years before the word fractal existed.",
      codeBase: "def draw_branch(length, depth):\n    if depth == 0:\n        return",
      codeRec: "    draw_branch(length * 0.7, depth - 1)\n    draw_branch(length * 0.7, depth - 1)",
      codeNote:
        "There it is again. When depth hits zero, return and stop. Otherwise, two smaller branches at 70 percent length, one level deeper. Left and right. That is the whole tree.",
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
          prompt: "What happens if you call countdown_broken(5), where it has no base case?",
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
          prompt: "Call countdown(3). What gets printed, in order?",
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
