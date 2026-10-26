import { describe, expect, it } from 'vitest'
import { keyAt, keyboardLayout, PIANO_LAYOUT, spanOf } from './keyboard-layout'
import { midi } from './music'

describe('keyboardLayout', () => {
  it('lays one octave out as 7 white keys with 5 shorter black keys between them', () => {
    const { keys, whites } = keyboardLayout({ from: midi(60), to: midi(71) })
    expect(whites).toBe(7)
    expect(keys.filter((key) => key.black).map((key) => key.midi)).toEqual([61, 63, 66, 68, 70])
    const c = keys.find((key) => key.midi === 60)
    const cSharp = keys.find((key) => key.midi === 61)
    expect(c).toMatchObject({ left: 0, width: 100 / 7, height: 100, black: false })
    expect(cSharp?.left).toBeCloseTo(100 / 7 - (100 / 7) * 0.31)
    expect(cSharp?.width).toBeCloseTo((100 / 7) * 0.62)
    expect(cSharp?.height).toBe(62)
  })

  it('widens a range that starts or ends on a black key to the white keys beside it', () => {
    const { keys } = keyboardLayout({ from: midi(61), to: midi(70) })
    expect(keys[0]?.midi).toBe(60)
    expect(keys.at(-1)?.midi).toBe(71)
  })
})

describe('spanOf', () => {
  const twoOctaves = keyboardLayout({ from: midi(48), to: midi(71) }).keys

  it('places a range on a laid-out keyboard in percent, with its white keys counted', () => {
    expect(spanOf(twoOctaves, { from: midi(60), to: midi(71) })).toEqual({
      left: 50,
      right: 100,
      whites: 7,
    })
  })

  it('reaches from a black key’s own edge', () => {
    const span = spanOf(twoOctaves, { from: midi(61), to: midi(64) })
    expect(span.left).toBeCloseTo(50 + (100 / 14) * 0.69)
    expect(span.whites).toBe(2)
  })
})

describe('PIANO_LAYOUT and keyAt', () => {
  /** The middle of the whole piano's white key `index`, as a fraction of its width: C4 is white key 23. */
  const whiteMiddle = (index: number) => (index + 0.5) / 52

  it('lays the whole piano out once', () => {
    expect(PIANO_LAYOUT.keys).toHaveLength(88)
    expect(PIANO_LAYOUT.whites).toBe(52)
  })

  it('finds the key under a point: a black key over a white one, a white key below it, nothing outside', () => {
    expect(keyAt(PIANO_LAYOUT.keys, whiteMiddle(23), 0.9)).toBe(60)
    expect(keyAt(PIANO_LAYOUT.keys, 24 / 52, 0.3)).toBe(61)
    expect(keyAt(PIANO_LAYOUT.keys, 24.1 / 52, 0.9)).toBe(62)
    for (const [x, y] of [
      [-0.01, 0.5],
      [1, 0.5],
      [0.5, 1],
      [Number.NaN, 0.5],
    ] as const)
      expect(keyAt(PIANO_LAYOUT.keys, x, y)).toBeNull()
  })
})
