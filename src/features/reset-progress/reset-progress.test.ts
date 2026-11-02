// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createProgressStore, EMPTY_PROGRESS } from '@/entities/progress'
import { recordPractised } from '@/features/record-practised'
import { createMemoryStorage } from '@/shared/lib'
import { resetProgress, resetSteps } from './index'

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

describe('resetSteps', () => {
  it('forgets one lesson’s progress, saved, the rest kept', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    recordPractised(store, 'bz5', new Date('2026-09-25T10:00:00.000Z'))
    store.setState({ learned: { 'lesson:a': '2026-09-25' }, read: { 'lesson:a': [0, 1] } })
    resetSteps(store, ['lesson:a'])
    expect(store.getState().learned).toEqual({})
    expect(store.getState().read).toEqual({})
    expect(store.getState().practised).toHaveProperty('bz5')
    expect(JSON.parse(storage.getItem('pt-progress') ?? 'null').state.learned).toEqual({})
  })
})
