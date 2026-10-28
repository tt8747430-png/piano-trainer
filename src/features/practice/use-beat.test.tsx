import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import type { Tick } from '@/shared/lib/music'
import type { PlayedBeat } from './beats'
import { initialPractice } from './practice-machine'
import { TWO_BARS } from './testing/performances'
import { useBeat } from './use-beat'
import type { Practice } from './use-practice'

const B = TICKS_PER_BEAT

/** The cursor on a beat group of the two bars, C and G, a beat group to each beat. */
const standingOn = (beatGroup: number) => ({
  ...initialPractice(TWO_BARS, 'listen', 'both'),
  beatGroup,
})

afterEach(() => vi.useRealTimers())

describe('useBeat', () => {
  it('is the beat the cursor stands on while nothing plays', () => {
    const { result } = renderHook(() => useBeat(TWO_BARS, { state: standingOn(5), clock: null }))
    expect(result.current).toEqual({ bar: 1, beat: 1, startTick: 5 * B })
  })

  it('follows Listen’s clock every frame, rendering again only as a beat begins', () => {
    vi.useFakeTimers()
    let heard: Tick | null = (5 * B) / 12
    let renders = 0
    const state = standingOn(0)
    const clock = () => heard
    const { result } = renderHook(() => {
      renders++
      return useBeat(TWO_BARS, { state, clock })
    })
    expect(result.current).toEqual({ bar: 0, beat: 0, startTick: 0 })
    const rendered = renders
    heard = (5 * B) / 6
    act(() => vi.advanceTimersToNextFrame())
    expect(renders).toBe(rendered)
    heard = 1.25 * B
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 0, beat: 1, startTick: B })
    expect(renders).toBe(rendered + 1)
    heard = (25 * B) / 6
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 1, beat: 0, startTick: 4 * B })
  })

  it('stands on the cursor’s beat until the music first sounds, and once Listen stops', () => {
    vi.useFakeTimers()
    const state = standingOn(2)
    const { result, rerender } = renderHook<PlayedBeat, { clock: Practice['clock'] }>(
      ({ clock }) => useBeat(TWO_BARS, { state, clock }),
      { initialProps: { clock: () => null } },
    )
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 0, beat: 2, startTick: 2 * B })
    rerender({ clock: () => (85 * B) / 12 })
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 1, beat: 3, startTick: 7 * B })
    rerender({ clock: null })
    expect(result.current).toEqual({ bar: 0, beat: 2, startTick: 2 * B })
  })
})
