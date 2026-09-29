# ADR 0018 — A lesson is a worksheet: examples that play, a quiz on the keys, links by name

- **Status:** accepted · **Date:** 2026-09-29 · **Amends:** ADR 0012 (Learn's lessons column)

## Context

The roadmap's lessons are The Ultimate Piano's worksheets (a level, a category, live diagrams that play in place)
with Pianote's pop quizzes and grids, in TJPS's modules (roadmap §3.4, §9.5, §9.8, §10.7). The one lesson the app
had was prose, steps, notes and rows of chords. Sub-project 5's spec (§4) settled what a worksheet holds.

## Decision

- **A lesson's blocks** are prose, steps and notes, and examples that play in place: chords as the lesson writes
  them; one quality on all twelve roots (`grid`); a scale, named, its notes with their degrees, its run on one
  staff (`scale`); the Intervals reference's own card (`interval`); a line of notes to read on the staff it is read
  on (`notes`, in `noteLine`'s format `E4 G4/2 B4/8.`). Every example shows on the lesson's pinned keys.
- **A quiz is answered on the keys:** Answer opens it (one open at a time, a reducer's state); taps choose keys with
  the Theory quiz's face; Check marks the right keys by role, the extra ones wrong and the missing ones ringed; a
  wrong answer can be fixed or shown. A chord's notes count in any octave.
- **Links are by name, never by route:** content names a chord symbol, a scale, a key, a tension chord or a lesson;
  the lesson view turns it into the reference's route and search. Content holds kernel values (`note('D')`, a `Key`)
  and symbols the catalog test reads.
- **Lessons are grouped by module** (Fundamentals first) on Learn, with Level and Category pop-ups held in the URL; a
  lesson keeps the Path's four levels.
- **Decided against:** a staff for each chord example (the keys show it; a link opens the Chords reference, which
  writes it); a contents list in a lesson (a lesson is short).

## Consequences

- A lesson's examples are `features/play-example`'s, which the references share; a new example kind joins there.
- Sub-project 6's step pages are made of the same blocks.
