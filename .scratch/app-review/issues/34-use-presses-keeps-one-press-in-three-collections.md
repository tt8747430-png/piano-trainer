# 34. usePresses keeps one press in three collections

Status: done
Severity: P3
Tier: 2
Rule: Smell baseline: Data Clumps
Where: `src/shared/lib/use-presses.ts`

## What is wrong

A young press's timer, its youth and whether it was let go lived in three parallel collections.

## The test that shows it

`use-presses.test.ts` and the keyboard's tests, unchanged and green.

## The fix

One map from a young press to its timer and whether it is let go.

## Comments
