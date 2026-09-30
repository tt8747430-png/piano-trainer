# 52. The plagal IVMaj7 is offered into a minor chord

Status: done
Severity: P2
Tier: 3
Rule: The plagal cadence into minor is iv
Where: `src/shared/lib/music/passing-chords.ts`

## What is wrong

C → Am offered DMaj7 as its plagal chord.

## The test that shows it

`passing-chords.test.ts`: "makes a minor target’s ii half-diminished and its IV minor, its plagal chord the minor one".

## The fix

The plagal IVMaj7 only before a major To; the minor plagal ivm7 before either.

## Comments
