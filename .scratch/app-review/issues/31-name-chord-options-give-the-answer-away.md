# 31. Name chord's options give the answer away

Status: done
Severity: P1
Tier: 2
Rule: CODE_STYLE §8 (`chordRootSpelling`, one rule for the table, the builder and the quiz)
Where: `src/features/quiz/quiz-machine.ts` (nameOptions)

## What is wrong

Wrong options were spelled on the question's root: a C♯m7 question offered C♯Maj7 and C♯7, which the app writes D♭ everywhere else, so a C♯ or G♯ root told the learner the answer was minor.

## The test that shows it

`quiz-draw.test.ts`: "spells each option’s root by its own chord, so a C♯ root never gives a minor answer away".

## The fix

Each option's root is `chordRootSpelling` of the question's key over the option's own intervals.

## Comments
