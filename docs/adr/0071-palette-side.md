# ADR 0071 — The editor's palette stands on either side of the sheet

- **Status:** accepted · **Date:** 2026-10-21

## Context

Beside the sheet (a laptop, a phone on its side) the score editor's palette stood on the right (ADR 0065). A
left-handed learner, or one whose mouse works the other side, wants it at the left, as notation apps let a palette
be docked on either side.

## Decision

`pt-settings`' `paletteSide` (`right` · `left`, right by default; a field added later reads as its default) says
the side. The palette's tab row carries a button that moves it to the other side (`setPaletteSide`), beside its
fold. `editor-screen`'s `data-side` swaps the grid's columns; folded, its button floats on the same side. At the
foot (a phone held upright, a tablet) there is one place, and the button is not shown.
