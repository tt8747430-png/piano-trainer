// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REST_MS, useRestingSave } from './use-resting-save'

describe('useRestingSave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the last value once the editor rests, and not before', () => {
    const write = vi.fn()
    const { result } = renderHook(() => useRestingSave<string>(write))
    act(() => {
      result.current.save('a')
      result.current.save('ab')
    })
    vi.advanceTimersByTime(REST_MS - 1)
    expect(write).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(write).toHaveBeenCalledExactlyOnceWith('ab')
  })

  it('keeps what waits at once on flush, and on the way out', () => {
    const write = vi.fn()
    const { result, unmount } = renderHook(() => useRestingSave<string>(write))
    act(() => result.current.save('done'))
    act(() => result.current.flush())
    expect(write).toHaveBeenCalledExactlyOnceWith('done')
    act(() => result.current.save('left'))
    unmount()
    expect(write).toHaveBeenLastCalledWith('left')
    vi.advanceTimersByTime(REST_MS)
    expect(write).toHaveBeenCalledTimes(2)
  })
})
