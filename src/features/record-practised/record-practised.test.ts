import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { recordPractised } from './index'

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
