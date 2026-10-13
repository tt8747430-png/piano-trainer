import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseNumerals } from '@/shared/lib/music'
import { progressionRow } from './chord-row'

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
