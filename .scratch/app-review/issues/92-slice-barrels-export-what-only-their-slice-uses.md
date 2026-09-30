# 92. Slice barrels export 89 names only their own slice uses, and two selectors nothing uses

Status: done
Severity: P3
Tier: 5
Rule: codebase-design (narrow interfaces); the plan's Tier 5 step
Where: every `src/*/*/index.ts`

## What is wrong

A TypeScript scan of every barrel's names against every import found 89 names no other slice imports (e.g. `definePiece`, `rate`, the quiz machine, `walkChart`), 14 more only other slices' tests use, and `selectLastPractised` and `selectRating` used by nothing but their test.

## The test that shows it

Structural: typecheck, lint and the suite, green after.

## The fix

The 89 leave their `index.ts` (their own tests import them by path); the two selectors go with their tests; `NAMESPACES` is no longer exported. Kept public: names other slices' tests or `vite.config.ts` use, and `PieceGroup` (PieceList's props, built by three pages).

## Comments
