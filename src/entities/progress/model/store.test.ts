import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createProgressStore, PROGRESS_STORAGE_KEY } from './store'
import { EMPTY_PROGRESS } from './types'

/** Puts progress in storage as an earlier session would have saved it. */
const writeSaved = (storage: Storage, state: unknown, version = 1) =>
  storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ state, version }))

const DAY = '2026-09-25T10:00:00.000Z'

describe('createProgressStore', () => {
  it('starts empty', () => {
    expect(createProgressStore({ storage: createMemoryStorage() }).getState()).toEqual(
      EMPTY_PROGRESS,
    )
  })

  it('saves under pt-progress with its version', () => {
    const storage = createMemoryStorage()
    const store = createProgressStore({ storage })
    store.setState({ learned: { 'piece:bz5': DAY } })
    expect(JSON.parse(storage.getItem('pt-progress') ?? 'null')).toEqual({
      state: { ...EMPTY_PROGRESS, learned: { 'piece:bz5': DAY } },
      version: 1,
    })
  })

  it('restores what was saved', () => {
    const storage = createMemoryStorage()
    const saved = {
      learned: { 'chords:sev': DAY },
      practised: { bz5: DAY },
      answers: { 'chord:m7': [{ correct: true, at: DAY }] },
      quiz: { correct: 1, total: 1, streak: 1, best: 1 },
    }
    writeSaved(storage, saved)
    expect(createProgressStore({ storage }).getState()).toEqual(saved)
  })

  it('keeps what is valid in a hand-edited save and drops the rest', () => {
    const storage = createMemoryStorage()
    const seven = Array.from({ length: 7 }, (_, i) => ({ correct: i % 2 === 0, at: DAY }))
    writeSaved(storage, {
      learned: { 'piece:bz5': DAY, 'lesson:1': DAY, 'scale:blues': 'yesterday', 'chords:': DAY },
      practised: { bz5: DAY, '': DAY, ode: 42 },
      answers: {
        'chord:m7': seven,
        'chord:x': [{ correct: true, at: DAY }],
        'scale:major': [{ correct: 'yes', at: DAY }, { correct: false, at: DAY }, null],
        'scale:blues': 'none',
      },
      quiz: { correct: 3, total: 5, streak: 4, best: 2 },
      extra: true,
    })
    expect(createProgressStore({ storage }).getState()).toEqual({
      learned: { 'piece:bz5': DAY },
      practised: { bz5: DAY },
      answers: {
        'chord:m7': seven.slice(2),
        'scale:major': [{ correct: false, at: DAY }],
      },
      quiz: { correct: 3, total: 5, streak: 4, best: 4 },
    })
  })

  it.each([
    { correct: -1, total: 5, streak: 0, best: 0 },
    { correct: 1.5, total: 5, streak: 0, best: 0 },
    { correct: 6, total: 5, streak: 0, best: 0 },
    { correct: 1, total: 5 },
    'lots',
  ])('starts the quiz stats over when they cannot be right: %j', (quiz) => {
    const storage = createMemoryStorage()
    writeSaved(storage, { quiz })
    expect(createProgressStore({ storage }).getState().quiz).toEqual(EMPTY_PROGRESS.quiz)
  })

  it('starts empty, without throwing, when the saved JSON is corrupt', () => {
    const storage = createMemoryStorage()
    storage.setItem(PROGRESS_STORAGE_KEY, '{oops')
    expect(createProgressStore({ storage }).getState()).toEqual(EMPTY_PROGRESS)
  })

  it('works on blocked storage, holding progress for the session', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError')
    })
    const store = createProgressStore()
    expect(() => store.setState({ practised: { bz5: DAY } })).not.toThrow()
    expect(store.getState().practised).toEqual({ bz5: DAY })
  })
})
