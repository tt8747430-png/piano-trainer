import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { midi, note, pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { Asks } from './draw'
import { targetKeys } from './round-keys'
import { AUTO_NEXT_MS, useTrainer, type TrainerOptions } from './use-trainer'

const ONLY_C_MAJOR: Asks = {
  kind: 'skills',
  chords: 'build-chord',
  skills: ['chord:maj'],
  roots: [pitchClass(0)],
}
const MIDDLE_C_ONLY: Asks = {
  kind: 'notes',
  notes: [{ key: midi(60), spelled: note('C'), clef: 'treble' }],
}

function setup(asks: Asks, options: Partial<TrainerOptions> = {}) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  const audio = createFakeAudio()
  let time = 0
  const clock = {
    now: () => time,
    move: (ms: number) => {
      time += ms
    },
  }
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    </ProgressStoreProvider>
  )
  const hook = renderHook(
    () => useTrainer(asks, { rounds: 2, random: () => 0, now: clock.now, ...options }),
    { wrapper },
  )
  return { ...hook, store, audio, clock }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('useTrainer', () => {
  it('falls silent when the learner leaves', () => {
    const { unmount, audio } = setup(ONLY_C_MAJOR)
    unmount()
    expect(audio.stops).toBe(1)
  })

  it('asks a round at once and records a right answer on a rated skill as evidence', () => {
    const { result, store, audio } = setup(ONLY_C_MAJOR)
    const { question } = result.current.round
    act(() => {
      for (const key of targetKeys(question)) result.current.toggleKey(key)
    })
    act(() => result.current.check())
    expect(result.current.round.result?.correct).toBe(true)
    expect(store.getState().answers['chord:maj']).toHaveLength(1)
    expect(audio.played.length).toBeGreaterThan(0)
  })

  it('records a wrong answer once, however often Check is pressed', () => {
    const { result, store } = setup(ONLY_C_MAJOR)
    act(() => result.current.check())
    act(() => result.current.check())
    expect(store.getState().answers['chord:maj']).toEqual([
      expect.objectContaining({ correct: false }),
    ])
  })

  it('records nothing as evidence for a round that rates no skill', () => {
    const { result, store } = setup(MIDDLE_C_ONLY)
    act(() => result.current.pressKey(midi(60)))
    expect(result.current.round.result?.correct).toBe(true)
    expect(store.getState().answers).toEqual({})
  })

  it('numbers its rounds and sums the run up after its last, keeping its record', () => {
    const { result, store, clock } = setup(MIDDLE_C_ONLY, { runKey: 'reading-notes:anchors' })
    expect(result.current.number).toBe(1)
    clock.move(1200)
    act(() => result.current.pressKey(midi(60)))
    act(() => result.current.next())
    expect(result.current.number).toBe(2)
    clock.move(800)
    act(() => result.current.pressKey(midi(62)))
    expect(result.current.summary).toBeNull()
    act(() => result.current.next())
    expect(result.current.summary).toMatchObject({
      answered: 2,
      accuracy: 50,
      averageMs: 1000,
      bestStreak: 1,
    })
    expect(store.getState().trainers['reading-notes:anchors']).toEqual({
      runs: 1,
      last: 50,
      best: 50,
      bestStreak: 1,
    })
  })

  it('sums up a run stopped early with the rounds answered, and starts again', () => {
    const { result } = setup(MIDDLE_C_ONLY, { rounds: 0 })
    act(() => result.current.pressKey(midi(60)))
    act(() => result.current.stop())
    expect(result.current.summary).toMatchObject({ answered: 1, accuracy: 100 })
    act(() => result.current.again())
    expect(result.current.summary).toBeNull()
    expect(result.current.number).toBe(1)
    expect(result.current.run.answered).toEqual([])
  })

  it('moves on by itself after a right answer with auto-next, and waits after a wrong one', () => {
    vi.useFakeTimers()
    const { result } = setup(MIDDLE_C_ONLY, { autoNext: true, rounds: 0 })
    act(() => result.current.pressKey(midi(60)))
    act(() => vi.advanceTimersByTime(AUTO_NEXT_MS))
    expect(result.current.number).toBe(2)
    act(() => result.current.pressKey(midi(61)))
    act(() => vi.advanceTimersByTime(AUTO_NEXT_MS * 3))
    expect(result.current.round.result?.correct).toBe(false)
  })

  it('sounds an ear round as it is shown, and again on request, stopping on a second', () => {
    const asks: Asks = { ...ONLY_C_MAJOR, chords: 'name-chord' }
    const { result, audio } = setup(asks)
    expect(audio.played).toHaveLength(1)
    act(() => result.current.hear())
    expect(audio.played).toHaveLength(2)
    expect(result.current.hearing).toBe(true)
    const stops = audio.stops
    act(() => result.current.hear())
    expect(audio.stops).toBe(stops + 1)
    expect(result.current.hearing).toBe(false)
  })
})
