// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { recordSectionRead } from './record-reading'

describe('record-reading', () => {
  it('saves a lesson’s section read, once', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordSectionRead(store, 'lesson:triads', 1)
    recordSectionRead(store, 'lesson:triads', 1)
    recordSectionRead(store, 'lesson:triads', 0)
    expect(store.getState().read).toEqual({ 'lesson:triads': [0, 1] })
    expect(storage.getItem('pt-progress')).toContain('"lesson:triads":[0,1]')
  })
})
