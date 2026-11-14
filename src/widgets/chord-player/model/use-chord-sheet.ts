import { useCallback, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import {
  NEW_ENTRY,
  selectEntry,
  useChordSheets,
  useChordSheetsStoreApi,
  type ChordSheetEntry,
  type ChordSheetSettings,
} from '@/entities/chord-sheet'
import { editSheet } from '@/features/manage-chord-sheets'
import {
  eachChord,
  emptySheet,
  sheetToText,
  textToSheet,
  transposeChord,
  transposeSheet,
  type ChordSheet,
} from '@/shared/lib/arrangement'
import type { Chord } from '@/shared/lib/music'

/** Each sheet's edits to undo and redo, by its id (`''` the sheet in hand): kept while the app runs. */
interface History {
  undo: string[]
  redo: string[]
}
const histories = new Map<string, History>()
const listeners = new Set<() => void>()
const changed = () => listeners.forEach((listener) => listener())
const historyOf = (id: string): History => {
  const kept = histories.get(id)
  if (kept) return kept
  const made = { undo: [], redo: [] }
  histories.set(id, made)
  return made
}
/** Edits kept to undo, at most. */
const DEPTH = 100

/** The sheet in hand (R29 CP2, CP5): read from its saved text, edited with Undo, shown transposed. */
export interface ChordSheetInHand {
  /** As written: in its own key. */
  readonly sheet: ChordSheet
  /** As shown and heard: moved by Settings' Transpose. */
  readonly shown: ChordSheet
  readonly entry: ChordSheetEntry
  /** Whether it is one of My chord sheets (`?sheet=`), not the sheet in hand. */
  readonly saved: boolean
  /** Whether a saved sheet has edits not saved yet: it shows and plays them, marked Draft. */
  readonly draft: boolean
  /** Changes the sheet as written, kept to undo. */
  edit(change: (sheet: ChordSheet) => ChordSheet): void
  /** Changes it as shown (transposed), kept to undo: each chord moved back into its own key. */
  editShown(change: (sheet: ChordSheet) => ChordSheet): void
  /** A chord as shown, written in the sheet's own key. */
  written(chord: Chord): Chord
  setEntry(change: Partial<Omit<ChordSheetEntry, 'text'>>): void
  setSettings(change: Partial<ChordSheetSettings>): void
  undo(): void
  redo(): void
  readonly canUndo: boolean
  readonly canRedo: boolean
}

/** One of My chord sheets (its id) or the sheet in hand (none); null for an id there is none of. */
export function useChordSheet(id: string | undefined): ChordSheetInHand | null {
  const store = useChordSheetsStoreApi()
  const entry = useChordSheets(selectEntry(id))
  const key = id ?? ''
  const version = useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange)
      return () => listeners.delete(onChange)
    },
    () => `${historyOf(key).undo.length}/${historyOf(key).redo.length}`,
  )
  // A saved sheet opens on its draft, where it has one.
  const text = entry?.draft ?? entry?.text ?? NEW_ENTRY.text
  const sheet = useMemo(() => textToSheet(text) ?? emptySheet(), [text])
  const transpose = entry?.settings.transpose ?? 0
  const shown = useMemo(() => transposeSheet(sheet, transpose), [sheet, transpose])
  // The latest sheet, for edits made one after another before a render.
  const latest = useRef(sheet)
  useLayoutEffect(() => {
    latest.current = sheet
  }, [sheet])
  const write = useCallback(
    (next: ChordSheet) => {
      const before = sheetToText(latest.current)
      const after = sheetToText(next)
      if (before === after) return
      const history = historyOf(key)
      history.undo = [...history.undo, before].slice(-DEPTH)
      history.redo = []
      latest.current = next
      editSheet(store, id, id === undefined ? { text: after } : { draft: after })
      changed()
    },
    [store, id, key],
  )
  const written = useCallback(
    (chord: Chord) =>
      transpose === 0 ? chord : transposeChord(chord, shown.key.tonic, sheet.key.tonic),
    [transpose, shown.key.tonic, sheet.key.tonic],
  )
  const step = useCallback(
    (from: 'undo' | 'redo') => {
      const history = historyOf(key)
      const to = from === 'undo' ? 'redo' : 'undo'
      const text = history[from].at(-1)
      if (text === undefined) return
      history[from] = history[from].slice(0, -1)
      history[to] = [...history[to], sheetToText(latest.current)]
      const restored = textToSheet(text)
      if (restored) latest.current = restored
      editSheet(store, id, id === undefined ? { text } : { draft: text })
      changed()
    },
    [store, id, key],
  )
  if (!entry) return null
  const [undos = 0, redos = 0] = version.split('/').map(Number)
  return {
    sheet,
    shown,
    entry,
    saved: id !== undefined,
    draft: entry.draft !== null,
    edit: (change) => write(change(latest.current)),
    editShown: (change) => {
      const own = latest.current
      const moved = change(transposeSheet(own, transpose))
      // Each chord back in the sheet's own key, its key spelled as it was.
      write({
        ...moved,
        key: own.key,
        sections: moved.sections.map((section) =>
          eachChord(section, (each) => ({ ...each, chord: written(each.chord) })),
        ),
      })
    },
    written,
    setEntry: (change) => editSheet(store, id, change),
    setSettings: (change) =>
      editSheet(store, id, { settings: { ...(entry.settings ?? NEW_ENTRY.settings), ...change } }),
    undo: () => step('undo'),
    redo: () => step('redo'),
    canUndo: undos > 0,
    canRedo: redos > 0,
  }
}
