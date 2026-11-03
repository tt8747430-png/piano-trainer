import { describe, expect, it } from 'vitest'

import { fingerPassage } from './passage-fingering'
import { midi } from './pitch'

const LETTER: Readonly<Record<string, number>> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/** Keys by name ("F#4"), middle C 60. */
const keys = (...names: string[]) =>
  names.map((name) => {
    const [, letter = 'C', sharp, octave = '4'] = /^([A-G])(#?)(\d)$/.exec(name) ?? []
    return midi(12 * (Number(octave) + 1) + (LETTER[letter] ?? 0) + (sharp ? 1 : 0))
  })

describe('fingerPassage (A30: Suggest fingering)', () => {
  it('fingers five notes in a row with the five fingers', () => {
    expect(fingerPassage(keys('C4', 'D4', 'E4', 'F4', 'G4'), 'rh')).toEqual([1, 2, 3, 4, 5])
    expect(fingerPassage(keys('C3', 'D3', 'E3', 'F3', 'G3'), 'lh')).toEqual([5, 4, 3, 2, 1])
  })

  it('passes the thumb under after the 3rd for a scale up an octave, as the books finger it', () => {
    expect(fingerPassage(keys('C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'), 'rh')).toEqual([
      1, 2, 3, 1, 2, 3, 4, 5,
    ])
  })

  it('crosses the 3rd over the thumb coming down', () => {
    expect(fingerPassage(keys('C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'), 'rh')).toEqual([
      5, 4, 3, 2, 1, 3, 2, 1,
    ])
  })

  it('keeps the thumb off a black key where another finger can take it', () => {
    const notes = keys('D4', 'E4', 'F#4', 'G4', 'A4')
    const fingers = fingerPassage(notes, 'rh')
    expect(fingers[2]).not.toBe(1)
    expect(fingers).toHaveLength(5)
  })

  it('takes a repeated key with the same finger, and a lone note with the thumb’s neighbour free', () => {
    expect(fingerPassage(keys('E4', 'E4', 'E4'), 'rh')).toEqual([3, 3, 3])
    expect(fingerPassage([], 'rh')).toEqual([])
  })
})
