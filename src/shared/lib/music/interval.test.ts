import { describe, expect, it } from 'vitest'
import { intervalBetween, spellAbove } from './interval'
import { note } from './note'

describe('spellAbove', () => {
  it.each([
    [note('E', -1), { steps: 5, semitones: 8 }, note('C', -1)],
    [note('G', 1), { steps: 6, semitones: 11 }, note('F', 2)],
    [note('C'), { steps: 6, semitones: 9 }, note('B', -2)],
    [note('C'), { steps: 1, semitones: 14 }, note('D')],
  ])('%j + %j → %j', (from, interval, expected) => {
    expect(spellAbove(from, interval)).toEqual(expected)
  })

  it('falls back to the plain spelling past a double accidental', () => {
    expect(spellAbove(note('C', -1), { steps: 6, semitones: 9 })).toEqual(note('A', -1))
  })
})

describe('intervalBetween', () => {
  it.each([
    [note('G'), note('D'), { steps: 4, semitones: 7 }],
    [note('G'), note('F', 1), { steps: 6, semitones: 11 }],
    [note('A'), note('C'), { steps: 2, semitones: 3 }],
    [note('C'), note('C'), { steps: 0, semitones: 0 }],
  ])('%j → %j is %j', (from, to, interval) => {
    expect(intervalBetween(from, to)).toEqual(interval)
  })
})
