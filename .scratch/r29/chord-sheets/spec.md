# Spec: My chord sheets (R29 CP5) — a store and a route

## Route

- `/practice/chord-player` (`pages/chord-player`), parent `/practice`. Search params
  (`app/routes/chord-player-search.ts`):
  - `sheet`: a saved sheet's id (`mine`); none for the learner's sheet in hand (the scratch sheet).
  - `p`, `key`: a progression line and its key as Progressions writes them (`I-V-vi-IV`, `C`): on
    arrival the line is read into the scratch sheet as one Verse, one chord a bar, and the params are
    dropped (replace, with an Undo toast). Progressions' link row opens the Chord player this way, and
    the Chord player's link row opens Progressions with its first section's chords.
  - `share`: a sheet's compact text (`sheetToText`), a Share link: read into the scratch sheet the same
    way (Postel's law: what does not read is skipped).
- `/practice/chord-player/settings` (`pages/chord-player-settings`), parent `/practice/chord-player`
  (with its `sheet`). Same `sheet` param.

## Store `pt-chord-sheets`, version 1 (`entities/chord-sheet`)

```ts
interface SavedChordSheet {
  id: string            // `sheet-<n>`
  name: string          // 1–60 characters
  text: string          // the sheet as `sheetToText` writes it (sections, chords, beats, key, meter)
  style: string         // a style id (`pop-1`, `pattern:t1`); an unknown one reads as Pop 1
  tempo: number         // 40–240
  settings: ChordSheetSettings
}
interface ChordSheetSettings {
  piano: { on: boolean; level: number }  // level 0–100
  bass: { on: boolean; level: number }
  drums: { on: boolean; level: number }
  countIn: boolean; repeat: boolean; volume: number; transpose: number // −5…+6
}
interface ChordSheetsState {
  scratch: Omit<SavedChordSheet, 'id' | 'name'>   // the sheet in hand, kept between visits
  mine: readonly SavedChordSheet[]                  // at most 100, newest first
  nextId: number
}
```

- `createSavedStore`, key `pt-chord-sheets`, version 1; one sanitiser reads field by field (a field
  added later reads as its default; a saved sheet whose text does not read is dropped; numbers clamped);
  any other version starts from the initial state (one empty Verse in C major, 4/4, Pop 1 at 100).
- Synced: `{ table: 'chord_sheets', key: 'pt-chord-sheets' }` in `SYNCED_SAVES`. The table is a new
  mirror table (migration `supabase/migrations/<ts>_chord_sheets.sql`, the user-documents shape, no
  `drop`), named in `push_documents`' list, in `purge-account`'s, and in `database.types.ts`.
- Commands (`features/manage-chord-sheets`): `saveAsMine(name)` (the scratch copied in as a new sheet,
  first), `editSheet(id | null, change)` (a saved sheet saves on every edit; no Save button),
  `renameSheet`, `duplicateSheet`, `deleteSheet` (asked first, R17), `startNew()` (the scratch back to
  one empty Verse; asked first when it holds chords).

## Done when

- `store.test.ts`: reads a version-1 save field by field; any other version starts empty; a sheet whose
  text does not read is dropped; at most 100 kept.
- `chord-sheet-text.test.ts`: `sheetToText`/`textToSheet` round-trip three sections with repeats,
  variations and lengths.
- `ChordPlayerPage.test.tsx`: Save as my chord sheet puts it first in the Library and an edit saves it.
