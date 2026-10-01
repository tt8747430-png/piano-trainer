import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { stubMatchMedia } from '@/shared/test/match-media'
import { useScrollMotion } from './use-scroll-motion'

// The stub answers every query alike: here, whether the learner asks for reduced motion.
describe('useScrollMotion', () => {
  it('scrolls smoothly', () => {
    stubMatchMedia({ dark: false })
    expect(renderHook(() => useScrollMotion()).result.current).toBe('smooth')
  })

  it('scrolls at once where the learner reduces motion', () => {
    stubMatchMedia({ dark: true })
    expect(renderHook(() => useScrollMotion()).result.current).toBe('instant')
  })
})
