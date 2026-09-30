# 54. One name, 13, for two 13th chords

Status: done
Severity: P2
Tier: 3
Rule: ADR 0014 (a chord named by the table, else the stacks' rule); one name, one chord
Where: `src/shared/lib/music/scale-chord.ts` (stackSuffix)

## What is wrong

The Scales reference named the 7-note stack on V of C `G13` with its natural 11th (C); the Chord builder's G13 leaves the 11th out over a major 3rd.

## The test that shows it

`scale-chord.test.ts`: C major's 7-note stacks: `CMaj13(11) … G13(11)`.

## The fix

A 13th stack over a major 3rd that keeps its natural 11th says so: `(11)`.

## Comments
