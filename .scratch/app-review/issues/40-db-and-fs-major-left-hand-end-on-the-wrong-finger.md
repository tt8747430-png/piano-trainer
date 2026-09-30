# 40. D♭ and F♯ major's left hand end on the wrong finger

Status: done
Severity: P1
Tier: 3
Rule: The taught fingering; one note one finger in a longer run
Where: `src/shared/lib/music/fingering.ts`

## What is wrong

The left hand's octave note was 2 in both, where the taught fingering (and the code's own longer run) gives 3 (D♭) and 4 (F♯).

## The test that shows it

`fingering.test.ts`: "ends D♭ and F♯ major’s left hand on the finger its octave takes in a longer run".

## The fix

`32143213` and `43213214`.

## Comments
