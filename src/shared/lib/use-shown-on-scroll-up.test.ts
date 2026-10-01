import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useShownOnScrollUp } from './use-shown-on-scroll-up'

const scrollTo = (y: number) => {
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(y)
  act(() => void window.dispatchEvent(new Event('scroll')))
}

describe('useShownOnScrollUp', () => {
  it('shows at the top, hides scrolling down, and shows again scrolling up', () => {
    const { result } = renderHook(() => useShownOnScrollUp())
    expect(result.current).toBe(true)
    scrollTo(120)
    expect(result.current).toBe(false)
    scrollTo(100)
    expect(result.current).toBe(true)
    scrollTo(0)
    expect(result.current).toBe(true)
  })

  it('takes a finger’s jitter for no direction', () => {
    const { result } = renderHook(() => useShownOnScrollUp())
    scrollTo(120)
    scrollTo(116)
    expect(result.current).toBe(false)
    scrollTo(124)
    scrollTo(120)
    expect(result.current).toBe(false)
  })
})
