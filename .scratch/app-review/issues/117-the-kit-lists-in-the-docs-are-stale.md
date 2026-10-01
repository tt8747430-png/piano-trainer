# 117. CODE_STYLE's and CLAUDE.md's kit lists miss most of the kit

Status: done
Severity: P3
Tier: 7
Rule: CLAUDE.md (docs move with the code)
Where: `docs/CODE_STYLE.md` §1, `CLAUDE.md` (shared/ui), `DESIGN.md:541`, ADR 0021

## What is wrong

The kit lists named about half the kit; DESIGN cited "the Chord pop-up's five families", which no longer exists;
ADR 0021 named the progression row's old parts.

## The test that shows it

Docs: read against `src/shared/ui/index.ts`.

## The fix

Both lists name the kit as it is now, with the rule that a boolean mode is a component or children; DESIGN's grouped
list example and ADR 0021's parts follow the code.

## Comments
