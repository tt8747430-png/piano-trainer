# 89. `isStepId('piece1')` is true

Status: done
Severity: P3
Tier: 5
Rule: Validating guards
Where: `src/entities/path/model/types.ts:46-48`

## What is wrong

With no colon, `indexOf` is -1 and `slice(0, -1)` reads `piece`.

## The test that shows it

`types.test.ts`: `isStepId("piece1")` and `isStepId("scalemajor")` are false.

## The fix

No colon, no step id.

## Comments
