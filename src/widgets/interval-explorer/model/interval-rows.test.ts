import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { EVERY_INTERVAL_GAP, everyInterval, INTERVAL_ROWS, rowRange } from './interval-rows'

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

  it('draws as many keys for every row, from the C or F under the root, one size for all (A22)', () => {
    expect(rowRange(midi(62))).toEqual({ from: 60, to: 87 })
    expect(rowRange(midi(71))).toEqual({ from: 65, to: 92 })
  })

  it('holds the widest interval from any root', () => {
    for (let low = 60; low < 72; low += 1) {
      expect(rowRange(midi(low)).to).toBeGreaterThanOrEqual(low + 21)
    }
  })

  it('plays every interval in turn for Play all, each the way chosen', () => {
    const sounds = everyInterval(note('C'), 'together')
    const rows = INTERVAL_ROWS.simple.length + INTERVAL_ROWS.compound.length
    expect(sounds).toHaveLength(rows * 2)
    expect(sounds.slice(2, 4).map((sound) => [sound.midi, sound.at])).toEqual([
      [60, EVERY_INTERVAL_GAP],
      [61, EVERY_INTERVAL_GAP],
    ])
  })
})
