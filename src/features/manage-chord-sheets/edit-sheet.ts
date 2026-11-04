import type { ChordSheetEntry, ChordSheetsStore } from '@/entities/chord-sheet'

/**
 * The sheet in hand changed (R29 CP5): one of My chord sheets (`id`), saved as it is edited (no Save
 * button), or the sheet in hand when none is open.
 */
export function editSheet(
  store: ChordSheetsStore,
  id: string | undefined,
  change: Partial<ChordSheetEntry>,
): void {
  if (id === undefined) {
    store.setState((state) => ({ scratch: { ...state.scratch, ...change } }))
    return
  }
  store.setState((state) => ({
    mine: state.mine.map((sheet) => (sheet.id === id ? { ...sheet, ...change } : sheet)),
  }))
}

/** A sheet put in hand (a Share link, a progression opened from Progressions): the one it replaces, for Undo. */
export function holdSheet(store: ChordSheetsStore, entry: ChordSheetEntry): ChordSheetEntry {
  const before = store.getState().scratch
  store.setState({ scratch: entry })
  return before
}
