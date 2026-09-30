# 39. Melodic minor puts the thumb on a black key

Status: done
Severity: P0
Tier: 3
Rule: Fingering as taught: the thumb never on a black key in a scale
Where: `src/shared/lib/music/fingering.ts`

## What is wrong

Melodic minor was fingered as natural minor, whose thumb can fall on the raised 6th: C♯ melodic's right hand put 1 on A♯.

## The test that shows it

`fingering.test.ts`: "never puts a thumb on a black key in a taught seven-note scale from its tonic" (major, natural, harmonic, melodic; 12 roots; both hands), "fingers C♯ melodic minor as C♯ major, keeping the thumb off A♯".

## The fix

`tableFor`: melodic minor takes natural minor's fingering, and its tonic's major's where natural minor's would put a thumb on a black key (it differs from that major only in its 3rd).

## Comments
