import { describe, expect, it } from 'vitest'
import { formatDecimal, formatPercent } from './format-number'

describe('formatDecimal', () => {
  it('writes one decimal place in each language', () => {
    expect(formatDecimal('en', 2.5)).toBe('2.5')
    expect(formatDecimal('ru', 2.5)).toBe('2,5')
    expect(formatDecimal('en', 3)).toBe('3.0')
    expect(formatDecimal('en', 1.26)).toBe('1.3')
  })
})

describe('formatPercent', () => {
  it('writes a whole percent as each language does', () => {
    expect(formatPercent('en', 50)).toBe('50%')
    expect(formatPercent('ru', 50)).toBe('50 %')
    expect(formatPercent('en', 100)).toBe('100%')
  })
})
