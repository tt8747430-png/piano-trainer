# 44. The tools' rows strike the bass's key twice

Status: done
Severity: P1
Tier: 3
Rule: A voicing never doubles a key
Where: `src/shared/lib/music/voice-lead.ts`

## What is wrong

The right hand's octave-down voicing could reach the bass: C → A7 played A3 twice (88 of 7,056 pairs).

## The test that shows it

`voice-lead.test.ts`: "keeps the right hand above the bass, never striking a key twice" (every pair of 60 chords).

## The fix

Only voicings wholly above the bass are weighed.

## Comments
