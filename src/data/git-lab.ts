// Single source of truth for the Git Internals Lab (/lab/git): a complete,
// taught lesson that a non-coder can follow and a senior engineer will trust.
//
// Anchor metaphor: a commit is a PHOTO of the whole project, history is a
// TIMELINE of photos, a branch is a LABEL stuck on a photo. Every concept is
// taught twice: a plain-language line, then the precise mechanic (in `teach`),
// with optional "under the hood" asides (`curious`) for the precise nuances a
// sharp reviewer checks. No em dashes anywhere.
//
// Prose, command labels, captions, and quiz content live here. Graph topology
// per step is structural logic and lives in the slide components.

export const gitLab = {
  meta: {
    title: "Git internals, made visible.",
    description:
      "An interactive Git lesson by Chalece DeLaCoudray. Take snapshots on a timeline, time travel back, then see what Git really does underneath: snapshots, pointers, and the commit graph, including merge versus rebase. Beginner friendly, technically honest.",
    ogTitle: "Git internals, made visible. An interactive lesson by Chalece DeLaCoudray.",
  },

  slides: {
    // 0. Cover.
    intro: {
      id: "start",
      title: "Git, one photo at a time",
      meta: "Interactive lesson · about 10 minutes · beginner friendly · no setup",
      promise:
        "Whether you have used Git for years or have never opened a terminal, this lesson shows you what Git actually does, by letting you do it. The trick is one idea: every time you save, Git takes a photo of your whole project. Once you can see the photos, branches, merges, and rebases all make sense.",
      objectivesLead: "By the end, you will be able to:",
      objectives: [
        "Take snapshots of your work and travel back to any earlier one.",
        "Explain what a commit really is: a full photo of your files, not a list of changes.",
        "See a branch for what it is: a movable label, not a copy of your files.",
        "Read a commit timeline by following HEAD to a branch to a photo and the photo before it.",
        "Tell merge and rebase apart, and know which one is safe to use when.",
      ],
      begin: "Start with a snapshot",
      byline: "An interactive lesson by Chalece DeLaCoudray",
    },

    // 1. NEW on-ramp: experience version history before any jargon.
    whyGit: {
      id: "why-git",
      title: "Your work, on a timeline you can return to",
      lead: "Before any commands, let us feel the one thing Git gives you: a timeline of your work that you can walk back through.",
      intro:
        "Below is a single file. Change it, then take a snapshot. Each snapshot is frozen and kept forever. Take a few, then click an older one to travel back and see exactly what your file looked like at that moment.",
      instruction: "Try it: make an edit, take a snapshot, repeat. Then click an earlier snapshot to time travel.",
      fileName: "trip-plan.md",
      versions: [
        "# Trip plan\n\n- Pick dates",
        "# Trip plan\n\n- Pick dates\n- Book the flight",
        "# Trip plan\n\n- Pick dates\n- Book the flight\n- Reserve a hotel",
        "# Trip plan\n\n- Pick dates\n- Book the flight\n- Reserve a hotel near the beach\n- Make a packing list",
      ],
      editLabel: "Make an edit",
      snapshotLabel: "Take a snapshot",
      latestLabel: "Back to the latest",
      resetLabel: "Start over",
      photoLabel: (n: number) => `Snapshot ${n}`,
      captions: {
        start: "An empty timeline. Make an edit, then take your first snapshot.",
        edited: "You changed the file. The change is not saved to the timeline until you take a snapshot.",
        snapped: (n: number) => `Snapshot ${n} is frozen on the timeline. It will never change.`,
        viewing: (n: number) => `Time traveling: this is exactly how the file looked at snapshot ${n}.`,
        latest: "Back to your latest work.",
      },
      takeHint: "Take at least two snapshots, then click an earlier one to travel back.",
      reveal:
        "That timeline is the heart of Git, and **Git calls each snapshot a commit**. The rest of this lesson is just a closer look at what a commit is and how the timeline grows.",
    },

    // 2. Snapshot, not a diff.
    snapshot: {
      id: "snapshot",
      title: "A commit is a photo, not a diff",
      lead: "You just took snapshots. Here is the surprising part of how Git stores them.",
      teach:
        "Each commit is a **full photo of every tracked file**, not a list of the lines you changed. That sounds wasteful, but it is cheap: Git saves each unique file once, keyed by its content, and a photo just points to the files it needs. Change one file and Git stores the new version once. The files that did not change are **reused**, not copied again.",
      instruction:
        "Take a photo, then change one file and take another. Watch what the second photo stores fresh and what it reuses.",
      files: [
        { name: "app.js", blob: "9e1c" },
        { name: "README.md", blob: "b42a" },
        { name: "styles.css", blob: "7c80" },
      ],
      editedFile: "README.md",
      editedBlob: "f30d",
      commitLabel: "Take a photo (commit)",
      editLabel: "Edit README.md",
      resetLabel: "Start over",
      cleanNote: "Working files are clean. Nothing new to photograph.",
      dirtyNote: "README.md changed. Its new content gets a new id.",
      newTag: "new",
      reuseTag: "reused",
      snapshotLabel: (n: number) => `Photo ${n}`,
      treeLead: "Points to each file's content",
      insight:
        "Two photos, one changed file. Git stored the new content once and pointed the second photo at the files that stayed the same. Snapshots, deduplicated by content. A diff is something Git works out later, on demand, by comparing two photos.",
      curiousTitle: "For the curious: does Git really copy everything?",
      curiousBody:
        "Conceptually yes, every commit is a complete snapshot. On disk, Git later compresses storage with delta packfiles, so it does not waste space. The mental model you reason with is still snapshots, and that model is correct.",
    },

    // 3. The commit object.
    commitObject: {
      id: "commit-object",
      title: "What is inside a photo",
      lead: "A commit is a little labeled box. Tap each part to see what it holds.",
      teach: "Four things go in the box, and together they make the photo findable and trustworthy.",
      parts: [
        {
          id: "tree",
          term: "tree",
          text: "The photo itself: a pointer to the exact set of files and their content this commit captured.",
        },
        {
          id: "parent",
          term: "parent",
          text: "The id of the photo that came right before this one. The very first commit has no parent.",
        },
        {
          id: "author",
          term: "author + date",
          text: "Who took the photo and when.",
        },
        {
          id: "message",
          term: "message",
          text: "Your short note about what changed and why. The thing your future self reads.",
        },
      ],
      hashLead: "Run the box through a hash",
      hashNote:
        "Feed all four through a hash function and out comes the **commit id**, the short code like `a1c3f9` you see in `git log`.",
      idInitial: "a1c3f9",
      idAfterEdit: "7f20b1",
      changeMessageLabel: "Change the message and re-hash",
      resetLabel: "Reset",
      tamperNote:
        "Change one character of the message and the id changes completely. Because the id is built from everything inside, you cannot quietly alter a commit. This is what people mean when they say Git history is tamper evident.",
      instruction: "Now add a couple more photos and watch the timeline form, each one pointing back to the one before it.",
      addLabel: "Add a photo",
      chainHint: "Each photo points back to the one before it.",
      insight:
        "A commit is a snapshot plus a pointer to its parent plus a little metadata, all sealed with a hash. That is the whole object. Everything else in Git is built from these.",
    },

    // 4. The reveal: a branch is a pointer.
    branch: {
      id: "branch",
      title: "A branch is a label you can move",
      lead: "Here is the part that surprises people.",
      teach:
        "A branch is **not** a copy of your files, and it is not a folder. It is a sticky label that names one photo: literally the id of one commit. `main` is just a label sitting on the latest photo. `HEAD` is a second marker that says which label you are on right now.",
      instruction:
        "You are on `main`. Take a photo and watch the `main` label slide forward on its own. Then add a `feature` label to the same photo, with nothing copied.",
      commitLabel: "git commit",
      branchLabel: "git branch feature",
      switchFeatureLabel: "git switch feature",
      switchMainLabel: "git switch main",
      resetLabel: "Reset",
      caption: {
        start: "You are on `main`, a label on photo `c3`. HEAD points at `main`.",
        committed: "New photo. The `main` label slid forward to it, and HEAD came along.",
        committedFeature: (id: string) => `New photo ${id} on feature. Only the feature label moved; main stayed put.`,
        branched: "`git branch feature` wrote one tiny label pointing at the current photo. No files were copied.",
        switchedFeature: "HEAD now points at `feature`. Switching is just moving the HEAD marker.",
        switchedMain: "HEAD is back on `main`. Same photos, different label.",
      },
      doneHint: "Take a photo and create the feature label to continue.",
      insight:
        "Creating a branch wrote a few bytes. Switching branches just moved a marker. That is why branching in Git is instant: there is almost nothing to copy.",
      curiousTitle: "For the curious: where does the label live?",
      curiousBody:
        "A branch is a one line file under `.git/refs/heads/`, containing a commit id. `HEAD` is usually a file that says `ref: refs/heads/main`. That is the entire machinery.",
    },

    // 5. Reading the graph.
    graph: {
      id: "graph",
      title: "Reading the timeline",
      lead: "Put the pieces together and you can read any Git history.",
      teach:
        "Photos point back to the photo before them. Branches are labels on photos. `HEAD` says which label you are on. That is all `git log --graph` is showing you.",
      instruction:
        "Press Trace to walk the pointers: HEAD to a branch, the branch to its photo, the photo to its parent. Or hover and tap any photo to light up the one it points back to.",
      walkLabel: "Trace from HEAD",
      walkResetLabel: "Reset",
      readout: (commit: string, parent: string | null) =>
        parent
          ? `Photo ${commit} points back to its parent ${parent}.`
          : `Photo ${commit} is the first one. It has no parent.`,
      walkCaptions: {
        head: "HEAD points at the `feature` label.",
        branch: "`feature` points at photo `e5`.",
        commit: "`e5` points back to its parent `d4`.",
        parent: "`d4` points back to `c3`, the photo both branches share.",
      },
      insight:
        "Read it out loud: HEAD is on `feature`, `feature` is a label on photo `e5`, and `e5`'s parent is `d4`. No magic, just labels and parents.",
    },

    // 6. Divergence.
    diverge: {
      id: "diverge",
      title: "Two timelines from one photo",
      lead: "Real work splits into parallel tracks.",
      teach:
        "You add a `feature` label and start taking photos on it, while `main` keeps taking its own. Soon both labels share an older photo but each have newer ones the other does not. That fork is a **divergence**, and it is the setup for every merge and rebase.",
      instruction: "Run the commands in order and watch the timeline fork into two tracks.",
      laneLabels: { main: "main track", feature: "feature track" },
      steps: [
        { cmd: "git switch -c feature", caption: "Added a `feature` label at `c3` and moved HEAD onto it." },
        { cmd: "git commit", caption: "Took photo `d4` on the feature track." },
        { cmd: "git commit", caption: "Took photo `e5` on the feature track. Feature is now two ahead." },
        { cmd: "git switch main", caption: "Switched back to `main`. HEAD moved; the files changed back." },
        { cmd: "git commit", caption: "Took photo `f6` on the main track. The tracks have now diverged." },
      ],
      nextLabel: "Run next command",
      resetLabel: "Reset",
      doneCaption: "Done. `main` and `feature` share photo `c3`, but each moved past it on its own track.",
      insight:
        "Both labels have moved past their shared photo `c3`. To bring the tracks back together you have two tools, and they behave very differently: merge and rebase.",
    },

    // 7. Merge (stepped).
    merge: {
      id: "merge",
      title: "Merge: join the tracks",
      lead: "Start from that divergence. You are on `main`.",
      teach:
        "A **merge** keeps both tracks and ties them together with one new photo. That photo, the **merge commit**, is special: it has **two parents**, the tip of each track. Nothing already on the timeline changes.",
      instruction: "Step through the merge and watch the new photo reach back to both tips.",
      runLabel: "git merge feature",
      nextLabel: "Next step",
      resetLabel: "Reset",
      steps: [
        { caption: "Git finds the two photos to join: `f6` on main and `e5` on feature." },
        { caption: "It creates a new photo `M` whose two parents are `f6` and `e5`." },
        { caption: "The `main` label moves to `M`. Every original photo kept its id." },
      ],
      insight:
        "The timeline now tells the truth: work happened on two tracks and came together at `M`. Merge is safe and never rewrites history. The cost is a slightly busier graph.",
    },

    // 8. Rebase (stepped replay).
    rebase: {
      id: "rebase",
      title: "Rebase: replay onto the other track",
      lead: "Same divergence, but this time you are on `feature`.",
      teach:
        "A **rebase** does not join the tracks. It picks up feature's photos and **retakes them**, one by one, on top of main's latest photo. You end with a straight line, but the retaken photos are brand new: same content, new parent, new id. The originals are left behind.",
      instruction: "Step through the replay and watch each feature photo lift off and come back as a new one.",
      runLabel: "git rebase main",
      nextLabel: "Next step",
      resetLabel: "Reset",
      steps: [
        { caption: "Git goes to main's tip `f6`. That is the new base feature's photos will sit on." },
        { caption: "It retakes `d4` on top of `f6` as a new photo `d4'`. The old `d4` is set aside." },
        { caption: "It retakes `e5` on top of `d4'` as a new photo `e5'`. The old `e5` is set aside." },
        { caption: "The `feature` label moves to `e5'`. The timeline is now a straight line." },
      ],
      danger:
        "This is why the golden rule exists: **never rebase photos you have already shared.** Rewriting commits other people have built on splits history and creates a real mess. On your own private branch, rebase gives you a clean, linear story.",
      compare: "Same goal, two trade offs. Merge records what happened. Rebase curates how it reads.",
      insight:
        "Notice `main` never moved. Rebase set feature's work down on top of main, leaving a straight line. The content is identical, but the ids are new.",
      curiousTitle: "For the curious: are the old photos deleted?",
      curiousBody:
        "Not right away. The old `d4` and `e5` just become unreachable from any label. Git keeps them in the reflog for a while, so you can recover a botched rebase, and a later garbage collection eventually clears them.",
    },

    // 9. Assessment finale.
    quiz: {
      id: "quiz",
      title: "Check what you learned",
      intro: "A few quick checks, easy ones first, then say it in your own words. This is how we know it clicked.",
      questions: [
        {
          id: "snapshot-basic",
          kind: "mc-text" as const,
          objective: "Explain what a commit captures.",
          prompt: "When you take a commit, what does Git capture?",
          options: [
            {
              key: "A",
              text: "A photo of all your tracked files at that moment.",
              correct: true,
              feedback:
                "Right. Each commit is a full snapshot of your tracked files. Git keeps it cheap by reusing the files that did not change.",
            },
            {
              key: "B",
              text: "Only the file you had open at the time.",
              correct: false,
              feedback: "A commit captures all tracked files, not just one. It is a photo of the whole project.",
            },
            {
              key: "C",
              text: "Nothing until you push it to a server.",
              correct: false,
              feedback: "Commits are saved locally the moment you make them. Pushing to a server is a separate, later step.",
            },
          ],
        },
        {
          id: "snapshot-check",
          kind: "mc-text" as const,
          objective: "Explain what a commit really is: a full snapshot, not a diff.",
          prompt: "True or false: a commit stores only the lines you changed since the last commit.",
          options: [
            {
              key: "A",
              text: "True. A commit is the diff of your changes.",
              correct: false,
              feedback:
                "No. A commit is a full photo of your tracked files. Git keeps it cheap by reusing unchanged files, but the commit points at the whole set, not a diff. Diffs are computed on demand.",
            },
            {
              key: "B",
              text: "False. A commit points to a full snapshot of the tracked files.",
              correct: true,
              feedback:
                "Right. Git stores snapshots, deduplicated by content. When you run git diff, Git compares two snapshots for you on the spot.",
            },
          ],
        },
        {
          id: "branch-check",
          kind: "mc-text" as const,
          objective: "See a branch for what it is: a lightweight, movable pointer.",
          prompt: "What is a Git branch?",
          options: [
            {
              key: "A",
              text: "A copy of your project files.",
              correct: false,
              feedback: "No copy is made. That is exactly what makes branching in Git instant.",
            },
            {
              key: "B",
              text: "A movable label that points to one commit.",
              correct: true,
              feedback:
                "Exactly. A branch is one line of text: the id of a commit. When you commit, that label moves forward to the new photo.",
            },
            {
              key: "C",
              text: "A folder that holds a separate version of your code.",
              correct: false,
              feedback: "No folder is created. A branch is just a reference to a commit.",
            },
            {
              key: "D",
              text: "A saved diff between two versions.",
              correct: false,
              feedback: "Not a diff. A branch points to a commit, and a commit is a snapshot, not a diff.",
            },
          ],
        },
        {
          id: "trace-pointers",
          kind: "fill" as const,
          objective: "Read a commit timeline by following HEAD to a branch to a photo.",
          prompt:
            "Trace the labels. Both `main` and `feature` start on photo `c3`. Run these in order, then say which photo each label sits on.",
          code: "git switch feature\ngit commit       # takes photo d4\ngit switch main\ngit commit       # takes photo e5",
          labels: ["feature is on", "main is on"],
          answers: ["d4", "e5"],
          feedbackCorrect:
            "Right. Only the label HEAD is on moves when you commit. Feature got d4, then you switched to main and committed e5, so main moved to e5 while feature stayed on d4.",
          feedbackIncorrect:
            "Not quite. You committed d4 while on feature, so feature is on d4. Then you switched to main and committed e5, so main is on e5. Only the checked-out label moves on a commit.",
        },
        {
          id: "merge-vs-rebase",
          kind: "mc-text" as const,
          objective: "Tell merge and rebase apart, and know when each is safe.",
          prompt: "While on `feature`, you run `git rebase main`. What happens?",
          options: [
            {
              key: "A",
              text: "Git creates one new photo with two parents.",
              correct: false,
              feedback: "That describes a merge, not a rebase. Rebase never creates a merge commit.",
            },
            {
              key: "B",
              text: "Feature's photos are retaken on top of main's tip as new commits with new ids.",
              correct: true,
              feedback:
                "Exactly. Rebase replays your commits on top of main: same content, new parents, new ids. The originals are left behind, which is why you never rebase commits you have already shared.",
            },
            {
              key: "C",
              text: "Main's photos are copied onto feature.",
              correct: false,
              feedback: "Backwards. Rebase replays the current branch (feature) onto the target (main), not the other way around.",
            },
            {
              key: "D",
              text: "Nothing changes until you push.",
              correct: false,
              feedback: "Rebase rewrites your local history right away. Pushing is a separate step.",
            },
          ],
        },
      ],
      reflection: {
        prompt: "In one sentence, explain to a friend what actually happens when you create a new branch. Your words.",
        placeholder: "Aim for one sentence, clear and specific.",
        instruction:
          "After you write it, check it against the rubric. There is no required phrasing. What matters is whether your sentence captures two ideas: a branch is a label that points to a commit, and creating one does not copy your files.",
        rubric: [
          {
            level: "Excellent",
            criteria:
              "Captures that a branch is a movable label or pointer to a commit AND that no files are copied (it is cheap, or HEAD just moves). Both ideas are present.",
          },
          {
            level: "Good",
            criteria: "Captures one of the two: either the pointer idea or the no-copy idea, but not both.",
          },
          {
            level: "Keep going",
            criteria: "Describes a branch as a copy, a folder, or a separate version of the files.",
          },
        ],
      },
    },

    // 10. Conclusion.
    outro: {
      id: "outro",
      title: "That is Git",
      lead: "You took snapshots on a timeline, traveled back through them, opened up what a photo holds, watched a branch move as a simple label, read the timeline, then watched merge and rebase bring two tracks together two different ways.",
      leadIdea:
        "Underneath every command, Git is three ideas: photos stored by content, labels you can move for almost nothing, and a timeline that records how the photos connect.",
      recapLead: "What you can do now:",
      recap: [
        "Take snapshots and travel back to any earlier one.",
        "Explain that a commit is a full photo, not a diff.",
        "Describe a branch as a movable label, not a copy.",
        "Read a timeline from HEAD to branch to photo to parent.",
        "Tell merge from rebase, and know why you never rebase shared work.",
      ],
      contactLead:
        "I am Chalece DeLaCoudray, a learning experience designer and technologist. If this is the kind of learning you want to build, let's talk.",
      backToPortfolio: "Back to portfolio",
      resume: "Download resume",
      byline: "Thanks for visiting.",
    },
  },
} as const;
