// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useWakeLock } from './use-wake-lock'

function stubWakeLock() {
  const sentinels: { released: boolean; release: () => Promise<void> }[] = []
  const request = vi.fn(async () => {
    const sentinel = {
      released: false,
      release: vi.fn(async () => void (sentinel.released = true)),
    }
    sentinels.push(sentinel)
    return sentinel
  })
  Object.defineProperty(navigator, 'wakeLock', { value: { request }, configurable: true })
  return { request, sentinels }
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'wakeLock')
})

describe('useWakeLock', () => {
  it('keeps the screen on while it is held, and lets it go after', async () => {
    const { request, sentinels } = stubWakeLock()
    const { unmount } = renderHook(() => useWakeLock())
    await waitFor(() => expect(request).toHaveBeenCalledWith('screen'))
    unmount()
    await waitFor(() => expect(sentinels[0]?.released).toBe(true))
  })

  it('asks again as the page shows after the browser let it go', async () => {
    const { request, sentinels } = stubWakeLock()
    renderHook(() => useWakeLock())
    await waitFor(() => expect(request).toHaveBeenCalledOnce())
    const first = sentinels[0]
    if (first) first.released = true
    document.dispatchEvent(new Event('visibilitychange'))
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2))
  })

  it('asks for nothing while it is not active, or where there is no Wake Lock', () => {
    const { request } = stubWakeLock()
    renderHook(() => useWakeLock(false))
    expect(request).not.toHaveBeenCalled()
    Reflect.deleteProperty(navigator, 'wakeLock')
    expect(() => renderHook(() => useWakeLock())).not.toThrow()
  })

  it('asks no second time while the first is still being granted', async () => {
    const { request, sentinels } = stubWakeLock()
    const { unmount } = renderHook(() => useWakeLock())
    document.dispatchEvent(new Event('visibilitychange'))
    await waitFor(() => expect(sentinels).toHaveLength(1))
    expect(request).toHaveBeenCalledOnce()
    unmount()
    await waitFor(() => expect(sentinels[0]?.released).toBe(true))
  })
})
