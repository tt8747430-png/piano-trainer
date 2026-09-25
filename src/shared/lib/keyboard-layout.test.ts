import { describe, expect, it } from 'vitest'
import { keyboardLayout } from './keyboard-layout'
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
