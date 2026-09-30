# 63. Practice's My gaps row counts Unknowns as Gaps

Status: done
Severity: P2
Tier: 4
Rule: ADR 0006 (a learner who only plays sees Unknowns, not Gaps)
Where: `src/pages/practice/ui/PracticePage.tsx:45`, `locales/*/practice.ts`

## What is wrong

The row read "Gaps: 3" for a learner who had only opened songs: `myGaps` holds gaps and the unknown skills of practised pieces (spec §4.6 ③), and the row named them all gaps.

## The test that shows it

`PracticePage.test.tsx`: "says how many skills My gaps holds to check, gaps and unknowns alike".

## The fix

The count reads "To check: N" / «На проверку: N», as the Continue card counts chords to check.

## Comments
