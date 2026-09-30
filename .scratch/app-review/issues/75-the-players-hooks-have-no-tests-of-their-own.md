# 75. The Player's four hooks have no tests of their own

Status: ready-for-agent
Severity: P2
Tier: 9
Rule: CLAUDE.md (a page's hook in `model/` is its test surface)
Where: `src/pages/player/model/use-player.ts`, `use-walk-player.ts`, `use-chromatic-player.ts`, `use-progression-player.ts`

## What is wrong

They are exercised only through the pages' `renderApp` tests; CLAUDE.md names `use-player.ts` as its page's test surface.

## The test that shows it

For Tier 9 to write with `renderHook` over the stores and fake services, or to settle CLAUDE.md's two statements (a hook as the test surface; a screen's test through `renderApp`).

## The fix

Tier 9 (tests).

## Comments
