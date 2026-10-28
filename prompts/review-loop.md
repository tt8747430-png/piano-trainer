# Review and improve the app in a loop

## Goal

Review and improve Piano Trainer round after round, starting from the ground up, until the usage runs out. When one round finishes, start the next on your own. Stop to ask only when a decision is genuinely the owner's.

## Context

- Repo `tt8747430-png/piano-trainer`, branch `claude/keen-gates-q9bnit`. Before starting, fetch and check that the branch is up to date with `main`.
- Read `CLAUDE.md` and load the `owner-way` skill first. It holds the owner's quality bar, UI rules and workflow, and their past feedback by area.
- Use the repo's skills where they fit: `code-review`, `humanizer`, `impeccable`, `tdd`, `vercel-react-best-practices`, `vite-react-best-practices`, `vercel-composition-patterns`, `shadcn`.

## Task, each round

1. Pick an area not yet reviewed: a page and all its components. Start with Songs (library, song page, Player, editor), then go on.
2. Review it for:
   - **Bugs:** verify each finding with a concrete failure scenario before fixing it.
   - **UI:**
     - an iPhone held upright (390×844 and 320×568);
     - an iPhone on its side (844×390), which must be as reliable and easy as the others;
     - a laptop (1280×800).
   - **Consistency** with the rest of the app.
   - **Music theory** content in English and Russian.
   - **AI-sounding text**, rewritten plainly.
3. Fix every confirmed bug yourself, test first. Improve the area: you may refactor anything, change the UI and the architecture, and add features. Implement what is missing rather than leaving it out.
4. Do the work yourself. Only a large, separable part that can be briefed in under a page goes to an agent (two or three at most, a cheap model for reading); see the owner-way skill's maximum principle.

## Constraints

- No backwards compatibility, legacy leftovers, workarounds or unfinished work. Saved user data need not survive; the built-in content must keep working.
- Ignore Vercel deployment and CI status. CI runs only by hand.
- Run the full test suite once a round, on the merged branch, never after each edit.
- Keep the conversation under about 300k tokens. Size each round so it fits.

## Done means, each round

- Each fix is committed with a clear message.
- The full suite and the build pass on the merged branch.
- `CLAUDE.md` and the docs are updated.
- Pushed with `git push -u origin <branch> && git push origin HEAD:main`.
- Nothing is left running: no dev server, waiting loop or test run of this round (the owner-way skill, Testing).

## Report, after each round

Briefly:

- what you fixed;
- what you left, and why;
- which decisions are the owner's;
- the running list of areas reviewed and areas left.

If the usage limit stops you, resume when the owner says "continue".
