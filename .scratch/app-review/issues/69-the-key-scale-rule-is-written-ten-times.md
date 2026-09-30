# 69. "A minor key's scale is natural minor" is written in ten places

Status: done
Severity: P3
Tier: 4
Rule: CODE_STYLE §8 (one home for each music rule)
Where: `scale.ts`, `numerals.ts` (a private `scaleOf`), `circle.ts`, `scale-chord.ts`, `notation/accidentals.ts`, `KeyExplorer.tsx` (twice), `KeyFacts.tsx`, `KeySignature.tsx`, `PieceFacts.tsx`

## What is wrong

`key.minor ? 'natural' : 'major'` in ten places.

## The test that shows it

`scale.test.ts`: "keyScale is a major key’s major scale and a minor key’s natural minor".

## The fix

`keyScale(key)` in `scale.ts`, exported by the kernel; every site calls it.

## Comments
