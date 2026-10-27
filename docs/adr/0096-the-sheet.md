# ADR 0096 — The sheet: three layouts, a playhead line, one selection in both screens

- **Status:** accepted · **Date:** 2026-10-20 · consolidated 2026-10-27

## Context

The owner wants the score seen as notation software shows it: as it will print, down the screen, or as one long line;
a playhead that runs along the music; what is chosen drawn as Flat, Dorico and MuseScore draw it. The Player and the
editor each had their own cursor, box and gestures, different again in each layout, and boxes drawn on empty staff.

## Decision

- **Three layouts**, one setting for both screens (`scoreView.layout`): **Page view** (`page`), **Vertical scroll**
  (`vertical`) and **Panorama** (`panorama`), chosen as tiles with their miniatures.
  - Page view: A4 pages at their print size (ADR 0087) on a canvas (`PageCanvas`), opened with a page's width fitted
    to the room left by what floats over it, dragged, pinched or zoomed with Ctrl or ⌘ and the wheel (10–400%). Its
    zoom buttons are in sight only while the pages are moved, never at a tap, and take no pointer out of sight. A
    point is read back through the zoom. The caret's line and the line playing are kept in sight (`useCanvasReveal`).
  - Vertical scroll: lines down the screen, the staff full size from a 600px sheet and smaller under it.
  - Panorama: the whole piece on one line.
- **The title is printed at the sheet's head** in every layout, the page's `h1`.
- **The playhead is a line**: one thin line across the system's staves in sight, the same height wherever it stands,
  just before what sounds. In Listen and the editor's Play it moves with the audio clock between the notes; in Wait
  mode it stands at the notes awaited; the sheet follows it. In the editor it is apart from the caret and the choice.
- **What is chosen is coloured**, both sheets, every layout: a note's head, accidental, stem, flag and dots, a chord
  whole or one key of it, a rest. A range is a light band over the staves it takes, from its first note to its last.
  The caret is a thin line on its staff, the note it stands on coloured. The Player's loop is a band over every staff,
  its grips on its barlines. No box hugs the notes and nothing washes on hover.
- **One way to choose** (`useSheetChoice`, `pickAt` over the heads read from the engraving): a click or tap is the head
  under it (one note of a chord), else the chord whose column it is on, else nothing: empty staff is never chosen.
  Shift with a click extends; a finger held 450 ms chooses, and dragged reaches each bar.
  - In the editor the range is notes (ADR 0114).
  - In the Player the range is the loop, in bars (its machine loops bars): a note clicked takes the cursor there and
    lets go of the loop; Shift-click or a held finger sets the loop; Shift with ← → moves its far end a bar, with Home
    or End to an end; Escape lets go of it, then closes.
- **No caret inside a range**, and no playhead while a loop stands chosen and stopped.

## Consequences

The selection and the playhead read the same in every layout of both screens; a change to their look is one place
(`shared/ui/score`).

## History

- 0064 — The tune's own staff; a score laid out three ways (2026-10-20). Its staves are ADR 0097's.
- 0075 — Pages float on a canvas at their print size (2026-10-21).
- 0076, 0082, 0088 — Bars chosen with Shift; one selection in both screens; heads hugged, one note of a chord
  (2026-10-22 to 10-23).
- 0096 — Sheets that show as notation software does (2026-10-24): the playhead line and the colouring replaced the
  boxes. Its fields are ADR 0114's, its explanations ADR 0061's, its recording ADR 0028's.
- 0115 — The layouts renamed Page view · Vertical scroll · Panorama (2026-10-27).
