# ADR 0082 — One selection, the editor's and the Player's, in every layout

- **Status:** accepted · **Date:** 2026-10-23 · Refines [0076](0076-chosen-notes.md)

## Context

The score editor and the Player marked what is chosen in their own ways, and differently again by layout. The
editor's caret was a band as wide as the next note's value, so a click on a bar the pattern plays, or between two
notes, drew a box on empty staff; a hover wash over the whole bar stayed behind a tap on an iPhone, another empty
box. A Shift move by bars ended on the next bar's barline and chose that bar too: three bars gone over chose four.
The bars chosen in the chord row covered the whole system. The Player's cursor was a narrower band, its loop a
muted wash from the labels to the foot of the line, its bars ringed on hover, and it had no way to choose bars at
all; its loop grips read a drag in screen pixels, wrong on a zoomed page.

## Decision

- **One look**, in `shared/ui/score` (`selection.ts`, `ScoreMark`): the sky-mist (`--secondary`) with the focus
  colour's ring (`--ring`), the notes inside in the focus colour (`ScoreView`'s `selected`, on one staff or every
  staff). Three marks, one geometry for both screens and all three layouts, in the layout's pixels:
  - **a note** (`noteBox`): a padded box round its column, a staff space past the staves it is on;
  - **an empty place** (`insertBox`): a slim line in the focus colour where the next note goes — never a box;
  - **bars chosen** (`rangeBox`): one rounded box from the first bar's notes (a line's clef and key left out) to
    the last's barline, inset from the barlines.
- **One behaviour**: a tap or click is one note (or beat); Shift with a click, or a finger held 450 ms on a bar and
  dragged (`useHoldToChoose`, now shared), chooses bars — exactly from where the choice began to where it ends.
  - In the **editor** a click lands on a note's start, the room after a bar's last note, or a bar's start where
    its row writes nothing (`tapPlaces`); a double click still writes on any step. The caret is a note's box on
    notes and a line elsewhere. A Shift move ending on a barline ends with the bar before it, and one starting back
    from a barline starts with the bar before it (`selectionTo`). The chord row's bars are boxed over the chord row
    alone.
  - In the **Player** the cursor is a note's box over every staff; the bars chosen are the loop, drawn as the range
    box with its grips down its edges; Shift-click or a held finger sets it, from the bar held (or the loop's start,
    else the cursor's bar) to the one reached.
- **No hover washes** on the bars of either sheet: a touch screen leaves them standing over empty staff.

## Consequences

The selection reads the same in Scroll, Pages and Panorama, in both screens; a change to its look is one place.
The editor's caret no longer shows the next note's length (the palette's value does).
