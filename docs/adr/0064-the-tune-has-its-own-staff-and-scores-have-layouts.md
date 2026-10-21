# ADR 0064 — The tune has its own staff; a score is laid out three ways

- **Status:** accepted · **Date:** 2026-10-20 · **Amends:** spec §2.4–2.5 (one grand staff), ADR 0061 (the palette)

## Context

The owner wants the editor to work as Soundslice and Sibelius do: the learner clicks the staff they write on, with
no Melody, Right or Left choice in the palette; the tune is a staff of its own, added like an instrument, and every
staff can be hidden. They also want the score seen as it will print (A4 pages) and as one long line, besides the lines
down the screen.

## Decision

- **Staves.** A score writes the staves `melody` (a treble), `treble` and `bass`, top down. `TimedMusic.melodyStaff`
  puts the tune's notes on their own staff; without it the tune stays the treble's upper voice, as lessons and the
  explorers write it. `Score.staves` says which it writes; the engraver draws them, or those asked for (`staves`),
  joining the grand staff with a brace and its barlines and the system at its left.
- **The editor** shows the tune's staff once the piece has a tune or the learner adds one (`Draft.melodyStaff`); a
  click writes the staff under it (or the chord row over the staves), and the editor opens on the top staff.
- **Layouts.** `SHEET_VIEWS` (`scroll`, `pages`, `horizontal`) live in the URL (`?layout=`): lines down the screen;
  the same dealt onto A4 pages at the screen's width, the title on the first; or the whole piece as one line.

## Consequences

Nothing saved changes: the tune's text is as it was. The Player keeps one line until its own views follow (phase 3).
