import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, chordRootSpelling, qualitySpellings } from './chord'
import { ChordSymbolError, parseChordSymbol } from './chord-symbol'
import { note, noteName } from './note'
import { pitchClass } from './pitch'

describe('parseChordSymbol', () => {
  it.each(CHORD_QUALITIES)('reads every spelling of %s on all 12 roots', (quality) => {
    for (let pc = 0; pc < 12; pc++) {
      const root = chordRootSpelling(pitchClass(pc), quality)
      for (const spelling of qualitySpellings(quality)) {
        expect(parseChordSymbol(noteName(root) + spelling)).toEqual({ root, quality })
      }
    }
  })

  it.each([
    ['Bbm7b5', note('B', -1), 'hd'],
    ['Ebmaj7', note('E', -1), 'maj7'],
    ['C7b9', note('C'), 'b9'],
    ['Gsus', note('G'), 'sus4'],
    ['Cdim7', note('C'), 'o7'],
    ['Cdim', note('C'), 'dim'],
    ['C°', note('C'), 'dim'],
    ['F♯m7', note('F', 1), 'm7'],
    ['Dm7(-5)', note('D'), 'hd'],
  ])('reads the ASCII form %s', (symbol, root, quality) => {
    expect(parseChordSymbol(symbol)).toEqual({ root, quality })
  })

  it.each([
    ['D/F#', { root: note('D'), quality: 'maj', bass: note('F', 1) }],
    ['F#m/D#', { root: note('F', 1), quality: 'min', bass: note('D', 1) }],
    ['D#/G', { root: note('D', 1), quality: 'maj', bass: note('F', 2) }],
    ['C6/9', { root: note('C'), quality: 's69' }],
    ['C6/9/E', { root: note('C'), quality: 's69', bass: note('E') }],
    ['Am7/G', { root: note('A'), quality: 'm7', bass: note('G') }],
  ])('reads the slash chord %s', (symbol, chord) => {
    expect(parseChordSymbol(symbol)).toEqual(chord)
  })

  it.each(['H7', 'Cmaj13', '', 'C/X', '7'])('names the symbol it cannot read: %j', (symbol) => {
    let caught: unknown
    try {
      parseChordSymbol(symbol)
    } catch (error) {
      caught = error
    }
    expect(caught).toBeInstanceOf(ChordSymbolError)
    expect((caught as ChordSymbolError).symbol).toBe(symbol)
    expect((caught as ChordSymbolError).message).toBe(`Unknown chord symbol "${symbol}"`)
  })
})
