# Round 28: score editor bug hunt

Driven at 390×844, 320×568, 844×390 and 1280×800 on `zz-dev-editor.html?p=/edit/bz5` (Playwright,
shots in the session's scratchpad `r28/shots`).

| # | Where | Bug | Fix | Test |
|---|---|---|---|---|
| 1 | Tie (`,`) | With notes chosen, Tie acted on the caret's note alone, so a run chosen stayed untied (every tool should act on what is chosen, ADR 0114) | `tieNotes` takes the selection's span; a run of one key chosen becomes one note | `notes.test.ts` "ties every note chosen" |
| 2 | Bar at 320px | Close and the MIDI button touched, Close squeezed under the actions once the bar held five buttons and Done | Under 360px the bar's buttons are 40px and the actions' gaps close (`score-bar` in `theme.css`) | visual (jsdom lays nothing out) |
| 3 | Score settings at 320px | Rows in the full-screen column were squeezed to the screen's height, a stepper spilling out of its card | The page's column is not a flex column's shrinking child (`shrink-0`, block list); the Bars stepper goes under its name on a narrow phone | visual |
| 4 | Notes edited silently | ↑ ↓, accidentals, octaves and a click on a note made no sound, unlike Flat, MuseScore and Dorico | Hear notes as you edit (on by default) | `heard-edit.test.ts` |
| 5 | Keys behind the Settings | (prevented) the editor's window listener would write at a caret out of sight while the Settings stood in its place | the editor's keys and MIDI pause while its child route is open | `ScoreSettingsPage.test.tsx` |

Checked and found working: Replace / Insert / Chord modes, copy and paste, undo and redo, slurs,
chord symbols and lyrics typed on the sheet, the title edited in place, the tempo, key and time
pickers (from the score and from the Settings, sheet on a phone, popover on a laptop), the staff
menu, Record (asks for a MIDI keyboard without one), the takes.
