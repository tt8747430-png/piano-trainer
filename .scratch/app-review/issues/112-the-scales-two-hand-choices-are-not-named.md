# 112. The Scales view's two hand choices read as one

Status: done
Severity: P2
Tier: 7
Rule: DESIGN (two segmented controls whose words could be mistaken for each other name themselves on screen)
Where: `src/widgets/scale-explorer/ui/RunView.tsx:72`, `ScalePractice.tsx:29`

## What is wrong

Fingers (None · Right hand · Left hand) and Hands (Right hand · Left hand · Together) sat on one screen with no name
on either.

## The test that shows it

`kit.test.tsx`: "NamedSegmented shows its name beside the segments, and is named by it once".

## The fix

The kit's `NamedSegmented` (a `Segmented` with its name beside it) for both, and for the two that were written by
hand (Keys play, the builder's 7th).

## Comments
