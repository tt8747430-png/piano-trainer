// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFieldText } from './use-field-text'

const field = (initialProps: { shown: string; at: string }) =>
  renderHook(({ shown, at }) => useFieldText(shown, at), { initialProps })

describe('what a field over the sheet holds (ADR 0096)', () => {
  it('holds what is written at its place, the typing kept until it goes on, then what is written there', () => {
    const { result, rerender } = field({ shown: 'G', at: '0' })
    expect(result.current.text).toBe('G')
    act(() => result.current.setText('am'))
    expect(result.current.text).toBe('am')
    rerender({ shown: 'C', at: '96' })
    expect(result.current.text).toBe('C')
    // Back where it was, what is written there now, never what was typed.
    rerender({ shown: 'Am', at: '0' })
    expect(result.current.text).toBe('Am')
  })

  it('marks what cannot be written at its place until it is typed again or the field goes on', () => {
    const { result, rerender } = field({ shown: '', at: '0' })
    act(() => result.current.setText('Hm'))
    expect(result.current.wrong).toBe(false)
    act(() => result.current.markWrong())
    expect(result.current).toMatchObject({ text: 'Hm', wrong: true })
    act(() => result.current.setText('H'))
    expect(result.current.wrong).toBe(false)
    act(() => result.current.markWrong())
    rerender({ shown: 'C', at: '96' })
    expect(result.current).toMatchObject({ text: 'C', wrong: false })
  })
})
