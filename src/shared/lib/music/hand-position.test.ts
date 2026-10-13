import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from './chord-symbol'
import { handPosition } from './hand-position'

describe('handPosition', () => {
  const chord = (symbol: string) => parseChordSymbol(symbol)

  it('names the inversion the hand’s lowest note makes', () => {
    expect(handPosition(chord('C'), [60, 64, 67])).toEqual({ inversion: 0 })
    expect(handPosition(chord('C'), [64, 67, 72])).toEqual({ inversion: 1 })
    expect(handPosition(chord('G7'), [65, 67, 71, 74])).toEqual({ inversion: 3 })
  })

  it('names the tension a rootless hand starts on', () => {
    expect(handPosition(chord('Dm9'), [64, 65, 69, 72])).toEqual({ from: '9th' })
    expect(handPosition(chord('G9'), [62, 65, 69, 71])).toEqual({ from: '5th' })
  })

  it('names nothing for an empty hand', () => {
    expect(handPosition(chord('C'), [])).toBeNull()
  })

  it('counts a held root’s chord in its own order: a sus4 from its 4th, a 6 chord from its 6th', () => {
    expect(handPosition(chord('Gsus4'), [60, 62, 67])).toEqual({ inversion: 1 })
    expect(handPosition(chord('C6'), [57, 60, 64, 67])).toEqual({ inversion: 3 })
  })
})
