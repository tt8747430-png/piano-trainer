# An agent's brief

Write one brief per agent into the session's scratchpad (`briefs/<round>-<area>.md`). Start with its own part:

1. **Opening line:** the job in one line, and that it works in its own worktree.
2. **Docs:** the ADR to write or amend, the ADRs to read first, and the CLAUDE.md entries for its area.
3. **Boundaries:** what other agents are changing at the same time. Name those files and tell it to stay out.
4. **The owner's screenshots:** their paths in `scratchpad/<round>/owner/`, each described in a line or two (what it shows, which app). The agent can't see the chat.
5. **The owner's words:** quoted verbatim.
6. **Build:** numbered items, each concrete and checkable. Name the components and the model functions involved. Say "decide and say why in the ADR" where a design choice is the agent's.
7. **Screens to shoot.**

Then append the common part below unchanged. Launch with `isolation: "worktree"` and a one-line prompt pointing at the brief's path and a free dev-server port (5191, 5192, …).

---

## Setup
- If `node_modules` is missing in your worktree, run `ln -s /home/user/piano-trainer/node_modules node_modules`. Do not run `npm install`, because the folder is shared. If you need a package, say so in your report.
- Run `git merge claude/keen-gates-q9bnit` first. That local branch holds every round before yours.
- Read these first:
  - `CLAUDE.md`, whose rules bind you;
  - `docs/CODE_STYLE.md`, `DESIGN.md` and `docs/UBIQUITOUS_LANGUAGE.md`;
  - the spec `docs/superpowers/specs/2026-10-26-chordify-for-piano.md` §1 (what Chordify does) and your round's section;
  - the ADRs your brief names.
- Chordify research notes are in `/tmp/claude-0/-home-user-piano-trainer/05b98fad-a70e-53a3-9b61-b349107350d2/scratchpad/chordify/research.md`. Read them for behaviour only: never copy Chordify's code or wording. chordify.net blocks automated access, so do not try to reach it.

## The owner's standing rules
- The quality of real apps.
- No legacy code, backwards compatibility or duplication.
- Phone and desktop work the same.
- Explanations go in ⓘ popups (the kit's `InfoTip`), never in a line of text under a control.
- No hardcoded text on the score.
- Consistency everywhere.
- Nothing is cut short or wraps badly at 320px.

## Process
- Write tests first.
- Make small commits, each ending with exactly these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01RLULmeGMHBXAgs4W7vM6qK`
- Never run `npm run format`. Use `npx prettier --write <files you touched>`.
- Never `git checkout`, `restore`, `stash` or `reset` what you did not create. Do not push.
- Commit each task as soon as it is finished: one proper commit per task, its message saying what changed and why. You need not run tests before each commit; `npm run typecheck && npm run lint` is enough there. When the round is finished, run only the tests your changes reach (`npm run test:changed`, or `npm run test:related -- <changed source files>`) and fix what fails. Never run the full `npm run test`: it runs once, on the merged branch, at the merge. Run `npm run build` only if you touched startup, routing, the PWA or config.
- Before you report, merge `claude/keen-gates-q9bnit` again if it moved, and resolve any conflicts.
- Write the ADR your brief names, in the style of `docs/adr/0105-*.md`, and add the glossary rows. Do not edit `CLAUDE.md`; it is updated at the merge.
- Put every string in English and Russian.
- Screenshots:
  - Run a dev server with `npx vite --port <your port> --strictPort` in the background.
  - Use Playwright: `require('/opt/node-tools/node_modules/playwright-core')`, `chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`, deviceScaleFactor 2.
  - Shoot each screen your brief lists at 390×844 and 1280×800; add 320×568 and 844×390 only where something may be clipped.
  - Look at every shot and fix what is cut, crowded or misaligned.

## Report back (under 500 words)
- What you built, file by file.
- The commits.
- The test results.
- The screenshot paths.
- Your decisions.
