import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseNumerals } from '@/shared/lib/music'
import { progressionRow, rowMoves, symbolsRow } from './chord-row'

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

  it('says what each chord does in its key', () => {
    const row = progressionRow(
      parseNumerals('i iv V VI') ?? [],
      { tonic: note('A'), minor: true },
      'triads',
    )
    expect(row.map((chord) => chord.function)).toEqual([
      'tonic',
      'subdominant',
      'dominant',
      'tonic',
    ])
  })
})

describe('rowMoves', () => {
  it('says how each root moved from the one before', () => {
    expect(rowMoves(symbolsRow(['C', 'F', 'Bdim', 'Em', 'Em7', 'G']))).toEqual([
      null,
      { by: 'fifth', down: true },
      { by: 'fifth', down: true },
      { by: 'fifth', down: true },
      null,
      { by: 'third', down: false },
    ])
  })
})
