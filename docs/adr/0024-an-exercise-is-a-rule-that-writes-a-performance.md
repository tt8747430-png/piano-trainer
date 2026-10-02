# ADR 0024 — An exercise is a rule that writes a Performance

- **Status:** accepted · **Date:** 2026-10-01 · **Builds on:** ADR 0013 (the Player plays a Performance, written by
  `notate`), ADR 0014 (a walk is a Performance handed to the Player), ADR 0015 (the chromatic walk), ADR 0022 (a
  screen opened plainly comes back as left) · **Spec:** `2026-10-01-practice-exercises-and-trainers-design.md`

## Context

Sub-project 7 asks for every exercise group of the roadmap (§10.5) in any key, in the Player with its sheet music,
Wait mode, tempo, hands, loop and swing. The Player plays Performances that `arrange` builds from a chart and a
pattern: chords voiced and patterned. A scale in 3rds, Hanon, a bebop line or a drop-2 walk is not a chart under a
pattern: it is a line of notes, both hands, fingered by its method.

## Decision

- **An exercise's rule writes the Performance itself.** `shared/lib/exercise`, a kernel fenced like the others (music,
  a Performance's types and itself; no package), holds one generator per rule, each over a small choice, all laid out
  by `exercisePerformance`: bars of 4/4 to the last note, four a line, a chord per passage (the scale's tonic chord,
  each harmonised note's chord, a ii–V–I's chords) for the symbols and Wait mode's spelling, the notes that start
  together grouped. `notate` writes it like any Performance.
- **Fingering is written where the method fingers it, and only there:** a scale (its taught fingering over any number
  of octaves, `scaleFingering(…, octaves)`), contrary motion, an arpeggio (`arpeggioFingering`, one rule: the thumb on
  the first white tone each octave, the third finger a 4 over a 4th), the five-finger position, Hanon, PWJ's inner
  voice and modes. Sequences, Barry Harris's lines and the rapid switch carry none.
- **The catalogue is content** (`entities/exercise`): each exercise's group, level, name and "trains" line in both
  languages (its group or name says whose idea it is), the choices its rule takes (`fields`, each with what it allows), its own choice, tempo and
  swing. An exercise another Player already plays (the walk, the chromatic walk, a progression through the keys) is
  a catalogue row that names that Player and its params, never a second implementation.
- **One route, one page:** `/play/exercise/$exerciseId`, remembered per exercise. Its URL holds the Player's view and
  any choice (absent is the exercise's own, swing included); `exerciseChoice` reads them against the exercise, so a
  choice it does not take, or does not allow, plays its own way. The Setup shows only the exercise's fields.

## Consequences

- A new exercise is a generator, a catalogue row and a case in `arrangeExercise`; its screen, Setup, sheet music and
  remembered view come with the route. `arrangeExercise`'s test writes every exercise in every root, and the widest
  of each scale kind and arpeggio type, on the piano's keys with every bar filled.
- The exercises' music is in 4/4 8ths (Hanon's 16ths are written as 8ths: the tempo is the learner's).
- Exercises record no practice and rate no skill (ADR 0006): evidence comes from answers; Wait mode is the check.
