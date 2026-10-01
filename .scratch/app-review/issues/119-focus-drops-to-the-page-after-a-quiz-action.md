# 119. Focus drops to the page after a quiz's answer, Check, Next or the end of a Check

Status: done
Severity: P1
Tier: 8
Rule: WCAG 2.2 2.4.3 (focus order), 4.1.3 (status messages)
Where: `QuizBoard.tsx:67-99`, `CheckPage.tsx:43-53`, `QuizBlock.tsx:38,54-73`

## What is wrong

Choosing an answer, Check and Next unmounted the focused button, so a keyboard user restarted from the top of the
screen after every question; the Check's score replaced the board unheard; a lesson quiz's Answer button became a
different Check button, and its verdict region was `display:none` until it spoke.

## The test that shows it

`QuizBoard.test.tsx`: "keeps the keyboard user's place…", "moves to Next once a build is checked";
`CheckPage.test.tsx`: the score has the focus; `LessonPage.test.tsx`: "keeps a keyboard user on the quiz's button…".

## The fix

Next takes the focus as it appears, and the new question's prompt after Next; the score takes it when the Check
ends; a lesson quiz keeps one first button through its stages (Show the answer hands the focus back to it); the
verdict's region stays in the page (`empty:sr-only`), as the MIDI status's does.

## Comments
