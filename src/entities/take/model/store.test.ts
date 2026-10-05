import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { createTakesStore, TAKES_STORAGE_KEY } from './store'
import type { Take } from './types'

const restored = (state: unknown, version = 1) => {
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
  pedal: [{ down: 10, up: 1300 }],
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
  pedal: [[10, 1300]],
}

describe('createTakesStore', () => {
  it('starts with no takes, and saves each note and press compactly under pt-takes', () => {
    const storage = createMemoryStorage()
    const store = createTakesStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ takes: [], nextTake: 1 })
    store.setState({ takes: [TAKE], nextTake: 2 })
    expect(JSON.parse(storage.getItem('pt-takes') ?? 'null')).toEqual({
      state: { takes: [SAVED_TAKE], nextTake: 2 },
      version: 1,
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
    const pedal = [
      [10, 1300],
      [1300, 10],
      [0, 5000],
      [1, 2, 3],
    ]
    const take = restored({ takes: [{ ...SAVED_TAKE, notes, pedal }], nextTake: 2 }).takes[0]
    expect(take?.notes).toEqual([{ midi: 60, at: 0, held: 640, velocity: 90 }])
    expect(take?.pedal).toEqual([{ down: 10, up: 1300 }])
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
