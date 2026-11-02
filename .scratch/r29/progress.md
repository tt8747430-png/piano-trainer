# Round 29: progress

The state of every item of `prompt.md`. Updated with every commit; a new session picks up from here.

## Phase 0 and 1

| Step | State | Notes |
|---|---|---|
| Phase 0: gate on main, files, before screenshots | done | gate green on main 2026-11-02: typecheck, lint, 6905 tests in 626 files, build; 360 before screenshots (36 screens × 402, 393, 320, 874×402, 1280 × light, dark) in `.scratch/r29/shots/before` |
| Phase 1: specs | done | ten specs in `.scratch/r29/<name>/spec.md` (back-as-up, settings-registry, key-picker, pedal-events, piano-sampler, metronome-engine, fingering-service, colour-notes, profile, staves-play-show); ADRs 0002, 0034, 0038, 0046, 0052, 0061, 0062, 0087, 0097, 0105, 0107, 0116 carry an r29 line |

## Items

| Item | What | Round | State | Commits | Notes |
|---|---|---|---|---|---|
| A1 | One component per thing | 1 | open | | |
| A2 | One app bar | 1 | open | | |
| A3 | One rule for actions | 1 | open | | |
| A4 | Page, sheet or menu | 1 | open | | |
| A5 | The right control for each choice | 1 | in progress | | worktree agent: the four pickers (key-picker spec) |
| A6 | Words | 1 | open | | |
| A7 | Navigation bugs | 1 | open | | |
| A8 | Shapes and selected states | 1 | open | | |
| A9 | Every action that loses or hides work | 1 | open | | |
| A10 | Settings map | 1 | in progress | | map in `settings-map.md`; registry `entities/settings/model/registry.ts`; one-home test `app/settings-homes.test.ts`; lesson reading and recording de-duplicated; pages from the registry with A12 |
| A11 | Favourite and other item acts | 1 | in progress | | the song Settings' Favourite switch removed (♡ on the card, row menus, swipe, Select stay); sweep found no other act as a switch; DESIGN.md pattern left |
| A12 | Settings layout | 1 | open | | |
| A13 | Pictures and icons in settings | 1 | open | | |
| A14 | Name the settings pages after what the learner sees | 1 | open | | |
| A15 | Account, sync and this device's data | 1 | open | | |
| A16 | Arrows and chevrons | 1 | open | | |
| A17 | Destructive and command rows | 1 | open | | |
| A18 | Navigation audit | 1 | in progress | | worktree agent: parents table, useUp, replace, Search palette (back-as-up spec) |
| A19 | Laptop layout audit | 1 | open | | |
| A20 | Buttons, rows and headings on every explorer | 2 | open | | |
| A21 | Scales and keys, all three tabs | 2 | open | | |
| A22 | Intervals | 2 | open | | |
| A23 | Progressions | 2 | open | | |
| A24 | A Settings page for every Practice page | 2 | open | | |
| A25 | Accompaniment, Chord finder, Metronome, Exercises and Quiz | 2 | open | | |
| A26 | The on-screen piano itself | 3 | open | | |
| A27 | The Player's piano sound and its pedal | 3 | open | | |
| A28 | The song page of an imported or own song | 4 | open | | |
| A29 | Imports and exports | 4 | open | | |
| A30 | Fingering, one way everywhere | 2 | open | | |
| A31 | Nothing flickers, nothing jumps | 1 | open | | |
| A32 | The theory pages: one owner per idea, no copies | 2 | open | | |
| A34 | The score editor against Flat and the editors in `piano-data` | 4 | open | | |
| A35 | The Player: play staves, not "melody" and patterns | 4 | open | | |
| A36 | Focus and keyboard walking | 1 | open | | |
| A37 | The chord views (Diagrams, Grid, Chords over lyrics) as Chordify does them | 4 | open | | |
| A38 | One meaning for the pencil, for everyone | 1 | open | | |
| A39 | The Metronome, against the metronome apps players use | 2 | open | | |
| A40 | The score editor's panels, against Flat's | 4 | open | | |
| A41 | Exercises and the Quiz, inside | 2 | open | | |
| A42 | Every theory, practice and training page against rule 30 | 1 | open | | |
| A43 | The Key tab's content, and theory written on the music | 2 | open | | |
| B1 | The Profile, as complete as memory-palaces' | 5 | open | | |
| B2 | Professional copy | 6 | open | | |
| B3 | Explore in Songs | 7 | open | | |
| B4 | Edit in place | 8 | open | | |
| B5 | Learner view | 9 | open | | |
| B6 | One publishing model | 10 | open | | |
| B7 | Real settings for the Player and the editor | 4 | open | | |
| B8 | The Player's practice flow | 11 | open | | |
| B9 | Customisable pages and cards | 14 | open | | |
| B10 | Customisable bars, as memory-palaces does | 12 | open | | |
| B11 | Tools, as a group of their own | 13 | open | | |

## Owner's to-dos

- Record the spoken metronome count, one to eight, in English and Russian (D16).

## Round reports

