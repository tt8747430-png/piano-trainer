import { describe, expect, it } from 'vitest'
import { isOneOf } from './is-one-of'

const THEMES = ['system', 'light', 'dark'] as const
const isTheme = isOneOf(THEMES)

describe('isOneOf', () => {
  it('knows the list’s values', () => {
    expect(THEMES.every(isTheme)).toBe(true)
  })

  it.each(['sepia', '', null, 1, ['dark']])('refuses %j', (value) => {
    expect(isTheme(value)).toBe(false)
  })
})
