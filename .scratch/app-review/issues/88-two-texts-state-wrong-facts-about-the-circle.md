# 88. Two texts state wrong facts: a chain that falls by fifths "climbs" the circle, and Stacks counts four m7 chords where it plays five

Status: done
Severity: P0
Tier: 5
Rule: The copy rule (a text says what is true); `stacks.ts` calls rising fifths clockwise
Where: `src/entities/lesson/content/gospel-progressions.ts:85`, `src/entities/piece/content/progressions/stacks.ts:15`

## What is wrong

B7 → E7 → A7 falls a fifth each time (anticlockwise); Stacks plays Cm7 Gm7 Dm7 Am7 Em7.

## The test that shows it

Read against the charts: `VII III VI` in C is B7 E7 A7; Stacks' progression line has five `:=m7` chords.

## The fix

"goes anticlockwise round the circle of fifths … down a fifth each time" / «против часовой стрелки … каждый раз на квинту вниз»; "Five m7 chords" / «Пять аккордов m7». The section's heading, The climb, stays the owner's.

## Comments
