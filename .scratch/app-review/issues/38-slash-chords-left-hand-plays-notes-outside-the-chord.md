# 38. A slash chord's left hand plays notes outside the chord

Status: done
Severity: P0
Tier: 3
Rule: CODE_STYLE §8 (the arrangement voices the chord); spec §4
Where: `src/shared/lib/arrangement/chord-context.ts` (bass-degree)

## What is wrong

`LN` added the root's intervals to the bass: Dm/F played F C F A♭ C, Cm/E♭ G♭, Fm/D A♮ — written on the staff too. The charts hold Fm/D 12 times, Dm/F 10, Cm/A 9; the figures `arp` and `wide` can be chosen for any piece.

## The test that shows it

`arrange.test.ts`: "plays %s’s left hand in its own tones, stacked up from the bass" (Dm/F, Cm/E♭, Fm/D).

## The fix

Over a bass that is not the root, `L3`, `L5`, `L7` are the chord's own root, 3rd, 5th and 7th stacked up from the bass (`stackFromBass`), spelled as the chord spells them; root position is unchanged.

## Comments
