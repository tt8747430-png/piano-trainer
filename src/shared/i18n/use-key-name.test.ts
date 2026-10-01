import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { i18n } from './index'
import { useKeyName } from './use-key-name'

describe('useKeyName', () => {
  it('names a key by its tonic and mode, in the learner’s language', () => {
    const { result } = renderHook(() => useKeyName())
    expect(result.current({ tonic: note('F', 1), minor: true })).toBe('F# minor')
    expect(result.current({ tonic: note('B', -1), minor: false })).toBe('B♭ major')
    act(() => void i18n.changeLanguage('ru'))
    expect(result.current({ tonic: note('F', 1), minor: true })).toMatch(/^F# /)
    expect(result.current({ tonic: note('F', 1), minor: true })).not.toBe('F# minor')
  })
})
