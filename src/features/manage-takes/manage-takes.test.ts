import { describe, expect, it } from 'vitest'
import { createTakesStore, type Played } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { midi } from '@/shared/lib/music'
import { deleteTake, saveTake } from './index'

const fresh = () =>
  createTakesStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const PLAYED: Played = {
  notes: [{ midi: midi(60), at: 0, held: 500, velocity: 80 }],
  pedal: [],
  length: 1000,
}
const MADE = { pieceId: 'my-1', made: 1_760_000_000_000, tempo: 90, meter: '4/4' } as const

describe('saveTake', () => {
  it('keeps what was played as the next take, and hands back its id', () => {
    const store = fresh()
    expect(saveTake(store, MADE, PLAYED)).toBe('take-1')
    expect(saveTake(store, MADE, PLAYED)).toBe('take-2')
    expect(store.getState().takes[0]).toEqual({ id: 'take-1', ...MADE, ...PLAYED })
  })
})

describe('deleteTake', () => {
  it('deletes a take without giving its number again', () => {
    const store = fresh()
    const first = saveTake(store, MADE, PLAYED)
    deleteTake(store, first)
    expect(store.getState().takes).toEqual([])
    expect(saveTake(store, MADE, PLAYED)).toBe('take-2')
  })
})
