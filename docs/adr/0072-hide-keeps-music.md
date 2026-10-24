# ADR 0072 — A row hidden keeps its music; a part removed loses it; a new song chooses its score

- **Status:** accepted · **Date:** 2026-10-21

## Context

The editor's Melody staff and voice switches took a staff away with every note on it, so turning one off to see the
piano cleared a song's tune for good. The chord names could be hidden only for a visit, and a new song always started
with chord names over the piano. Notation apps keep the two apart: an eye hides a staff and keeps its notes, Remove
deletes the instrument and its music, and a new score starts from a template.

## Decision

- **Hidden rows.** A piece's `hidden` names the rows out of sight (`HIDDEN_ROWS`: the chord names, the tune's staff,
  each more voice's). The editor's settings list the rows (`StaffList`), each with an eye (`hide`) and, for a part, a
  Remove that takes it away with its notes (undone by Undo). A hidden row is not drawn, the caret passes it by, and its
  notes are saved and still heard.
- **An empty staff stays.** A tune's or a voice's staff the score has is written though empty, as a rest
  (`emptyLine`), so it is read back as there; the tune's staff is there wherever the music has a line for it.
- **A new song's score.** New song shows what the score holds and a Customize button opening its own sheet
  (`ScoreSetupSheet`): a template (Chords and piano, the default; Lead sheet; Piano), the chord names and the tune's
  staff on or off, and up to three more parts on instruments. `makeSong` writes them (`ScoreSetup`, `chartStart`).

## Consequences

The Player keeps its own View menu for what it shows; a song's hidden rows are the editor's.

**Later (2026-10-23, ADR 0091):** the more voices and their instruments are gone, and `StaffList` with its Remove
with them: the rows are the chord names, the tune's staff and the piano, each shown or hidden; a new song chooses
those three rows.

**Later (2026-10-24, ADR 0094):** `hidden` and `HIDDEN_ROWS` are gone. The chord names shown or not are the View's
(`scoreView.chordNames`), the tune's staff is added or taken away with its notes, and the one row a score hides is
the piano, a boolean (`leadSheet`). A new song chooses the tune's staff and the piano.
