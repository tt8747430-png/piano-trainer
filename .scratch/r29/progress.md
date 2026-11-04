# Round 29: progress

The state of every item of `prompt.md`. Updated with every commit; a new session picks up from here.
Where everything is: [`README.md`](README.md). The exact plan: [`plan.md`](plan.md) (D20: nothing is built
before its item is planned and read). What the code really does: [`compliance/summary.md`](compliance/summary.md).

**2026-11-03, audit:** the compliance audit found states below marked "done" that the code does not bear out;
they are corrected to "partial" with the audit's reason. Round 1 is still open (A3, A4, A19 not started) while
rounds 2–5 were built: the prompt's order was not kept. From here the order is the plan's.

## Phase 0 and 1

| Step | State | Notes |
|---|---|---|
| Phase 0: gate on main, files, before screenshots | done | gate green on main 2026-11-02: typecheck, lint, 6905 tests in 626 files, build; 360 before screenshots (36 screens × 402, 393, 320, 874×402, 1280 × light, dark) in `.scratch/r29/shots/before` |
| Phase 1: specs | done | ten specs in `.scratch/r29/<name>/spec.md` (back-as-up, settings-registry, key-picker, pedal-events, piano-sampler, metronome-engine, fingering-service, colour-notes, profile, staves-play-show); ADRs 0002, 0034, 0038, 0046, 0052, 0061, 0062, 0087, 0097, 0105, 0107, 0116 carry an r29 line |

## Items

