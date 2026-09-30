# 47. 6/8 and 12/8 play 8th patterns two to a beat

Status: done
Severity: P1
Tier: 3
Rule: A meter's beat divides as it does (compound: in three)
Where: `src/shared/lib/arrangement/figure.ts`, `src/entities/pattern/model/selectors.ts`, `src/widgets/player-setup`, `src/pages/player/model/player-search.ts`

## What is wrong

Figures are written for a beat divided in two; in a 6/8 piece (five hymns) any pattern could be chosen, and 8th patterns played and were written two to a beat.

## The test that shows it

`figure.test.ts`: "splitsTheBeat"; `PlayerSetup.test.tsx`: "closes what plays inside a beat to a piece in 6/8 or 12/8, keeping what plays on it"; `player-search.test.ts`: "plays a piece in 6/8 by its own pattern and figures when the URL names ones inside the beat"; `catalog.test.ts`: "gives every piece in 6/8 or 12/8 a pattern that plays on the beat".

## The fix

`splitsTheBeat(figure)` and `splitsBeat(pattern)`; Setup closes such patterns and figures ("Needs simple time" / "Нужен простой размер"); the Player falls back to the piece's own.

## Comments
