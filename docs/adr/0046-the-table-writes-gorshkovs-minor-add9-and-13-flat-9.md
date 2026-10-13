# ADR 0046 — The table writes Gorshkov's m(add9) and 13♭9

- **Status:** accepted · **Date:** 2026-10-14 · **Amends:** ADR 0043 (a printed chord the kernel does not write)

## Context

ADR 0043 played two of Gorshkov's printed chords as their nearest, «Опять метель»'s Gm add2 as Gm and «Как
олень»'s A13♭9 as A7♭9, rather than widen the table, which reaches every Skill and trainer. His sheets print
both again: lesson 5's figuration on Cm add2 and Gm add2, the voicings sheet's E/G over G (G13♭9), lesson 3's
A13♭9 as two chords. The Chords explorer already built a minor triad with an added 9th, by rule, as `m(add9)`,
and could not open it from a symbol. A widened table costs a count in a few tests and nothing else: every
Skill, trainer and tension follows the table.

## Decision

- **Two qualities join the table:** `madd9` (`m(add9)`, also `madd9`, `madd2`, `m(add2)`, `m2`: 1 ♭3 5 9) among
  the 6th and added chords, and `b9n13` (`13♭9`, also `13(−9)`: 1 3 5 ♭7 ♭9 13) among the altered. 38 qualities,
  51 Skills. A lower-case numeral writes the first `iadd9`.
- **The songs play them as printed:** «Опять метель»'s bar 4 is `Gm(add9)`, «Как олень»'s bar 13 `A13♭9`. Only
  «Как олень»'s C♯7♭5 still plays as another chord, the C♯m7♭5 his own sheet names.

## Consequences

- A chord trainer's added 9th asks the minor one too; the Chord finder names both from the table.
