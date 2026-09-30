# 42. Chord symbols that read back as another chord

Status: done
Severity: P1
Tier: 3
Rule: CODE_STYLE §8 (one name, one chord)
Where: `src/shared/lib/music/chord.ts` (aliases)

## What is wrong

`C11` read as C7sus4 while the builder names 1 3 5 ♭7 9 11 C11; `Cmaj` and `CM` read as CMaj7, where they name the major triad; `Cø7` and `C+7` did not read at all.

## The test that shows it

`chord-symbol.test.ts`: `Cmaj`, `CM`, `Cø7`, `C+7` read; `C11` does not.

## The fix

`11` leaves sus7's ways of writing; `M` and `maj` move to the major triad; `ø7` joins m7♭5, `+7` joins 7♯5. (Cm13, CMaj13, C9sus4 and C7♭9♭13 are the builder's, not the table's qualities the quizzes rate; issue 49.)

## Comments
