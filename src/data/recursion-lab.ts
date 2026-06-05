// Single source of truth for the Recursion Lab (/lab/recursion). All copy,
// captions, and answers live here. Teaching style: instruction-driven,
// manipulatives before code. No em dashes anywhere.

export const N_RANGE = [2, 3, 4, 5, 6] as const;
export const DEFAULT_N = 4;

export function factorial(k: number): number {
  return k <= 1 ? 1 : k * factorial(k - 1);
}

/** Call-stack slide captions, ported verbatim from the prototype. */
export const callStackCaptions = {
  ready: (n: number) => `Ready. Press Step to call factorial(${n}).`,
  call: (k: number) =>
    k === 1
      ? "factorial(1) is the base case. No more questions, the answer is just 1."
      : `factorial(${k}) cannot finish yet. It needs factorial(${k - 1}) first, so it waits.`,
  ret: (k: number) =>
    k === 1
      ? "factorial(1) hands back 1. Now the waiting calls can finish, one at a time."
      : `factorial(${k}) = ${k} x factorial(${k - 1}) = ${factorial(k)}.`,
  result: (n: number) => `factorial(${n}) = ${factorial(n)}`,
};

export const recursionLab = {
  meta: {
    title: "Recursion, watch it run.",
    description:
      "An interactive lesson by Chalece DeLaCoudray. Play with recursion, build the function yourself, then watch it run.",
  },
  slides: {
    // Slide 1: concrete manipulative, no code.
    shrink: {
      id: "shrink-it",
      title: "Make it smaller, then build it back.",
      sub: "Open each box until one is too small to open. That smallest box is where recursion stops.",
      maxN: 4,
      instructionOpen: "Drag the top box aside to open the next smaller one.",
      instructionBuild: "Now stack the answers back up.",
      baseLabel: "smallest: nothing left to open, the answer is just 1",
      doneLabel: "That is recursion: shrink to the smallest, then build the answer back up.",
    },
    // Slide 2: name the two parts.
    match: {
      id: "two-parts",
      instruction: "Every recursion needs exactly two things. Drag each into place.",
      slots: [
        { id: "stop", label: "When to stop", term: "base case" },
        { id: "shrink", label: "How to shrink", term: "recursive case" },
      ],
      chips: [
        { id: "c-stop", text: "the smallest box, answer is just 1", fits: "stop" },
        { id: "c-shrink", text: "every bigger box: open the next, then combine", fits: "shrink" },
      ],
      wrongHint: "Not quite. Think about which one ends the opening, and which keeps it going.",
    },
    // Slide 3: build the function (code).
    build: {
      id: "build",
      instruction: "Build factorial. Drag the right line into each slot.",
      signature: "function factorial(n) {",
      close: "}",
      slots: [
        { id: "base", label: "base case" },
        { id: "recursive", label: "recursive case" },
      ],
      blocks: [
        { id: "b-base", code: "if (n <= 1) return 1;", fits: "base", hint: "" },
        { id: "b-rec", code: "return n * factorial(n - 1);", fits: "recursive", hint: "" },
        {
          id: "d-norec",
          code: "return n * factorial(n);",
          fits: null,
          hint: "That never gets smaller, so it never stops.",
        },
        {
          id: "d-zero",
          code: "if (n == 0) return 0;",
          fits: null,
          hint: "factorial(1) is 1, not 0. That base value is wrong.",
        },
      ],
      success: "You built it. Now watch it run.",
    },
    // Slide 4: call-stack visualizer (built component reads dek + captions).
    callStack: {
      id: "call-stack",
      title: "Now watch the calls stack up.",
      dek: "Here is the function you built, running. Press Step and watch each call wait for a smaller one, hit the base case, then build the answer back up.",
    },
    // Slide 5: predict the output.
    predict: {
      id: "predict",
      title: "You already know enough. Predict the output.",
      instruction: "Before you peek, pick the answer.",
      expr: "factorial(4) = 4 x 3 x 2 x 1",
      options: [
        { value: 24, correct: true },
        { value: 12, correct: false },
        { value: 10, correct: false },
      ],
      why: "4 x 3 x 2 x 1 = 24. Each call multiplies n by the answer to the next smaller one.",
      reflect: {
        q: "How would you stop factorial?",
        model: "Return 1 when n is 1 or less. That is the base case, the line that ends the calls.",
      },
    },
    // Slide 6: everywhere + close.
    close: {
      id: "close",
      title: "Once you see it, recursion is everywhere.",
      instruction: "Tap each to spot the same shape.",
      cards: [
        { id: "list", label: "A nested list", hint: "a list inside a list inside a list" },
        { id: "folders", label: "Folders in folders", hint: "each folder can hold more folders" },
        { id: "search", label: "A search that splits", hint: "halve the problem, then halve the half" },
      ],
      footer: "Made by Chalece DeLaCoudray, who builds interactive learning like this.",
    },
  },
} as const;
