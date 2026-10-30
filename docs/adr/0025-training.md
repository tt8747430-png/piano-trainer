# ADR 0025 — Training: gaps from quiz answers only, trainers on one round machine and one setup, exercises as rules

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27 · amended 2026-10-28

## Context

The owner wants the app to find and fill gaps in a learner's theory without lesson text, trainers in The Ultimate
Piano's shape (a ladder of levels, fixed rounds so runs compare, a summary), and every exercise group of the sources
(scales in 3rds, Hanon, Barry Harris's lines, Piano With Jonny's) in any key, in the Player with its sheet music and
Wait mode. A reference drill app (round 13) gave every drill one setup and asked the same chords and intervals four
ways, with a time limit and a Next that waits for the answer.

## Decision

- **A Skill is one chord quality or one scale kind**, rated from its Evidence, the last five quiz answers: Known is at
  least four of five right including the latest; Gap is tried but not Known; Unknown is never tried. A Known skill
  whose latest answer is 14 days old is Due, and stays Known. Only quiz answers are evidence: a wrong note in the
  Player is as likely rhythm or hand position as theory, exercises record none, and a round's keyboard names no chord
  (ADR 0062).
- **Where gaps are found and filled:** a song's Check these chords (its own chords in turn, six questions or one
  each); a journey chapter's Check, which marks its step learned once its family is Known, asking each skill as often
  as it still needs; and My gaps in Quiz's bar (the gaps, then the due, then the unknowns of pieces opened).
- **One round machine** (`features/trainer`): a round is answered by keys chosen and checked, by keys pressed and
  judged at once, or by a choice; a card is revealed, never right or wrong; any other round's answer can be shown
  unanswered (Show answer, or its **time limit** running out), counted missed. What a run asks is one value
  (`Asks`), drawn never the same twice running. A run counts its rounds (10, 20 or until stopped), times each
  answer, keeps the streak and sums up; a run of cards has no score and keeps no record. The Check, a lesson's
  question and every trainer share one board, whose one primary button never moves: Reveal, Check, or Next greyed
  until the round is answered, then Next.
- **Four drills over the same material.** **Chords** and **Intervals** are each one trainer asked four ways (`Drill`):
  **Cards** (one of name, keys and staff shown, the rest revealed), **Quiz** (seen on the keys and staff, four
  choices on the same root differing only in quality, so the quality is what is read), **Play** (a chord built on the
  keys or MIDI; an interval's upper note over its given lower one) and **By ear** (heard, the same four choices, the
  keys staying up while it sounds). Their ladders and Custom (chords or intervals, roots by Natural · Sharp · Flat,
  inversions, how an interval sounds by ear) are the same for every drill. Only a chord read or played rates its
  quality: a card or a sound heard is no evidence. Each drill keeps its own record (`chords:quiz:c-main`). **Cadences** is a third trainer in the
  four drills (in the By ear group): the authentic (perfect and imperfect where a level splits it), plagal, half,
  deceptive and Phrygian half cadences, each voiced in four parts over its key's tonic, common tones held, in keys up
  to three sharps or flats (`ladders/cadences.ts`); By ear plays the tonic then the cadence, Quiz shows its two
  chords on the grand staff with no symbols, Play asks for the chord that makes it (before the last, or the last) in
  the inversion it needs, and its Cards show its name or its staff, a trainer naming the card faces it has
  (`Trainer.sides`). Like a progression, a cadence rates no skill.
- **One setup for every trainer** (`widgets/trainer-setup`): the drill and what a card shows, Options (level,
  Custom's lists each a sheet of checks that never empties, switches, rounds), Timing (time limit, Go on
  automatically), the record, Start (held in reach at a phone's foot); the drill in a sentence behind the bar's ⓘ. Every explanation is an ⓘ. A run takes
  the setup's place until its X or its results' Done.
- **What a trainer asks is view state** (its drill, level, rounds, time limit and Custom choices in the URL,
  remembered per trainer);
  **what a learner did is saved state**: each run adds to its trainer level's record in `pt-progress`.
- **An exercise is a rule that writes a Performance** (`shared/lib/exercise`, a fenced kernel): one generator per
  rule over a small choice, laid out by `exercisePerformance` in 4/4 bars, four a line, a chord a passage for the
  symbols and Wait mode. Fingering is written where the method fingers it, and only there. The catalogue is content
  (`entities/exercise`: group, stage, name, what it trains, the fields its rule takes, its own choice, tempo and
  swing). One route plays them, `/play/exercise/$exerciseId`, its URL's choices read against the exercise.
- **Hanon's Nos. 1 to 20** (The Virtuoso Pianist, Part I, public domain) are one exercise with a number, written
  from G. Schirmer's 1900 edition note for note and finger for finger: each figure carried up a degree at a time and
  its descending figure down, the figures the book bends to turn round or to land written as it bends them, No. 20
  ending on a chord. Both hands play the book's notes, the left two octaves under the right (the book has one) so
  each reads on its own staff, in any major key (the book prints C). Each number says what it works, as the book
  does. They start at ♩ = 60, the bottom of the book's 60 to 108.
- **The tempo ladder** climbs ♩ = 60, 72 … 132 in steps of 12 in every exercise's Setup, its rule in its ⓘ: a rung up
  after four clean passes, a rung down after a slip. An exercise opens at the tempo it was last played at, kept in
  `pt-progress` (`tempos`, by `tempoKey`: the exercise, and Hanon's number). It is a field read as none where a
  save lacks it, so the store's version stays.
- **The daily scale routine** is an exercise of its own: one major or minor scale two octaves up and back in five
  parts, each from a bar of its own: the right hand, the left hand, hands together, together staccato, together
  from piano up to forte and back. Its tempo is the ladder's; the routine's minute of improvising is left out, as
  nothing is written for it.
- **One home each:** the Quiz page holds every trainer by group; the Exercises page holds the drills of no other
  page (a scale's exercises open from Scales, a chord's arpeggio from Chords); a drill another Player already plays is
  not repeated.

## Consequences

A new trainer is a ladder, an entry in `trainers.ts`, its words and its sentence in the setup; a new exercise a generator, a catalogue row and
a case in `arrangeExercise`, whose test writes every exercise in every root on the piano's keys.

## History

- 0006 — Theory gaps come from quiz answers only (2026-09-24; Due added 2026-10-11).
- 0024 — An exercise is a rule that writes a Performance (2026-10-01).
- 0025 — A trainer is a round machine with a ladder (2026-10-01).
- 0025 — Chords and Intervals in four drills, one setup for every trainer, a time limit, an answer-gated Next (2026-10-28).
- r14 — Cadences, a trainer in the four drills, its cards naming their faces; Hanon's Nos. 1 to 20, the tempo
  ladder with each exercise's last tempo kept, the daily scale routine (2026-10-28).
- r15 — The setup's groups named small over their cards; Start held at a phone's foot; the drill's sentence moved from a
  card under the controls to the bar's ⓘ (2026-10-30).
