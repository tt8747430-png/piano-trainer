import { describe, expect, it, vi } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import { createProgressStore, PROGRESS_STORAGE_KEY } from './store'
import { EMPTY_PROGRESS } from './types'

/** Puts progress in storage as an earlier session would have saved it. */
const writeSaved = (storage: Storage, state: unknown, version = 2) =>
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
      version: 2,
    })
  })

  it('restores what was saved', () => {
    const storage = createMemoryStorage()
    const saved = {
      learned: { 'chords:sev': DAY },
      practised: { bz5: DAY },
      answers: { 'chord:m7': [{ correct: true, at: DAY }] },
      trainers: { 'build-chord:1': { runs: 3, last: 70, best: 90, bestStreak: 8 } },
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
      trainers: {
        'name-chord:3': { runs: 2, last: 80, best: 70, bestStreak: 5 },
        'name-chord:4': { runs: 0, last: 0, best: 0, bestStreak: 0 },
        'chords by ear': { runs: 1, last: 50, best: 50, bestStreak: 1 },
        'reading-notes:1': { runs: 1, last: 120, best: 120, bestStreak: 1 },
      },
      extra: true,
    })
    expect(createProgressStore({ storage }).getState()).toEqual({
      learned: { 'piece:bz5': DAY },
      practised: { bz5: DAY },
      answers: {
        'chord:m7': seven.slice(2),
        'scale:major': [{ correct: false, at: DAY }],
      },
      trainers: { 'name-chord:3': { runs: 2, last: 80, best: 80, bestStreak: 5 } },
    })
  })

  it('reads a version-1 save, its quiz stats belonging to no trainer', () => {
    const storage = createMemoryStorage()
    const answers = { 'chord:m7': [{ correct: true, at: DAY }] }
    writeSaved(
      storage,
      {
        learned: { 'piece:bz5': DAY },
        answers,
        quiz: { correct: 1, total: 1, streak: 1, best: 1 },
      },
      1,
    )
    expect(createProgressStore({ storage }).getState()).toEqual({
      ...EMPTY_PROGRESS,
      learned: { 'piece:bz5': DAY },
      answers,
    })
  })

  it.each([0, 3])('reads a version-%i save for what is still valid', (version) => {
    const storage = createMemoryStorage()
    writeSaved(storage, { learned: { 'piece:bz5': DAY, 'lesson:1': DAY }, quiz: 'lost' }, version)
    expect(createProgressStore({ storage }).getState()).toEqual({
      ...EMPTY_PROGRESS,
      learned: { 'piece:bz5': DAY },
    })
  })

  it('keeps what another tab saved when it saves next', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createProgressStore({ storage, otherTabs })
    writeSaved(storage, { ...EMPTY_PROGRESS, practised: { bz5: DAY } })
    otherTabs.dispatchEvent(
      new StorageEvent('storage', {
        key: PROGRESS_STORAGE_KEY,
        newValue: storage.getItem(PROGRESS_STORAGE_KEY),
      }),
    )
    store.setState({ learned: { 'piece:bz5': DAY } })
    expect(JSON.parse(storage.getItem(PROGRESS_STORAGE_KEY) ?? 'null').state).toEqual({
      ...EMPTY_PROGRESS,
      practised: { bz5: DAY },
      learned: { 'piece:bz5': DAY },
    })
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
