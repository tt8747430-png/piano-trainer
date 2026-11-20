# Practice code review (2026-11-20)

Two-axis review of `origin/main...HEAD` over the Practice area. Fixed in the first pass:

- Own progressions draw in their own mode, with their Key column (were always major, Key blank).
- Laptop libraries sort again: Sort by in the Sort and filter sheet on every size (the table's headings never sorted).
- The progression editor's honey Publish keeps the draft first, as the menu's did.
- The arrange table's context renders as `<TableOf value>`; the editor's typed rows show the kit's focus ring.

Open, in this order:

1. A pattern's Publish still has an address (`/practice/accompaniment/patterns/$patternRef/publish`): ruling 1670, no
   thing's Settings or Publish has one. Move it into the pattern's Settings window, as the song's and progression's.
2. A progression's Settings head draws a Lucide glyph, not its list picture (ruling 1646): use the library tile.
3. Progressions' sheet: a Key filter (Major key · n, Minor key · n); Recently played sort where the spec asks.
4. Accompaniment rows: Listen, and the hands line on a phone in place of the description (ruling 551).
5. CLAUDE.md's map: the Player's Pace lists Interpret (gone); Practice says Exercises by book (two shelves now).
6. Arbitrary values to tokens: `PracticePage.tsx:103`, `LibraryTable.tsx:32,40,251`, `PatternPage.tsx:198,214`,
   `LibraryTile` radii; `ChordPlayerSettings.tsx` (340 lines) and `ArrangeList.tsx` (445) split; Chord player's
   gear onto `SettingsGear`; progression strings out of the `learn` namespace.
7. Smells: `ArrangeList` handle and style built three times; `FoldHeadRow` vs `FoldSection`; folds in `useState`
   where Practice uses `useFold`; the names list in `ChordPlayerSettings` vs `PROGRESSION_NAMES`.
8. `practice-machine.test.ts`: 10 of 39 red since the machine keys by Midi (waits for the owner's test run).
