# R35 item 1: the notes sounding, lit on the staff

## Source

Owner, 2026-11-06: "look at these websites (Ivory) and the open source repos, the most valuable too, and improve our
design". Ivory's Dual View lights each note on the staff as it sounds, in step with the keys. Piano Forte (the most
valuable reference, `.scratch/r34/ref/more-pianos.md`): notation is sacred, colour on it for state only; the note
awaited is lit.

## Today

The Player's score shows a thin playhead line (`shared/ui/score/Playhead.tsx`); the keys light in the hand's colour
(`--hand-rh` brick, `--hand-lh` lilac, `--hand-staff` grass). Nothing on the staff says which heads sound.

## Will build

- In the Player only (not the editor, whose colour is the selection): the heads at the playhead, on each staff the
  latest onset at or before it, drawn in their hand's colour: treble brick, bass lilac, a single staff grass. A rest
  as the latest onset lights nothing on that staff.
- While the music plays they follow the playhead every frame; stopped, the heads at the cursor (the notes awaited).
- Not on a muted hand's staff, not while the playhead is hidden; a chosen note keeps the selection colour.
- Heads and accidentals only; stems, beams and the staff stay ink.
- DESIGN.md (the score), ADR 0096 amended; the design system's README.
