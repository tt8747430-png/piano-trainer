# ADR 0067 — Barlines and repeats, engraved as written and played as taken

- **Status:** accepted · **Date:** 2026-10-21

## Context

The owner asked that the editor add what Sibelius's Barline tiles add, rather than leave them out: repeats, 1st
and 2nd endings, double and final barlines.

## Decision

- **Chart text.** Between a line's bars: `|:` starts a repeat at the next bar, `:|` ends one at the bar before, `||`
  is a double barline and `|.` the final one; `[1` or `[2` before a bar puts it in that ending (each bar of a long
  ending marked). They are `BarMarks` (`shared/lib/music/bar-marks.ts`) on a `ChartBar`, written back by `writeBar`.
- **Engraved as written.** Notation carries each bar's marks to its `Measure`; the engraver draws repeat barlines
  with their dots, double and final barlines (across the grand staff too), and each ending's bracket over the top
  staff, numbered where it begins, with room made over the staves for it.
- **Played as taken.** `playOrder` is the order the bars are played: back once from a repeat's end to its start (the
  piece's where none starts it), the 1st ending left out the second time. `arrange(…, { unfold: true })` lays the
  bars out in that order (each `PerformanceBar` naming the bar it plays as `written`), the tune and voices going
  round with them, the repeats' signs left out and a double or final barline kept. The Player plays and shows the
  piece unrolled; the editor, the song's page and the chord chart keep the bars as written.
- **Editor.** The + menu's Barlines put a mark on the bars chosen, or the caret's: a repeat's start on the first,
  its end (or a double or final barline) on the last, an ending over them all; a mark a bar has comes off; Plain
  takes them all off.

## Consequences

The editor's Play plays the bars as written, so the caret's place on the timeline stays true; the Player is where
a piece is heard with its repeats.
