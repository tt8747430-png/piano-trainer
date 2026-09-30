# 53. A pass drops a note still held where it starts

Status: done
Severity: P2
Tier: 3
Rule: A loop plays its passage (the glossary's Pass)
Where: `src/shared/lib/schedule/schedule.ts`

## What is wrong

Only notes starting inside a pass sounded, so a loop from bar N (or Play from the cursor) dropped a tune note tied over its first barline and a bass held from beat 1.

## The test that shows it

`schedule.test.ts`: "sounds a note still held where the pass starts, from there for what is left of it"; "ends a pass where it is told…" now hears the held bass.

## The fix

A note sounding across the pass's start sounds from there, for what is left of it.

## Comments
