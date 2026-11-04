import { describe, expect, it } from 'vitest'
import { createChordSheetsStore, NEW_ENTRY, type ChordSheetsStore } from '@/entities/chord-sheet'
import { createMemoryStorage } from '@/shared/lib'
import {
  deleteSheet,
  duplicateSheet,
  editSheet,
  holdSheet,
  renameSheet,
  saveAsMine,
  startNew,
} from './index'

const fresh = (): ChordSheetsStore =>
  createChordSheetsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const LINE = { ...NEW_ENTRY, text: 'C 4/4; verse: C G Am F' }

describe('My chord sheets', () => {
  it('Save as my chord sheet puts the sheet in hand first, named, and an edit saves it', () => {
    const store = fresh()
    editSheet(store, undefined, { text: LINE.text })
    const first = saveAsMine(store, '  Four chords  ', store.getState().scratch)
    const second = saveAsMine(store, 'Second', LINE)
    expect(store.getState().mine.map((s) => [s.id, s.name])).toEqual([
      [second, 'Second'],
      [first, 'Four chords'],
    ])
    editSheet(store, first ?? '', { tempo: 120 })
    expect(store.getState().mine[1]).toMatchObject({ tempo: 120, text: LINE.text })
  })
  it('refuses a blank name', () => {
    expect(saveAsMine(fresh(), '   ', LINE)).toBeNull()
  })
  it('renames, duplicates after it with a new id, deletes', () => {
    const store = fresh()
    const id = saveAsMine(store, 'One', LINE) ?? ''
    expect(renameSheet(store, id, 'Uno')).toBe(true)
    expect(renameSheet(store, id, '')).toBe(false)
    const copy = duplicateSheet(store, id, 'Uno (copy)') ?? ''
    expect(store.getState().mine.map((s) => s.name)).toEqual(['Uno', 'Uno (copy)'])
    expect(copy).not.toBe(id)
    deleteSheet(store, id)
    expect(store.getState().mine.map((s) => s.id)).toEqual([copy])
  })
  it('New puts an empty Verse in hand; a sheet held in hand gives back the one it replaced', () => {
    const store = fresh()
    editSheet(store, undefined, { text: LINE.text })
    const before = holdSheet(store, { ...LINE, text: 'G 3/4; chorus: G' })
    expect(before.text).toBe(LINE.text)
    expect(store.getState().scratch.text).toBe('G 3/4; chorus: G')
    startNew(store)
    expect(store.getState().scratch).toEqual(NEW_ENTRY)
  })
})
