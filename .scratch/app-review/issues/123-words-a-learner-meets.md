# 123. Words a learner meets: Russian quizzes ask for a note, a numeral's case, a field that blames an empty line

Status: done
Severity: P1
Tier: 8
Rule: CODE_STYLE §10; ADR 0020 (upper case is major); UBIQUITOUS_LANGUAGE (Chart → "Chords" in the UI)
Where: `chord-family.ts:72,77`, `common-progressions.ts:97,104`, `gospel-reharmonisation.ts:93-94`, `TypedField.tsx`, `PractiseChords.tsx:59`, `en/piece.ts:9`

## What is wrong

Five Russian quizzes asked for a degree («Сыграйте V ступень…», one note) while the answer is a chord; a quiz asked
for C major's "IV" borrowed from the minor (answer Fm, a minor iv); a typed field said "can't be read" as soon as it
was cleared to type again; a progression's row title skipped `entryTitles`; the piece page titled its chart "Chart".

## The test that shows it

`kit.test.tsx` ("says nothing while the field is empty"); the copy is checked by reading it.

## The fix

«Сыграйте аккорд V ступени…» in each; "iv" in both languages; `TypedField` keeps quiet while empty; the title
through `entryTitles`; "Chords".

## Comments
