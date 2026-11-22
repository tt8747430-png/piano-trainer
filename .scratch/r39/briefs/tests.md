# Brief: bring the failing tests level with the app

## The job

Make every test file in your list pass against the app as it is now on `claude/keen-gates-q9bnit`.

Your list is one of `.scratch/r39/plan/tests/A.txt`, `B.txt` or `C.txt`. The prompt names it.

## Why they fail

The full suite (`npm run test`, 2026-11-22) has 1,209 failing tests in 202 files. From 2026-11-14 the owner had tests
off while the screens were redesigned canvas-first. The redesigns were deliberate. Most failures therefore assert an
old label, line, role or structure that the current screen no longer has. An example:
`src/pages/practice/ui/PracticePage.test.tsx` looks for "Daily technique, theory and accompaniment, in one place.",
which the page no longer says.

## Rules

1. **The app at HEAD is the spec.** Read the component under test, the `en` strings
   (`src/shared/i18n/locales/en/*.ts`) and `git log -p` for the file. Then update the test to assert what the screen
   now does, and keep the intent of the test where the feature still exists.
2. **Fix code only for a real bug:** a crash, a missing provider in app code, wrong music, or broken behaviour that no
   redesign explains. Name each code fix in your report.
3. **Delete a test only when its feature was removed** (for example the Quiz, the Chord trainer, a removed setting).
   Check `git log` and the ADRs first, and list each deleted test in the report.
4. **Never:** `it.skip`, `.todo`, loosened assertions that test nothing, `eslint-disable`, casts or `any`. Follow
   `docs/CODE_STYLE.md`.
5. **Run only your files,** one at a time or a few together: `npx vitest run <file>`. Never run the full suite.
   Before each commit, run `npm run typecheck && npm run lint`.
6. **Stay in your files,** plus any code fix they need. Do not touch these:
   - `src/widgets/welcome/`
   - `src/pages/account/`
   - `src/app/RootLayout.tsx`

   The session is redesigning those now.
7. **Commit by path,** one commit per page or area, never `git add .`. Format only the files you touched:
   `npx prettier --write <files>`. End each commit message with:

   ```
   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01BrtnH1Yf7S8aVU4w6rFSCU
   ```

   Do not push. No model name goes in any commit.
8. **No browser passes are needed:** the work is tests only, so no screen changes.
9. **Save your progress** as you go to `.scratch/r39/briefs/tests-<A|B|C>-progress.md`: each file and its state.

## Setup

If `node_modules` is missing in your worktree, symlink the main checkout's (`/home/user/piano-trainer/node_modules`).
Never run `npm install`. Read `CLAUDE.md` and `docs/CODE_STYLE.md` first.

## Report (under 400 words)

- Files now green, and files still red with the reason.
- The code fixes, each with its file.
- The tests deleted, each with the reason.
- Your commits, and your branch name.
