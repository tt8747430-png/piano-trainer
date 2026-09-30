# 30. A perfect Check cannot mark its step, and a piece's Check can skip chords

Status: done
Severity: P1
Tier: 2
Rule: spec §4.6 (the answer that makes every quality Known marks the step); ADR 0006
Where: `src/features/quiz/check-plan.ts`, `src/pages/check/ui/CheckPage.tsx`

## What is wrong

A step's Check asked each quality twice, and Known takes four right: however well a learner answered, the step stayed unmarked. A piece's Check drew its six questions at random, so a chord could go unasked.

## The test that shows it

`check-plan.test.ts` (four tests), `mastery.test.ts`: "stillToKnow", `CheckPage.test.tsx`: "asks a scale the learner already knows once".

## The fix

`stillToKnow(answers)`; a step's Check asks each skill in turn as often as its evidence still lacks (at least once), drawn from the evidence as it opens; a piece's Check asks its chords in turn, six questions or one each.

## Comments
