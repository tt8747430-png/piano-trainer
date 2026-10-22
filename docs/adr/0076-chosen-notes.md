# ADR 0076 — Bars of notes are chosen with Shift, drawn as a notation app draws a selection

- **Status:** accepted · **Date:** 2026-10-22

## Context

Shift chose bars in the chord row alone: in a row of notes there was no range at all, so a half step, a step,
Respell or Delete took the notes at the caret one column at a time. The chosen box spanned every staff of the line
from barline to barline, over the clef and key, and the caret ran up to the next note's accidental. Sibelius and
Flat draw a range as one padded box over the staff it is on, its notes in the selection's blue, and a single note
by its blue notehead.

## Decision

- **Shift** with an arrow or a click chooses bars in any row (`selectionTo`, `shortcutOf`).
- **What an edit of notes takes** is the bars chosen, else the caret (`chosenSpan` over `Where`): Delete takes the
  row's notes in them and puts the caret at their start; a half step, a step of the key and Respell move them all
  and keep them chosen, so the next edit takes them too; marks did already.
- **The chosen box** (`chosenBox`) covers the staff of the row it is chosen in, a staff space past it, from the
  first bar's first note (its clef and key left out) to the last's barline, in the caret's light blue with a blue
  ring and a soft shadow; the chords' box reaches over the chord row.
- **The notes chosen** turn blue: `ScoreView`'s `selected` is a span of ticks on a staff, not one tick.
- **The caret** keeps clear of the next note: it ends 16 px before it, past that note's accidental.
