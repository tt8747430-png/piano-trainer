// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useLayerPadding } from './safe-area'

/** A screen with these insets: the browser's `env(safe-area-inset-*)`, which jsdom cannot resolve. */
function screenWithInsets(padding: string) {
  const sized = document.createElement('div')
  sized.style.padding = padding
  document.body.append(sized)
  const computed = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation(() => computed(sized))
  return {
    turn: (next: string) => {
      sized.style.padding = next
      act(() => void window.dispatchEvent(new Event('resize')))
    },
  }
}

/** A resize, so the insets read by an earlier test are read again. */
const resize = () => window.dispatchEvent(new Event('resize'))

afterEach(() => {
  vi.restoreAllMocks()
  document.body.replaceChildren()
  resize()
})

describe('useLayerPadding', () => {
  it('keeps Base UI’s 5px from a screen with no safe area', () => {
    const { result } = renderHook(() => useLayerPadding())
    expect(result.current).toEqual({ top: 5, right: 5, bottom: 5, left: 5 })
  })

  it('keeps clear of the status bar and the home indicator on an installed iPhone', () => {
    screenWithInsets('59px 0px 34px 0px')
    resize()
    const { result } = renderHook(() => useLayerPadding())
    expect(result.current).toEqual({ top: 64, right: 5, bottom: 39, left: 5 })
  })

  it('follows the phone as it turns on its side: the notch at a side, the home indicator lower', () => {
    const screen = screenWithInsets('59px 0px 34px 0px')
    resize()
    const { result } = renderHook(() => useLayerPadding())
    screen.turn('0px 59px 21px 59px')
    expect(result.current).toEqual({ top: 5, right: 64, bottom: 26, left: 64 })
  })

  it('reads the insets once while the screen keeps its size', () => {
    screenWithInsets('59px 0px 34px 0px')
    resize()
    const first = renderHook(() => useLayerPadding())
    const second = renderHook(() => useLayerPadding())
    expect(window.getComputedStyle).toHaveBeenCalledTimes(1)
    expect(second.result.current).toEqual(first.result.current)
  })

  it('stops listening once unmounted', () => {
    const removed = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useLayerPadding())
    unmount()
    expect(removed).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