| Item | What | Round | State | Commits | Notes |
|---|---|---|---|---|---|
| A1 | One component per thing | 1 | done | | checked: Transpose and the headers are already one each (audit) |
| A2 | One app bar | 1 | partial (audit: tabs a second row and titles wrap, so the bar's height varies; Songs' My songs · Explore not built) | | one `ScreenHeader`; after-shots in the round's screenshots |
| A3 | One rule for actions | 1 | open | | |
| A4 | Page, sheet or menu | 1 | open | | |
| A5 | The right control for each choice | 1 | partial (audit: the editor's key keeps its sign grid; D20: Transpose is not a circle, it matches the editor's) | 9a33ae70, aa176aa9, d421ec25, d52e781f, 0bce757a (merged 03b5bfc4) | PitchPicker, NotePicker, KeyPicker (circle), KeysChecklist, MenuPicker, PickerRow; strips and edge fades gone. Decided: the Key tab's circle chooses on tap (no Select button: it is the page's own control, not a popover); wedges show the signature as a count; options that don't apply are left out (R30); Quiz/Exercises keys map to each signature's major tonic (D♯/G♯/A♯ roots go, C♭ comes in); Start on is a menu of the scale's notes; the score editor's key keeps its sign grid (ADR 0114) |
| A6 | Words | 1 | in progress | | the known renames done with their test (audit); the full en/ru sweep against the books continues in B2 (round 6) |
| A7 | Navigation bugs | 1 | done | | Back retracing fixed by A18; the sidebar compares paths only (`includeSearch: false`), so Learn stays current on its tabs; `NavTabs` already marks its own tab; a test per tab |
| A8 | Shapes and selected states | 1 | partial (audit: the contact sheet of every control missing) | 79811d63, 4ad592ac | four corner tokens (control, card, sheet, pill) with a test against one-off corners; one chosen fill to a control's edges (sand by day, dusk line by night), with a test |
| A9 | Every action that loses or hides work | 1 | in progress | | `ConfirmDialog` and `confirm()`; Archive asks from every trigger; deletes moved; edit-original's in round 10 (audit) |
| A10 | Settings map | 1 | partial (audit: the registry maps key → page only, no label or control; pages hand-written; D20 moves the Practice pages' settings to each page) | | map in `settings-map.md`; registry `entities/settings/model/registry.ts`; one-home test `app/settings-homes.test.ts`; lesson reading and recording de-duplicated; pages from the registry with A12 |
| A11 | Favourite and other item acts | 1 | in progress | | the song Settings' Favourite switch removed (♡ on the card, row menus, swipe, Select stay); sweep found no other act as a switch; DESIGN.md pattern left |
| A12 | Settings layout | 1 | partial (audit: see A10; D20 changes the structure) | 045617ab | two panes from 64rem, one column on a phone; wide `/settings` replaces to `/settings/general` |
| A13 | Pictures and icons in settings | 1 | done | 7031d3d9 | picture choices for looks (key size, length, names, position, fold, swipe, theme); coloured icon rows |
| A14 | Name the settings pages after what the learner sees | 1 | partial (audit: "Play melody" still on Sound and recording) | 51f697f0 | On-screen piano, Connect a piano, Computer keys, Sound and recording; "Piano position", "Fold the keys"; the on-screen piano's accessible name stays "Keyboard" for now (27 test files) |
| A15 | Account, sync and this device's data | 1 | partial (audit: screenshots signed in and out missing) | 144f4b56, a8e46a3a, 23b924b5 | account card with one status line; Sync on the Account; Storage and backup its own page; Sync and data gone |
| A16 | Arrows and chevrons | 1 | partial (audit: Profile and Practice at 1280 screenshots missing) | acebab69 | marks only in the shared rows; a test fails a page importing them; prev/next lesson arrows count as movement |
| A17 | Destructive and command rows | 1 | partial (audit: the lesson's and course's Settings screenshots missing) | 9bc0e55a | destructive acts last and alone in red, through `ConfirmDialog`; Sign out a red row of its own; the song's Reset/Delete keeps its own dialog for its focus return (to move with B6) |
| A18 | Navigation audit | 1 | done | dcaa63b6, b24068b9, 66fd1593, d9d5883e, 4ecda26d (merged ed9a4e1d) | parents table + test, `useUp` (history.back when the entry before is the parent, so it isn't doubled), `useSetSearch` (46 sites in `back-as-up/navigates.md`), a Back test per place, the Search palette. The Dialog primitive was taken from `shadcn add --view` by hand (the CLI would run npm install) |
| A19 | Laptop layout audit | 1 | open | | |
| A20 | Buttons, rows and headings on every explorer | 2 | in progress | 7875ffe7 | Chords: a choice the chord can't take is not drawn; Arpeggio and Play one floating bar. Left: Practise in the Player's heading style; one header over Scales' tabs |
| A21 | Scales and keys, all three tabs | 2 | in progress | 9c6e182f | Notes · Harmony · Key; Harmony's seven degrees named, each chord opening in Chords in the key. a minor key's harmonic V and vii° stacked over v and VII. |
| A22 | Intervals | 2 | partial (audit: no interval on a staff; its settings do not exist) | df4ad453, 6d566e1f | Harmonic · Melodic rising · falling as pictured buttons in a floating bar with Play all; a play mark and its semitones per row; one keyboard size |
| A23 | Progressions | 2 | in progress | 1ea3aeac | three tabs (Progression · Library · Passing chords), each chord's role and bass move drawn (kernel `chordRole`, tested on every library progression), Written as and Voicing as settings, the Library a list with style chips. Left: Passing chords by groups with Insert |
| A24 | A Settings page for every Practice page | 2 | redo (D20: each Practice page's own Settings page from its gear, like a lesson's, not `/settings/<page>`; today's Chords, Scales, Intervals pages hold only links; the Metronome has none) | e212b61d | at `/settings/<page>`, a gear in each page's bar (`?from=` for Back) and a Practice group in Settings; Chords, Scales and Intervals' pages hold only rows to the on-screen piano and a connected piano for now |
| A25 | Accompaniment, Chord finder, Metronome, Exercises and Quiz | 2 | in progress | 52ae1faf | book names in one script, My gaps an icon button, the Quiz in two even columns. Left: Accompaniment's chips and pattern names, the Chord finder's empty state |
| A26 | The on-screen piano itself | 3 | open | | |
| A27 | The Player's piano sound and its pedal | 3 | in progress | 16190d53, 5fdb368d | pedal events: one voice per key, scheduled notes decay as the live voice's, pedal-held notes end at the lift, CC64 to a connected piano with note-offs at written ends; auto-pedal as a pure function (wired with B7's Player settings page). the pedal lamp and Ped. highlight in the Player (d205cf49). Left: the sampled grand (D15), the Fantaisie-Impromptu check (its file is not in the repo: owner's to-do) |
| A28 | The song page of an imported or own song | 4 | open | | |
| A29 | Imports and exports | 4 | in progress | 65506c2c, 96379253, 44aa68f7, afd5758d, aba6d200 | the pedal as a line of events: MusicXML read/write at its own positions and offsets (4 fixtures), MIDI CC64 both ways, MEI tstamp, the editor's pedal tool. Left: .mxl, beams kept, minor keys without mode, PDF/audio export, dragging a Ped. mark |
| A30 | Fingering, one way everywhere | 2 | open | | |
| A31 | Nothing flickers, nothing jumps | 1 | partial (audit: 7875ffe7 stops drawing Chords' rows that don't apply, undoing "rows that stay") | 0a9069b4 | measured before paint, rows that stay, a bar that holds; a CLS about 0.01 on Chords and Scales at 1280 on a fresh load remains (audit); Chords' heading block height goes with A20 |
| A32 | The theory pages: one owner per idea, no copies | 2 | partial (audit: the app-wide Notation and names settings don't exist) | 31080752 | the relative key on the Key tab only; Intervals links the Quiz's Intervals drill; Harmony's chords open Chords |
| A33 | Colour notes: one model | 2 | done | 8355d0ed, b417ebf7 | one panel: Chord tones · Tensions · Avoid, a tap adds the note (C9, C7♯11, Cadd9); `colour=` in the URL; `key=` follows the chord's degree from its root. Dm7 as ii takes 13 (the spec's table), not avoided |
| A34 | The score editor against Flat and the editors in `piano-data` | 4 | open | | |
| A35 | The Player: play staves, not "melody" and patterns | 4 | done | 49809bdd, 093e86b9 | Staves (Play/Show, recording a track), accompaniment for charts only, Melody gone, other hand, controlsFor + audit table; click from the Metronome engine. Daisy fields is a chart (audit); Clef display not built |
| A36 | Focus and keyboard walking | 1 | done | a2569823 | one 3px focus outline with a test; Practice walked by Tab in a test |
| A37 | The chord views (Diagrams, Grid, Chords over lyrics) as Chordify does them | 4 | open | | |
| A38 | One meaning for the pencil, for everyone | 1 | in progress | | song page done (audit); editing in the chord views (Grid, Chords over lyrics, Diagrams) goes with A37 in round 4 |
| A39 | The Metronome, against the metronome apps players use | 2 | in progress | a61dde1c | engine model and the page (audit); the Player's click and count-in from its engine (093e86b9). Left: samples (owner's CC0 files), flash |
| A40 | The score editor's panels, against Flat's | 4 | open | | |
| A41 | Exercises and the Quiz, inside | 2 | in progress | 41a450d5 | drills Flashcards · Name it · Play it · By ear, Start a labelled button, no time signature on a question's staff. Left: the results page, the Why line and stats, the exercise page and Next key |
| A42 | Every theory, practice and training page against rule 30 | 1 | in progress | | part done with A23–A25; the rest open |
| A43 | The Key tab's content, and theory written on the music | 2 | in progress | 9c6e182f | the degrees table gone from Key (Harmony owns it); a minor key borrows the Picardy I and the Neapolitan (C♭ in B♭ minor). Left: theory written on the music |
| B1 | The Profile, as complete as memory-palaces' | 5 | in progress | ef48f266, 00c8af17, 5baac640 | server: learner_profiles, handle check, public avatars (access test green). Device: tiered badges and the Almost there card on the Profile. Next, after the Settings rebuild merges (it owns the Account pages): avatar picker, Edit profile (handle, bio), Privacy, notifications, Streak merged with Activity |
| B2 | Professional copy | 6 | open | | |
| B3 | Explore in Songs | 7 | open | | |
| B4 | Edit in place | 8 | open | | |
| B5 | Learner view | 9 | open | | |
| B6 | One publishing model | 10 | open | | |
| B7 | Real settings for the Player and the editor | 4 | partial (audit: Clef, Replace/Insert, palette side, the score's Layout link and the On-screen piano link missing; "Hear notes" drawn on two pages) | 4ffa41de | /settings/player (and a song's gear, /play/$pieceId/settings), /settings/score-editor; Clef, Replace/Insert, palette side not offered (no engine for them) |
| B8 | The Player's practice flow | 11 | open | | |
| B9 | Customisable pages and cards | 14 | open | | |
| B10 | Customisable bars, as memory-palaces does | 12 | open | | |
| B11 | Tools, as a group of their own | 13 | open | | |

## Where we are (2026-11-04, late): agents on B4/B6, B8/B10, B1/B3; inline work pushed to the branch

- **SND:** the light piano now from Splendid Grand Piano (public domain, cloned by git; zip download refused);
  Settings' credits link CC BY 3.0; the Metronome's drum groove on the recorded kit.
- **B2 part 1:** Privacy and Terms rewritten (Children, Questions, publishing licence and takedown, others'
  work); Report a problem in Settings › Help (sent with the error reports); copy.md holds before and after.
- **A26:** rail names and icons, the pedal icon, two labels a key at most, PedalBar, the toggle lets up when
  the page hides. **A28:** tempo in the felt beat. **T:** the editor's Transpose shows the Player's offset,
  Use this. **A29:** .mxl export. **A37:** summary split In this song · In order.
- **Rulings:** Computer keys stays off the rail (it is On-screen piano's, a computer's only), cost: one more
  tap to reach it; the pedal lifts on the page hiding (route change and dialogs unmount or leave it, as the
  MIDI foot does), cost: a held pedal through a sheet; PDF stays the Player's Print (no second row in
  Export…, one way to each act); written beams and directions-at-tick wait for a song-text format change
  (an editor round), cost: imported beams re-grouped by our rule; A37's follow setting waits for B8's
  Display.
- **Next:** merge the three agents; A34+A40 (editor against Flat) to an agent; B9, B11, B2 part 2; the full
  suite, build, push main.

## Where we are (2026-11-04, night): Chord player merged, Part B started — main c0c4566e

Full suite 7355 tests (one stray mark fixed after), build green; pushed to the branch and main.

- **Merged:** the Chord player (CP1–CP6, its agent's report `.scratch/r29/briefs/chord-player-report.md`);
  migration `chord_sheets` applied to the project, access checked (own 1, other 0, changed 0, anon refused).
- **B5 done:** Admin's bar has View as a learner (opens Learn); walk test of editor controls; a reload ends it.
- **B7 done:** editor Note input — Input mode on opening, Palette side (pt-settings v21); Player Display — Clef
  for a single-staff song (`?clef=`, `withClef`); the Player's Settings row to On-screen piano.
- **B6/B2 part:** the rights checkbox (D3 words, Terms link) gates Publish; Unpublish asks first.
- **B4 part:** `entities/library/model/permissions.ts` (`can`, D8's table, tested); not yet wired into Songs.
- **Left of Part B:** B4 wiring, Archived (n), level/Courses Edit modes; B2 copy inventory, legal rewrite, empty
  states and ⓘ texts; B6 one Publish page for all five kinds; B3, B1, B9 (need their migrations), B8, B10, B11,
  B2 part 2. Rounds 3–4: A26, A28 rest, A29, A34, A40, A37, T remainder; P15, P7/P9 bits.
- **Rulings:** Clef shown only for a lead sheet of one staff (a grand staff keeps Original, card hidden); Palette
  side choice hidden under 48rem (the phone's palette is a sheet); the rights tick clears after each publish.

## Where we are (2026-11-04, evening): Practice redesign, ST17, T

**On the branch (and main up to `1d1beb72`):** P1 (one bar height, switcher, Segmented/Source/Section menus),
P2 (key-signature grid in every KeyPicker), P3 Top note, P4 (Play · Arpeggio named), P5 (HandCard on Chords),
P6 (ChordHead), P7 (views with summaries, the circle a picture), P8 (Tonic · Scale heading), P9 (1–4 octaves,
Direction, On the keys gone), P10 (alteredFromMajor, degree names, mode colour), P12 (Intervals: Play as, meanings),
P16 (beatGrid/snapRange, beatsBand), the band's sound contract (`NoteSound.instrument`, `DrumSound`),
ST17 (folder Settings page), A27 pedal (a lift a hair before a press is one change), T in progress (relative
`transpose`, `tkey`, `tchords`; the switches in the one Transpose popover; arrange keepSignature/keepChordSymbols).

**Agents running (worktrees):** chord player (CP1–CP6, brief `briefs/chord-player.md`), sounds (SND + A27,
brief `briefs/sound.md`). Merge each after reading its report and diff.

**Rulings (owner may change):**
- P1: Songs keeps its Public library row; no My songs · Explore switcher (the public page would have to become a
  place). Admin's nine tabs and Accompaniment's six sources are menus (Section, Source), not segments.
- P2: Decided 22 followed: no twin names. Every tap reports its key; the editor ignores a repeat.
- P5: Scales keep the numbered hand beside a run (a run crosses fingers); the drawn hand is Chords'.
- P7: Harmonise and Borrowed chords stay on the Key view; Triads · 7ths not moved back from Settings.
- P9: Tempo stays the slider on the page (not moved into the capsule yet).
- P12: an interval's songs stay behind its ⓘ; the row's staff picture not drawn (its name and meaning are).
- P15 (one sheet everywhere) not built: the Player's and editor's sheets stay their own; deferred.
- P16: the band snaps to beats; the editor's selection still extends by notes.
- CP: Progressions and Accompaniment stay (Decided 22: two pages, one engine); Export audio waits for samples.
- SND: no new npm package in a worktree: our own sampler, no smplr.
- T: the Player keeps an offset, never writes the song (the plan's default to the owner's question).

## Where we are (2026-11-04)

Built and on `main`, each plan with its ledger (`.superpowers/sdd/<plan>/progress.md`, rulings and deferred
minors) and a fresh review whose Critical/Important findings were fixed or ruled:
- **Build 1, app Settings** (`plan/app-settings.impl.md`).
- **The Player** (`plan/player.impl.md`): one gear, the Settings sheet (While you play · This song · Share; a panel
  at the right on a laptop), Pick your view, Display the shown view's own, hands in the transport with Hear the
  other hand, the beat strip a page at a time.
- **The score editor** (`plan/editor.impl.md`): Piano keys in its bar, no Sound popover; the score's Settings a list
  of pages (Title and credits; Music; How the editor works), Key and Time from a section; Settings › Sound and
  recording and › Score editor gone.
- **Songs** (`plan/songs.impl.md`): ✎ opens the score; Settings › Details holds the words; Move to folder….
- **Practice P3**: Chords by name (size, then one Chord menu); the Add row kept.

Left, in order:
1. Practice redesign (`plan/practice-redesign.md`): P11, P1, P2, P8, P15, P16, P4–P6 (+ Top note for P3), P7, P9,
   P10, P12, SND, CP1–CP6 (Chord player, Chordify's grooves `grooveOf`).
2. Rounds 3–4 (`plan/rounds-3-4.md`): Transpose's offset, the sampled grand, imports, the editor against Flat;
   tempo words in the model; a recorder Count-in switch.
3. Part B planning.
4. Owner's questions: section pages and their lessons (1.6 asked for the Player instead); the folder's Settings
   page (ST17, deferred); the remaining mockups (Lyrics 2.15, polish 1.9/3.8/3.9).
5. Bug known: the pedal's doubled icons on the Fantaisie-Impromptu.

## Earlier: where we were (2026-11-03, late evening)

Design by mockups with the owner's feedback per screen (claude.ai pages, copies in `mockups/`; feedback in
`owner/feedback-*.md`; research in `research/chords-scales.md`; answers in prompt Decided 22–23).

Left, in order:
1. **Owner:** feedback on the redrawn Chords and Scales page (`mockups/chords-and-scales.html`) and a last look at
   the song, Player and editor page (`mockups/song-player-editor.html`).
2. **Mockups still to draw:** 2.15 Lyrics (research first); polish 1.9 Changes, 3.8 Layout, 3.9 Note input; the
   app's Settings pages (General, Storage and backup, On-screen piano with Computer keys, Connect a piano); Songs
   and a folder's Settings; the other Practice pages (Intervals, Progressions, the Chord player CP1–CP6,
   Metronome, Exercises and Quiz, Chord finder); New song.
3. **Fold the approved mockups into the plan:** `plan/settings.md` (ST), `plan/practice-redesign.md` (P, CP),
   `plan/rounds-3-4.md` (Transpose); ADR and glossary lines.
4. **`writing-plans` implementation plans** per subsystem (`plan/<subsystem>.impl.md`), Settings first; the owner
   reads each before code.
5. **Build:** round 1 (Settings, confirmations, one selected style, …), round 2 (Practice redesign, Chordify's
   grooves `grooveOf`, the metronome's sounds), rounds 3–4 (Transpose fix, the sampled grand, the editor against
   Flat, imports/exports), then Part B (planned after).
6. **Bugs known:** the pedal's doubled icons on the Fantaisie-Impromptu.
7. **`main`:** two code commits are on this branch only (118a0f4f recorded metronome sounds, 884d7115 drum
   grooves; the owner later chose Chordify's grooves, to replace them in round 2). They reach `main` with round 1's
   full gate. Docs and mockups reach `main` with them.

## Owner's to-dos

- Spoken metronome count (D16): left out. Owner chose free recordings; only an English CC0 set exists (OpenGameArt "numbers one million"), no Russian one. Owner may record or approve a TTS voice later.
- Metronome samples: done with VCSL (CC0) in 118a0f4f; the full D16 set and its folder and `SOURCES.md` are in the plan (round 2).
- The Fantaisie-Impromptu's files: the owner added them (`piano-data/scores/`); both import with nothing left out (c6500150).
- Reseed: done 2026-11-03 with the editor login the owner gave (27 items written, 277 unchanged); the login is kept nowhere. Reseed again after content changes.
- Salamander Grand Piano's credit line in About: the owner agreed (2026-11-03).

## Round reports

### Build 1: the app's Settings and the card style (2026-11-03, on `main`)
- Built from `plan/app-settings.impl.md`, inline, test first: `ChoiceCard` (shadcn radio group); the Settings list
  holds only the app's pages (General, Storage and backup; Piano: On-screen piano, Connect a piano; Help); General's
  Appearance and Language as cards; lessons read as chosen on a lesson's Settings; Computer keys a group of
  On-screen piano on a computer only (the old link redirects), letters play only there; Back from a Practice page's
  Settings goes to Practice.
- Gate: typecheck, lint, full suite 7147/7147 (a slow Songs drag test given its own limit), build, screenshots at
  390, 320 (Russian) and 1280; a fresh whole-branch review: 3 Important found and fixed test-first.
- Rulings: tasks 2–3 in one commit; pictured choices stay `PictureChoice`; `midi.sound` stays a switch (on/off);
  the rail's ⌨ toggle gone with the page.
- Deferred minors: On-screen piano reads the pointer once (not live); the store's typing default and the section
  read different pointer queries; the redirect route's unused lazy component; Computer keys keeps its old switch
  label and the Shortcuts button, not the mockup's key picture row.
- Next: `plan/player.impl.md` (the Player's bar, Pick your view, its Settings page and inner pages, hands in the
  transport, Simplify as one button, Diagrams' strip), then the score editor, Songs, the Practice redesign.


### Round 1, checkpoint 1 (2026-11-03)
- Merged: the key pickers (A5), Back as up and the Search palette (A18), the settings registry (A10), Favourite as an act (A11), updates by hand, the shared confirm dialog (A9, four screens so far).
- Gate on the merged branch: typecheck, lint, full suite (6952 tests, two merge-seam failures fixed: the Back test used the old strip; `router.test.tsx`'s own stub copy kept a waiting update), build.
- Left in round 1: A1–A4, A6–A8, A9's other screens, A12–A17 (two-pane Settings, page names, account card, arrows, destructive rows), A19, A31, A36, A38, A42; screenshots after.

## Musicca reference (piano-data/musica), 2026-11-03

The folder is musicca.com's own site: its chord player's bundles, jQuery/Joomla, its samples as base64 text, no
licence anywhere. Behaviour only is taken (notes: scratchpad metronome-ref/musicca-notes.md, summarised here):
- Metronome: tempo slider, arrows, Tap tempo; beats per measure; a mute function (play N bars, mute M; 3/1, 1/1,
  2/2, 4/4 suggested). Ours already has all of it (Silent bars, speed trainer, subdivisions, accents).
- Piano: one sample per key (MIDI 31-91), no pitch-shifting, no velocity layers, ~3.3 s each, no pedal. Ours (D15)
  should be better: a sampled grand with velocity layers and our pedal model.
- Drums: 16 steps a bar per drum with a fill bar; a crash on a section's start silences the hat that step; count-in
  one bar of hats; stop fades over two beats; a worker clock (50 ms tick, 100 ms lookahead).
- Owner's decision (to-do): the sounds. Musicca's can't ship. Options: Salamander Grand Piano (CC-BY, a credit
  line) for D15; a CC0 drum/click pack the owner downloads into the repo; or the owner's own recordings.
