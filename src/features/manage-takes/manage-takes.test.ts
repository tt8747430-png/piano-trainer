import { describe, expect, it } from 'vitest'
import { createTakesStore, keepBars, type Played } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { deleteTake, keepTakeBars, renameTake, saveTake } from './index'

const fresh = () =>
  createTakesStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const PLAYED: Played = {
  notes: [{ midi: midi(60), at: 0, held: 500, velocity: 80 }],
  pedals: [],
  length: 1000,
}
const TAKE = {
  pieceId: 'my-1',
  made: 1_760_000_000_000,
  tempo: 90,
  meter: '4/4',
  fromBar: 1,
  ...PLAYED,
} as const

describe('saveTake', () => {
  it('keeps what was played as the next take, and hands back its id', () => {
    const store = fresh()
    expect(saveTake(store, TAKE)).toBe('take-1')
    expect(saveTake(store, TAKE)).toBe('take-2')
    expect(store.getState().takes[0]).toEqual({ id: 'take-1', ...TAKE })
  })
})

describe('deleteTake', () => {
  it('deletes a take without giving its number again', () => {
    const store = fresh()
    const first = saveTake(store, TAKE)
    deleteTake(store, first)
    expect(store.getState().takes).toEqual([])
    expect(saveTake(store, TAKE)).toBe('take-2')
  })
})

describe('renameTake', () => {
  it('names a take, trimmed and cut at 40 characters; a blank name takes it away', () => {
    const store = fresh()
    const id = saveTake(store, TAKE)
    renameTake(store, id, '  Verse  ')
    expect(store.getState().takes[0]?.name).toBe('Verse')
    renameTake(store, id, 'x'.repeat(50))
    expect(store.getState().takes[0]?.name).toBe('x'.repeat(40))
    renameTake(store, id, '   ')
    expect(store.getState().takes[0]).not.toHaveProperty('name')
  })

  it('changes nothing for a take that is not there', () => {
    const store = fresh()
    saveTake(store, TAKE)
    const before = store.getState()
    renameTake(store, 'take-9', 'Verse')
    expect(store.getState()).toBe(before)
  })
})

describe('keepTakeBars', () => {
  it('cuts a take to its bars for good, keeping the others and the next number', () => {
    const store = fresh()
    const long = { ...TAKE, tempo: 120, length: 8000 }
    const first = saveTake(store, long)
    const second = saveTake(store, TAKE)
    keepTakeBars(store, first, 1, 2)
    const [cut, other] = store.getState().takes
    expect(cut).toEqual(keepBars({ id: first, ...long }, 1, 2))
    expect(other?.id).toBe(second)
    expect(store.getState().nextTake).toBe(3)
  })
})
