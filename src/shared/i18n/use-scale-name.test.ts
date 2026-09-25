import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { i18n } from './index'
import { useScaleName } from './use-scale-name'

describe('useScaleName', () => {
  it('names a scale by its root and kind, in the learner’s language', () => {
    const { result } = renderHook(() => useScaleName())
    expect(result.current(note('E', -1), 'harmonic')).toBe('E♭ harmonic minor')
    act(() => void i18n.changeLanguage('ru'))
    expect(result.current(note('E', -1), 'harmonic')).toMatch(/^E♭ /)
    expect(result.current(note('E', -1), 'harmonic')).not.toBe('E♭ harmonic minor')
  })
})
