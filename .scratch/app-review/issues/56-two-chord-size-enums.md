# 56. Two chord-size enums and three tables of their notes

Status: done
Severity: P2
Tier: 3
Rule: Smell baseline: Duplicated Code; one rule, one home
Where: `entities/piece` (`ChordSize`), `shared/lib/music/numerals.ts` (`NumeralSize`), `features/practice/walk.ts`, `ui/PractiseChords.tsx`

## What is wrong

`CHORD_SIZES`/`ChordSize` and `NUMERAL_SIZES`/`NumeralSize` were the same enum; the notes of each size were written in `numerals.ts` and `walk.ts`, and inverted in `PractiseChords`.

## The test that shows it

Every consumer's tests unchanged and green.

## The fix

The kernel owns `CHORD_SIZES`, `ChordSize`, `SIZE_NOTES` and `sizeOfNotes` beside `ChordNotes`; the entity and every caller use them.

## Comments
