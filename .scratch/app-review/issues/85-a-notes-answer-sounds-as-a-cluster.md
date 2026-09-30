# 85. A lesson quiz's notes answer sounds as one cluster

Status: done
Severity: P2
Tier: 5
Rule: ADR 0018 (right, the answer plays)
Where: `src/widgets/lesson-view/ui/LessonView.tsx:71,75`

## What is wrong

The chromatic-scale quiz sounded six semitones at once; the D major quiz seven notes.

## The test that shows it

`lesson-quiz.test.ts` (`answerSounds`); `LessonView.test.tsx`: "plays a notes answer as a line, one note after another".

## The fix

`answerSounds` in the quiz model: a chord together, notes as a line from the lowest. `quizAnswers` moved there from the component too.

## Comments
