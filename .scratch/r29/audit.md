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
