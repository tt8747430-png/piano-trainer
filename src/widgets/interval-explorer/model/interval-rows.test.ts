import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { INTERVAL_ROWS, rowRange } from './interval-rows'

describe('the Intervals page’s rows', () => {
  it('lists the octave’s intervals a row each, the augmented 4th and the diminished 5th apart', () => {
    expect(INTERVAL_ROWS.simple).toEqual([
      ...['r', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'd5', 'P5'],
      ...['m6', 'M6', 'm7', 'M7', 'P8'],
    ])
  })

  it('lists past the octave the degrees a chord symbol writes', () => {
    expect(INTERVAL_ROWS.compound).toEqual(['m9', 'M9', 'A9', 'P11', 'A11', 'm13', 'M13'])
  })

  it('draws as many keys for every row of a group, from the C or F under the root', () => {
    expect(rowRange(midi(62), 'simple')).toEqual({ from: 60, to: 79 })
    expect(rowRange(midi(71), 'simple')).toEqual({ from: 65, to: 84 })
    expect(rowRange(midi(60), 'compound')).toEqual({ from: 60, to: 87 })
  })

  it('holds the widest interval of a group from any root', () => {
    for (let low = 60; low < 72; low += 1) {
      expect(rowRange(midi(low), 'simple').to).toBeGreaterThanOrEqual(low + 12)
      expect(rowRange(midi(low), 'compound').to).toBeGreaterThanOrEqual(low + 21)
    }
  })
})
