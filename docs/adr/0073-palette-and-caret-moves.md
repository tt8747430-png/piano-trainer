# ADR 0073 — The palette holds tools; the caret's moves stand apart; slurs and legato join notes

- **Status:** accepted · **Date:** 2026-10-21

## Context

The palette repeated itself: its Notes tab carried the caret's ‹ › and Delete and the semitone keys, the chord palette
carried ‹ › and Delete again, and the Pitch keys' pictures (♯↑, 8↓, a note on lines) did not say what they did. The
tabs' pictures stood at different heights. Notes under a slur, or after legato, played cut short like any other.
Touch notation apps keep navigation and Delete on screen but apart from the tools (Dorico for iPad's Advance caret and
Delete left, Flat's bottom toolbars); MuseScore plays notes under a slur joined.

## Decision

- **`CaretMoves`**: ‹ › and Delete by the caret's line, the same in every row and tab; on a phone on its side, at the
  palette's foot.
- **The Notes tab** holds the values, dots, Triplet, Rest, Tie and Chord (stacked noteheads); **Pitch** holds a half
  step, a step of the key and an octave up and down, each key its arrow over the word, and Respell.
- **Tabs and keys** wear a picture alone, as Sibelius's palette does: each tab's drawn in one 24-unit SVG box so the
  row stands level, its name in its tooltip and for a screen reader. Fingering is a hand; Pitch's keys an arrow
  beside a sharp or a flat (a half step), two stepping notes (a step of the key) or 8va (an octave).
- **The + menu's Staves** lists the instruments in one grid in score order.
- **Joined notes** (`joinedNotes`): under a slur, and from legato until leggiero, in their hand, each held to the next
  (103 % of its length; others 95 %).
