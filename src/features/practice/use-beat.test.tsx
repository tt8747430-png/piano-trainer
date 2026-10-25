import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Tick } from '@/shared/lib/music'
import { initialPractice } from './practice-machine'
import { TWO_BARS } from './testing/performances'
import { useBeat } from './use-beat'

/** The cursor on a beat group of the two bars, C and G, a beat group to each beat. */
const standingOn = (beatGroup: number) => ({
  ...initialPractice(TWO_BARS, 'listen', 'both'),
  beatGroup,
})

afterEach(() => vi.useRealTimers())

describe('useBeat', () => {
  it('is the beat the cursor stands on while nothing plays', () => {
    const { result } = renderHook(() => useBeat(TWO_BARS, { state: standingOn(5), clock: null }))
    expect(result.current).toEqual({ bar: 1, beat: 1, startTick: 120 })
  })

  it('follows Listen’s clock every frame, rendering again only as a beat begins', () => {
    vi.useFakeTimers()
    let heard: Tick | null = 10
    let renders = 0
    const state = standingOn(0)
    const clock = () => heard
    const { result } = renderHook(() => {
      renders++
      return useBeat(TWO_BARS, { state, clock })
    })
    expect(result.current).toEqual({ bar: 0, beat: 0, startTick: 0 })
    const rendered = renders
    heard = 20
    act(() => vi.advanceTimersToNextFrame())
    expect(renders).toBe(rendered)
    heard = 30
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 0, beat: 1, startTick: 24 })
    expect(renders).toBe(rendered + 1)
    heard = 100
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 1, beat: 0, startTick: 96 })
  })

  it('stands on the cursor’s beat until the music first sounds, and once Listen stops', () => {
    vi.useFakeTimers()
    const state = standingOn(2)
    const { result, rerender } = renderHook(
      ({ clock }: { clock: (() => Tick | null) | null }) => useBeat(TWO_BARS, { state, clock }),
      { initialProps: { clock: () => null } },
    )
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 0, beat: 2, startTick: 48 })
    rerender({ clock: () => 170 })
    act(() => vi.advanceTimersToNextFrame())
    expect(result.current).toEqual({ bar: 1, beat: 3, startTick: 168 })
    rerender({ clock: null })
    expect(result.current).toEqual({ bar: 0, beat: 2, startTick: 48 })
  })
})
