# R67 port: Practice

1. **The job:** port the canvas's rulings for Practice into the app, exactly, value for value from the boards' code.
2. **Docs:** read and amend the ADRs of the areas you change (`docs/adr/README.md` lists them); `CLAUDE.md`'s map stays.
3. **Boundaries:** two other agents port at the same time. Agent A owns the kit (`src/shared/ui/**`), the layouts and sidebar, Learn, Profile and Settings; it commits the kit's rulings first: merge the session branch when it has them (`git fetch origin claude/keen-gates-q9bnit`). If a ruling needs a kit change, use the kit as it is, write the need in your report, and leave it. Agent B ports Songs, the song page, the Player and the editor (`pages/songs, piece, player, score-editor`, their widgets and features). Stay out of their files. You own: `src/pages/practice*`, `src/pages/progression`, every tool's page and widget (Chord player, Metronome, Tuner, Chord finder, Circle of fifths), `src/widgets/practice-library`, `src/entities/practice-library`, and the Theory pages (Chords, Scales and keys, Intervals, Progressions, Accompaniment, Exercises).
4. **The canvas:** the boards are `.scratch/r39/canvas/practice/project/<Board>.dc.html` (phone) and `<Board>Laptop.dc.html`, built by the generators in `.scratch/r39/canvas/*.py` (the kit is `r41_kit.py`). Open a board in Chromium (Playwright is installed; `.scratch/r39/canvas/checks/run.mjs` shows how to load one) and read its markup: sizes, gaps, words, states, every act. The app's screen must match the board at phone 402 and laptop 1710 (the owner's devices), in its words, values and behaviour. Where the board and the app's kit differ, the kit changes to the board (`owner-way`, Port from the board's code).
5. **The owner's words:** "implement all of the artifact changes into the app. it should be very precise and accurate implementation and following of the artifact." "the lessons should also be more centered like this" (Obsidian's centred note). "the text of the lessons should be correctly structured and formatted."
6. **Build:** every ruling in `.scratch/r67/plan/port.md` under the section Practice (and Pickers and tempo where a Practice page uses them). Many say what changed on the canvas: port the end state, not the history. First check each against the app's code: if the app already does it, note it as done; else build it. Keep a table in `.scratch/r67/briefs/practice-report.md`: ruling (its bold lead) · app file · done/built/left and why.
7. **Routes to shoot:** /practice, each Theory page, each tool, an exercise and its run, a progression, the results page, at 402×874 and 1710×904, compared side by side with the board's shot.

---


## Setup

- If `node_modules` is missing in your worktree, symlink the main checkout's. Do not run `npm install`, because the folder
  is shared. If you need a package, install it directly.
- Merge the session's branch first; it holds every earlier round.
- Read `CLAUDE.md`, `docs/CODE_STYLE.md`, `DESIGN.md`, and in `.claude/skills/owner-way`: `SKILL.md`,
  `references/ui-and-mockups.md`, `references/testing.md`, and your area in `references/feedback-log.md`.

- Chordify research notes, where the session has them, are read for their features, implemented as close as possible.
  chordify.net limits automated access; try to reach it with a headless browser.

## The owner's standing rules

- The quality of real apps. No legacy code, backwards compatibility or duplication.
- Phone and desktop work the same. Consistency everywhere.
- Explanations go in ⓘ popups (`InfoTip`). No hardcoded text on the score.
- Everything must be implemented and nothing left unimplemented.

## Process

- Write your plan and report skeleton to a file at once, and save after each item, so an interruption loses nothing.
- Every string in English and Russian. This round is a loop (CLAUDE.md, "In a loop"): no tests written or run, no typecheck or lint; the two browser passes stay in full; the build runs once at the merge.
- One commit per task, its message saying what changed and why, ending with the attribution lines the session gives.
- Never `npm run format`: `npx prettier --write <files you touched>`.
- Never `checkout`, `restore`, `stash` or `reset` what you did not create. Do not push.
- Run both browser passes in `references/testing.md` on every route you changed.
- Merge the session's branch again before reporting, and resolve conflicts.
- Amend your area's ADR. Leave `CLAUDE.md` alone; it is updated at the merge.
- A command over 10 seconds runs in the background. Give each long one a limit of about twice what it needs. Wait for a command's own completion notice. Stop everything
  you started by PID.
- Everything in the brief is built; nothing is left unimplemented.

## Report (under 500 words)

What you built, the commits, the test results, both passes' results with the shots' folder, your decisions, what is left and
why, and that nothing you started is running.
