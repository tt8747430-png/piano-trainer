# ADR 0043 — Gorshkov's course is a method book, with its textures and its songs

- **Status:** accepted · **Date:** 2026-10-13 · **Amends:** ADR 0042 (Gorshkov's course as no method book),
  ADR 0033 (the method books)

## Context

ADR 0042 made Vasily Gorshkov's accompaniment course a module of Learn but no method book: it had no pattern groups
and no studies, so Practice's Accompaniment had nothing to show for it, and two of the songs its sheets teach on
(«Как олень спешит к воде», «Опять метель») were not pieces. The owner asked for what was left to be finished.

## Decision

- **The course is a method book** (`gorshkov` in `BOOK_IDS` and `METHOD_BOOK_IDS`, «Курс по аккомпанементу»,
  Василий Горшков), called by its author's name as Боброва's is: **Горшков**, in both languages. `COURSE_MODULES`
  is the method books; Learn's Courses tab and Practice's Accompaniment both gain it from the one list.
- **Its pattern group, «Аранжировка аккомпанемента»,** holds six textures from his lessons 4 and 5, `g1`–`g6`: chord
  pulse with beats 1 and 4 brighter, pulse with the 2nd added, broken chords in 8ths, harmonic figuration in 16ths,
  pulse with a run on beat 4, and a line down the 9th chord on beats 3 and 4. His lessons play them over
  «Ромашковые поля» and «Опять метель».
- **Its pieces are its songs** (`METHOD_BOOK_PIECES.gorshkov`): the collection «Песни курса Горшкова», in place of
  Other songs, «Ромашковые поля», «Как олень спешит к воде», «Опять метель». They stay songs, on Songs, as Боброва's
  hymns do.
- **A printed chord the kernel does not write plays as its nearest**, said in the piece's note: «Как олень»'s A13♭9
  as A7♭9, «Опять метель»'s Gm add2 as Gm. Widening the 36 qualities would reach every Skill and trainer.

## Consequences

- Practice's Accompaniment reads Called to Play · Боброва · Горшков · Styles · Yours.
- The pattern book holds 45 patterns in five groups.
