# 35. The practice machine keeps `playing` beside its outcome

Status: wontfix
Severity: P3
Tier: 2
Rule: CODE_STYLE §3 (one union value, never a flag each)
Where: `src/features/practice/practice-machine.ts`

## What is wrong

`playing`, `outcome` and `wrong` could in type say `{ playing: true, outcome: 'finished' }`.

## The test that shows it

None.

## The fix

None. The reducer never makes that state and its tests pin every transition; a union would reshape every consumer of `PracticeState` for no behaviour a learner meets.

## Comments
