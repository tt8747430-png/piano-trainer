import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { createTakesStore, TAKES_STORAGE_KEY } from './store'
import type { Take } from './types'

const restored = (state: unknown, version = 2) => {
  const storage = createMemoryStorage()
  storage.setItem(TAKES_STORAGE_KEY, JSON.stringify({ state, version }))
  return createTakesStore({ storage, otherTabs: new EventTarget() }).getState()
}

const TAKE: Take = {
  id: 'take-1',
  pieceId: 'my-1',
  made: 1_760_000_000_000,
  tempo: 90,
  meter: '4/4',
  length: 4000,
  notes: [
    { midi: midi(60), at: 0, held: 640, velocity: 90 },
    { midi: midi(64), at: 667, held: 600, velocity: 72 },
  ],
  pedals: [{ pedal: 'sustain', down: 10, up: 1300 }],
  fromBar: 1,
}
/** The take as it is saved: each note and press a short list of whole numbers. */
const SAVED_TAKE = {
  id: 'take-1',
  pieceId: 'my-1',
  made: 1_760_000_000_000,
  tempo: 90,
  meter: '4/4',
  length: 4000,
  notes: [
    [60, 0, 640, 90],
    [64, 667, 600, 72],
  ],
  pedals: [[10, 1300]],
  fromBar: 1,
}

describe('createTakesStore', () => {
  it('starts with no takes, and saves each note and press compactly under pt-takes', () => {
    const storage = createMemoryStorage()
    const store = createTakesStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ takes: [], nextTake: 1 })
    store.setState({ takes: [TAKE], nextTake: 2 })
    expect(JSON.parse(storage.getItem('pt-takes') ?? 'null')).toEqual({
      state: { takes: [SAVED_TAKE], nextTake: 2 },
      version: 2,
    })
  })

  it('restores what was saved', () => {
    expect(restored({ takes: [SAVED_TAKE], nextTake: 2 })).toEqual({ takes: [TAKE], nextTake: 2 })
  })

  it('drops a note or a press that cannot be one, and keeps the rest of the take', () => {
    const notes = [
      [60, 0, 640, 90],
      [20, 0, 100, 90],
      [64, 667, 600, 0],
      [65, 3900, 200, 80],
      [66, -5, 100, 80],
      [67, 100, 100],
      [68, 'x', 100, 80],
      'C4',
    ]
    const pedals = [
      [10, 1300],
      [1300, 10],
      [0, 5000],
      [0, 100, 7],
      [1, 2, 3, 4],
    ]
    const take = restored({ takes: [{ ...SAVED_TAKE, notes, pedals }], nextTake: 2 }).takes[0]
    expect(take?.notes).toEqual([{ midi: 60, at: 0, held: 640, velocity: 90 }])
    expect(take?.pedals).toEqual([{ pedal: 'sustain', down: 10, up: 1300 }])
  })

  it('reads a version-1 take’s presses as the sustain’s, from bar 1, unnamed', () => {
    const { pedals: _pedals, fromBar: _fromBar, ...older } = SAVED_TAKE
    const v1 = {
      ...older,
      pedal: [
        [10, 1300],
        [20, 30, 1],
      ],
    }
    expect(restored({ takes: [v1], nextTake: 2 }, 1).takes).toEqual([TAKE])
  })

  it('keeps the soft pedal’s and the sostenuto’s presses, the bar it starts at and its name', () => {
    const saved = {
      ...SAVED_TAKE,
      name: 'Verse, slower',
      fromBar: 9,
      pedals: [
        [10, 1300],
        [20, 400, 1],
        [500, 900, 2],
      ],
    }
    const storage = createMemoryStorage()
    storage.setItem(
      TAKES_STORAGE_KEY,
      JSON.stringify({ state: { takes: [saved], nextTake: 2 }, version: 2 }),
    )
    const store = createTakesStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState().takes[0]).toEqual({
      ...TAKE,
      name: 'Verse, slower',
      fromBar: 9,
      pedals: [
        { pedal: 'sustain', down: 10, up: 1300 },
        { pedal: 'soft', down: 20, up: 400 },
        { pedal: 'sostenuto', down: 500, up: 900 },
      ],
    })
    store.setState({ takes: [...store.getState().takes], nextTake: 2 })
    expect(JSON.parse(storage.getItem(TAKES_STORAGE_KEY) ?? 'null').state.takes[0]).toEqual(saved)
  })

  it('reads a name trimmed to 1–40 characters, else none; a bar from 1, else 1', () => {
    const read = (extra: object) => restored({ takes: [{ ...SAVED_TAKE, ...extra }] }).takes[0]
    expect(read({ name: '  Intro  ' })?.name).toBe('Intro')
    expect(read({ name: 'x'.repeat(41) })).not.toHaveProperty('name')
    expect(read({ name: '   ' })).not.toHaveProperty('name')
    expect(read({ fromBar: 0 })?.fromBar).toBe(1)
    expect(read({ fromBar: 2.5 })?.fromBar).toBe(1)
  })

  it('rounds a time to the millisecond', () => {
    const notes = [[60, 0.4, 640.6, 90]]
    expect(restored({ takes: [{ ...SAVED_TAKE, notes }] }).takes[0]?.notes).toEqual([
      { midi: 60, at: 0, held: 641, velocity: 90 },
    ])
  })

  it('drops a take whose id, piece, time, tempo, meter or length cannot be read, or that came before', () => {
    const takes = [
      SAVED_TAKE,
      { ...SAVED_TAKE, id: 'take-1' },
      { ...SAVED_TAKE, id: 'take-0' },
      { ...SAVED_TAKE, id: 'take-3', pieceId: '' },
      { ...SAVED_TAKE, id: 'take-4', made: 'today' },
      { ...SAVED_TAKE, id: 'take-5', tempo: 300 },
      { ...SAVED_TAKE, id: 'take-6', meter: '5/4' },
      { ...SAVED_TAKE, id: 'take-7', length: -1 },
      { ...SAVED_TAKE, id: 'take-8', length: 11 * 60 * 1000 },
      { ...SAVED_TAKE, id: 'take-9', notes: 'none' },
      null,
    ]
    expect(restored({ takes, nextTake: 2 }).takes.map((take) => take.id)).toEqual(['take-1'])
  })

  it('never gives a number again: the next one is past every take kept', () => {
    const later = { ...SAVED_TAKE, id: 'take-7' }
    expect(restored({ takes: [later], nextTake: 3 }).nextTake).toBe(8)
    expect(restored({ takes: [], nextTake: 12 }).nextTake).toBe(12)
    expect(restored('nonsense')).toEqual({ takes: [], nextTake: 1 })
  })
})
