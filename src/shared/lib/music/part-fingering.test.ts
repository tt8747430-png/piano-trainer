import { describe, expect, it } from 'vitest'

import type { Finger } from './fingering'
import { fingerPart, type PartNote } from './part-fingering'
import { midi } from './pitch'

const LETTER: Readonly<Record<string, number>> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

/** A key by name ("F#4"), middle C 60. */
const key = (name: string) => {
  const [, letter = 'C', sharp, octave = '4'] = /^([A-G])(#?)(\d)$/.exec(name) ?? []
  return midi(12 * (Number(octave) + 1) + (LETTER[letter] ?? 0) + (sharp ? 1 : 0))
}

/** A line of notes a beat each, one after another. */
const line = (...names: string[]): PartNote[] =>
  names.map((name, i) => ({ key: key(name), start: i, end: i + 1 }))

/** Notes struck together at `start`, held for `length`. */
const together = (start: number, length: number, ...names: string[]): PartNote[] =>
  names.map((name) => ({ key: key(name), start, end: start + length }))

describe('fingerPart (R36, the hands at the keys; A30, Suggest fingering)', () => {
  it('fingers five notes in a row with the five fingers', () => {
    expect(fingerPart(line('C4', 'D4', 'E4', 'F4', 'G4'), 'rh')).toEqual([1, 2, 3, 4, 5])
    expect(fingerPart(line('C3', 'D3', 'E3', 'F3', 'G3'), 'lh')).toEqual([5, 4, 3, 2, 1])
  })

  it('passes the thumb under after the 3rd for a scale up an octave, as the books finger it', () => {
    expect(fingerPart(line('C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'), 'rh')).toEqual([
      1, 2, 3, 1, 2, 3, 4, 5,
    ])
  })

  it('crosses the 3rd over the thumb coming down', () => {
    expect(fingerPart(line('C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'), 'rh')).toEqual([
      5, 4, 3, 2, 1, 3, 2, 1,
    ])
  })

  it('keeps the thumb off a black key where another finger can take it', () => {
    const fingers = fingerPart(line('D4', 'E4', 'F#4', 'G4', 'A4'), 'rh')
    expect(fingers[2]).not.toBe(1)
    expect(fingers).toHaveLength(5)
  })

  it('takes a repeated key with the same finger, and fingers nothing when nothing plays', () => {
    expect(fingerPart(line('E4', 'E4', 'E4'), 'rh')).toEqual([3, 3, 3])
    expect(fingerPart([], 'rh')).toEqual([])
  })

  it('fingers a chord as the books do, in the order the notes are given', () => {
    const triad = together(0, 4, 'G4', 'C4', 'E4')
    expect(fingerPart(triad, 'rh')).toEqual([5, 1, 3])
    expect(fingerPart(together(0, 4, 'C3', 'E3', 'G3'), 'lh')).toEqual([5, 3, 1])
  })

  it('keeps the fingers the music writes, and fingers the rest around them', () => {
    const written: PartNote[] = line('C4', 'D4', 'E4').map((note, i) =>
      i === 0 ? { ...note, finger: 2 satisfies Finger } : note,
    )
    expect(fingerPart(written, 'rh')).toEqual([2, 3, 4])
  })

  it('spans two keys together with the fingers that reach them at ease', () => {
    const [low, high] = fingerPart(together(0, 1, 'C4', 'C5'), 'rh')
    expect([low, high]).toEqual([1, 5])
    const third = fingerPart(together(0, 1, 'E4', 'G4'), 'rh')
    const [lower = 0, upper = 0] = third
    expect(upper - lower).toBeGreaterThanOrEqual(1)
  })

  it('never takes a key with a finger still holding another', () => {
    // The 5th holds the C under a line in the same hand.
    const notes = [
      ...together(0, 4, 'C4'),
      { key: key('G4'), start: 0, end: 1 },
      { key: key('A4'), start: 1, end: 2 },
      { key: key('B4'), start: 2, end: 3 },
    ]
    const fingers = fingerPart(notes, 'rh')
    const held = fingers[0]
    expect(fingers.slice(1)).not.toContain(held)
  })
})
