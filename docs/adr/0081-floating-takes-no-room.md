# ADR 0081 — What floats over the music takes no room

- **Status:** accepted · **Date:** 2026-10-22 · **Amends:** ADR 0061 (the Player's transport), ADR 0079 (the
  editor's tools)

## Context

The Player's transport had a row of the screen's grid, kept empty when it hid; the editor padded its sheet by
the palette's width beside it and by the foot's height on the Pages canvas. Folded, the palette beside the sheet
jumped from the top of its side to the foot's corner, and its row of tabs grew and lost a Keys button as the keys
folded and unfolded. Floating controls that reserve room, move when they fold, or change what they hold read as
unreliable.

## Decision

- **Floating means over the music, never beside it.** The Player's transport stands in the sheet's grid cell,
  over its foot (upright over its end on a phone on its side); the editor's dock and palette stand over the
  sheet, which is as wide and tall as the screen gives it.
- **Room to scroll, not room kept.** A scrolling sheet has room past its last line to bring it above what floats
  at its foot (`--float-room` in the Player, the measured foot in the editor); the Pages canvas pans.
- **A palette folds in place:** folded, its row of tabs stays where the card's was, at the foot or at the top of
  its side.
- **The keys come and go in one way on both screens:** folded from their rail, brought back from View. Nothing
  appears in another control's row as they do.
- **The editor's Song wears the Player's Setup sliders**, named on a wide screen, as both are the song's own
  settings.

## Consequences

What floats can cover the music's edge; it steps aside while the music is read (`useHiddenWhileReading`) and
comes back at a tap, so nothing is hidden for long.
