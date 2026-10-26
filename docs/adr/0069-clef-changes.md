# ADR 0069 — A hand's staff changes clef from a bar on

- **Status:** accepted · **Date:** 2026-10-21

## Context

A left hand that climbs over middle C, or a right hand that goes down, is written in the other clef rather than on
ledger lines. Notation apps change a staff's clef at a bar; the owner asked that the editor add what they add.

## Decision

- **Written first in a hand's bar:** `clef:treble` or `clef:bass` before its notes (or before `-`, where the pattern
  plays it) changes that hand's staff from this bar on. `parseHandClefs` reads them onto `ChartBar.clefs`
  (`HandClefs`, `shared/lib/music/clef.ts`); `writeHand` writes them back.
- **Carried by the bars, resolved by notation.** `clefsInForce` holds each hand's clef from a change to the next.
  `PerformanceBar.clefs` carries a change, and where a repeat goes back, the clefs that stand at the bar gone back
  to. `notate` gives each `Measure` the clefs its staves are in where not their own (`clefIn`).
- **Engraved** in that clef: a system's first bar opens in it, and a bar that changes it draws a small clef.
- **Editor.** The + menu's Staves tab has a Clef from this bar group, each hand in each clef, the one in force
  pressed. A click on a staff writes the note the clef there names (`staffClefAt`). A line of the sheet starts in
  the clefs its first bar is in.

## Consequences

A clef changes at a bar's start, not mid-bar. The tune's staff keeps the treble clef (its instruments, ADR 0070,
were removed by ADR 0091).
