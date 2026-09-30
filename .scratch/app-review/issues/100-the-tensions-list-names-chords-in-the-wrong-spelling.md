# 100. The Tensions chord list names each chord with the current root's spelling

Status: done
Severity: P3
Tier: 5
Rule: CODE_STYLE §8 (a chord's root spelled by the chord's one rule)
Where: `src/widgets/tension-explorer/ui/TensionExplorer.tsx:57`

## What is wrong

At C♯m7 the list offered "C♯Maj7", and choosing it gave D♭Maj7.

## The test that shows it

`TensionsPage.test.tsx`: "names each chord in its list as choosing it will spell it, on the root’s pitch".

## The fix

Each item's root is `chordRootSpelling` over its own intervals, as the validator spells it.

## Comments
