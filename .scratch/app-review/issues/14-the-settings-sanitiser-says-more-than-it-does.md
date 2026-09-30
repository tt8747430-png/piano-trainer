# 14. The settings sanitiser says more than it does

Status: done
Severity: P3
Tier: 1
Rule: A comment says what the code does
Where: `src/entities/settings/model/store.ts`

## What is wrong

The comment said every field keeps the current value when a saved one is not valid; practice toggles and quiz lists take their defaults.

## The test that shows it

None: a comment.

## The fix

The comment names which fields keep the current value and which take their default.

## Comments
