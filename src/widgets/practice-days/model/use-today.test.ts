// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useToday } from './use-today'

afterEach(() => vi.useRealTimers())

describe('useToday', () => {
  it('moves on to the next day at midnight', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 11, 23, 59))
    const { result } = renderHook(() => useToday())
    expect(result.current).toBe('2026-10-11')
    act(() => vi.advanceTimersByTime(2 * 60 * 1000))
    expect(result.current).toBe('2026-10-12')
  })

  it('looks again when the app comes back into view', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 11, 9))
    const { result } = renderHook(() => useToday())
    vi.setSystemTime(new Date(2026, 9, 13, 9))
    act(() => void document.dispatchEvent(new Event('visibilitychange')))
    expect(result.current).toBe('2026-10-13')
  })
})
