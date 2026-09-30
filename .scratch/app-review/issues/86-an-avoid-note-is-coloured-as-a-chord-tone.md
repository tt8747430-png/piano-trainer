# 86. The Tensions reference colours an avoid note as a chord tone

Status: done
Severity: P2
Tier: 5
Rule: The widget's own rule (`TensionGroupCard.tsx:9`)
Where: `src/widgets/tension-explorer/ui/TensionExplorer.tsx:80-83`

## What is wrong

Over Cm7, tapping "3 E" put a 3 in the 3rd's colour beside ♭3 E♭.

## The test that shows it

`tension-keys.test.ts`: "marks an avoid note plainly, so no colour calls it a chord tone".

## The fix

`tensionMark(tone)` in the model: an avoid note is marked plainly (`scale`).

## Comments
