import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, chordRootSpelling, qualityIntervals, qualitySpellings } from './chord'
import {
  ChordSymbolError,
  chordsOfLine,
  parseChordSymbol,
  printedSymbol,
  readChordLine,
  readChordSymbol,
} from './chord-symbol'
import { note, noteName } from './note'
import { pitchClass } from './pitch'

describe('parseChordSymbol', () => {
  it.each(CHORD_QUALITIES)('reads every spelling of %s on all 12 roots', (quality) => {
    for (let pc = 0; pc < 12; pc++) {
      const root = chordRootSpelling(pitchClass(pc), qualityIntervals(quality))
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
    ['Cmaj', note('C'), 'maj'],
    ['CM', note('C'), 'maj'],
    ['Cø7', note('C'), 'hd'],
    ['C+7', note('C'), 's5'],
  ])('reads the ASCII form %s', (symbol, root, quality) => {
    expect(parseChordSymbol(symbol)).toEqual({ root, quality })
  })

  it.each([
    ['D/F#', { root: note('D'), quality: 'maj', bass: note('F', 1) }],
    ['F#m/D#', { root: note('F', 1), quality: 'min', bass: note('D', 1) }],
    ['F#m/Db', { root: note('F', 1), quality: 'min', bass: note('C', 1) }],
    // A chord tone with a double accidental, or a B♯ for a C, stays as typed.
    ['D#/G', { root: note('D', 1), quality: 'maj', bass: note('G') }],
    ['Cdim7/A', { root: note('C'), quality: 'o7', bass: note('A') }],
    ['E+/C', { root: note('E'), quality: 'aug', bass: note('C') }],
    ['C6/9', { root: note('C'), quality: 's69' }],
    ['C6/9/E', { root: note('C'), quality: 's69', bass: note('E') }],
    ['Am7/G', { root: note('A'), quality: 'm7', bass: note('G') }],
  ])('reads the slash chord %s', (symbol, chord) => {
    expect(parseChordSymbol(symbol)).toEqual(chord)
  })

  it.each(['H7', 'Cmaj13', '', 'C/X', '7', 'C12'])(
    'names the symbol it cannot read: %j',
    (symbol) => {
      let caught: unknown
      try {
        parseChordSymbol(symbol)
      } catch (error) {
        caught = error
      }
      expect(caught).toBeInstanceOf(ChordSymbolError)
      expect((caught as ChordSymbolError).symbol).toBe(symbol)
      expect((caught as ChordSymbolError).message).toBe(`Unknown chord symbol "${symbol}"`)
    },
  )
})

describe('the chords Gorshkov prints', () => {
  it('reads a minor add2 and a 13♭9', () => {
    expect(parseChordSymbol('Gmadd2')).toEqual({ root: note('G'), quality: 'madd9' })
    expect(parseChordSymbol('Cm(add9)')).toEqual({ root: note('C'), quality: 'madd9' })
    expect(parseChordSymbol('A13b9')).toEqual({ root: note('A'), quality: 'b9n13' })
  })
})

describe('readChordSymbol', () => {
  it.each([
    ['Cmin7', 'm7'],
    ['CmMaj7', 'mM7'],
    ['CmM7', 'mM7'],
    ['Cm(Maj7)', 'mM7'],
    ['C11', 'n11'],
    ['C69', 's69'],
    ['C9sus4', 'sus9'],
    ['C9sus', 'sus9'],
    ['C7(b9)', 'b9'],
    ['Cadd11', 'add11'],
    ['Caug7', 's5'],
    ['Cm7-5', 'hd'],
  ])('reads the chord %s as sheets write it', (symbol, quality) => {
    expect(readChordSymbol(symbol)).toEqual({ root: note('C'), quality })
  })

  it('reads what is typed, spaces around it left out, and nothing it cannot read', () => {
    expect(readChordSymbol(' Dm7 ')).toEqual({ root: note('D'), quality: 'm7' })
    expect(readChordSymbol('Dm7/')).toBeNull()
    expect(readChordSymbol('Qx')).toBeNull()
    expect(readChordSymbol('')).toBeNull()
  })
})

describe('readChordLine', () => {
  it('reads chords apart by spaces, commas or bar lines, a minus kept for minor', () => {
    expect(readChordLine('Dm7, G7 | C-7  |F/A')).toEqual({
      chords: [
        { root: note('D'), quality: 'm7' },
        { root: note('G'), quality: 'd7' },
        { root: note('C'), quality: 'm7' },
        { root: note('F'), quality: 'maj', bass: note('A') },
      ],
      unread: [],
    })
  })

  it('gives a line’s chords only where every word is one', () => {
    expect(chordsOfLine('C | G7')).toEqual([
      { root: note('C'), quality: 'maj' },
      { root: note('G'), quality: 'd7' },
    ])
    expect(chordsOfLine('C Qx')).toBeNull()
    expect(chordsOfLine(' ')).toBeNull()
  })

  it('names the words it cannot read, and reads nothing in an empty line', () => {
    expect(readChordLine('C Qx G Dm7/')).toMatchObject({ unread: ['Qx', 'Dm7/'] })
    expect(readChordLine(' | ')).toEqual({ chords: [], unread: [] })
  })
})

describe('printedSymbol', () => {
  it('prints sharps and flats as their signs, as a chord name is engraved', () => {
    expect(printedSymbol('C#m')).toBe('C♯m')
    expect(printedSymbol('F#m/D#')).toBe('F♯m/D♯')
    expect(printedSymbol('Bbmaj7')).toBe('B♭maj7')
    expect(printedSymbol('Ab/Eb')).toBe('A♭/E♭')
    expect(printedSymbol('C7b9#11')).toBe('C7♭9♯11')
    expect(printedSymbol('Dm7(b5)')).toBe('Dm7(♭5)')
  })

  it('leaves the letters of a quality alone', () => {
    expect(printedSymbol('Bsus4')).toBe('Bsus4')
    expect(printedSymbol('Bdim7')).toBe('Bdim7')
    expect(printedSymbol('Cadd9')).toBe('Cadd9')
  })
})
