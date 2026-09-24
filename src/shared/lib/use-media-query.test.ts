import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stubMatchMedia } from '@/shared/test/match-media'
import { useMediaQuery } from './use-media-query'

const DARK_SCHEME = '(prefers-color-scheme: dark)'

describe('useMediaQuery', () => {
  it('answers whether the query matches now', () => {
    stubMatchMedia({ dark: true })
    const { result } = renderHook(() => useMediaQuery(DARK_SCHEME))
    expect(result.current).toBe(true)
  })

  it('follows the query as it changes', () => {
    const media = stubMatchMedia({ dark: false })
    const { result } = renderHook(() => useMediaQuery(DARK_SCHEME))
    act(() => media.setDark(true))
    expect(result.current).toBe(true)
    act(() => media.setDark(false))
    expect(result.current).toBe(false)
  })

  it('stops listening once unmounted', () => {
    const media = stubMatchMedia({ dark: false })
    const { unmount } = renderHook(() => useMediaQuery(DARK_SCHEME))
    unmount()
    expect(media.listenerCount()).toBe(0)
  })
})
