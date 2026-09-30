# 41. The circle of fifths puts E♭m under F♯

Status: done
Severity: P1
Tier: 3
Rule: CODE_STYLE §8 (never move by semitones, then choose); ADR 0014 (a key shows its signature's count)
Where: `src/shared/lib/music/circle.ts`, `src/app/routes/search.ts`

## What is wrong

The inner ring was spelled by semitones from the major, so F♯ (6♯) sat over E♭m (6♭), while the Keys page's facts named F♯'s relative D♯m; and the Keys URL turned D♯m into E♭m, which the circle then did not hold.

## The test that shows it

`circle.test.ts`: "goes round by fifths from C, each major over its relative minor with the same signature", "circleKey"; `KeysPage.test.tsx`: "reads a key spelled another way as the circle spells it, with its relative’s signature".

## The fix

Each place's minor is its major's `relativeKey` (by letters); `circleKey(pc, minor)` spells a key as the circle does, and the Keys URL reads to it.

## Comments
