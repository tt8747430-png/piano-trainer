# 55. Reharmonise writes the available tensions a second time

Status: done
Severity: P2
Tier: 3
Rule: CODE_STYLE §8 ("Never write a second table of what a chord takes")
Where: `src/shared/lib/music/reharmonise.ts`

## What is wrong

Its table listed Maj7's, m7's and 7's tensions again beside `tensions.ts`, tied by nothing.

## The test that shows it

Reharmonise's tests unchanged and green (same rows, same order).

## The fix

The tension rows come from `availableTensions`; Reharmonise keeps only which chord shows each tension, and throws if one has none.

## Comments
