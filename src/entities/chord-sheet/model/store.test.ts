// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import {
  CHORD_SHEETS_STORAGE_KEY,
  CHORD_SHEETS_VERSION,
  createChordSheetsStore,
  DEFAULT_SHEET_SETTINGS,
  NEW_ENTRY,
} from './store'

const restored = (state: unknown, version = CHORD_SHEETS_VERSION) => {
  const storage = createMemoryStorage()
  storage.setItem(CHORD_SHEETS_STORAGE_KEY, JSON.stringify({ state, version }))
  return createChordSheetsStore({ storage, otherTabs: new EventTarget() }).getState()
}

const MINE = {
  id: 'sheet-1',
  name: 'Sunday set',
  text: 'G 4/4; verse x2: G D Em C; chorus v2: C G D:2 G:2',
  style: 'worship-1',
  tempo: 72,
  settings: DEFAULT_SHEET_SETTINGS,
}

describe('the chord sheets store (pt-chord-sheets)', () => {
  it('starts with an empty Verse in hand in Pop 1 at 100, and none of the learner’s own', () => {
    const storage = createMemoryStorage()
    const store = createChordSheetsStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ scratch: NEW_ENTRY, mine: [], nextId: 1 })
    expect(NEW_ENTRY).toMatchObject({ text: 'C 4/4; verse:', style: 'pop-1', tempo: 100 })
    store.setState({ nextId: 2 })
    expect(JSON.parse(storage.getItem('pt-chord-sheets') ?? 'null').version).toBe(1)
  })
  it('reads a version-1 save field by field', () => {
    const saved = { scratch: { ...MINE, id: undefined, name: undefined }, mine: [MINE], nextId: 2 }
    const state = restored(saved)
    expect(state.mine).toEqual([MINE])
    expect(state.scratch.text).toBe(MINE.text)
    expect(state.nextId).toBe(2)
  })
  it('starts empty from any other version', () => {
    expect(restored({ mine: [MINE], nextId: 2 }, 0)).toEqual({
      scratch: NEW_ENTRY,
      mine: [],
      nextId: 1,
    })
  })
  it('drops a sheet whose text does not read, a name that is blank, an id twice', () => {
    const state = restored({
      mine: [
        MINE,
        { ...MINE, id: 'sheet-2', text: 'nonsense' },
        { ...MINE, id: 'sheet-3', name: '   ' },
        { ...MINE, name: 'Again' },
        'Sunday',
      ],
      nextId: 9,
    })
    expect(state.mine.map((each) => each.id)).toEqual(['sheet-1'])
  })
  it('a field added later, or out of its range, reads as its default or its nearest', () => {
    const state = restored({
      mine: [
        {
          ...MINE,
          style: 42,
          tempo: 999,
          settings: { drums: { on: false, level: 250 }, countIn: 'yes', transpose: -40 },
        },
      ],
    })
    expect(state.mine[0]).toMatchObject({
      style: 'pop-1',
      tempo: 240,
      settings: {
        ...DEFAULT_SHEET_SETTINGS,
        drums: { on: false, level: 100 },
        transpose: -5,
      },
    })
    expect(state.nextId).toBe(2)
  })
  it('keeps at most 100 sheets', () => {
    const mine = Array.from({ length: 120 }, (_, i) => ({ ...MINE, id: `sheet-${i + 1}` }))
    expect(restored({ mine, nextId: 121 }).mine).toHaveLength(100)
  })
})
