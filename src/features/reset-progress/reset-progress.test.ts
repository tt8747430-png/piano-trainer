import { describe, expect, it } from 'vitest'
import { createProgressStore, EMPTY_PROGRESS } from '@/entities/progress'
import { recordPractised } from '@/features/record-practised'
import { createMemoryStorage } from '@/shared/lib'
import { resetProgress } from './index'

describe('resetProgress', () => {
  it('forgets all progress, on this device too', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordPractised(store, 'bz5', new Date('2026-09-25T10:00:00.000Z'))
    resetProgress(store)
    expect(store.getState()).toEqual(EMPTY_PROGRESS)
    expect(JSON.parse(storage.getItem('pt-progress') ?? 'null').state).toEqual(EMPTY_PROGRESS)
  })
})
