# 48. A pickup is played as a downbeat and written as a 1/4 bar

Status: done
Severity: P1
Tier: 3
Rule: CONTENT: `Fm@1` a pickup bar
Where: `src/shared/lib/music/time.ts`, `arrangement/arrange.ts`, `schedule/schedule.ts`, `notation/notate.ts`, `ui/score/vexflow-notes.ts`

## What is wrong

A pickup played the pattern's first beat (otche: the bass's octave on the upbeat), the metronome accented it, the count-in ignored it, and the staff wrote 1/4 then 4/4.

## The test that shows it

`time.test.ts`: "reads a first bar shorter than the meter as a pickup"; `arrange.test.ts`: "plays a pickup as the end of a bar"; `schedule.test.ts`: "counts a pickup as the end of a bar"; `notate.test.ts`: "writes a pickup under the meter’s signature, as a short first bar"; every piece engraves (`notate-pieces.test.ts`).

## The fix

`beatsBefore(bars, index, meter)`: a first bar shorter than the meter is a pickup. Its chords sit where they fall in the meter's bar; the metronome and count-in keep the bar's grid; notation writes it under the meter's signature and the engraver sizes its voice by the measure.

## Comments
