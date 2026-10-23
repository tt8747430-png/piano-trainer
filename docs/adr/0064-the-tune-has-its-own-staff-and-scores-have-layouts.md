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

**Later (2026-10-21):** what the sheet shows has one home. Finger numbers and Named notes are the View menu's
switches alone, no longer the Setup's tiles too (the Setup keeps how it plays: chord positions, metronome,
count-in, swing), and the View menu's button wears an eye, so it never reads as the Setup's sliders beside it.

**Later (2026-10-21), the sheet's lines:** a line is spread to its bars' share of the longest line's width (the
chart's Equal Columns Rule), replacing the threshold that left a line under 30% of the width natural: a line of
empty bars in the editor now gets room to write in, and bars line up down the page. The layouts' names are one set
in the shared `music` namespace (`SheetLayoutField`), in the order Across · Down · Pages.
