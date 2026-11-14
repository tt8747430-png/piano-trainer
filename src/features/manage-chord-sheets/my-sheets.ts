import {
  MOST_SHEETS,
  NEW_ENTRY,
  sheetName,
  type ChordSheetEntry,
  type ChordSheetsStore,
} from '@/entities/chord-sheet'

/**
 * Save as my chord sheet… (R29 CP5): `entry` kept under `name`, first among My chord sheets; its id,
 * or null for a blank name or a full list.
 */
export function saveAsMine(
  store: ChordSheetsStore,
  name: string,
  entry: ChordSheetEntry,
): string | null {
  const kept = sheetName(name)
  const { mine, nextId } = store.getState()
  if (!kept || mine.length >= MOST_SHEETS) return null
  const id = `sheet-${nextId}`
  const { text, draft, style, tempo, settings } = entry
  store.setState({
    // Saved as it is shown: a draft brought along becomes its chords.
    mine: [
      { id, name: kept, text: draft ?? text, draft: null, style, tempo, settings, online: null },
      ...mine,
    ],
    nextId: nextId + 1,
  })
  return id
}

/** A sheet renamed; false for a blank name or no such sheet. */
export function renameSheet(store: ChordSheetsStore, id: string, name: string): boolean {
  const kept = sheetName(name)
  const { mine } = store.getState()
  if (!kept || !mine.some((sheet) => sheet.id === id)) return false
  store.setState({
    mine: mine.map((sheet) => (sheet.id === id ? { ...sheet, name: kept } : sheet)),
  })
  return true
}

/** A sheet's copy under `name`, just after it; its id, or null where none can be made. */
export function duplicateSheet(store: ChordSheetsStore, id: string, name: string): string | null {
  const { mine, nextId } = store.getState()
  const at = mine.findIndex((sheet) => sheet.id === id)
  const original = mine[at]
  const kept = sheetName(name)
  if (!original || !kept || mine.length >= MOST_SHEETS) return null
  // A copy is the learner's own, never the shared sheet.
  const copy = { ...original, id: `sheet-${nextId}`, name: kept, online: null }
  store.setState({
    mine: [...mine.slice(0, at + 1), copy, ...mine.slice(at + 1)],
    nextId: nextId + 1,
  })
  return copy.id
}

/** A sheet deleted (asked first, R17). */
export function deleteSheet(store: ChordSheetsStore, id: string): void {
  store.setState((state) => ({ mine: state.mine.filter((sheet) => sheet.id !== id) }))
}

/** New (R29 CP5): an empty Verse in hand, in Pop 1 at 100. */
export function startNew(store: ChordSheetsStore): void {
  store.setState({ scratch: NEW_ENTRY })
}
