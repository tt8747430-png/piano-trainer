# 61. Route validation carries the practice machine, the arranger and the pattern content into the first paint

Status: done
Severity: P2
Tier: 4
Rule: CODE_STYLE §7 (the first paint carries the shell); `react-route-splitting`, `bundle-dynamic-imports`; router.tsx's own comment
Where: `src/app/routes/search.ts:6-14` (then)

## What is wrong

The validators imported `PRACTICE_MODES` from `practice-machine.ts` and the chromatic walk's URL codec from `chromatic.ts`. The bundler assigns whole modules to chunks, so the entry chunk held the reducer, `arrange.ts`, `chord-context.ts`, `voice-leading.ts`, `accompaniment.ts`, `patterns.ts` and `figures.ts` (65 kB of source).

## The test that shows it

Measured on `vite build --sourcemap`: the entry chunk was 357.73 kB (118.61 kB gzip); after, 325.83 kB (107.43 kB gzip), with no arrangement, pattern or machine module in it.

## The fix

`features/practice/practice-mode.ts` (`PRACTICE_MODES`), `chromatic-choice.ts` (the walk's own choices, root spelling and chord-list codec) and `progression-choice.ts` (`PROGRESSION`) hold what a URL is made of; `practice-machine.ts`, `chromatic.ts` and `progression.ts` keep the machine, the charts and the arrangements. CODE_STYLE §6 and CLAUDE.md say validators import only what a URL is made of.

## Comments
