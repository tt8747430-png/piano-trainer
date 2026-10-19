// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { recordDay, recordPractised } from './index'

describe('recordPractised', () => {
  it('saves when each piece was last opened, keeping the others', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordPractised(store, 'bz5', new Date('2026-09-24T10:00:00.000Z'))
    recordPractised(store, 'ode', new Date('2026-09-25T10:00:00.000Z'))
    recordPractised(store, 'bz5', new Date('2026-09-26T10:00:00.000Z'))
    expect(store.getState().practised).toEqual({
      bz5: '2026-09-26T10:00:00.000Z',
      ode: '2026-09-25T10:00:00.000Z',
    })
    expect(storage.getItem('pt-progress')).toContain('2026-09-26T10:00:00.000Z')
  })
})

describe('recordDay', () => {
  it('records today once, and saves nothing again the same day', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordDay(store, new Date(2026, 9, 11, 9))
    const saved = store.getState()
    recordDay(store, new Date(2026, 9, 11, 21))
    expect(store.getState()).toBe(saved)
    recordDay(store, new Date(2026, 9, 12, 8))
    expect(store.getState().days).toEqual(['2026-10-11', '2026-10-12'])
  })

  it('counts opening a piece in the Player as practising that day', () => {
    const store = createProgressStore({ storage: createMemoryStorage() })
    recordPractised(store, 'bz5', new Date(2026, 9, 11, 9))
    expect(store.getState().days).toEqual(['2026-10-11'])
  })
})
