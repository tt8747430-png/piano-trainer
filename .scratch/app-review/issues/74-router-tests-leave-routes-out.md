# 74. The router's tests leave seven routes out, and check five for laziness through a cast

Status: done
Severity: P3
Tier: 4
Rule: CLAUDE.md (`notFound()` cases); global constraints (no `as` cast)
Where: `src/app/router.test.tsx:12-30,72-83`

## What is wrong

`ROUTES` lacked the tools, Intervals, Tensions and `/play/progression`; the lazy check read five routes through `as { preload?: unknown }`.

## The test that shows it

`router.test.tsx`: the routes table and "keeps every screen a lazy route component" over `routesByPath`.

## The fix

Every route in `ROUTES`; every route with a path checked lazy with `toHaveProperty('preload', expect.any(Function))`.

## Comments
