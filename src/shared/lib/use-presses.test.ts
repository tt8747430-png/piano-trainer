import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { midi } from '@/shared/lib/music'
import { SHORTEST_PRESS_MS, usePresses } from './use-presses'

const C4 = midi(60)
const E4 = midi(64)
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('usePresses', () => {
  it('holds a key down while it is pressed', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => result.current.press('finger', C4))
    wait(1000)
    expect([...result.current.keys]).toEqual([C4])
  })

  it('keeps a tap down for the shortest press, however soon it lifts', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => {
      result.current.press('finger', C4)
      result.current.release('finger')
    })
    expect([...result.current.keys]).toEqual([C4])
    wait(SHORTEST_PRESS_MS - 1)
    expect([...result.current.keys]).toEqual([C4])
    wait(1)
    expect(result.current.keys.size).toBe(0)
  })

  it('lets a key held past the shortest press up the moment it is let go', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => result.current.press('finger', C4))
    wait(SHORTEST_PRESS_MS + 50)
    act(() => result.current.release('finger'))
    expect(result.current.keys.size).toBe(0)
  })

  it('moves a press to another key, the key it left down for the shortest press', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => {
      result.current.press('finger', C4)
      result.current.press('finger', E4)
    })
    expect([...result.current.keys]).toEqual([C4, E4])
    wait(SHORTEST_PRESS_MS)
    expect([...result.current.keys]).toEqual([E4])
  })

  it('keeps each press apart: letting one go leaves the others down', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => {
      result.current.press('left', C4)
      result.current.press('right', E4)
    })
    wait(SHORTEST_PRESS_MS)
    act(() => result.current.release('left'))
    expect([...result.current.keys]).toEqual([E4])
  })

  it('lets every press go at once', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => {
      result.current.press('left', C4)
      result.current.press('right', E4)
    })
    wait(SHORTEST_PRESS_MS)
    act(() => result.current.releaseAll())
    expect(result.current.keys.size).toBe(0)
  })

  it('ignores letting go of a press it does not hold', () => {
    const { result } = renderHook(() => usePresses<string>())
    act(() => result.current.press('left', C4))
    act(() => result.current.release('right'))
    expect([...result.current.keys]).toEqual([C4])
  })

  it('leaves nothing to fire once unmounted', () => {
    const { result, unmount } = renderHook(() => usePresses<string>())
    act(() => {
      result.current.press('finger', C4)
      result.current.release('finger')
    })
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
