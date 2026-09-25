import { describe, expect, it } from 'vitest'
import { midi, PITCH_CLASSES, pitchClass } from './pitch'

describe('pitchClass', () => {
  it('wraps any integer into one octave', () => {
    expect(pitchClass(-1)).toBe(11)
    expect(pitchClass(25)).toBe(1)
    expect(pitchClass(0)).toBe(0)
  })
})

describe('midi', () => {
  it('accepts a whole number 0–127', () => {
    expect(midi(60)).toBe(60)
    expect(midi(0)).toBe(0)
    expect(midi(127)).toBe(127)
  })

  it.each([128, -1, 60.5, Number.NaN])('refuses %s', (n) => {
    expect(() => midi(n)).toThrow(RangeError)
  })
})

describe('PITCH_CLASSES', () => {
  it('lists the 12 notes from C', () => {
    expect(PITCH_CLASSES).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  })
})
