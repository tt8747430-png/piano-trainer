import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { KeySize } from '@/shared/lib'
import { stubBox } from '@/shared/test/layout'
import { useSizeCaption } from './use-size-caption'

/** A scroller 100px wide holding keys 20px wide from C3 (48), the first `inSight` within it. */
function scrollerWithKeys(inSight: number, total = 12) {
  const scroller = document.createElement('div')
  stubBox(scroller, { width: 100, height: 50 })
  for (let at = 0; at < total; at += 1) {
    const key = document.createElement('button')
    key.dataset.midi = String(48 + at)
    stubBox(key, { left: at < inSight ? at * 20 : 200 + at * 20, width: 20, height: 50 })
    scroller.append(key)
  }
  return { current: scroller }
}

describe('useSizeCaption', () => {
  it('says for a moment, after the key size changes, how many keys are in sight and which', () => {
    vi.useFakeTimers()
    const scroller = scrollerWithKeys(5)
    const { result, rerender } = renderHook(({ size }) => useSizeCaption(scroller, size), {
      initialProps: { size: 'fit' as KeySize },
    })
    expect(result.current).toBeUndefined()
    rerender({ size: 'large' })
    act(() => vi.advanceTimersByTime(400))
    expect(result.current).toEqual({
      label: 'Keys in sight',
      text: 'Showing 5 keys (C3–E3)',
    })
    act(() => vi.advanceTimersByTime(2500))
    expect(result.current).toBeUndefined()
    vi.useRealTimers()
  })

  it('says nothing where nothing is laid out', () => {
    vi.useFakeTimers()
    const scroller = scrollerWithKeys(0)
    const { result, rerender } = renderHook(({ size }) => useSizeCaption(scroller, size), {
      initialProps: { size: 'fit' as KeySize },
    })
    rerender({ size: 'piano' })
    act(() => vi.advanceTimersByTime(400))
    expect(result.current).toBeUndefined()
    vi.useRealTimers()
  })
})
