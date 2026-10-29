import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useOnline } from './use-online'

describe('useOnline', () => {
  afterEach(() => vi.restoreAllMocks())

  it('says whether the device has a connection, and follows it as it comes and goes', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnline())
    expect(result.current).toBe(true)
    online.mockReturnValue(false)
    act(() => void window.dispatchEvent(new Event('offline')))
    expect(result.current).toBe(false)
    online.mockReturnValue(true)
    act(() => void window.dispatchEvent(new Event('online')))
    expect(result.current).toBe(true)
  })
})
