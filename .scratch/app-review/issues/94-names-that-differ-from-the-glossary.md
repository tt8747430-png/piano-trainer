# 94. Names in code that differ from the glossary

Status: wontfix
Severity: P3
Tier: 5
Rule: UBIQUITOUS_LANGUAGE
Where: see below

## What is wrong

Two `QuizAnswer`s, the lesson's a Lesson quiz's (now `LessonAnswer`, done); `pieceKey` takes a Listing; `isPieceKey` beside `pieceKey`; `StepKind`; `splitsBeat` beside `splitsTheBeat`; two `readProgression`s; `usePieceHeadings` in `use-section-heading.ts`; `KeyChords` for a scale's chords; `arpeggio` called rolled; `chordsHolding` twice; a passing chord called a suggestion and a way; `held` for holding chords.

## The test that shows it

—

## The fix

`LessonAnswer` for the Lesson quiz's answer.

## Comments

The rest stay: each is local to its slice and reads right there; renaming them all would touch every caller for no learner-visible change. Tier 10 may fold the glossary's word into any it edits.
