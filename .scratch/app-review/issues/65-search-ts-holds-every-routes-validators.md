# 65. `search.ts` holds fifteen validators for eleven owners, and each route repeats its search pair

Status: done
Severity: P2
Tier: 4
Rule: CODE_STYLE §1 (about 200 lines a file); Divergent Change, Data Clumps, Duplicated Code
Where: `src/app/routes/search.ts` (434 lines, then), `src/app/router.tsx`

## What is wrong

Every view's URL change edited one 434-line file. The key read by the tonic rule was written four times, C major five, the Setup's figures twice (the chromatic walk's a copy without the chord size), the numerals read twice, and `I-V-vi-IV` in two places. Each of 15 routes wrote `validateSearch` and `stripSearchParams(DEFAULTS)` as a pair.

## The test that shows it

Structural: `route-search.test.ts` (was `search.test.ts`) and `router.test.tsx`, green before and after.

## The fix

`app/routes/read-search.ts` (the input type, `routeSearch`, the shared guards, `readKey`, `readNumerals`, `C_MAJOR`), and one file per place: `songs-search.ts`, `learn-search.ts` (the lessons' filter and the references), `tools-search.ts`, `player-search.ts`, `practice-search.ts`. Each route spreads its place's `…Search` options. The tool's and the Player's default line is `PROGRESSION.numerals`.

## Comments
