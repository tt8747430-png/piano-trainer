# 46. Swing swings a shuffle a second time

Status: done
Severity: P1
Tier: 3
Rule: "Off-beat 8ths late, long-short"
Where: `src/shared/lib/schedule/swing.ts`

## What is wrong

`swingTick` moved every tick, the triplet grid too: a blues shuffle's 2:1 became 3.5:1, and even triplet 8ths came out uneven.

## The test that shows it

`swing.test.ts`: "leaves a note written on the triplet grid where it is: it is long-short already".

## The fix

A tick on the triplet grid (a third or two thirds into the beat) stays.

## Comments
