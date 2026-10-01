# 118. Components keep rules of their own, and the kit's shapes are written again

Status: done
Severity: P3
Tier: 7
Rule: CODE_STYLE §2 (pure logic never lives in a component); Duplicated Code; `patterns-explicit-variants`
Where: `PractiseChords.tsx:18-23`, `ChordChart.tsx:26-47`, `QuizChoiceSheet.tsx:18-23`, `LearnedToggle.tsx`, the switch rows, `LoopButton.tsx`, the four Player hooks, `setup-params.ts:18-22`

## What is wrong

Which scale kinds are a key's scale, a bar's methods and short-bar signature, which skills a quiz mode asks of the
choice, and a list toggle (three times) were worked out in components; a Learned toggle switched its element by a
`variant` (the text one ignoring its required `title`); seven switch rows, the loop's round button, four identical
hook results and a choice type that restated `Accompaniment` were written by hand; Player code called what the Player
plays a "source", the glossary's word for where a piece is printed.

## The test that shows it

`scale.test.ts` (`keyMode`), `chart-sections.test.ts` (`chartBar`), `theory-quizzes.test.ts` (`chosenSkills`),
`toggled.test.ts`, `learned.test.tsx`, `kit.test.tsx` (`SwitchRow`).

## The fix

`keyMode` (kernel), `chartBar` (the chart's model), `chosenSkills` (features/quiz, which `theoryQuizConfig` uses too),
`toggled` (shared/lib); `LearnedCheck` and `LearnedButton` over `useLearned`; `SwitchRow` (kit); `LoopButton` over
`RoundButton`; `PlayerOf<Choice, Change>`; `PatternChoice` and `AccompanimentChoice` in the pattern entity
(`FigureChoice` goes); "the music the Player plays" in comments.

## Comments

Left as they are, with reasons: QuizBoard's mode (four one-line differences; two boards would repeat the keyboard,
verdict and Next); TempoButton's eight props (explicit, tested without a Player); the sheet overlay's props two levels
down (one widget); the four pages' `navigate` patch (each typed by its own route); `KeyChords`' `listening` (its live
region must exist before it speaks); a staff's wrapper (a page's labelled sheet against a card's example; the memo
would only move).
