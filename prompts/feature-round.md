# One round of work from the owner's feedback

## Goal

Turn the owner's feedback (text and screenshots) into finished, merged work that matches the reference apps they point at, in one round of parallel agents.

## Context

- Load the `owner-way` skill and read `CLAUDE.md`.
- Before touching an area, read its section in the skill's `references/feedback-log.md`, so you don't bring back something the owner already rejected.
- **Screenshots:** copy them into the session's `scratchpad/<round>/owner/` with descriptive names (`1-example-time-signature-wheels.jpg`, `4-ours-editor-palette.jpg`). Agents can't see the chat, so each one needs a written description.

## Task

1. List every request in the feedback, the small ones too. Nothing the owner wrote may be dropped silently.
2. Group the requests into agents by the files they touch, so no two agents edit the same component. Keep each agent's work well under an hour. Split a large area rather than let one agent run long.
3. Write each agent's brief from `.claude/skills/owner-way/references/agent-brief.md`. Quote the owner's words, describe each screenshot, number the items to build, and name the ADR to write or amend.
4. Launch the agents in one message, each with `isolation: "worktree"`, a one-line prompt pointing at its brief, and its own dev-server port.
5. If the owner adds feedback while an agent runs, send it to that agent with SendMessage.
6. As each agent reports, check its commits and look at its screenshots. Merge it into the session branch.
7. Once all have merged, run the full test suite and the build once. Fix what fails.
8. Update `CLAUDE.md` and the docs. Then push the branch and `main`, and remove the worktrees and their branches.

## Constraints

- Agents test only what their changes reach. The full suite runs once, on the merged branch. Never run two suites at once.
- No legacy code, workarounds or unfinished work. Implement what's missing.

## Done means

- Every request is built or explicitly deferred with a reason.
- The merged branch passes the full suite and the build, and is pushed to the branch and `main`.

## Report

Under 300 words:

- what changed, in the owner's words for screens and controls;
- what was left and why;
- the decisions that are the owner's, as questions;
- the push state.
