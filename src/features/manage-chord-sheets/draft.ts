import type { ChordSheetsStore } from '@/entities/chord-sheet'

const withDraft = (
  store: ChordSheetsStore,
  id: string,
  change: (draft: string | null, text: string) => { text?: string; draft: string | null },
) =>
  store.setState((state) => ({
    mine: state.mine.map((sheet) =>
      sheet.id === id ? { ...sheet, ...change(sheet.draft, sheet.text) } : sheet,
    ),
  }))

/** The draft becomes the sheet's chords (Save): what a shared link shows from now on. */
export function saveDraft(store: ChordSheetsStore, id: string): void {
  withDraft(store, id, (draft, text) => ({ text: draft ?? text, draft: null }))
}

/** The draft dropped, the saved chords back (Discard draft); returns it, for Undo. */
export function discardDraft(store: ChordSheetsStore, id: string): string | null {
  const kept = store.getState().mine.find((sheet) => sheet.id === id)?.draft ?? null
  withDraft(store, id, () => ({ draft: null }))
  return kept
}

/** A discarded draft put back (Undo). */
export function restoreDraft(store: ChordSheetsStore, id: string, draft: string): void {
  withDraft(store, id, () => ({ draft }))
}
