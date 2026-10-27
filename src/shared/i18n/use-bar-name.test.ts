// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { i18n } from './index'
import { useBarName } from './use-bar-name'

describe('useBarName', () => {
  it('names a bar by its number, then what it holds where it holds anything (ADR 0114)', () => {
    const { result } = renderHook(() => useBarName())
    expect(result.current(3, 'G D7')).toBe('Bar 3: G D7')
    expect(result.current(4, '')).toBe('Bar 4')
    act(() => void i18n.changeLanguage('ru'))
    expect(result.current(4, '')).toBe('Такт 4')
  })
})
