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
| A1 | One component per thing | 1 | done | | checked: Transpose and the headers are already one each (audit) |
| A2 | One app bar | 1 | done | | one `ScreenHeader`; after-shots in the round's screenshots |
| A3 | One rule for actions | 1 | open | | |
| A4 | Page, sheet or menu | 1 | open | | |
| A5 | The right control for each choice | 1 | done | 9a33ae70, aa176aa9, d421ec25, d52e781f, 0bce757a (merged 03b5bfc4) | PitchPicker, NotePicker, KeyPicker (circle), KeysChecklist, MenuPicker, PickerRow; strips and edge fades gone. Decided: the Key tab's circle chooses on tap (no Select button: it is the page's own control, not a popover); wedges show the signature as a count; options that don't apply are left out (R30); Quiz/Exercises keys map to each signature's major tonic (D♯/G♯/A♯ roots go, C♭ comes in); Start on is a menu of the scale's notes; the score editor's key keeps its sign grid (ADR 0114) |
| A6 | Words | 1 | in progress | | the known renames done with their test (audit); the full en/ru sweep against the books continues in B2 (round 6) |
| A7 | Navigation bugs | 1 | done | | Back retracing fixed by A18; the sidebar compares paths only (`includeSearch: false`), so Learn stays current on its tabs; `NavTabs` already marks its own tab; a test per tab |
| A8 | Shapes and selected states | 1 | done | 79811d63, 4ad592ac | four corner tokens (control, card, sheet, pill) with a test against one-off corners; one chosen fill to a control's edges (sand by day, dusk line by night), with a test |
| A9 | Every action that loses or hides work | 1 | in progress | | `ConfirmDialog` and `confirm()`; Archive asks from every trigger; deletes moved; edit-original's in round 10 (audit) |
| A10 | Settings map | 1 | done | | map in `settings-map.md`; registry `entities/settings/model/registry.ts`; one-home test `app/settings-homes.test.ts`; lesson reading and recording de-duplicated; pages from the registry with A12 |
| A11 | Favourite and other item acts | 1 | in progress | | the song Settings' Favourite switch removed (♡ on the card, row menus, swipe, Select stay); sweep found no other act as a switch; DESIGN.md pattern left |
| A12 | Settings layout | 1 | done | 045617ab | two panes from 64rem, one column on a phone; wide `/settings` replaces to `/settings/general` |
| A13 | Pictures and icons in settings | 1 | done | 7031d3d9 | picture choices for looks (key size, length, names, position, fold, swipe, theme); coloured icon rows |
| A14 | Name the settings pages after what the learner sees | 1 | done | 51f697f0 | On-screen piano, Connect a piano, Computer keys, Sound and recording; "Piano position", "Fold the keys"; the on-screen piano's accessible name stays "Keyboard" for now (27 test files) |
| A15 | Account, sync and this device's data | 1 | done | 144f4b56, a8e46a3a, 23b924b5 | account card with one status line; Sync on the Account; Storage and backup its own page; Sync and data gone |
| A16 | Arrows and chevrons | 1 | done | acebab69 | marks only in the shared rows; a test fails a page importing them; prev/next lesson arrows count as movement |
| A17 | Destructive and command rows | 1 | done | 9bc0e55a | destructive acts last and alone in red, through `ConfirmDialog`; Sign out a red row of its own; the song's Reset/Delete keeps its own dialog for its focus return (to move with B6) |
| A18 | Navigation audit | 1 | done | dcaa63b6, b24068b9, 66fd1593, d9d5883e, 4ecda26d (merged ed9a4e1d) | parents table + test, `useUp` (history.back when the entry before is the parent, so it isn't doubled), `useSetSearch` (46 sites in `back-as-up/navigates.md`), a Back test per place, the Search palette. The Dialog primitive was taken from `shadcn add --view` by hand (the CLI would run npm install) |
| A19 | Laptop layout audit | 1 | open | | |
| A20 | Buttons, rows and headings on every explorer | 2 | open | | |
| A21 | Scales and keys, all three tabs | 2 | open | | |
| A22 | Intervals | 2 | open | | |
| A23 | Progressions | 2 | in progress | 1ea3aeac | three tabs (Progression · Library · Passing chords), each chord's role and bass move drawn (kernel `chordRole`, tested on every library progression), Written as and Voicing as settings, the Library a list with style chips. Left: Passing chords by groups with Insert |
| A24 | A Settings page for every Practice page | 2 | done | e212b61d | at `/settings/<page>`, a gear in each page's bar (`?from=` for Back) and a Practice group in Settings; Chords, Scales and Intervals' pages hold only rows to the on-screen piano and a connected piano for now |
| A25 | Accompaniment, Chord finder, Metronome, Exercises and Quiz | 2 | in progress | 52ae1faf | book names in one script, My gaps an icon button, the Quiz in two even columns. Left: Accompaniment's chips and pattern names, the Chord finder's empty state |
| A26 | The on-screen piano itself | 3 | open | | |
| A27 | The Player's piano sound and its pedal | 3 | in progress | 16190d53, 5fdb368d | pedal events: one voice per key, scheduled notes decay as the live voice's, pedal-held notes end at the lift, CC64 to a connected piano with note-offs at written ends; auto-pedal as a pure function (wired with B7's Player settings page). Left: the sampled grand (D15), the pedal lamp and Ped. highlight in the Player, the Fantaisie-Impromptu check (its file is not in the repo: owner's to-do) |
| A28 | The song page of an imported or own song | 4 | open | | |
| A29 | Imports and exports | 4 | in progress | 65506c2c, 96379253, 44aa68f7, afd5758d, aba6d200 | the pedal as a line of events: MusicXML read/write at its own positions and offsets (4 fixtures), MIDI CC64 both ways, MEI tstamp, the editor's pedal tool. Left: .mxl, beams kept, minor keys without mode, PDF/audio export, dragging a Ped. mark |
| A30 | Fingering, one way everywhere | 2 | open | | |
| A31 | Nothing flickers, nothing jumps | 1 | done | 0a9069b4 | measured before paint, rows that stay, a bar that holds; a CLS about 0.01 on Chords and Scales at 1280 on a fresh load remains (audit); Chords' heading block height goes with A20 |
| A32 | The theory pages: one owner per idea, no copies | 2 | open | | |
| A33 | Colour notes: one model | 2 | in progress | | tensions follow the chord's degree in a key (kernel, tested); the one panel for added tones, alterations and tensions next |
| A34 | The score editor against Flat and the editors in `piano-data` | 4 | open | | |
| A35 | The Player: play staves, not "melody" and patterns | 4 | open | | |
| A36 | Focus and keyboard walking | 1 | done | a2569823 | one 3px focus outline with a test; Practice walked by Tab in a test |
| A37 | The chord views (Diagrams, Grid, Chords over lyrics) as Chordify does them | 4 | open | | |
| A38 | One meaning for the pencil, for everyone | 1 | in progress | | song page done (audit); editing in the chord views (Grid, Chords over lyrics, Diagrams) goes with A37 in round 4 |
| A39 | The Metronome, against the metronome apps players use | 2 | in progress | a61dde1c | engine model and the page (audit); samples, flash and the Player's click next |
| A40 | The score editor's panels, against Flat's | 4 | open | | |
| A41 | Exercises and the Quiz, inside | 2 | in progress | 41a450d5 | drills Flashcards · Name it · Play it · By ear, Start a labelled button, no time signature on a question's staff. Left: the results page, the Why line and stats, the exercise page and Next key |
| A42 | Every theory, practice and training page against rule 30 | 1 | in progress | | part done with A23–A25; the rest open |
| A43 | The Key tab's content, and theory written on the music | 2 | open | | |
| B1 | The Profile, as complete as memory-palaces' | 5 | in progress | ef48f266, 00c8af17, 5baac640 | server: learner_profiles, handle check, public avatars (access test green). Device: tiered badges and the Almost there card on the Profile. Next, after the Settings rebuild merges (it owns the Account pages): avatar picker, Edit profile (handle, bio), Privacy, notifications, Streak merged with Activity |
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
- The Metronome's recorded sounds (D16): Freesound answers 403 from the cloud container, so no CC0 one-shots could be fetched. Either drop the CC0 files (woodblock, clave, rimshot, cowbell, click, kick, snare, closed and open hat, ride; an accent and a normal stroke each) into `public/samples/metronome/` with their sources, or let the environment reach freesound.org. Until then the synthesised voices play.
- Add the Fantaisie-Impromptu's MusicXML to `src/shared/lib/musicxml/fixtures/` (or say where it is) so its pedalling can be checked against the score (A27).
- Reseed the built-in content (`node scripts/export-content.mjs` then `scripts/seed-content.mjs` with an editor's `SEED_EMAIL`/`SEED_PASSWORD`): two lessons' wording changed with A6 (Approach chords, Root movement).

## Round reports


### Round 1, checkpoint 1 (2026-11-03)
- Merged: the key pickers (A5), Back as up and the Search palette (A18), the settings registry (A10), Favourite as an act (A11), updates by hand, the shared confirm dialog (A9, four screens so far).
- Gate on the merged branch: typecheck, lint, full suite (6952 tests, two merge-seam failures fixed: the Back test used the old strip; `router.test.tsx`'s own stub copy kept a waiting update), build.
- Left in round 1: A1–A4, A6–A8, A9's other screens, A12–A17 (two-pane Settings, page names, account card, arrows, destructive rows), A19, A31, A36, A38, A42; screenshots after.
