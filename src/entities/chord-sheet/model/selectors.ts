import type { ChordSheetsState } from './store'
import type { ChordSheetEntry, SavedChordSheet } from './types'

/** The sheet in hand: one of My chord sheets by its id, else the scratch sheet; undefined for an id there is none of. */
export const selectEntry =
  (id: string | undefined) =>
  (state: ChordSheetsState): ChordSheetEntry | undefined =>
    id === undefined ? state.scratch : state.mine.find((sheet) => sheet.id === id)

/** One of My chord sheets by its id. */
export const selectSaved =
  (id: string | undefined) =>
  (state: ChordSheetsState): SavedChordSheet | undefined =>
    id === undefined ? undefined : state.mine.find((sheet) => sheet.id === id)

/** My chord sheets, newest first. */
export const selectMine = (state: ChordSheetsState): readonly SavedChordSheet[] => state.mine
