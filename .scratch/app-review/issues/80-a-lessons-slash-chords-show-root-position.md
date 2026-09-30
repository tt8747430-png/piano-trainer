# 80. A lesson's slash chords show root position, the jump the lesson says not to make

Status: done
Severity: P0
Tier: 5
Rule: ADR 0018 (the keys show each example); the lessons' own text
Where: `src/widgets/lesson-view/model/chord-example.ts`

## What is wrong

Every example sat in root position from middle C, a slash's bass an octave below. Inversions says C/E is E G C and "C E G becomes C F A"; Bass and chords says the nearest F is C F A (F/C) and the nearest G is B D G (G/B). The keys showed C4 E4 G4, then C3 + F4 A4 C5, then B3 + G4 B4 D5.

## The test that shows it

`chord-example.test.ts`: "plays a slash chord over a chord tone as that inversion, from the bass nearest middle C" (C/E is E4 G4 C5, F/C is C4 F4 A4, G/B is B3 D4 G4).

## The fix

Over a bass that is one of its tones, the chord is placed in that inversion, stacked up from the bass's key nearest middle C; over any other bass, as before.

## Comments
