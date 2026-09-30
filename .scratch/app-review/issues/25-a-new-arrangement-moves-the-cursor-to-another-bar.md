# 25. A new arrangement moves the cursor to another bar

Status: done
Severity: P1
Tier: 2
Rule: ADR 0003 (the cursor is where the learner is)
Where: `src/features/practice/practice-machine.ts` (configure)

## What is wrong

`configure` kept the beat group's index across a new performance. Another pattern, figure or chord size can cut a bar into more or fewer beat groups, so the same index landed elsewhere in the piece.

## The test that shows it

`practice-machine.test.ts`: "keeps its moment in the music when a new arrangement cuts the bars differently".

## The fix

`sameMoment`: the cursor keeps its tick, as the last beat group of the new performance at or before it.

## Comments
