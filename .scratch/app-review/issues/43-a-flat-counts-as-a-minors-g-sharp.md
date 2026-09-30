# 43. A♭ counts as A minor's G♯

Status: done
Severity: P1
Tier: 3
Rule: Reharmonise: "marked in the key when every tone is the key's" (ADR 0019)
Where: `src/shared/lib/music/reharmonise.ts`, `passing-chords.ts`, `scale.ts`

## What is wrong

The in-key check compared pitch classes, so in A minor Fm (A♭) and G7♭9 (A♭) were marked in the key. The key's tones were also built by the same expression in two places.

## The test that shows it

`scale.test.ts`: "holds a chord in the key only when the key spells each of its tones alike"; `reharmonise.test.ts`: "never marks a chord in the key that holds a note the key spells otherwise".

## The fix

`keyTones(key)` is the one source of a key's notes; `tonesInKey(tones, key)` compares spelled notes, for Reharmonise and Passing chords; `keyPitchClasses` goes.

## Comments
