import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { markLearned, unmarkLearned } from './index'

const MONDAY = new Date('2026-09-21T10:00:00.000Z')
const FRIDAY = new Date('2026-09-25T10:00:00.000Z')

describe('mark-learned', () => {
  it('marks a step learned on the day, and saves it', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    markLearned(store, 'piece:bz5', MONDAY)
    expect(store.getState().learned).toEqual({ 'piece:bz5': MONDAY.toISOString() })
    expect(storage.getItem('pt-progress')).toContain(MONDAY.toISOString())
  })

  it('keeps the day a step was first marked', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    markLearned(store, 'piece:bz5', MONDAY)
    markLearned(store, 'piece:bz5', FRIDAY)
    expect(store.getState().learned['piece:bz5']).toBe(MONDAY.toISOString())
  })

  it('unmarks a step, leaving the others', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    markLearned(store, 'piece:bz5', MONDAY)
    markLearned(store, 'chords:sev', MONDAY)
    unmarkLearned(store, 'piece:bz5')
    expect(store.getState().learned).toEqual({ 'chords:sev': MONDAY.toISOString() })
  })
})
