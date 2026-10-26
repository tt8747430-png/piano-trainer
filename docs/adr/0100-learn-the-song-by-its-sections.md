# ADR 0100 — A song is learned by its sections: its chords, its changes, its sequences, its pattern

- **Status:** accepted · **Date:** 2026-10-25 · **Amends:** ADR 0098 (the song's page) · **Amended by:** ADR 0106
  (the learning card goes) · **Spec:**
  [chord views and song lessons](../superpowers/specs/2026-10-25-chord-views-and-song-lessons.md)

## Context

The owner showed Chordify's "Learn the song": a card saying where to start with the song's progress, its facts as
cards, its sections as rows each with its lessons done, and a section's page that teaches its chords one by one, the
changes between them one at a time, its chord sequences in time and its strumming pattern. The song's page said what
the song is and opened the Player at a section (ADR 0098), but taught nothing step by step and kept no progress below
a whole piece's Learned mark.

## Decision

- **The song's page is "Learn the song".** Under its bar: a card with where to go next and the song's lesson
  progress, its key, time and tempo as fact cards, its chords as diagrams (each opening its sheet), its sections as
  rows (a tile in the section's paint, its lessons done of all), and Play along; its note last.

  **Amended** (2026-10-26, ADR 0106's second round): the owner did not want the card on top, and found the page
  too much at once ("all of the chords when it has no sections… the play song is at the bottom, and this scale…
  also at the bottom, and also I don't like the descriptions"). The page is now, top to bottom: its bar and byline;
  **Practise**, first and largest (the Player as it was left; the floating Practise and Play along go); its key,
  time and tempo; the way to its key's scale under them, its note behind an ⓘ (no paragraph on the page); its
  chords as diagrams, once; its sections, only where it has more than one (a song of one section shows none of the
  section machinery: its lessons are its section page's). `LearnCard`, `nextStep`, `songProgress` and `PlayAlong`
  go. A section's page keeps its chords open and folds its Changes and Pattern until asked for; one change alone
  is not listed apart from its sequence.
- **A section's page** (`…/$pieceId/sections/$section`) teaches it in order: each chord (learned by playing it in
  its sheet, on a MIDI keyboard or the sheet's keys), each change between two chords (the Player looping the bars it
  is in), each chord sequence in time (the Player looping it), and each pattern it is played with (the Player
  looping a bar of it).
- **Progress is what was played.** `pt-progress` keeps the lessons done by key: a chord played in a song, and a
  Wait-mode pass finished over a run of bars, which the Player records for any loop or the whole piece. A section's
  lessons and their keys are computed from the music; nothing about a section is stored but what was played.
- **The whole piece's Learned mark stays** the learner's own: lessons never mark it.

## Consequences

`pages/piece` (the page, the section page), the router (two routes, one a shelf's), `entities/progress` (`lessons`,
version up), a new `features/record-lesson`, the lessons' model, `pages/player` (a finished pass recorded),
`widgets/chord-diagrams` (the sheet learns a chord where it is asked to). A section page's lessons follow the music:
a chord the learner's version changes is a new lesson; bars that no longer hold the same change keep their key's
state.
