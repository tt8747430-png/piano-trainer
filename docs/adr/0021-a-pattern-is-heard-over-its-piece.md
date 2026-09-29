# ADR 0021 — A lesson's pattern is heard over its piece, and a progression is the tool's row

- **Status:** accepted · **Date:** 2026-09-30 · **Amends:** ADR 0018 (a lesson is a worksheet)

## Context

The Accompaniment and Gospel modules (sub-project 5's part 5.4) teach the accompaniment patterns already in
`entities/pattern` (Called to Play's five ways and right-hand techniques, Боброва's seven types, the rhythm styles)
and the common progressions. A worksheet's examples play in place (ADR 0018), so a lesson must play a pattern and a
progression, and open the tools and the Player on what it names.

## Decision

- **A pattern is heard over a piece, never alone** (`{ kind: 'pattern', pattern, piece }`): a pattern is a way of
  playing chords and is heard only on chords, and each source teaches its patterns on a piece (the five ways on
  Called to Play's lesson 3, a technique on its lesson's study, the seven types on «О наш Отец на небесах»). The
  block plays the piece's first line with the pattern, both hands, in the piece's key and at its tempo
  (`patternOpening`: `arrangePiece`, then `schedule` cut where the second line begins), and opens the piece in the
  Player with it; the Player closes back through the history, to the lesson. Its name and description are the
  pattern entity's own text. A pattern that plays the tune names a piece with a melody: the content test refuses one
  that would fall back to figuration.
- **A progression is the Progressions tool's row** (`{ kind: 'progression', numerals, key, size? }`): the same
  component, moved to `features/play-example` beside the Intervals reference's card, with a link into the tool.
- **Links reach the tools and the Player:** `progressions`, `passing-chords`, `reharmonise` and `piece`, each read by
  the content test.
- **Modules:** Fundamentals, Accompaniment, Gospel, in that order.

## Consequences

- Jazz's modules need no new block: their patterns, progressions and tools are already these.
- A new pattern shows in a lesson with its entity's name and description; a lesson writes only why it is there.
