# ADR 0079 — The score editor floats its tools over the sheet

- **Status:** accepted · **Date:** 2026-10-22 · **Amends:** ADR 0065 (the palette's place and size; removed by ADR 0091)

## Context

The editor gave its palette a row of the screen at the foot, or a column beside the sheet, of one fixed size
whatever its tab, and the caret's moves a row of their own under the sheet. Rows that held empty card, a status row
of outlined buttons unlike the Player's floating transport, and a palette that moved when the keys opened or
folded made the screen read as a form, not a notation app.

## Decision

- **The screen is the bar, the sheet and the keys.** The caret's line is in the bar under the title, or, on a
  phone where the bar has no room, in the moves' pill.
- **What works on the sheet floats over it**, above everything and never moving it: the caret's moves ‹ › ⌫ in one
  pill (the Player's `FloatingBar`), the folded keys' and palette's buttons beside it, and the palette, a card as
  tall as its keys (scrolling them past a share of the screen), at the foot on a phone held upright and a tablet
  (at most 36rem wide), beside the sheet on a laptop and a phone on its side, on the side the learner chose.
- **The sheet keeps clear of it:** it scrolls its last line above what floats at its foot, and its lines end short
  of the palette beside it, by their measured sizes.
- **The editor's layout and whether its palette is folded are settings** (`editorLayout`, `paletteFolded`), the
  same on every song.

## Consequences

Opening or folding the keys moves the sheet's area, and the tools with it, never one over the other. The palette
changes height with its tab, which moves nothing but itself.
