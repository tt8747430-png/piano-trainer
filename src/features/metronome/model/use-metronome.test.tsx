import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeAudio, PLAY_DELAY, type FakeAudio } from '@/shared/api/audio'
import { ServicesProvider } from '@/shared/lib/services'
import { useMetronome } from './use-metronome'

let audio: FakeAudio
beforeEach(() => {
  vi.useFakeTimers()
  audio = createFakeAudio()
})
afterEach(() => vi.useRealTimers())

function metronome(initial: { on: boolean; tempo: number; beats: number }) {
  return renderHook((props) => useMetronome(props), {
    initialProps: initial,
    wrapper: ({ children }: { children: ReactNode }) => (
      <ServicesProvider services={{ audio, midi: null }}>{children}</ServicesProvider>
    ),
  })
}

describe('useMetronome', () => {
  it('queues a bar at a time ahead of the audio clock, each where the last ends', () => {
    metronome({ on: true, tempo: 120, beats: 4 })
    expect(audio.played.map((play) => play.at)).toEqual([PLAY_DELAY, PLAY_DELAY + 2])
    expect(audio.played[0]?.sounds).toHaveLength(4)
    act(() => {
      audio.setNow(2)
      vi.advanceTimersByTime(100)
    })
    expect(audio.played.map((play) => play.at)).toEqual([0, 2, 4].map((at) => at + PLAY_DELAY))
  })

  it('queues nothing while off, and silences what it queued when turned off', () => {
    const { rerender } = metronome({ on: false, tempo: 120, beats: 4 })
    expect(audio.played).toEqual([])
    rerender({ on: true, tempo: 120, beats: 4 })
    rerender({ on: false, tempo: 120, beats: 4 })
    expect(audio.stops).toBe(1)
    act(() => void vi.advanceTimersByTime(1000))
    expect(audio.played).toHaveLength(2)
  })

  it('takes up a new tempo from the next bar it queues, without starting again', () => {
    const { rerender } = metronome({ on: true, tempo: 120, beats: 4 })
    rerender({ on: true, tempo: 60, beats: 4 })
    expect(audio.stops).toBe(0)
    act(() => {
      audio.setNow(2)
      vi.advanceTimersByTime(100)
    })
    const third = audio.played[2]
    expect(third?.at).toBeCloseTo(4 + PLAY_DELAY)
    expect(third?.sounds.map((sound) => sound.at)).toEqual([0, 1, 2, 3])
  })
})
