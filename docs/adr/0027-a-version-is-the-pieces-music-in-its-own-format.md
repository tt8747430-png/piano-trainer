# ADR 0027 — A version is the piece's music in its own format; the editor edits music, not a Score

- **Status:** accepted · **Date:** 2026-10-01 · **Amends:** ADR 0013's consequence that "the editor edits a Score and
  adds `perform(score)`" · **Builds on:** ADR 0002 (content as code), ADR 0023 (an inversion and a walk of keys play any
  chart), ADR 0026 (the learner's own beside the built-in, looked up in one place) · **Spec:**
  `2026-10-01-score-editor-design.md`

## Context

Sub-project 9 asks for the learner's version of any piece (its notes, melody and chord symbols), songs written from
scratch, undo and redo, input from the mouse, the computer keyboard and MIDI, and the Player playing the version. A
piece here is a lead sheet arranged by a pattern: its chart, an optional tune and a pattern become a Performance in
any key, chord size, inversion or walk of keys. Editing the Score that `notate` writes would freeze one key and one
accompaniment into notes. Only 3 of 54 pieces have a tune and 7 songbook entries have no chart, so writing tunes and
charts is most of what a learner needs; writing the accompaniment note by note matters for a bar or a passage, not
for every bar.

## Decision

- **The editor edits a piece's music:** its chart (sections, lines, bars of chords), its tune, and any bar of either
  hand written note by note (a **written hand**), which `arrange` plays in place of the pattern's hand in that bar,
  moved to the key like the tune. The Performance still comes from `arrange`; there is no `perform(score)`.
- **A version is stored in the content's own text format** (`PieceMusic`: key, meter, tempo, pattern, sections,
  melody, hands), so one parser reads content and saved music, a version is a `ChartPiece`, and every reader
  (`chartOf`, `melodyOf`, `pieceFit`, the headings, the Setup) reads it unchanged. The format gains `hands` (bars of
  pitches with `+`, `^finger`, `r`, `@beat`, `-` for the pattern's bar); writers turn music back into the shortest
  text the parsers read the same, every catalog piece round-tripped by a test.
- **`pt-pieces` (version 1)** keeps the learner's versions by the catalog id they replace, their own songs
  (`my-<n>`, never given twice) and the next song's number; the sanitiser keeps only music that parses. A version
  equal to its original is no version; Reset to the original deletes it.
- **The repertoire** (`repertoire(state)`, `useRepertoire()`) is the catalog as the learner has it: each piece in its
  version (a listing's makes it a song), and their own songs. The router (its context holds the store), Songs, a
  piece's page and the Player read it; lessons, the Path, the Check and the pattern pages read the catalog, which
  they teach.
- **A recording plays along with a version only on the original's timeline** (key, meter, every bar's length).
- **The editor is a pure draft and reducer** (`features/score-editor`): bars of chords by where each starts, the
  melody and the hands as notes on the piece's timeline, a caret, the layer, the note value, a visit's clipboard and
  200 steps of undo; every change is saved as it is made. Its sheet draws one line of grand staff per chart line.

## Consequences

- A written-out accompaniment keeps everything else the Player offers: another key, a walk of keys, the hands, Wait
  mode; only its written bars ignore the pattern, chord size and inversion.
- The format is the content's too: a piece in the catalog may write a hand out where its book does.
- MusicXML, recording from MIDI and lyrics stay planned; ChordPro and PDF export are not for this app; an own
  pattern's figure is still made of the catalog's figures (a figure's notes are tokens over any chord, not pitches).
