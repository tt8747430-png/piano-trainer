# ADR 0065 — The editor is one screen, its palette one size

- **Status:** accepted · **Date:** 2026-10-20 · **Amends:** ADR 0064 (the palette), ADR 0061 (the editor's tools)

## Context

The owner compared the score editor with Sibelius for iPhone. Ours went past the screen's edge on a phone (a chart
line drawn wider than the screen scrolled sideways), its parts were all different widths (a laptop's ribbon, a notes
column, the sheet and the keys), and its palette changed height with every tab, so the sheet jumped. The keys stood
over the palette when open and folded to a place under it.

## Decision

- **One screen.** The editor never scrolls as a whole: the sheet is its one scroller. A line down the screen is
  justified to the sheet's width; a line wider than that is drawn smaller to fit (the engraver's `fill` shrinks as
  well as spreads), and a chart line of more bars than a narrow sheet holds is cut into even parts (`linesOf`'s
  `most`: two bars on a phone, three on a tablet). The Player's lines fit the same way.
- **The palette, one size.** One palette everywhere (no ribbon, no notes column), its height fixed by the layout and
  never by its tab: at the foot over the keys on a phone held upright and a tablet (three rows of keys, more scrolling
  inside), or a column beside the sheet on a laptop and a phone on its side (the column's height). It folds into a
  button floating over the sheet's lower right corner.
- **The keys** dock where the keyboard settings dock every screen's: at the foot under the palette, or under the
  bar. Folded, the Keys button floats over the sheet's lower left corner, as on every screen (ADR 0055, 0062).

## Consequences

Nothing saved changes. A phone sees two bars a line where the chart writes four; the chart's lines are still the
lines of A4 pages and of the Player.
