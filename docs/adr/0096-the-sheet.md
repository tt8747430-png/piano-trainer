# ADR 0096 — The sheet: three layouts, a playhead line, one selection in both screens

- **Status:** accepted · **Date:** 2026-10-20 · consolidated 2026-10-27

## Context

The owner wants the score seen as notation software shows it: as it will print, down the screen, or as one long line;
a playhead that runs along the music; what is chosen drawn as Flat, Dorico and MuseScore draw it. The Player and the
editor each had their own cursor, box and gestures, different again in each layout, and boxes drawn on empty staff.

## Decision

- **Three layouts**, one setting for both screens (`scoreView.layout`): **Page view** (`page`), **Vertical scroll**
  (`vertical`) and **Panorama** (`panorama`), chosen in the sheet's one pill at its bottom-right (`SheetPill`, R34).
  - Page view: A4 pages at their print size (ADR 0087) on a canvas (`PageCanvas`), opened with a page's width fitted
    to the room left by what floats over it, dragged, pinched or zoomed with Ctrl or ⌘ and the wheel (10–400%). Its
    zoom buttons stand in the sheet's pill beside the layout, always in sight, so never put under a tap (R34). A
    point is read back through the zoom. The caret's line and the line playing are kept in sight (`useCanvasReveal`).
  - Vertical scroll: lines down the screen, the staff full size from a 600px sheet and smaller under it.
  - Panorama: the whole piece on one line.
- **The title is printed at the sheet's head** in every layout, the page's `h1`.
- **The playhead is a line**: one thin line across the system's staves in sight, the same height wherever it stands,
  just before what sounds. In Listen and the editor's Play it moves with the audio clock between the notes; in Wait
  mode it stands at the notes awaited; the sheet follows it. In the editor it is apart from the caret and the choice.
- **The heads sounding are lit, in the Player only** (R35, after Ivory's Dual View and Piano Forte): on each staff the
  heads of the latest onset at the playhead (a rest silencing that staff) take their hand's colour as their keys below
  do, deep enough for a notehead (`--hand-rh-ink` brick, `--hand-lh-ink` lilac, `--hand-staff-ink` grass), stems and
  beams staying ink. Stopped, they are the notes awaited. Not on a muted hand's staff, not with the playhead hidden; a
  chosen note keeps the selection colour; the editor lights nothing, its colour being the selection.
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
- **A take's verdicts** colour each judged head (`NoteVerdicts`) and draw its shape beside it (`VerdictShapes`, from
  `shared/ui/verdict-shape.ts`): ● right, ◂ early, ▸ late, ○ missed, × wrong. The take's summary leads each count with
  the same shape, and a wrong key on the piano shows the same ×, so colour is never the only cue (R34).

## Consequences

The selection and the playhead read the same in every layout of both screens; a change to their look is one place
(`shared/ui/score`).
