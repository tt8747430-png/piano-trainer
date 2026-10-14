# ADR 0047 — Called to Play's level 2 is a method book, its methods in compound time

- **Status:** accepted · **Date:** 2026-10-14 · **Amends:** ADR 0033 (the method books), ADR 0043 (four groups
  of patterns by book) · **Spec:** `docs/superpowers/specs/2026-10-14-called-to-play-level-2-design.md`

## Context

`piano-data/Called to play/prizvan-igrat-uroven-2-ru.pdf` is the second workbook of Савченко's course: ten
lessons and an exam over 25 Russian hymns, each printed with a way over every chord. It keeps level 1's methods
and plays them in 6/8 and 12/8, adds octaves and chords, joining I–IV–V by the nearest notes, ten left-hand ways
under a tune and the balance of bass, melody and filling. The app taught level 1 only, and a figure written for 4/4
could not play inside a compound beat.

## Decision

- **Level 2 is a method book of its own** (`called-to-play-2`, «Призван играть для Него. Уровень 2», named
  **Called to Play 2**), after level 1 in `METHOD_BOOK_IDS`: its own module on Learn's Courses tab (eleven lessons,
  the book's order), its own part of Accompaniment, its own collection on Songs (`METHOD_BOOK_PIECES`).
- **One set of methods.** A method code means one way in any meter. A figure may carry its compound version
  (`inCompound`, a 12/8 bar in 16ths of the dotted-quarter beat, whose first half a 6/8 bar plays), one for major
  chords there, and its two-beat form for a 6/8 bar alone (`inSix`). Every method plays in compound time; a test
  holds each figure to the book's notes.
- **Level 2's new ways are methods too:** `oct`, `octs` and `ch` (Октавы, Октавы (гамма), Chords), the pattern
  group «Octaves and chords (level 2)». Chord degrees reach 22.
- **A plan is a chart:** each chord a bar, dash-joined chords sharing one, a chord with two ways split in halves;
  what the codes cannot say (3↑, x 1, melody) is in the piece's note. The exam's two songs have chords alone.

## Consequences

- 70 pieces, 48 patterns in six groups, 20 method codes, four method books.
- Боброва's 6/8 and 12/8 hymns can now take Called to Play's methods as well as her types.
