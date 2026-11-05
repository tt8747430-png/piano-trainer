import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useLatestCallback } from './use-latest-callback'

describe('useLatestCallback', () => {
  it('keeps one handler across renders that calls the latest callback', () => {
    const { result, rerender } = renderHook(
      ({ add }) => useLatestCallback((n: number) => n + add),
      {
        initialProps: { add: 1 },
      },
    )
    const first = result.current
    expect(first(1)).toBe(2)
    rerender({ add: 10 })
    expect(result.current).toBe(first)
    expect(first(1)).toBe(11)
  })
})
