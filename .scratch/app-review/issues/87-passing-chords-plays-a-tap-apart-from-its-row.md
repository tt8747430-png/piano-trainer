# 87. Passing chords plays a tapped chord in another voicing than its row's

Status: done
Severity: P2
Tier: 5
Rule: The tool's doc; the Progressions tool's taps play the row's voicing
Where: `src/widgets/passing-chords/ui/PassingChordsTool.tsx:44-48`

## What is wrong

A tap voiced the chord alone (`voiceLead([chord])`), so Fm7 sounded an octave from where Play put it, and the keys shown did not match the row.

## The test that shows it

`PassingChordsPage.test.tsx`: "plays a chord of a row as the row voices it".

## The fix

Each row is voiced once; a tap plays its place in it. The card passes a place only.

## Comments
