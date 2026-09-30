# 50. ♭II in E♭ minor reads back as ♯I

Status: wontfix
Severity: P3
Tier: 3
Rule: ADR 0020
Where: `src/shared/lib/music/numerals.ts`

## What is wrong

♭II in E♭ minor is F♭, named plainly E; typed back, E is ♯I.

## The test that shows it

None.

## The fix

None. Minor keys count from natural minor (ADR 0020), and a root is named plainly (CODE_STYLE §8); the Neapolitan of a six-flat minor key is the one place the two meet.

## Comments
