import { describe, expect, it } from 'vitest'
import { note, parseNumerals } from '@/shared/lib/music'
import { readProgression } from './progression'

const C_MAJOR = { tonic: note('C'), minor: false }

describe('readProgression', () => {
  it('reads a lesson’s numerals in its key, at the size it names', () => {
    expect(readProgression({ numerals: 'ii V I', key: C_MAJOR, size: 'sevenths' })).toEqual({
      numerals: parseNumerals('ii V I'),
      key: C_MAJOR,
      size: 'sevenths',
    })
  })

  it('plays triads when a lesson names no size', () => {
    expect(readProgression({ numerals: 'I IV V I', key: C_MAJOR }).size).toBe('triads')
  })

  it('refuses numerals it cannot read', () => {
    expect(() => readProgression({ numerals: 'I V x', key: C_MAJOR })).toThrow(/I V x/)
  })
})
