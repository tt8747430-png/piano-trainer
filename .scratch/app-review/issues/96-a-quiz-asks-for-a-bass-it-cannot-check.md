# 96. Bass and chords' quiz asks for F in the bass but checks only the chord's notes

Status: needs-triage
Severity: P3
Tier: 5
Rule: ADR 0018 (a chord's notes in any octave)
Where: `src/entities/lesson/content/bass-and-chords.ts:96-101`

## What is wrong

"F low for the bass, the chord above it" is answered `{ chord: 'F' }`: A C F with no low F is right.

## The test that shows it

—

## The fix

The owner's call: reword the ask to what is checked, or let a chord answer require its bass lowest (a change to ADR 0018's rule).

## Comments
