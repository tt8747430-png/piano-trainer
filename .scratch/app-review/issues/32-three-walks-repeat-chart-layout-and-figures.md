# 32. The walk, the chromatic walk and a progression repeat one chart shape

Status: done
Severity: P2
Tier: 2
Rule: Smell baseline: Duplicated Code, Data Clumps
Where: `src/features/practice/{walk,chromatic,progression,arrange-piece}.ts`, `src/entities/piece/model/parse-progression.ts`

## What is wrong

Four copies of four-bars-a-line, three of a chord held a bar of 4/4, four of a pattern with each hand's figure spread over it, and `pattern, rh, lh` travelling together through four choice types.

## The test that shows it

`chart-layout.test.ts`, `accompaniment.test.ts`; every arranger's tests unchanged and green.

## The fix

`fourToALine` and `wholeBar` in `entities/piece`; `Accompaniment` and `accompanimentOptions` in `entities/pattern`, which the choices extend. The chord-size tables (`ChordSize` and `NumeralSize`) go with the kernel in Tier 3.

## Comments
