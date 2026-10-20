import { describe, expect, it } from 'vitest'
import { pitchClassOf } from './note'
import { keysOfChords, readInKey } from './key-of-chords'
import { keySymbol, type Key } from './key'
import { parseChordSymbol } from './chord-symbol'
import { chordSymbol } from './chord'
import { note } from './note'
import { numeralChord, numeralText } from './numerals'

const chords = (line: string) => line.split(' ').map(parseChordSymbol)
const found = (line: string) => keysOfChords(chords(line)).map((reading) => keySymbol(reading.key))
const D_MINOR: Key = { tonic: note('D'), minor: true }
const numerals = (line: string, key: Key) =>
  readInKey(chords(line), key).map(({ numeral }) => (numeral ? numeralText(numeral) : null))

describe('keysOfChords', () => {
  it('finds the key whose chords these are, its tonic first and last', () => {
    expect(found('C F G C')[0]).toBe('C')
    expect(found('G D Em C G')[0]).toBe('G')
  })

  it('finds «Ромашковые поля» in D minor, though F major holds its chords too', () => {
    expect(found('Dm7 Gm9 Asus4 Dm7').slice(0, 2)).toEqual(['Dm', 'F'])
    const verse =
      'Dm Gm Asus4 Dm Gm Csus4 Am D D/F# Gm Csus4 C F Bb Gm Em7b5 Asus4 A Dm Gm Csus2 C FMaj7 D7 Gm7 Dm/F Em7b5 A Dm6'
    expect(found(verse)[0]).toBe('Dm')
  })

  it('takes the key whose tonic chord opens the line, where two hold every chord', () => {
    expect(found('Am F C G').slice(0, 2)).toEqual(['Am', 'C'])
    expect(found('C Am F G').slice(0, 2)).toEqual(['C', 'Am'])
  })

  it('counts the chords each key holds, and scores them', () => {
    const [best] = keysOfChords(chords('Dm7 Gm9 Asus4 Dm7'))
    expect(best).toMatchObject({ held: 4, score: 11 })
  })

  it('counts a dominant that leads to the next chord as heard in the key', () => {
    const [withApplied] = keysOfChords(chords('C A7 Dm G7 C'))
    expect(keySymbol(withApplied?.key ?? D_MINOR)).toBe('C')
    expect(withApplied).toMatchObject({ held: 4, score: 12 })
  })

  it('spells the key as the chords spell its tonic, where a signature writes it', () => {
    expect(found('C# F# G# C#')[0]).toBe('C#')
    expect(found('Db Gb Ab Db')[0]).toBe('D♭')
    expect(found('Ebm Abm Bb Ebm')[0]).toBe('E♭m')
  })

  it('goes to the key nearest C, then major, where scores tie', () => {
    expect(found('F G')[0]).toBe('C')
  })

  it('finds nothing in no chords', () => {
    expect(keysOfChords([])).toEqual([])
  })
})

describe('readInKey', () => {
  it('reads each chord as its numeral in the key', () => {
    expect(numerals('Dm7 Gm9 Asus4 Dm7', D_MINOR)).toEqual(['i7', 'iv9', 'Vsus4', 'i7'])
    expect(numerals('Em7b5 A7b9 Dm6', D_MINOR)).toEqual(['iiø7', 'V7♭9', 'i6'])
  })

  it('names a dominant out of the key by the chord it leads to', () => {
    expect(numerals('D D/F# Gm', D_MINOR)).toEqual(['I', 'V/3/iv', 'iv'])
    expect(numerals('C A7 Dm G7 C', { tonic: note('C'), minor: false })).toEqual([
      'I',
      'V7/ii',
      'ii',
      'V7',
      'I',
    ])
  })

  it('marks the chords out of the key, an applied dominant among them', () => {
    const read = readInKey(chords('Dm D7 Gm Bb E♭'), D_MINOR)
    expect(read.map(({ inKey }) => inKey)).toEqual([true, false, true, true, false])
    expect(numerals('E♭', D_MINOR)).toEqual(['♭II'])
  })

  it('spells each chord as the key does, its bass with it', () => {
    const [chord] = readInKey(chords('A#/D'), D_MINOR).map((reading) => reading.chord)
    expect(chord).toEqual({ root: note('B', -1), quality: 'maj', bass: note('D') })
  })

  it('keeps a chord out of the key as typed, its numeral from its letter', () => {
    const G: Key = { tonic: note('G'), minor: false }
    const C: Key = { tonic: note('C'), minor: false }
    const E_FLAT: Key = { tonic: note('E', -1), minor: false }
    const D: Key = { tonic: note('D'), minor: false }
    const symbols = (line: string, key: Key) =>
      readInKey(chords(line), key).map(({ chord }) => chordSymbol(chord))
    expect(symbols('G Bb C G', G)).toEqual(['G', 'B♭', 'C', 'G'])
    expect(numerals('G Bb C G', G)).toEqual(['I', '♭III', 'IV', 'I'])
    expect(symbols('C F#m7b5 B7 Em', C)[1]).toBe('F#m7♭5')
    expect(numerals('C F#m7b5 B7 Em', C)[1]).toBe('#ivø7')
    expect(symbols('Eb Cb Ab Bb7', E_FLAT)[1]).toBe('C♭')
    expect(numerals('Eb Cb Ab Bb7', E_FLAT)[1]).toBe('♭VI')
    expect(symbols('D Bb A D', D)[1]).toBe('B♭')
    expect(numerals('D Bb A D', D)[1]).toBe('♭VI')
  })

  it('reads a minor key’s chords on its raised 6th and 7th as its own', () => {
    const A_MINOR: Key = { tonic: note('A'), minor: true }
    expect(numerals('Am G#dim Am', A_MINOR)).toEqual(['i', 'vii°', 'i'])
    expect(numerals('F#m7b5 E7 Am', A_MINOR)).toEqual(['viø7', 'V7', 'i'])
  })

  it('reads every chord back: its numeral in the key is the chord', () => {
    const lines: [string, Key][] = [
      ['Dm Gm Asus4 Dm Gm Csus4 Am D D/F# Gm Csus4 C F Bb Gm Em7b5 A Dm6', D_MINOR],
      ['C A7 Dm G7 C E7 Am Fm6 C', { tonic: note('C'), minor: false }],
      ['Em9 A7b9 DMaj9 C#m7b5 F#7#9 Bm9', { tonic: note('D'), minor: false }],
      ['Am F#m7b5 G#dim7 Am G#m7b5 E7 Am', { tonic: note('A'), minor: true }],
    ]
    for (const [line, key] of lines) {
      for (const { chord, numeral } of readInKey(chords(line), key)) {
        const back = numeral && numeralChord(numeral, key, 'triads')
        expect(back && [pitchClassOf(back.root), back.quality]).toEqual([
          pitchClassOf(chord.root),
          chord.quality,
        ])
      }
    }
  })
})
