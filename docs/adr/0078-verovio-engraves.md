# ADR 0078 — Verovio engraves every score

- **Status:** accepted · **Date:** 2026-10-22 · **Supersedes:** ADR 0013's engraver, ADR 0077

## Context

VexFlow draws what it is told: each bar's width, its columns' spacing, where a tie or a slur bends, how a chord
symbol avoids the next. We had grown an engraver around it (`engrave.ts`, `vexflow-notes.ts`, the LilyPond spacing
port of ADR 0077, chord-symbol widening) and it still read as a sketch beside a printed score. Verovio (LGPL 3, MEI's
reference engraver) lays music out as a notation program does: its spacing, beams,
slurs, ties, dynamics and pedal marks are a publisher's, and it reads MEI, which our Score maps onto one to one.

## Decision

- **The Score is written as MEI** (`scoreToMei`, `shared/lib/notation/mei.ts`): the sung staves, then the piano's
  two braced (a staff drawn alone stands without the brace); measures by index (`m-<i>`), notes, chords and rests
  named by their staff and tick (`n-<staff>-<tick>-<i>`, `c-…`, `r-…`), so what is drawn is found by what it is.
- **Verovio engraves it in a Web Worker** (`shared/ui/score/verovio/`): the WASM build, loaded once, warmed as the
  score view's chunk loads. A line is one system justified to its sheet's width; one whose music is wider is
  drawn smaller, never broken in two. In a test, where jsdom has no Worker, it runs on the test's thread: the
  build leaves that path out, so the app carries Verovio once.
- **The layout is read from the SVG** (`layoutOf`): measures from their staff lines, staves from the first
  measure, onsets from the noteheads' positions, all from the SVG's own coordinates, so a test reads it as the
  browser does. The overlays (the caret, the cursor, the loop, bars to tap, labels) stand on it as before.
- **Chord names, bar numbers and tempo stay ours**, HTML over the staff, as the Player's and the editor's labels.
- **A sheet still breaks its lines by width** (ADR 0074), on bar widths estimated from what each bar writes,
  fitted to Verovio's own natural widths.
- **Precached:** the worker is about 8 MB (2.4 MB as it travels), the one file past the recordings' limit; the
  service worker precaches it so the music is drawn offline.

## Consequences

The engraving reads as print on every screen: the Player, the editor, lessons, explorers and the Chord finder.
VexFlow, its fonts, the spacing port and the canvas and font stubs of the tests are gone. The first staff after
the app opens waits for the WASM to load (warmed early, in the worker); each line after takes tens of
milliseconds, off the page's thread. Verovio's LGPL asks that it stays a replaceable library: it is the
unmodified npm package, bundled only into the worker's own file.
