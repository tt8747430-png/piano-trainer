# 49. The builder's names Cm13, CMaj13, C9sus4 and C7♭9♭13 do not parse

Status: wontfix
Severity: P3
Tier: 3
Rule: One name, one chord
Where: `src/shared/lib/music/chord.ts`

## What is wrong

The Chord builder names chords the quality table (the quizzes' skills) does not hold, so a typed name the builder shows can fail to read.

## The test that shows it

None.

## The fix

None. The table is the rated skills; a parser over the builder's parts would be a second naming rule. The tools that take typed chords say plainly when one does not read.

## Comments
