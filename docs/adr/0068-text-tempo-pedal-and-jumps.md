# ADR 0068 — Expressions, the tempo, the pedal, and the jumps

- **Status:** accepted · **Date:** 2026-10-21

## Context

The owner asked that what a notation app's Text and Repeat tiles add be added rather than left out: words over the
notes (dolce, rit.), the tempo over the first bar, the sustain pedal's marks, and the jumps (D.C., D.S., Fine, the
sign, the coda).

## Decision

- **Expressions and the pedal are note marks** (ADR 0063): `dolce` `cantabile` `espress` `legato` `leggiero` `rit`
  `rall` `accel` `atempo`, and `ped` (down) `pedch` (let up and down again) `pedup` (up). `EXPRESSION_TEXT` is how a
  score prints each, in italics over the note; the engraver draws the pedal as Ped. … ✱ under the staff.
- **They are heard.** `tempoWarp` (`shared/lib/schedule/tempo-marks.ts`) holds the time back from `rit` or `rall`
  and presses it on from `accel`, easing over two beats to three quarters or five quarters of the tempo, until
  `atempo`. `pedalHeld` (`pedal-marks.ts`) holds each note struck under the pedal until it lets up. Both read
  `Performance.timing`, every part's marks whether the learner hears that part or not; a count-in keeps the
  written tempo, and a bar tapped plays to its own end, however long the marks make it.
- **The tempo** is engraved over the first bar (`Measure.tempo`, ♩ = n, a dotted quarter's in a compound meter),
  after a sign that bar has. The + menu's Text sets it by its word (Largo 50 … Presto 160).
- **Jumps are bar marks** (`BarMarks`, ADR 0067): `Segno` or `Coda` before a bar puts its sign at its start;
  `Fine`, `ToCoda` and a jump `DC` `DC.Fine` `DC.Coda` `DS` `DS.Fine` `DS.Coda` after a bar stand at its end. The
  engraver draws them over the top staff. `playOrder` takes a jump once, back to the start or the sign, plays on
  without repeats or 1st endings as players do, and stops at Fine or goes from To Coda to the coda's sign. A repeat at the jump's bar is taken first.
- **Editor.** The + menu has a Text tab (expressions, the pedal, the tempo) and the Barlines tab a Jumps group. An
  expression goes on the first onset of the bars chosen, the pedal down there and up at their last.

## Consequences

The Player unrolls jumps as it does repeats; the editor's Play still plays the bars as written.
