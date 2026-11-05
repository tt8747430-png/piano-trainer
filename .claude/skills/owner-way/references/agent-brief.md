# An agent's brief

Used only when SKILL.md's agent test passes. Write one brief per agent to `.scratch/<round>/briefs/<area>.md`, launch with
`isolation: "worktree"` and a one-line prompt giving the brief's path and a free dev-server port (5191, 5192, …). The agent
cannot see the chat, so the brief carries everything.

## Its own part, in this order

1. **The job** in one line.
2. **Docs:** the ADRs to read and amend.
3. **Boundaries:** what other agents are changing now, named by file, to stay out of.
4. **The owner's screenshots:** paths under `.scratch/<round>/owner/`, each described in a line or two.
5. **The owner's words,** quoted verbatim.
6. **Build:** numbered, checkable items naming the components and model functions. Say "decide and say why in the ADR" where
   a choice is the agent's.
7. **Routes to shoot.**

Then append the common part, unchanged.

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
- Test first. Every string in English and Russian.
- One commit per task, its message saying what changed and why, ending with the attribution lines the session gives.
- Never `npm run format`: `npx prettier --write <files you touched>`.
- Never `checkout`, `restore`, `stash` or `reset` what you did not create. Do not push.
- Before each commit: `npm run typecheck && npm run lint`. When finished: `npm run test:changed`, and `npm run build` only
  after touching startup, routing, the PWA or config. Never the full suite: it runs once, on the merged branch.
- Run both browser passes in `references/testing.md` on every route you changed.
- Merge the session's branch again before reporting, and resolve conflicts.
- Amend your area's ADR. Leave `CLAUDE.md` alone; it is updated at the merge.
- A command over 10 seconds runs in the background. Give each long one a limit of about twice what it needs. Wait for a command's own completion notice. Stop everything
  you started by PID.
- Everything in the brief is built; nothing is left unimplemented.

## Report (under 500 words)

What you built, the commits, the test results, both passes' results with the shots' folder, your decisions, what is left and
why, and that nothing you started is running.
