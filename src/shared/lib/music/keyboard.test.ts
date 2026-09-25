import { describe, expect, it } from 'vitest'
import { isBlackKey, keyboardRange, MIDDLE_C } from './keyboard'
import { midi } from './pitch'

const ONE_OCTAVE = { from: midi(60), to: midi(71) }

describe('isBlackKey', () => {
  it('knows the black keys in any octave', () => {
    expect([60, 61, 62, 63, 64, 65, 66].map((key) => isBlackKey(midi(key)))).toEqual([
      false,
      true,
      false,
      true,
      false,
      false,
      true,
    ])
    expect(isBlackKey(midi(46))).toBe(true)
  })
})

describe('keyboardRange', () => {
  it('runs from the C below the lowest key to the B above the highest', () => {
    expect(keyboardRange([midi(62), midi(79)], ONE_OCTAVE)).toEqual({ from: 60, to: 83 })
  })

  it('never shrinks below the least range, so the keyboard does not jump', () => {
    expect(keyboardRange([midi(64), midi(67)], ONE_OCTAVE)).toEqual(ONE_OCTAVE)
    expect(keyboardRange([], ONE_OCTAVE)).toEqual(ONE_OCTAVE)
  })

  it('keeps a least range that does not end on a B while the keys fit inside it', () => {
    const least = { from: midi(60), to: midi(76) }
    expect(keyboardRange([midi(60), midi(64), midi(67)], least)).toEqual(least)
  })

  it('grows downwards for a low left hand', () => {
    expect(keyboardRange([midi(43), midi(67)], ONE_OCTAVE)).toEqual({ from: 36, to: 71 })
  })

  it('names middle C', () => {
    expect(MIDDLE_C).toBe(60)
  })
})
