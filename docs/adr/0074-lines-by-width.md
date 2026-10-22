# ADR 0074 — A sheet's lines are cut by width, pressed before shrunk, the tempo in the labels' row

- **Status:** accepted · **Date:** 2026-10-21

## Context

Down the screen and on pages, the sheet cut a chart line by a count of bars (`floor(width / 150px)`), the same for a
lead sheet's whole notes as for a hymn's four-part sixteenths: Wonderful Grace of Jesus showed one or two bars a line,
and a phone drew the staff at full size, one bar to a line. A line wider than the screen was drawn smaller at once.
The tempo took a row of its own between the chord names and the staff. LilyPond and abcjs break lines by the music's
width (LilyPond's optimal breaker, abcjs's `wrap`) and compress a crowded line before anything else; the printed
hymnals in `piano-data/scores` keep one chart line (four bars) to a system.

## Decision

- **`measureWidths`** (`shared/lib/notation`) estimates each measure's tightest width from its columns of notes and
  rests, its accidentals and its chord names (which keep their own size, so take more of a smaller staff's units);
  `lineLead` the clef and key.
- **`breakLine`** (`shared/lib`) cuts a chart line into as few lines as hold it, then as even as they come by width;
  a tie leaves the earlier line fuller. The editor's sheet (`linesOf`) and the Player's (`scoreLines`) both use it.
- **Every line is justified** to the sheet's width, as LilyPond's are (`ragged-last` off): lines of one width down
  the screen. Chord names that are hidden take no room in a bar's width.
- **The engraver presses** a too-wide line toward each measure's `tight` width (its notes at 1.2 of VexFlow's least,
  never closer than its chord names need) before it draws the line smaller.
- **Down the screen**, the staff is full size from a 600 px sheet and smaller below, never under 0.72.
- **The editor's tempo** stands in the labels' row by the line's first bar number, not engraved over the staff.

## Consequences

Lines hold what fits: a hymn four bars to a line on a tablet, two on a phone. The widths are estimates: a line they
under-measure is pressed, then drawn smaller, as before.
