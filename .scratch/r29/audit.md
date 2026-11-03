# Round 29: audit

One row per finding: where, what's wrong, the single fix, its state.

| Item | Where | What's wrong | Fix | State |
|---|---|---|---|---|
| A10 | a lesson's Settings; Settings › General | "Lessons read as" set in two places | home Settings › General; the lesson's row links there | fixed |
| A10 | the editor's Sound popover; Settings › Keyboard and recording | a take's Metronome and Play melody switches in two places | the popover keeps the volumes and links to Recording's home | fixed |
| A10 | the Metronome page | writes the Player's click volume (`sound.click`) | moves to the Metronome's one set with the engine (A39, round 2) | open, round 2 |
| A10 | `settings-homes.test.ts` | nothing stopped a second home | static test: each preference command called only from its home | fixed |
| A10 | Settings pages | not drawn from the registry; no two panes on a laptop | R20 two-pane rebuild from the registry | open, round 1 (A12) |
| A11 | a song's Settings › In your library | Favourite as a switch (an act posing as a setting, R19) | removed; ♡ on the overview card, the row menus, swipe and Select keep it | fixed |
| Constraints | Settings › Version | only the build; Later on the banner left no way back to an update | Version row as iOS's Software Update (status, tap to check, offline says so), Install and restart, the Profile's gear marked while a version waits; one update state (`shared/lib/app-update`) | fixed |
| R20 | Settings › Help | credits only in a hover title | the group's footnote line | fixed |
| A1 | Transpose | three controls named in the brief | already one widget (`widgets/transpose` `TransposeTool`), the Player's and the editor's files only wrap it with their own state | checked, no change |
| A1 | headers | `LibraryHeader`, `PieceHeader` | both compose `ScreenHeader`; `ScoreBar` is the score's own bar in both modes (ADR 0115) | checked, no change |
| A2 | every screen | the bar's height | one `ScreenHeader`, one row of one height; `large` sets the title larger in the same row | checked; screenshots after |
| A9 | Archive (row ⋯, swipe, drag onto Archive, Select's bar, a folder's ⋯, a song's Settings) | archived at once, Undo only | asks first through one `confirm()` (`shared/ui/confirm.ts`, `Confirmer` beside the toasts), then says it with Undo | fixed |
| A9 | Delete songs / folder / take / pattern, Reset progress | each its own AlertDialog | `ConfirmDialog` | fixed |
| A9 | Publish / Discard / Unpublish / Delete (an editor's original, `features/edit-original`), Keep bars of a take, own music's Reset | own AlertDialogs, already R17's shape (question, one line, act named, red) but kept open while the server answers | move onto `ConfirmDialog` with a busy state when B6 (round 10) rebuilds publishing | open, round 10 |
| A9 | Delete account, Sign out, Reset progress on Settings | Settings pages | the Settings rebuild agent (A17) | in progress |
| A38 | a song's page | the pencil edited the page for an editor or an own song, but opened the score editor for a learner on a built-in song | the pencil edits the page in place, shown only to whoever may; "Edit score" a labelled button on the overview card for everyone (Practise · Edit score · Learned · ♡); the Settings page's "Edit the score" row goes (offered once, R29) | fixed |
| A38 | lessons, courses, levels, progressions, patterns | pencils | checked: each opens its own editing in place for an editor and is absent for a learner; the Player's pencil edits the score it shows | checked |
| A6 | Practice, the Player's Setup, a song's Edit, lessons | home-made phrases | Passing chords, Voice leading, Inversion, Approach chords, Root movement, Harmonic function, Credits / Composer / Lyricist, in en and ru; each in the glossary's "Words the app says" with its _Avoid_ words; `avoid-words.test.ts` fails them in a locale file. "Melody staff" goes with A35 (round 4), "Pulsing chords" was already gone | fixed |
| A39 | the Metronome | six meters; 6/8 clicked eighths; only beat 1 accented; no subdivision; drums a beat apart from the hat | any time signature, counted as players count it (dotted beat in 6/8, 9/8, 12/8; odd meters grouped 3+2, 2+2+3 with an accent per group); squares tapped through accent · beat · silent; Subdivision (8ths, triplets, 16ths, swing 8ths) softer than the beat; the drum groove per meter with the hat on 8ths or the subdivision; the speed trainer (from, to, step, every) | fixed |
| A39 | the Metronome | synthesised sounds; no flash; the Player's click its own | recorded CC0 samples (D16), the full-screen flash, and the Player's click and count-in from this engine | open, round 2 (this round) |
| A30 | Chords page and inversion drills | "one chord fingered by two rules" | checked: placedFingering and blockFingering both use handFingers, the drills' rule; one rule already | checked |
| B1 | badges | Scale Master by "keys practised" needs a record the app does not keep | counts scales learned (a scale step marked learned), tiers 1 · 3 · 6 · 12; keys practised would need the scale routine to record keys (a later round) | decided |
