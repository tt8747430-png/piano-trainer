# 82. The Chords and Keys references engrave their staff again when nothing on it changed

Status: done
Severity: P2
Tier: 5
Rule: CODE_STYLE §7
Where: `ChordExplorer.tsx:42`, `KeyExplorer.tsx:39`

## What is wrong

`viewChord(chord)` ran on every render, so each Play or Stop gave `ChordSheet` a new placement and VexFlow drew the staff again; the Keys page's key object was new on every render, so a chord-size or inversion change redrew the signature.

## The test that shows it

`ChordsPage.test.tsx`: "keeps the chord written while it plays, engraving it once"; `KeysPage.test.tsx`: "keeps the key’s signature written while its chords change, engraving it once" (the staff's `svg` is the same element after).

## The fix

The placement and the key are memoised on the view.

## Comments
