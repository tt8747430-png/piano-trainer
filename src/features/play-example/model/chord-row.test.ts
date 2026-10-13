import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseChordSymbol, parseNumerals } from '@/shared/lib/music'
import { handPosition, progressionRow } from './chord-row'

describe('progressionRow', () => {
  it('writes a progression’s chords in a key and size, each captioned by its numeral', () => {
    const row = progressionRow(
      parseNumerals('ii-V-I') ?? [],
      { tonic: note('C'), minor: false },
      'sevenths',
    )
    expect(row.map(({ chord }) => chordSymbol(chord))).toEqual(['Dm7', 'G7', 'CMaj7'])
    expect(row.map(({ caption }) => caption)).toEqual(['ii', 'V', 'I'])
  })
})

describe('handPosition', () => {
  const chord = (symbol: string) => parseChordSymbol(symbol)

  it('names the inversion the hand’s lowest note makes', () => {
    expect(handPosition(chord('C'), [48, 60, 64, 67])).toEqual({ inversion: 0 })
    expect(handPosition(chord('C'), [48, 64, 67, 72])).toEqual({ inversion: 1 })
    expect(handPosition(chord('G7'), [43, 65, 67, 71, 74])).toEqual({ inversion: 3 })
  })

  it('names the tension a rootless hand starts on', () => {
    expect(handPosition(chord('Dm9'), [50, 64, 65, 69, 72])).toEqual({ from: '9th' })
    expect(handPosition(chord('G9'), [43, 62, 65, 69, 71])).toEqual({ from: '5th' })
  })

  it('names nothing for a bass alone', () => {
    expect(handPosition(chord('C'), [48])).toBeNull()
  })
})
