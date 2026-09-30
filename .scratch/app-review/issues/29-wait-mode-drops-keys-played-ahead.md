# 29. Wait mode drops keys played ahead

Status: done
Severity: P2
Tier: 2
Rule: Wait mode waits for your notes
Where: `src/features/practice/practice-machine.ts`

## What is wrong

Keys played during the pause after a right answer, or through a rest, were dropped: a learner who plays on to the next chord had to play it again.

## The test that shows it

`practice-machine.test.ts`: "keeps a key played during the pause for the beat group it belongs to", "is right at once when the keys played ahead complete the next beat group", "carries a key played through a rest to the beat group it belongs to", "forgets keys played ahead when the learner moves", "never marks a key played once the beat group is done wrong".

## The fix

The machine keeps `ahead`; the app's own move on (`advance`) counts them toward the beat group it reaches; a learner's move forgets them.

## Comments
