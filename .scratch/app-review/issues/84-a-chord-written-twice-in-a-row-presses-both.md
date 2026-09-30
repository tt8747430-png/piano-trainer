# 84. A lesson's row that writes a chord twice presses both buttons

Status: done
Severity: P2
Tier: 5
Rule: React keys; every button that plays is its own toggle (CODE_STYLE §1)
Where: `src/widgets/lesson-view/ui/ChordExamples.tsx:22-24`

## What is wrong

The symbol was the React key and the playback id: in Inversions (C F/C G/B C) and Accompanying a hymn (C F C) a tap on one C pressed both, and React warned of duplicate keys.

## The test that shows it

`LessonPage.test.tsx`: "plays one of a chord written twice, pressing only the one tapped".

## The fix

Keyed and played by place in the row.

## Comments
