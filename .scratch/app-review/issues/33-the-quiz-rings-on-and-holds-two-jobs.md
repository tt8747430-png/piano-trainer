# 33. The quiz rings on after the learner leaves, and holds two jobs in one file

Status: done
Severity: P3
Tier: 2
Rule: CODE_STYLE §1 (~200 lines, one job); smell baseline: Duplicated Code, Speculative Generality
Where: `src/features/quiz/{quiz-machine,use-quiz,quiz-keys}.ts`

## What is wrong

A Name chord question's sound rang on after the learner left; `quiz-machine.ts` (254 lines) drew questions and judged them; `targetOf` repeated `quiz-keys`'s `tonesOf`; and a question was `null` only in an initial state the hook replaced at once, which four places checked.

## The test that shows it

`use-quiz.test.tsx`: "falls silent when the learner leaves"; the machine's tests split with it.

## The fix

`quiz-draw.ts` draws; the machine judges, exporting one `tonesOf`; `startQuiz(question)` begins a quiz, so a question is never `null`; leaving the quiz stops its sound.

## Comments
