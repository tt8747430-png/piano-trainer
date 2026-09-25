import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { recordAnswer } from './index'

const NOW = new Date('2026-09-25T10:00:00.000Z')

describe('recordAnswer', () => {
  it('records an answer as evidence and in the quiz stats, and saves it', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordAnswer(store, { skill: 'chord:m7', correct: true }, NOW)
    expect(store.getState().answers['chord:m7']).toEqual([{ correct: true, at: NOW.toISOString() }])
    expect(store.getState().quiz).toEqual({ correct: 1, total: 1, streak: 1, best: 1 })
    expect(storage.getItem('pt-progress')).toContain(NOW.toISOString())
  })

  it('marks a step learned by the answer that makes it Known', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    for (let i = 0; i < 4; i++) recordAnswer(store, { skill: 'scale:blues', correct: true }, NOW)
    expect(store.getState().learned['scale:blues']).toBe(NOW.toISOString())
  })
})
