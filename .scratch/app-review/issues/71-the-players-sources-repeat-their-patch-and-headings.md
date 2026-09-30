# 71. The Player's four sources repeat their URL patch and their empty headings

Status: done
Severity: P3
Tier: 4
Rule: Duplicated Code
Where: `walk-search.ts:31-41`, `progression-search.ts:34-44`, `chromatic-search.ts:43-50`, `player-search.ts:46-58`; `NO_HEADINGS` in three pages

## What is wrong

Four patches left a source's own pattern and chord size out of the URL, three of them line for line; three pages declared the same empty headings. `progressionChoice` fell back to `PROGRESSION.numerals` for a line the validator had already read.

## The test that shows it

Structural: the four `*-search.test.ts`, green before and after.

## The fix

`ownLeftOut(change, own)` in `pages/player/model/own-left-out.ts` under each source's patch; `PlayerLayout`'s `headings` defaults to none.

## Comments

The four hooks and pages stay one per source: each is ten lines of wiring whose types differ, and a generic would add type parameters for no fewer lines. The Setups' shared props and `PlayerSetup`'s mode booleans are 76's.
