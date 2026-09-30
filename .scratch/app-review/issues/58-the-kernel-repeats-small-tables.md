# 58. The kernel repeats the major scale's semitones and the accidental signs

Status: done
Severity: P2
Tier: 3
Rule: Smell baseline: Duplicated Code
Where: `note.ts`, `interval.ts`, `interval-facts.ts`, `typing-keys.ts`

## What is wrong

The major or perfect interval over a letter distance was written three times, the accidental signs twice, and the piano's top C twice.

## The test that shows it

The kernel's tests unchanged and green.

## The fix

`plainSemitones` and `accidentalSign` in `note.ts`; typing's top C is `PIANO.to`.

## Comments
