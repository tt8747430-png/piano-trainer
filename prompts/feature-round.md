# One round of work from the owner's feedback

## Goal

Turn the owner's feedback (text and screenshots) into finished, merged work that matches the reference apps they point at, for the least usage that gets it right (the owner-way skill's maximum principle).

## Context

- Load the `owner-way` skill and read `CLAUDE.md`.
- Before touching an area, read its section in the skill's `references/feedback-log.md`, so you don't bring back something the owner already rejected.
- Read the skill's `references/practices.md` once: test first, root cause before a fix, evidence before claims, impeccable for UI.
- **Screenshots:** look at each one yourself. Only if an agent will build from them, copy them to `scratchpad/<round>/owner/` with descriptive names and describe each in its brief.

## Task

1. List every request in the feedback, the small ones too. Nothing the owner wrote may be dropped silently.
2. Order them so each builds on the last, and do them **yourself, one after another**: read only the code each needs, test first, build, run the tests it reaches, commit.
3. Use agents only where the owner-way skill allows: a large part that touches other files and can be briefed in under a page. Then two or three at most, each with a brief from `.claude/skills/owner-way/references/agent-brief.md` (the owner's words, the screenshots described, numbered items, the ADR), launched in one message with `isolation: "worktree"`, a cheap model for reading or mechanical work. Keep working on your own part while they run; send mid-round feedback to the running agent; check each one's diff and tests before merging it.
4. Once everything is in, run the full test suite and the build once. Fix what fails at its cause.
5. Update `CLAUDE.md` and the docs. Push the branch and `main`; remove any worktrees.

## Constraints

- The tests a change reaches after each task; the full suite once, on the finished branch. Never run two suites at once.
- Read parts of files, not whole ones; filter long outputs to their summary lines.
- No legacy code, workarounds or unfinished work. Implement what's missing.

## Done means

- Every request is built or explicitly deferred with a reason.
- The merged branch passes the full suite and the build, and is pushed to the branch and `main`.
- Nothing is left running: no dev server, waiting loop or test run of this round (the owner-way skill, Testing).

## Report

Under 300 words:

- what changed, in the owner's words for screens and controls;
- what was left and why;
- the decisions that are the owner's, as questions;
- the push state.
