# R39-11 · Exercises and Quiz, redesigned

Premium here means an exercise reads like the page of the book it comes from (its bars engraved, its technique in a
line) and a quiz shows how far you have come at a glance, as Tenuto's and Functional Ear Trainer's lists do.

## The rulings as they stand

- Exercises is one library with Accompaniment and Progressions (R30-4), in the Songs library's shape: search, place
  chips, Sort and filter with its count and Show n, folders that fold with counts, a heart. Never stars or chips by kind.
- "Quiz: one setup and four drills for every trainer; a cadence trainer."
- Every Practice page has its own settings (a gear). A key is the root grid. Play controls sit above the keys.
- No finger numbers on or under the keys; no explanation line under a control (an ⓘ at most).
- A trainer has its setup page (canvas 134): Drill, Shown, Level, Custom chord qualities, Timing, the best score, Start; its run plays on keys (Show answer, Clear, Check, Next) and ends on Results. A song's Check is the same run over the song's chords, Close back to the song. Exercise's Start opens the Player with a setup sheet.

## Today

`src/pages/exercises` (the library, `widgets/practice-library`), `src/pages/exercise` (an exercise's page),
`src/pages/quiz` (`widgets/trainer-list`), `src/pages/trainer`; strings `practice.ts` `exercisePage`, `quiz.ts`.
Exercises: rows with a book icon, a long line and ···, a pencil in the bar. Quiz: rows with coloured icons and an
explanation line, My gaps behind a target icon in the bar.

## Will build (canvas rows 9 and 10)

Exercises: the library as Accompaniment's (place chips All · Favourites · Recently used · Finger technique · Barry
Harris · Piano With Jonny · Mine; filter Level and Focus); each row a roll of the figure, name, what it trains, its
level, Listen, the heart. An exercise's page: book, name, what it trains; its first bars engraved (No. 1 · bars 1–2
of 28 · C major); Number − No. 1 +, Key ▾ (root grid; Next key: This key · Circle of fifths · Chromatic); Hands Left
hand · Both · Right hand; Rhythm Even · Dotted · Reverse dotted (Hanon); Tempo and Target tempo, a bar showing how
near; Completed today (what was played, the next key); Technique. Listen and Start above the keys, which show the
position. Settings: Count-in, Metronome sound, Wait for the right note, All piano settings. Laptop: the library left,
the exercise right.
Quiz: My gaps first (its count, the skills named, Start); the trainers by group (Chords and intervals, Scales and
keys, By ear, Reading), each row with its best score in a ring, what it asks, Best · runs or Not tried yet. A trainer
opens its setup: name and record, Drill Flashcards · Name it · Play it · By ear with ⓘ (how it asks), Level, Options
(Chord qualities 4 of 16 ›, Keys ›, Inversions), Rounds 10 · 20 · Until stopped, Timing (Time limit ›, Advance
automatically), Start. A run: × End the run, Round 3 of 10, the tally, progress, the chord on the grand staff and on
the keys, four answers on one root, the verdict (Not quite: it's F major, with A lowest) and Next. Laptop: the
trainers left, the setup right.

## History

- 2026-11-08: drawn (canvas v9); waiting for the owner.

Sources: Hanon, The Virtuoso Pianist (No. 1); Tenuto and musictheory.net's exercise setup (drill, range, rounds);
Functional Ear Trainer's progress rings; `catalog.ts`, `quiz-groups.ts`, `quiz.ts`.

## Canvas 127 (2026-11-11): one segmented control, one stepper, 44 high

- **A choice of two or three in a settings group stands under its label,** across the group's width, so "Ascending ·
  Descending · Harmonic" and "Even · Dotted · Reverse dotted" read whole; it was squeezed beside the label and cut.
- **The segmented control is the Player's:** 44 high, 11 outside and 9 inside; the stepper's − and + are 44 square.
  Changed once in the kit, so Scales, Intervals, Progression, Exercise, Metronome, Tuner and the libraries' Sort and
  filter all follow.
- **Hear it** buttons 44; End the run 12 from the edge.
