# ADR 0077 — A bar's notes are spaced by LilyPond's rule, not VexFlow's

- **Status:** accepted · **Date:** 2026-10-22

## Context

VexFlow spaces a bar's columns by a power of each note's length (`softmaxFactor^(ticks/bar)`, 10 by default): a
half note takes 2.4 times an eighth's room and a whole note 7.5 times, where a printed score gives them about 2 and
2.5. LilyPond (lily/spacing-basic.cc, spacing-spanner.cc) gives a note 1.2 staff spaces more each time its length
doubles, from 2.4 for the shortest that counts (never longer than 3/16), and a shorter note its share of that; a gap
never closes past what its notes and accidentals take.

## Decision

- **`idealSpace`, `columnGaps`, `fitGaps`** (`shared/lib/notation/spacing.ts`): the rule, a bar's gaps by it, and the
  gaps fitted to a width in proportion, each kept at least as wide as its notes need.
- **`formatMeasure`** (the engraver): VexFlow formats a bar to its stave, then its columns are placed by those gaps
  in the width VexFlow justified to. Measuring chord names, the onsets and the drawing all read the same places.

## Consequences

Long notes no longer stretch a bar out of proportion. VexFlow still decides each column's least width, the bar's
width (ADR 0074) and everything drawn on the notes.
