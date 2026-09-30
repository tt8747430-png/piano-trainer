# 68. The Check counts on `useMemo` to draw its questions once

Status: done
Severity: P3
Tier: 4
Rule: React: `useMemo` is a performance hint, its cache may be dropped
Where: `src/pages/check/ui/CheckPage.tsx:62-65`

## What is wrong

The plan is drawn at random from the evidence; had React dropped the memo, the questions would be drawn again under the learner.

## The test that shows it

Structural: `CheckPage.test.tsx`, green before and after; its not-found case now also covers `/check` and `/check?of=nothing`.

## The fix

`CheckDraw`, keyed by the step, draws the plan in `useState`'s initializer, as My gaps does.

## Comments
