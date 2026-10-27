# ADR 0112 — A progression's songs, and a song's progressions

- **Status:** accepted · **Date:** 2026-10-27 · **Amends:** ADR 0041 (the progression library), ADR 0100 (the
  song's page) · **Spec:** [Chordify for piano](../superpowers/specs/2026-10-26-chordify-for-piano.md) §10

## Context

Progressions showed a progression as a row of chords on a staff, played and sent to the Player, but nothing tied
it to the songs. A song's page listed its chords and said nothing of how they move. Chordify's "Chord progression
of the month" shows a progression's numerals, its chords as piano diagrams and a list of songs that use it, in
their own keys. The owner wants both ways: a progression's songs, and a song's progressions.

## Decision

- **A progression is heard in a song by its numerals**, never by its chord symbols, so a song in any key is found
  (`findNumerals`, `numeralReadings` and `standsFor` in the music kernel):
  - each chord is read in the key it is written in, a section's own where it has one (`readInKey`); an applied
    dominant is read both as applied (`V7/IV`) and as its own degree, so Amazing Grace's G7 before C is still the
    I it colours;
  - a song's chord stands for a numeral on the same degree, applied to the same chord if either is, where it
    holds every tone the numeral writes: a plain triad is any chord of it with its 7th, 6th, 9th or sus added (a
    sus's 4th or 2nd stands for the 3rd), and a chord written out asks for what it writes (I7 is no I, nor IMaj7;
    V7♭9 needs its ♭9). The bass is never asked;
  - each numeral is one chord or several running on that stand for it, and a numeral written twice running in
    the library's line is one chord held (`I v v ii` is I–v–ii). A line of one chord is found nowhere;
  - a place runs from the first chord of its first numeral to the arrival of its last; a loop going round may
    start again on that arrival;
  - a place never runs over a bar of no chord symbol or a key change, and only a key of the line's mode is
    searched: a progression's major line in major keys, its minor line in minor ones (ADR 0041).
- **Where it is** (`entities/progression-library`'s `progressionPlaces`): its bars as written, which the row
  says ("bars 5–8") and the Player's `bar` opens at, and the same bars as the Player plays them, its repeats
  taken (`playOrder`), which its `loop` goes round; and its chords as written, a chord held once.
- **Progressions** shows, for the line on it (the library's or one typed):
  - its chords as the Player's diagrams (`chordDiagram`, the same keys and folding as `diagramChord`), each once,
    each opening its sheet, under the row's Play;
  - **Songs with this progression**, after the ways into the Player: every song, the learner's own after the
    catalog's, each as its row is everywhere with the bars and chords it is first heard on, opening the Player at
    those bars, looped. The first eight, then Show all; "No song uses it yet" where none.
- **A song's page** names the library's progressions it uses (`progressionsOf`) in one quiet line under its
  chords: chips by name and numerals, each opening Progressions in the key the song uses it in. One heard only
  wholly inside a longer one there is left out (Amazing Grace's first I–IV–I is its I–IV–I–V's), so the line
  stays short. No line where it uses none.

## Consequences

- **`shared/lib/music`:** `numeral-find.ts` (`findNumerals`, `numeralReadings`, `standsFor`, `FoundSpan`).
- **`entities/progression-library`:** `in-songs.ts` (`progressionPlaces`, `songsWith`, `progressionsOf`,
  `SongPlace`), each piece read once (a `WeakMap`).
- **`features/practice`:** `chordDiagram`, a chord of no music drawn as the Player draws it.
- **`widgets/progression-explorer`:** `ProgressionDiagrams`, `ProgressionSongs`.
- **`pages/piece`:** `PieceProgressions`, under `PieceChords` (which takes `children`).
- No store changes: nothing is saved; the Player's `bar` and `loop` already open a piece at its bars.
- Studies are left out of Songs with this progression: they are practised on Practice, not listed as songs.
