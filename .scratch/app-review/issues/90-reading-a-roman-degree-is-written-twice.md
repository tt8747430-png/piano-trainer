# 90. Reading a Roman degree and its ♭ or ♯ is written twice

Status: done
Severity: P2
Tier: 5
Rule: CODE_STYLE §8 (one home for each music rule)
Where: `src/entities/piece/model/parse-progression.ts:23-32`, `src/shared/lib/music/numerals.ts:22-30`

## What is wrong

The piece parser kept its own Roman list and sign table beside the kernel's.

## The test that shows it

`numerals.test.ts` (`readDegree`); the catalogue's tests read every piece as before.

## The fix

`readDegree(sign, roman)` in the kernel; both readers call it. What a degree means stays apart: a piece counts from the major scale, a numeral in minor from natural minor (ADR 0020).

## Comments
