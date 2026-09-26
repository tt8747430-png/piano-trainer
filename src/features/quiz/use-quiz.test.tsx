import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createProgressStore, ProgressStoreProvider } from '@/entities/progress'
import { createFakeAudio } from '@/shared/api/audio'
import { createMemoryStorage } from '@/shared/lib'
import { pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import type { QuizConfig } from './quiz-machine'
import { targetKeys } from './quiz-keys'
import { useQuiz } from './use-quiz'

const ONLY_C_MAJOR: QuizConfig = {
  chordMode: 'build-chord',
  scope: { skills: ['chord:maj'], roots: [pitchClass(0)], length: 2 },
}

function setup(config: QuizConfig) {
  const store = createProgressStore({ storage: createMemoryStorage() })
  const audio = createFakeAudio()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ProgressStoreProvider store={store}>
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    </ProgressStoreProvider>
  )
  const hook = renderHook(() => useQuiz(config, { random: () => 0 }), { wrapper })
  return { ...hook, store, audio }
}

describe('useQuiz', () => {
  it('asks a question at once and records a right answer as evidence', () => {
    const { result, store, audio } = setup(ONLY_C_MAJOR)
    const question = result.current.state.question
    if (!question) throw new Error('no question')
    act(() => {
      for (const key of targetKeys(question)) result.current.toggleKey(key)
    })
    act(() => result.current.check())
    expect(result.current.state.result?.correct).toBe(true)
    expect(store.getState().answers['chord:maj']).toHaveLength(1)
    expect(store.getState().quiz.correct).toBe(1)
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

  it('finishes after the scope’s length', () => {
    const { result } = setup(ONLY_C_MAJOR)
    act(() => result.current.check())
    act(() => result.current.next())
    act(() => result.current.check())
    expect(result.current.finished).toBe(true)
    act(() => result.current.next())
    expect(result.current.state.asked).toBe(2)
  })

  it('sounds a Name chord question as it is shown, and again on request', () => {
    const { result, audio } = setup({ ...ONLY_C_MAJOR, chordMode: 'name-chord' })
    expect(audio.played).toHaveLength(1)
    act(() => result.current.hear())
    expect(audio.played).toHaveLength(2)
  })

  it('stops Play again’s sound on a second hear, and says while it plays', () => {
    const { result, audio } = setup({ ...ONLY_C_MAJOR, chordMode: 'name-chord' })
    expect(result.current.hearing).toBe(false)
    act(() => result.current.hear())
    expect(result.current.hearing).toBe(true)
    const stops = audio.stops
    act(() => result.current.hear())
    expect(audio.stops).toBe(stops + 1)
    expect(result.current.hearing).toBe(false)
  })
})
