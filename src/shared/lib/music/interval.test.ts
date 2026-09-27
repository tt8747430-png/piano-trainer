import { describe, expect, it } from 'vitest'
import { degreeLabel, INTERVALS, intervalBetween, spellAbove } from './interval'
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

describe('degreeLabel', () => {
  it.each([
    [0, 0, '1'],
    [1, 1, '♭2'],
    [1, 3, '#2'],
    [2, 3, '♭3'],
    [2, 4, '3'],
    [3, 6, '#4'],
    [4, 6, '♭5'],
    [6, 9, '𝄫7'],
    [1, 13, '♭9'],
    [8, 14, '9'],
    [3, 16, '♭11'],
    [10, 18, '#11'],
    [5, 20, '♭13'],
    [12, 21, '13'],
  ])('writes %i letter steps and %i semitones as %s', (steps, semitones, label) => {
    expect(degreeLabel(steps, semitones)).toBe(label)
  })

  it('refuses a letter three semitones off its interval', () => {
    expect(() => degreeLabel(2, 7)).toThrow(RangeError)
  })

  it('labels the named intervals by the same rule', () => {
    expect(INTERVALS.m2.degree).toBe('♭2')
    expect(INTERVALS.A2.degree).toBe('#2')
    expect(INTERVALS.d7.degree).toBe('𝄫7')
    expect(INTERVALS.A11.degree).toBe('#11')
  })
})
