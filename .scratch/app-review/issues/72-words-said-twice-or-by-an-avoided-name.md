# 72. The Player says a key's name with its own copy of `music:key`, and calls chord qualities chord types in code

Status: done
Severity: P3
Tier: 4
Rule: CLAUDE.md (`music` for the words every screen shares); UBIQUITOUS_LANGUAGE (chord type in code: avoid)
Where: `locales/*/player.ts` (`keyOf`, `chordTypes`), `PieceSetup.tsx`, `PractiseChords.tsx`, `ChromaticSetup.tsx`, `ChromaticPlayerPage.tsx`

## What is wrong

`player:keyOf` repeated `music:key.{major,minor}` word for word in both locales; the chromatic walk's pop-up key and comments said chord types.

## The test that shows it

Structural: the Player's and Keys' tests, green before and after.

## The fix

`music:key` everywhere; the key is `player:qualities`. The English label stays "Chord types" (the UI may say it).

## Comments
