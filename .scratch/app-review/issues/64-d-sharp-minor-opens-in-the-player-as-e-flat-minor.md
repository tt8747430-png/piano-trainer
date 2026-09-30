# 64. D♯ minor on the Keys page opens in the Player as E♭ minor

Status: needs-triage
Severity: P2
Tier: 4
Rule: CODE_STYLE §8 (one rule, one home: a key's spelling)
Where: `src/shared/lib/music/circle.ts` (`circleKey`), `src/shared/lib/music/key.ts` (`tonicSpelling`), `src/pages/player/model/player-search.ts:35`, `src/app/routes/player-search.ts` (`validateWalkSearch`)

## What is wrong

Two rules spell the key at pitch class 3, minor: the circle pairs it with F♯ as D♯m (6♯, issue 41), `tonicSpelling` names it E♭m (6♭), which every other screen uses, because D♯ minor's V is A♯ with a C𝄪. The Keys page's "In the Player" rows read "D♯ minor" and link `?key=D#`; the Player, the walk and a progression respell it to E♭ minor, six flats after a page of six sharps. It is the only key where the two differ.

## The test that shows it

A probe over every pitch class: `circleKey(pc, minor)` and `tonicSpelling(pc, minor)` differ only at `minor 3: circle D# tonic E♭`.

## The fix

The owner's call, one of:

1. The app names that key E♭ minor everywhere: the circle's slot 6 is G♭ / E♭m (and `tonicSpelling(6, false)` G♭), relatives by letter as issue 41 requires.
2. The Player keeps a key it is handed when the circle spells it so (D♯m), its Setup's key pop-up offering that spelling for that pitch class.
3. Keep both names and let the Keys page's rows say the Player's name ("E♭ minor").

## Comments

Not fixed in the review: it changes which name the app teaches for a key, a decision issue 41 took the other way for the circle.
