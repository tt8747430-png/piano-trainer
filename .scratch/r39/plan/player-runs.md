# The runs in the Player (loop, the board-to-app port, 2026-11-19)

## The rulings as they stand

- A run (the walk, the chromatic walk, a progression in 12 keys, an exercise, the chord run) opens the Player: CLAUDE.md,
  "The Player (`/play/$pieceId`): one screen over any Performance"; `practice-chords.md`, "each opening the Player";
  `r54_practice_more.py`'s own header, "the Player's variants: their setup over the Player".
- Its setup (the walk's Root and Chord size; the chromatic walk's chord and direction; a progression's keys; an
  exercise's hands and keys) lives in the Player's gear, as a song's, in the app (`PlayerLayout`'s `setup`, inside
  the settings sheet): one home for a run's settings, the Player's gear.
- Each run says where it stands and its music stands on the paper (feedback log, 2026-11-18); its transport floats as
  the Player's (2026-11-18).

## Source

- The pairing of 2026-11-19: `/play/walk` against `PlayWalk`. The app draws the Player (× · the score's view · gear;
  the walk on a grand staff with its chord names, the left hand's root and the pedal; the floating keys with the
  hands; Wait or Listen · Loop, ‹ ▶ ›, Both · 3D). The board draws a stripped screen of its own: the bar × · title ·
  gear, a treble staff of triads only, a progress row, the keys at the foot, a floating Setup · Play · 72 BPM, and a
  Setup sheet open at the start; on a laptop the eight bars float mid-screen, cut at the right edge, under a Setup
  popover that covers them.
- The Player board (`Editor`, Play mode) draws the same Player the app draws: × · Play | Edit · score · gear, the
  grand staff, Wait · Loop, ‹ ▶ ›, Both · 3D.

## Today

- App: `src/pages/player/ui/WalkPlayerPage.tsx`, `ChromaticPlayerPage.tsx`, `ProgressionPlayerPage.tsx`,
  `ExercisePlayerPage.tsx` over `PlayerLayout.tsx`; setups `WalkSetup.tsx`, `ChromaticSetup.tsx`,
  `ProgressionSetup.tsx`, `ExerciseSetup.tsx`.
- Canvas: `PlayWalk`, `PlayChromatic`, `PlayProgression`, `PlayExercise` (and their laptops) from
  `r54_practice_more.py`; `PlayChord` from `r56_results.py`.

## Will build (canvas)

- The run boards redrawn as the Player board in Play mode, value for value from its generator (`r44_editor.py`): its
  bar without Play | Edit (a run is not a piece one edits), the run's title in the music's head, its music on the
  grand staff as the app engraves it, the progress row under the music, the floating keys with the hands, the
  Player's transport; the gear's sheet holding the run's Setup first, as the app's.
- What goes: the run screen's own floating Setup · Play · BPM dock and the Setup sheet open at the start.
</content>
</invoke>
