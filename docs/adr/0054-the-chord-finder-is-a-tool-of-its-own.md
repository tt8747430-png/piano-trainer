# ADR 0054 — The Chord finder is a tool of its own

- **Status:** accepted · **Date:** 2026-10-15 · **Supersedes:** ADR 0052's Free play (Play · Find · Mark) and ADR
  0034's live score as a page of Free play

## Context

Free play held three modes on one page: Play (a live score under the keys, with a metronome), Find (the chord
finder) and Mark (a teaching diagram). The owner wanted the chord finder as a tool of its own, after MIDI chord
players and identifiers (orbkord, Piano Lesson with Warren's MIDI player, PianoLab and the chord identifiers): the
chord being played named at once and seen on a staff. Free play and Mark are not needed.

## Decision

- **The Chord finder** (`/practice/chord-finder?keys=&key=`, remembered with its key) replaces Free play in
  Practice's At the keys group. Free play, Mark, the diagram marks, the stand-alone metronome and the live score widget
  are removed.
- The chord shown is the one a MIDI keyboard plays, as its keys went down, read on once they are let go
  (**Last played**); without MIDI keys held, the keys tapped (kept in the URL, a link to send).
- It is named as large as the page allows, spelled in the key chosen, in every **reading** `nameChords` gives
  (every chord the Chords page builds, in any inversion over its bass, tones left out), one chosen to mark the keys by
  degree and open in Chords; two notes are an interval, a perfect 5th also a power chord (`C5`).
- The chords played are logged (`logKeys`: a chord grows while no key is let go; a key struck after one was let go
  starts the next) and written in turn on a grand staff, each named over its bar; then the keys that hold the chord.

- What a reading is, under its name: its kind, its inversion, the tones left out, how the keys lay it out
  (`voicingKind`: close, open, drop 2, drop 3, a shell of root, 3rd and 7th, stacked 4ths, the So What
  voicing), and a dominant with two altered tensions or more as a chart writes it (`alteredSymbol`: `C7alt`).
  A setting names an inversion over its bass (`C/E`, the default) or by its root alone, its inversion said.

## Consequences

- `/practice/free-play` is gone with no redirect (no users before release).
- Its state lives in `pages/chord-finder` (`useChordFinder`); the naming, log and staff are `widgets/chord-finder`.
