# 111. Reharmonise scrolls away from the note a hand taps

Status: done
Severity: P2
Tier: 7
Rule: ADR 0009
Where: `src/widgets/reharmonise/model/holding-keys.ts:13-16`, `ReharmoniseTool.tsx:41-43`

## What is wrong

Tapping F♯2 chose the note, but the keys showed it on F♯4 and scrolled there, away from the hand.

## The test that shows it

`ReharmonisePage.test.tsx`: "names a tapped note on the key tapped, the keys held still" (the keyboard scrolled to
F♯2, F♯2 tapped: named G♭ there, nothing scrolls).

## The fix

`melodyAlone(melody, key)` shows the note on the key a hand chose it on; the tool keeps that key while the note is
its, over a fixed range (the middle octaves), so a tap never re-ranges the keys.

## Comments
