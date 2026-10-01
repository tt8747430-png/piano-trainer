import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { recordRun } from './index'

describe('recordRun', () => {
  it('records a run at its level and saves it', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordRun(store, 'reading-notes:anchors', { accuracy: 80, streak: 6 })
    expect(store.getState().trainers['reading-notes:anchors']).toEqual({
      runs: 1,
      last: 80,
      best: 80,
      bestStreak: 6,
    })
    expect(storage.getItem('pt-progress')).toContain('reading-notes:anchors')
  })
})
