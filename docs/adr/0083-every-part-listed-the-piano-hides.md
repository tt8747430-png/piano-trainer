# ADR 0083 — Every part listed, the piano among them; a lead sheet hides the piano; the pattern's notes shown soft

- **Status:** accepted · **Date:** 2026-10-23 · Refines [0072](0072-hide-keeps-music.md)

## Context

The Song sheet's Parts list named the chord names, the tune's staff and the more voices, never the piano, and said
nothing of what each was: a pianist could not tell why "Melody" was an option over a grand staff that already had a
treble, nor have the melody and chords alone. In the editor, a hand's bar played by the pattern was an empty staff
with a small "Pattern", so what plays there was not seen.

## Decision

- **Every part listed.** `StaffList` lists the score's parts top down as it writes them: the chord names, the tune's
  staff, each more voice's (each with its instrument) and the piano, each with a line saying what it is. The eye hides
  any of them, the piano too.
- **The piano may be hidden.** `HIDDEN_ROWS` holds `piano`. A score never hides every staff (`showsAStaff`): the store's
  sanitiser shows the piano again where no other staff would be in sight, the editor's `hide` refuses the last staff's
  eye (disabled, the list saying "One staff always stays in sight."), and taking away a lead sheet's last sung part
  brings the piano back. Hidden keeps the music, so what plays is the same.
- **A lead sheet** (`isLeadSheet`) is a piece that hides its piano. The editor's sheet writes no piano (`TimedMusic.piano:
false`) and the caret leaves a hand for the top staff (`staffLeftFor`, `topStaff`). The Player writes the tune's staff
  alone; its tune is always heard there (no tune, nothing to write), so its Setup has no Melody toggle.
- **New song** offers the choice: Chords and piano (the default), Melody and chords (a lead sheet), Piano with melody,
  Piano; `ScoreSetup.piano` is its own switch, kept on while no tune or part is chosen.
- **The pattern's notes shown soft.** The editor arranges its draft once a change (`arrangeDraft`, `playedHands`) and
  `lineMusic` writes, in a bar a hand leaves to the pattern, the notes the pattern plays there, cut at the bar's end;
  the bar's `pattern` staves are typed `pattern` in the MEI and drawn in soft ink (`score.css`), never marked chosen.
  They are not written notes: a click there still puts the caret at the bar's start, the caret is a line, no grip;
  "Pattern" stands over the staff.

## Consequences

A lead sheet reads as one in both screens. A hand's staff is never blank where the pattern plays. Writing out a bar
replaces the soft notes with the written ones.

**Later (2026-10-23, ADR 0091):** the pattern's notes drawn soft, and `StaffList`'s parts, are gone: every bar of
the editor's score is written, so a hand's staff holds its own notes everywhere; the lead sheet and the piano's eye
stay.

**Later (2026-10-24, ADR 0094):** a lead sheet is one boolean, `leadSheet`, read only where the piece has a tune, so
a score never hides every staff without `HIDDEN_ROWS` or `showsAStaff`. The chord names are the View's; New song's
templates are Piano (the default), Melody and chords, and Piano with melody.
