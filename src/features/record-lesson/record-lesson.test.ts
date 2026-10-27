// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { loopParam } from '@/features/practice'
import { createMemoryStorage } from '@/shared/lib'
import { recordHold, recordPass } from './index'

const MONDAY = new Date('2026-10-19T10:00:00.000Z')
const FRIDAY = new Date('2026-10-23T10:00:00.000Z')

describe('recordPass', () => {
  it('saves a pass over bars as played, under the bars the Player’s loop names', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    const chorus = { first: 8, last: 17 }
    recordPass(store, 'bz5', chorus, MONDAY)
    expect(store.getState().lessons).toEqual({
      [`bz5:bars:${loopParam(chorus)}`]: MONDAY.toISOString(),
    })
    expect(storage.getItem('pt-progress')).toContain('bz5:bars:9-18')
  })

  it('keeps the day a pass was first finished, and writes nothing again', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    recordPass(store, 'bz5', { first: 0, last: 3 }, MONDAY)
    const saved = store.getState()
    recordPass(store, 'bz5', { first: 0, last: 3 }, FRIDAY)
    expect(store.getState()).toBe(saved)
  })
})

describe('recordHold', () => {
  it('counts each hold of a chord in its sheet, learning it on the third', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    recordHold(store, 'bz5', 'D/F♯', MONDAY)
    recordHold(store, 'bz5', 'D/F♯', MONDAY)
    expect(store.getState().holds).toEqual({ 'bz5:chord:D/F♯': 2 })
    expect(store.getState().lessons).toEqual({})
    recordHold(store, 'bz5', 'D/F♯', FRIDAY)
    expect(store.getState().lessons).toEqual({ 'bz5:chord:D/F♯': FRIDAY.toISOString() })
    const saved = store.getState()
    recordHold(store, 'bz5', 'D/F♯', FRIDAY)
    expect(store.getState()).toBe(saved)
  })
})
