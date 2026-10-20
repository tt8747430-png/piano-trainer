# Prompt for the next agent

Copy everything below the line into a new session on `tt8747430-png/piano-trainer`.

---

Work in `tt8747430-png/piano-trainer` on branch `claude/keen-gates-q9bnit`. Pull it first. It is ahead of `main` by one
commit, `1d8ec22` ("WIP: score editor on a phone on its side…"). Read `CLAUDE.md` and follow it: test first, FSD
layers, every UI string in `en` and `ru`, no legacy code, `npx prettier --write` only on files you touch.

## 1. Finish the score editor on a phone on its side (the main task)

The editor's tools are now a floating palette, `EditorPalette` over the shared `ToolPalette` (see
`src/pages/score-editor/ui` and `docs/adr/0061-songs-player-and-editor-float-their-actions.md`). On a phone held
upright and on a laptop it looks right. On a phone on its side (844x390, 667x375) the score was squeezed to a
40px strip: the palette column, the Verse picker, the status line and the open keys left almost no height for the
staves. Commit `1d8ec22` started fixing this (`EditorKeyboard.tsx`, `EditorToolbar.tsx`, `ScoreEditor.tsx`,
`ScoreEditorPage.test.tsx`, the `editor-screen` block in `src/styles/theme.css`). It typechecks and the editor's 165
tests pass, but it hasn't been checked on screen.

Target: at 844x390 and 667x375, with the palette open and the caret visible, at least one full grand staff (both
staves, a few bars) is visible. Ways to get there:

- in landscape the editor's keys start folded, the Keys button opens them, and the choice is remembered;
- the keys and their rail are shorter there;
- the title row and the Verse picker share one row;
- the status line moves into the palette's column.

Portrait (390x844) and laptop (1280x800) must stay as they are.

Check it with Playwright (Chromium is preinstalled: `npx vite --port 5210 &`). Make your own song through Songs →
Your songs → New song, then open `/edit/my-1`. Use `isMobile` and `hasTouch` for phones. Take screenshots and look
at them, then stop vite. Write tests first where jsdom can show the change.

## 2. Then

- Check `src/pages/score-editor/ui/ScoreEditorPage.test.tsx` for one flaky pattern: a test that finds a status line
  with `findByRole('status')` and then reads its text at once. The line can be on the page but still empty. Put
  that check inside `waitFor`.
- Run the full check once: `npm run typecheck && npm run lint && npm run test && npm run build`. Fix anything red at
  its cause. Never skip a test or raise a timeout without a reason.
- Commit each fix with a clear message, then push and merge: `git push -u origin claude/keen-gates-q9bnit && git
  push origin HEAD:main`.

## Context

A long review loop already fixed and redesigned most of the app. Done:

- **Fixed:** the music theory engine, the Player, lessons and courses (English and Russian), the score editor and
  takes, the trainers and Quiz, the keyboard, MIDI and audio, the explorers and Chord finder, saved data and backup,
  Learn, Songs and Search, the patterns, arrangement and notation, and the interface text.
- **Redesigned (ADR 0061, 0062):** song pages, the Player's floating transport, floating buttons across the app,
  keys folded by default on a phone on its side, and the editor's tool palette.

Open decisions belong to the owner, so don't change these without asking:

- whether to keep the two full-coverage music tests, which add about 70 seconds to the suite;
- whether `Db9sus4` should stay named `C#9sus4` under the fewest-accidentals rule.

Also left, optional: the Check page (`src/pages/check`) could get the same floating treatment.
