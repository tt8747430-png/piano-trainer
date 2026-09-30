# 59. The chord builder's kernel module holds the Chords reference's URL codec

Status: done
Severity: P2
Tier: 3
Rule: CODE_STYLE §1 (the URL's view type with what owns it); §8 (the kernel is music)
Where: `src/shared/lib/music/chord-parts.ts`

## What is wrong

`PartsParams`, `partsParams`, `partsFromParams`, `qualityParams` and `readAlterations` (the URL form of a chord's parts) sat in the music kernel.

## The test that shows it

`chord-params.test.ts` (moved with it).

## The fix

`shared/lib/chord-params.ts`, beside the other search-param readers, where the router's validators may import it.

## Comments
