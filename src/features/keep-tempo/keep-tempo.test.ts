// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createProgressStore } from '@/entities/progress'
import { createMemoryStorage } from '@/shared/lib'
import { keepTempo } from './index'

describe('keepTempo', () => {
  it('keeps each exercise’s last tempo and saves it, writing nothing when it is kept already', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    keepTempo(store, 'hanon:5', 72)
    keepTempo(store, 'scale', 96)
    keepTempo(store, 'hanon:5', 84)
    expect(store.getState().tempos).toEqual({ 'hanon:5': 84, scale: 96 })
    expect(storage.getItem('pt-progress')).toContain('"hanon:5":84')
    const kept = store.getState()
    keepTempo(store, 'scale', 96)
    expect(store.getState()).toBe(kept)
  })
})
