# Practice code review (2026-11-20)

Two-axis review of `origin/main...HEAD` over the Practice area. Fixed in the first pass:

- Own progressions draw in their own mode, with their Key column (were always major, Key blank).
- Laptop libraries sort again: Sort by in the Sort and filter sheet on every size (the table's headings never sorted).
- The progression editor's honey Publish keeps the draft first, as the menu's did.
- The arrange table's context renders as `<TableOf value>`; the editor's typed rows show the kit's focus ring.

Open, in this order:

1. ~~A pattern's Publish still has an address~~ done: a window over the pattern (canvas v715). It had an address (`/practice/accompaniment/patterns/$patternRef/publish`): ruling 1670, no
   thing's Settings or Publish has one. Move it into the pattern's Settings window, as the song's and progression's.
2. ~~A progression's Settings head draws a Lucide glyph~~ done: the library tile at 64.
3. ~~Progressions' sheet: a Key filter~~ done (the board's Key, counts on every filter choice). It asked for a Key filter (Major key · n, Minor key · n); Recently played sort where the spec asks.
4. ~~Accompaniment rows: Listen, and the hands line on a phone~~ stale: the Accompaniment board (r41_practice) draws each row's idea under its name, its level and heart, no Listen, and the app matches it at 402 (2026-11-20); the older spec line was superseded by the board.
5. ~~CLAUDE.md's map~~ done: the Player's Pace lists Interpret (gone); Practice says Exercises by book (two shelves now).
6. (Part done 2026-11-20: every arbitrary corner equal to a scale step is now its token across the app, 14 card, 12 control, 8 tile, 16 menu; the picture tiles' 9, 10, 11 and 18 and the small 2 to 6 wait for their own tokens.) Arbitrary values to tokens: `PracticePage.tsx:103`, `LibraryTable.tsx:32,40,251`, `PatternPage.tsx:198,214`,
   `LibraryTile` radii; `ChordPlayerSettings.tsx` (340 lines) and `ArrangeList.tsx` (445) split; ~~Chord player's
   gear onto `SettingsGear`~~ done: its gear is the kit's `GearButton` (its sheet has pages, as Scales'); ~~progression strings out of the `learn` namespace~~ done: its Settings title is the app's one `nav.settings`; Share keeps the things' Settings words (`learn:settings`), shared with a lesson's and a course's.
7. Smells: `ArrangeList` handle and style built three times (tried 2026-11-20: one hook returning the node, style and handle trips `react-hooks/refs`, refs read through a returned object; kept as written); `FoldHeadRow` vs `FoldSection` (kept 2026-11-20: the boards draw two heads, the laptop table's chevron first on its rows' edge at 16/700, `r41_lib.py:133`; a section's after its name at 20/700, `folds.py`); folds in `useState` (done 2026-11-20: `useFold`, keyed `library:<kind>:<section>`)
   where Practice uses `useFold`; the names list in `ChordPlayerSettings` vs `PROGRESSION_NAMES`.
8. `PatternPage.test.tsx`'s publish test still expects the old address (waits for the owner's test run). `practice-machine.test.ts`: 10 of 39 red since the machine keys by Midi (waits for the owner's test run).
8. Voicing's third wording: the Player's Pattern card (`widgets/player-setup/InversionField` → `PositionField`) holds First chord's inversion and a switch, Smooth voice leading, for songs, walks, the chromatic run and progressions; the progression page and the Chord player call the same choice Voicing (Voice-led · Block), and the Player boards' Pattern sheet (PlayerApp, a hand-kept board with no generator) draws neither. Decided: one shape, the progression page's: First chord's inversion as its picture choice and Voicing as Voice-led · Block, drawn first on PlayerApp's and PlayerDesk's Pattern sheet, then `PositionField`'s switch becomes that segmented row (`music:position.nearest` gone); a progression's run starts from its page's Settings (`progressions.voicing`, `.inversion`) unless its URL says otherwise. **Ported 2026-11-21:** the Player's Accompaniment reads Inversion, then Voicing as Voice-led · Block (`PositionField`, `music:position.voicing`), each its own section; the PlayerApp and PlayerDesk boards still draw neither and are drawn next time the Player canvas is published.
