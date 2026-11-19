# The runs' own view (loop, the board-to-app port, 2026-11-19)

## The rulings as they stand

- A run (walk the chords of a key, a chromatic walk, a progression in all 12 keys, an exercise; the chord practice run)
  plays in the run view, the canvas's deliberate design (round 41, "the Player's runs … in the run view's parts, where
  a wireframe stood"; round 63, the chord run's music on the paper; round 66, a phone on its side; round 68, every
  run's music on the paper at the chord run's 1.35 on a laptop), not in the song Player's chrome.
- "A run's transport floats, as the Player's" (owner, 2026-11-18: "the floating actions guidelines are broken by that
  implementation"): the kit's glass pieces 12 above the keys, reserving no space; Setup a plain piece, the honey Play
  capsule at the centre, the tempo a piece.
- "Every run says where it stands" (2026-11-18): a progress row under the music, "Chord 1 of 8", "Key 1 of 12".
- "Every run's music on the paper" (2026-11-18): never in a lone card; the phone's two lines of four bars under the
  bar, the laptop's eight bars at 1.35, centred in the band over the transport.
- "A practice run's Setup groups by heading" (2026-11-18, canvas v549): sections 24 apart, a heading 8 over its control.
- Every run's Setup ends with Tempo, a stepper (2026-11-19): the Tempo piece opens Setup, which had no tempo in it. An
  exercise's Tempo carries the tempo ladder's ⓘ; the ladder's rung picker went (a second control for the tempo).
- An exercise's music is its real line engraved (2026-11-19): the grand staff as the app's engraver sets it, two lines
  of two bars on a phone, one of four on a laptop at 1.35, the playhead bringing its line; its place is Key k of 12
  round Next key's order, Next key › at the row's end after a pass; the keys light the notes sounding now.

## A run's results (2026-11-19, from `PlayChord` and `PracticeResult`, `r56_results.py`'s `RS_RESULTS`)

- **Source:** the boards end a run in its results, full screen, and Profile › Practice history opens the same page
  ("Today, 14:20" in its bar). The app ended a run in the song Player's Played through sheet and recorded nothing,
  so Practice history held only the old trainer's quiz runs.
- **Will build:**
  1. `entities/progress`: a run kept is a quiz run (`kind: 'quiz'`, as today) or a played run (`kind: 'played'`):
     its title as played, the route that plays it again (`href`), its tempo, each bar's step (`clean`, `slip` or
     `pause`, the practice machine's slips and pauses of the pass), its chords on the treble staff when it walks
     whole-note chords (`RunNote`s), its accuracy (the pass's score) and when. The store's version goes up.
  2. A run's Wait pass played to its end is recorded (`recordPlayedRun`) and the run opens its results, in the run's
     own full-screen frame: the bar is Close and the time ("Today, 14:20"); the verdict (✓ on sage, ★ on honey for
     100%), the title 26 bold; three tiles (Accuracy "92% · 11 of 12", Pauses "2 · of 12 chords", Tempo "72 BPM · In
     Wait mode"); The run (four chords a line on a phone, six on a laptop, each marked ✓, Wrong notes or Paused) and
     its legend; Practise mistakes (honey, the bars with a slip looped) over Retry and Done, at the foot on a phone;
     "Personal best n% · Attempt k" and "All practice in Profile ›" under them.
  3. Profile's history rows read a played run as "72 BPM · 14:20"; its page is the same results with Back, no Done
     and no Profile link; Practise mistakes and Retry open the run again (`href`).
- **Built (2026-11-19):** `widgets/run-results` (`RunResults`, `RunStaff`), `withPlayedRun`, `recordPlayedRun`, the
  progress store at version 12; measured within 3 of `PracticeResult` and `PracticeResultLaptop` at 402 and 1710. The
  wrong chord is drawn as written on the boards too: Wait mode keeps that a bar slipped, never which keys.

## Source

- The boards `PlayWalk`, `PlayChromatic`, `PlayProgression`, `PlayExercise` and their laptops, written by
  `r56_results.py` (`PV_RUN`, `PV_LINE`, `RS_CELL`, `RS_KEYS`, `RUNBAR`, `PIECE`, `PLAYCAP`) with `r54_practice_more.py`
  (`PV_SRC`, `PVSET`, `PVSETL`, `PVSTART`, `PVBAR`); `PlayChord` (the chord run and its results) in `r56_results.py`
  (`RS_RUNVIEW`, `RS_RESULTS`).
- The pairing of 2026-11-19: `/play/walk` draws the song Player (× · the score's view · gear, the grand staff with the
  left hand's root and the pedal, the floating keys with the hands, Wait · Loop, ‹ ▶ ›, Both · 3D); the board draws the
  run view. No "Chord 1 of 8" string exists in the app.

## Built (2026-11-19: 374fee51 the chord runs, 171cfeb2 the exercise)

- `RunLayout`, `RunStaff`, `run-music` in `src/pages/player`; every run route under the shell. The rest of this file
  is the plan as it was written.

## Today (before the port)

- `src/pages/player/ui/WalkPlayerPage.tsx`, `ChromaticPlayerPage.tsx`, `ProgressionPlayerPage.tsx`,
  `ExercisePlayerPage.tsx`, each over `PlayerLayout.tsx`, their setups (`WalkSetup.tsx`, `ChromaticSetup.tsx`,
  `ProgressionSetup.tsx`, `ExerciseSetup.tsx`) inside the Player's gear sheet (`PlayerLayout`'s `setup`).

## Will build (app), value for value from the boards

Phone (402):
1. The bar (`PVBAR`, the kit's `TOP`): Close (× glass 44, to where the run was opened from), the run's title
   ("Walk the chords in C major", "Chromatic walk: minor 7th chords", "I – V – vi – IV in C", "Hanon No. 1: in C"),
   the gear (Player settings) at its end.
2. `main`, padding 4 16 34, a column 16 apart: the music as two lines of four bars (`PV_LINE(4, 76)`: a treble clef
   cell 40 wide, then each chord a whole-note cell 76 wide on a five-line staff 82 tall, lines at .8 and 50%, the
   last bar's end line 1.2); the progress row (8 tall track in Fill, radius 4, the done part #44684A; the count 14px
   soft, tabular, 12 from it); a spring; the keys edge to edge (`RS_KEYS(112)`: 112 tall, F3 to G5, the current
   chord's tones in their role paints with their names).
3. The floating dock (`RUNBAR`, left 12 right 12, bottom 158, gap 12): Setup (sliders icon over "Setup"), the honey
   Play capsule (`PLAYCAP`), Tempo (gauge icon over "72 BPM"); Setup and Tempo open the Setup.
4. The Setup sheet (`BSHEET('setupOn', 'Setup', PVSTART, 'Close')`), open when the run starts: the walk's Root (the
   root grid) and Chord size (Triads | Sevenths); the chromatic walk's Chord type chips, Root, Direction (Up · Down ·
   Up and down); a progression's Chord size and Keys chips (One key · Chromatically, rising · Circle of fifths, rising
   · Circle of fifths, falling); an exercise's Exercise and Key rows, Rhythm (Even · Dotted · Reverse dotted), Hands
   (Right hand · Left hand · Both), Next key (Circle of fifths · Chromatic), Octaves and Tempo steppers, Tempo ladder
   with its ⓘ; sections 24 apart; Start (honey, 52) at its foot.

Laptop (1710):
5. The bar as `LTOP`, the music's eight bars in one line at zoom 1.35 in a 1177 column with the progress row, centred
   in the band between the bar and the keys; the keys 170 tall under a hairline; the dock centred, bottom 186; Setup a
   popover 620 wide above the dock (`PVSETL`: the exercise's rows at each row's end), Play beside it starting the run.

What goes from the runs: the song Player's chrome (the score's view button, Wait · Loop, ‹ ›, Both · 3D, the floating
keys with the hands) and the Setup inside the gear's sheet.

The chord run (`PlayChord`) is the app's Inversions exercise in the run view (2026-11-19): its board now wears the
run view's bar and transport. Still to port: its results as a full-screen page kept in Profile › Practice history
(canvas 160; the app opens Played through, the song Player's sheet, and records only a trainer's runs), and its staff
as the app engraves it (the grand staff, half-note chords, Key 1 of 12; the board draws whole notes on the treble).
</content>
</invoke>
<parameter name="file_path">/home/user/piano-trainer/.scratch/r39/plan/player-runs.md