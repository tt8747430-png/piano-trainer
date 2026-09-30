# 81. The Progressions field keeps showing chords typed in another key

Status: done
Severity: P1
Tier: 5
Rule: ADR 0020 (typed chords are written back as numerals in the key); the field's own contract
Where: `src/widgets/progressions/ui/ProgressionField.tsx:31-33`

## What is wrong

Type Am F C G in C, choose G major: the field still read Am F C G while the row played Em C G D.

## The test that shows it

`ProgressionsPage.test.tsx`: "writes typed chords as numerals again once the key changes, as the row plays them".

## The fix

The typed text is kept while it means the progression in the key it was typed in.

## Comments
