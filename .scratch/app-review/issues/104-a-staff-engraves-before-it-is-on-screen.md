# 104. A staff engraves, and loads VexFlow, before it is on screen

Status: done
Severity: P3
Tier: 6
Rule: ADR 0014, CODE_STYLE §8, CLAUDE.md (`LazyScoreView` loads VexFlow when a staff is first on screen)
Where: `src/shared/ui/LazyScoreView.tsx`

## What is wrong

It loaded on mount: the Intervals page engraved 20 staves at once, and a lesson every staff from its top to its last block as it opened.

## The test that shows it

`LazyScoreView.test.tsx`: "engraves nothing, and loads no engraver, until the staff is on screen".

## The fix

An `IntersectionObserver` (200 px ahead) shows the staff; until then, its space. The test setup's `stubIntersectionObserver` puts everything on screen, and a test can hold it off and `show` it.

## Comments
