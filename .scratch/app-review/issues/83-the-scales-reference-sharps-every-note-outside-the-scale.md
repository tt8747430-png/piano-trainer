# 83. The Scales reference names a note outside the scale with a sharp, even in a flat key

Status: done
Severity: P2
Tier: 5
Rule: CODE_STYLE §8 (one home for each rule: `spellInKey`)
Where: `src/widgets/scale-explorer/model/scale-keys.ts:64-68`

## What is wrong

In F major Chords view said F#, where Reharmonise says G♭; the test pinned the sharp.

## The test that shows it

`scale-keys.test.ts`: "spells a note of the scale as the scale does, any other as its key does (spellInKey)"; `ScalesPage.test.tsx` now expects D♭ in C major.

## The fix

`heardName(note, root, kind)`: the scale's spelling, else `spellInKey` over the scale's key.

## Comments
