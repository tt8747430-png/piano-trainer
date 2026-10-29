import { describe, expect, it } from 'vitest'
import { plainText } from './plain-text'

describe('plainText', () => {
  it('drops the NUL bytes and control characters a file may carry, and the spaces round it', () => {
    expect(plainText('\u0000 Minuet\u0007\u0000 ')).toBe('Minuet')
    expect(plainText('Für Elise · Ода')).toBe('Für Elise · Ода')
  })
})
