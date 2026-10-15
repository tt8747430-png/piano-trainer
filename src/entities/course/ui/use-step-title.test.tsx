import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from '@/shared/i18n'
import { useStepTitle } from './use-step-title'

describe('useStepTitle', () => {
  it('names a chord step by its family, a scale step by its kind', () => {
    const { result } = renderHook(() => useStepTitle())
    expect(result.current({ kind: 'chords', family: 'sev' })).toEqual({
      primary: '7th chords',
      kind: 'chords',
    })
    expect(result.current({ kind: 'scale', scale: 'harmonic' })).toEqual({
      primary: 'Harmonic minor',
      kind: 'scale',
    })
  })

  it('names a piece by its titles and its kind', () => {
    const { result } = renderHook(() => useStepTitle())
    expect(result.current({ kind: 'piece', pieceId: 'bz5' })).toEqual({
      primary: 'Still, my soul, be still',
      secondary: 'Мир, душа, храни',
      kind: 'song',
    })
    act(() => void i18n.changeLanguage('ru'))
    expect(result.current({ kind: 'piece', pieceId: 'bz5' })).toEqual({
      primary: 'Мир, душа, храни',
      kind: 'song',
    })
  })
})
