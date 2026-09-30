# 107. The validators carry Learn's and the Player's music kernel into the first paint

Status: wontfix
Severity: P3
Tier: 6
Rule: CODE_STYLE §7
Where: `src/app/routes/learn-search.ts`, `read-search.ts`, `player-search.ts`

## What is wrong

About 22 kB raw (8 kB gzip) of `shared/lib/music` (`buildChord`, `fitParts`, the fingerings, `parseNumerals`) validates Learn's, the tools' and the Player's URLs as the app opens.

## The test that shows it

Measured by the Tier 6 review from the build's sourcemaps.

## The fix

None.

## Comments

The router owns validation (ADR 0003, CODE_STYLE §6), and TanStack's `validateSearch` is synchronous: the rules a URL is read by have to be there when any URL is.
