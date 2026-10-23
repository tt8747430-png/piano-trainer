# ADR 0075 — Pages float on a canvas at their print size

- **Status:** accepted · **Date:** 2026-10-21

## Context

The Pages view laid its pages out again for each screen: a page as wide as the screen, its staff at screen size,
so a laptop's A4 page held two bars of Wonderful Grace of Jesus where the printed hymnal
(`piano-data/scores/wonderful-grace-of-jesus.pdf`, Finale) holds four, and a phone's page held one. Measured, the
hymnal's staff is 18 pt on a 612 pt page (a 34th of its width), its systems 12.6 staff spaces apart, one chart
line (four bars) to a system; LilyPond's 20 pt staff is a 108th of its line in spaces, its chord names 2.6 spaces
tall; a Sibelius lead sheet's chord symbols 12 pt over a 4.6 pt space. Notation apps (MuseScore, Dorico, Flat) keep
the page as it prints and let it be zoomed and moved: Ctrl and the wheel or a pinch zoom about the pointer (MuseScore
a sixth of an octave a notch, 5–1600 %), the wheel moves, Fit Page Width opens it.

## Decision

- **`PRINT_SCALE`** (0.6): a page's staff a 33rd of its width, as the hymnal's; lines are cut to the page's own
  width at that size (ADR 0074), whatever the screen.
- **`PageCanvas`** (`shared/ui`): the pages in a column on a canvas, opened with a page's width fitted to the screen
  (never past full size); a drag moves it (past 6 px, so a click or a double click on a bar still reaches it, and
  the click a drag ends with is the drag's); a pinch, Ctrl or ⌘ with the wheel (`2^(1/6)` a notch) and its buttons
  zoom it, 10–400 %; the wheel alone moves it. A grip that holds its pointer (a note's, the loop's) drags itself.
  `pan-zoom.ts` holds its pure moves (`zoomAt`, `fitWidth`, `panBy`, `reveal`).
- **`useCanvasReveal`**: the caret's line and the line playing are brought into sight by moving the canvas, as a
  page scrolls them into view.
- **A page's chord symbols** are 2.6 staff spaces, as they print (`labelScale(scale, true)`).
- A point on a zoomed bar is read back through the zoom (`zoomOf`), so a click places the caret and a double click
  writes the note where it was made.

## Consequences

A page looks the same on every screen, as it will print, and a phone reads it zoomed in. Scroll stays the view
that reflows for the screen.
