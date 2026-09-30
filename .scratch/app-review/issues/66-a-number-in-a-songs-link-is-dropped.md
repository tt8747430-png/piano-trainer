# 66. A number searched for in a Songs link opens an empty search

Status: done
Severity: P3
Tier: 4
Rule: spec §6 (shareable URLs)
Where: `src/app/routes/search.ts:101` (then)

## What is wrong

The router reads `?q=1999` as the number 1999; the validator kept only strings, so the box opened empty.

## The test that shows it

`search-params.test.ts` (`readText`); `route-search.test.ts`: "keep a number typed as a search, which the router reads as a number".

## The fix

`readText` in `shared/lib/search-params.ts` keeps text and a number as written; Songs' `q` and Passing chords' two chords read with it.

## Comments
