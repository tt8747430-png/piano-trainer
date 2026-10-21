# ADR 0005 — Levels live on the Path, nowhere else

- **Status:** accepted · **Date:** 2026-09-24 · amended by [ADR 0018](0018-a-lesson-is-a-worksheet.md): a lesson,
  which is no Step, carries its own level on the Path's four; and by [ADR 0048](0048-the-path-reads-the-subjects-lessons.md):
  a subject's lesson is a Step, placed on the Path by that level

## Context

Every Step has a level from 1 to 4, and Songs filters by level. A `level` on each piece as well as the piece's
place on the Path would be two sources of truth, and no test could say which is right when they disagree.

## Decision

`entities/path/content/path.ts` is the only place a Step's level is written: a Step's level is the list it sits in. Pieces
carry no `level`; Songs reads a piece's level through `levelOf(stepId)`. Tests require every Piece on the Path
exactly once and no Listing on it; once the Path is levelled (roadmap sub-project 6), every level holds at least
one Step, and that work adds the test.

## Consequences

- Re-levelling is moving a line in one file.
- Until sub-project 6 levels the Path, everything sits at level 1.

## Amendment (2026-10-11): the Path is levelled

The Path holds four levels, each taught in order: level 1 the triads, the major and minor scales, the pentatonics and
songs on a few triads; level 2 the 6th and 7th chords, the other minors and the blues scales, and songs in minor or
with a dominant 7th; level 3 the 9ths, the modes and songs with slash chords; level 4 the altered chords, Locrian and
songs with diminished passing chords and 9ths. A test requires every level to hold a step.

## Amendment (2026-10-21): Songs filters by a course's stage

The Path gave way to the Courses (ADR 0053): a song's level is now its course's Stage (`pieceStage`), and Songs
filters by it (`?stage=`), offering only the stages the shelves shown hold. A song in no course (the learner's own,
a listing, a method book's) has no stage: a stage chosen leaves it out, and where none of a shelf's songs has one,
Stage is not offered.
