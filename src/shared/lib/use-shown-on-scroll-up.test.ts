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

  it('stays until the page has scrolled past it', () => {
    const { result } = renderHook(() => useShownOnScrollUp(88))
    scrollTo(60)
    expect(result.current).toBe(true)
    scrollTo(88)
    expect(result.current).toBe(true)
    scrollTo(120)
    expect(result.current).toBe(false)
    scrollTo(100)
    expect(result.current).toBe(true)
    scrollTo(40)
    scrollTo(60)
    expect(result.current).toBe(true)
  })

  it('takes an overshoot at the page’s end for no direction', () => {
    // A page 2000px long in a window 768px tall ends at 1232.
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000)
    const { result } = renderHook(() => useShownOnScrollUp())
    scrollTo(1232)
    expect(result.current).toBe(false)
    scrollTo(1290)
    scrollTo(1232)
    expect(result.current).toBe(false)
    scrollTo(1200)
    expect(result.current).toBe(true)
  })

  it('takes an overshoot at the page’s top for no direction', () => {
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000)
    const { result } = renderHook(() => useShownOnScrollUp())
    scrollTo(-40)
    expect(result.current).toBe(true)
    scrollTo(0)
    expect(result.current).toBe(true)
  })
})
