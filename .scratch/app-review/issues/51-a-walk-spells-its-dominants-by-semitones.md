# 51. Passing chords' walks spell their dominants by semitones

Status: done
Severity: P2
Tier: 3
Rule: CODE_STYLE §8 (every chord's root by `chordRootSpelling`)
Where: `src/shared/lib/music/passing-chords.ts`

## What is wrong

The chromatic walk moved its roots by semitones and then chose sharps rising or flats falling: A → D♭ walked A♯7 (C𝄪, E♯), C → E♭ C♯7.

## The test that shows it

`passing-chords.test.ts`: "spells a walk’s dominants as the app spells a chord’s root" (A → D♭: B♭7 B7 C7), and C → E♭'s walk D♭7 D7.

## The fix

Each walking dominant's root is `chordRootSpelling` of its pitch class.

## Comments
