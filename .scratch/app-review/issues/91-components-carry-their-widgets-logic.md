# 91. Components carry the Chord finder's, a lesson's and Reharmonise's logic, and two models go untested

Status: done
Severity: P2
Tier: 5
Rule: CODE_STYLE §2 (pure logic never lives in a component); CLAUDE.md (a colocated test)
Where: `ChordFinder.tsx:30-36`, `FinderName.tsx:27-41`, `LessonView.tsx:13-20`, `ReharmoniseTool.tsx:48-54`, `holding-keys.ts`, `key-marks.ts`

## What is wrong

What keys make (note, interval, chord, none) and each key's mark were worked out in two components; a lesson's answers by place in its view; Reharmonise's melody alone in its tool.

## The test that shows it

`finding.test.ts` (`findChord`, `findingMarks`), `lesson-quiz.test.ts` (`quizAnswers`), `holding-keys.test.ts` (`melodyAlone`, `underMelody`), `key-marks.test.ts`.

## The fix

`chord-finder/model/finding.ts`; `quizAnswers` and `answerSounds` in `lesson-quiz.ts`; `melodyAlone` beside `underMelody`.

## Comments

Left as they are: `ChordExplorer`'s `keysOf` (a placement flattened) and its written spellings (a display join), `KeyExplorer`'s range over two lists, `KeyChords`' sentence, and Passing chords' `inKey` (one kernel call per chord). The inversion clamp and the key signature's run go with 93's shapes.
