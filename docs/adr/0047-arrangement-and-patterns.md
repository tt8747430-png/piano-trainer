# ADR 0047 — The arrangement: a chart and a pattern become a Performance; patterns and the method books

- **Status:** accepted · **Date:** 2026-09-24 · consolidated 2026-10-27

## Context

A piece is mostly a lead sheet played by an accompaniment pattern from the owner's method books: Called to Play's
five ways and techniques (levels 1 and 2, the second in 6/8 and 12/8), Боброва's seven types on a hymn, Gorshkov's
textures. The Player must play any chart in any key, chord size and inversion, and other things than pieces: a
scale's chords, a chromatic walk, a progression, an exercise.

## Decision

- **`arrange(chart, options) → Performance`** (`shared/lib/arrangement`, importing only the music kernel) is the one
  playable truth: each note's written onset, length, roll and spelling, in ticks, with the bars, the chords and the
  beat groups. Everything that plays or draws music reads a Performance.
- **The Player has several sources**, each a page hook filling one `PlayerLayout`: a piece; Walk the chords (a
  scale's chords up and back); the chromatic walk (table qualities root by root, written in C); a progression
  (ADR 0112); an exercise (ADR 0025).
- **A written bar plays as written.** A bar whose hands are written plays them in place of the pattern. An edited
  piece has every bar written (ADR 0114), so the pattern and the Setup's pattern card apply only to a piece no one
  has edited.
- **Starting position and Move smoothly.** The first chord's position is Root to 3rd (root by default); Move smoothly
  (on by default) takes each later chord to the voicing nearest the last, and off, every chord stays in the first's
  inversion. A chord of up to four notes plays whole; a bigger one leaves out its root and 5th, down to four, its first
  tension where the root was (Dm9 from the 3rd is 3-5-7-9). A figure that plays the chord as voiced follows the
  position; a pattern that plays its own shapes keeps them (`followsInversion`).
- **A pattern is a named pair of figures**, a right hand and a left, each a bar of tokens over any chord. A figure may
  carry its compound version (`inCompound`) and its 6/8 form (`inSix`), so one method code means one way in any meter;
  in a meter of groups (5/4, 6/4) a figure plays once a group. A figure that plays the key's triads closes for a
  source with no key; a pattern that plays the tune needs a piece with one, and the content test refuses one that
  would fall back.
- **Swing** is a feel: Straight, Light (3:2), Medium (2:1) or Hard (3:1).
- **The pattern book** holds the built-in patterns and the learner's own (`my-<n>`, never given twice), looked up by
  a ref. Every reader takes the book; a ref it no longer holds plays the music's own pattern. `pt-patterns` keeps the
  favourites, the hidden and the learner's own. Every built-in pattern has its idea in one line; its source's
  description is its page.
- **A method book is a book with its own patterns, pieces and course.** `entities/book` holds the books a source
  cites; the method books are Called to Play, Called to Play 2, Боброва and Горшков. Each has its pattern group, its
  pieces (studies practised on Practice, songs on Songs) and its course on Learn (ADR 0053). Accompaniment on
  Practice is a tab for each book, then Styles and Yours (ADR 0052).
- **A printed chord the kernel does not write** plays as its nearest, and the piece's note says so.

## Consequences

A new pattern figure that plays the chord as voiced follows the position with no change. A new method book is a book
id, its group's book, its pieces and its course: the tabs, the picker and Learn follow.

## History

- 0015 — Progressions in sections; the chromatic walk (2026-09-29). Sectioned progressions went into the library
  (ADR 0112).
- 0023 — An inversion and a walk of keys play any chart (2026-10-01). Its walks are ADR 0112's.
- 0026 — The pattern book; the learner's own pattern (2026-10-01).
- 0033, 0043, 0047 — The method books: Called to Play and Боброва; Gorshkov's course; Called to Play 2 in compound
  time (2026-10-09 to 10-14).
- 0039 — The first chord's position, then Nearest (2026-10-13), renamed Starting position and Move smoothly by 0115.
