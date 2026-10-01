import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'

import { useShownKeys } from './use-shown-keys'
import { NO_KEYS, unmarked } from '@/shared/ui'

describe('useShownKeys', () => {
  it('shows what was played last, until the context changes', () => {
    const played = unmarked([midi(60), midi(64)])
    const { result, rerender } = renderHook(({ context }) => useShownKeys(context, NO_KEYS), {
      initialProps: { context: 'C major' },
    })
    expect(result.current[0]).toBe(NO_KEYS)
    act(() => result.current[1](played))
    expect(result.current[0]).toBe(played)
    rerender({ context: 'D major' })
    expect(result.current[0]).toBe(NO_KEYS)
    rerender({ context: 'C major' })
    expect(result.current[0]).toBe(NO_KEYS)
  })
})
