import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, chordSymbol, qualityIntervals } from './chord'
import { parseChordSymbol } from './chord-symbol'
import type { Key } from './key'
import { note } from './note'
import {
  numeralChord,
  numeralOf,
  numeralsLine,
  numeralsParam,
  numeralText,
  parseNumeral,
  parseNumerals,
  readDegree,
} from './numerals'
import type { ChordSize } from './scale-chord'

const C: Key = { tonic: note('C'), minor: false }
const A_MINOR: Key = { tonic: note('A'), minor: true }
const texts = (line: string) => (parseNumerals(line) ?? []).map(numeralText)
const chords = (text: string, key: Key, size: ChordSize) =>
  (parseNumerals(text) ?? []).map((numeral) => chordSymbol(numeralChord(numeral, key, size)))

describe('parseNumerals', () => {
  it('reads numerals apart by spaces, dashes or commas, with accidentals and 7ths', () => {
    expect((parseNumerals('I–V–vi–IV') ?? []).map(numeralText)).toEqual(['I', 'V', 'vi', 'IV'])
    expect((parseNumerals('ii7, V7, IMaj7 bVII #iv° viiø7') ?? []).map(numeralText)).toEqual([
      'ii7',
      'V7',
      'IMaj7',
      '♭VII',
      '#iv°',
      'viiø7',
    ])
    expect(parseNumerals('I Q V')).toBeNull()
    expect(parseNumerals('  ')).toBeNull()
  })

  it('writes them for a URL', () => {
    expect(numeralsParam(parseNumerals('♭VII ii7 V7') ?? [])).toBe('bVII-ii7-V7')
  })

  it('writes them as a line to read, a dash between them', () => {
    expect(numeralsLine(parseNumerals('bVII ii7 V7b9') ?? [])).toBe('♭VII–ii7–V7♭9')
  })

  it('reads a ♭9 written on a dominant 7th, and only there', () => {
    expect((parseNumerals('V7♭9 I') ?? []).map(numeralText)).toEqual(['V7♭9', 'I'])
    expect(numeralsParam(parseNumerals('V7b9 i') ?? [])).toBe('V7b9-i')
    expect(parseNumerals('ii7♭9')).toBeNull()
    expect(parseNumerals('vii°7♭9')).toBeNull()
    expect(parseNumerals('IMaj7♭9')).toBeNull()
  })

  it('reads a degree with its chord as the sheets write it', () => {
    expect(texts('IIm7 – V7 – Imaj7')).toEqual(['ii7', 'V7', 'IMaj7'])
    expect(texts('Im7 IVm9 Vsus4 Im7')).toEqual(['i7', 'iv9', 'Vsus4', 'i7'])
    expect(texts('IIm7b5 V7b9 Im6')).toEqual(['iiø7', 'V7♭9', 'i6'])
    expect(texts('iim7 V7 IMaj7')).toEqual(['ii7', 'V7', 'IMaj7'])
  })

  it('still reads a line written the old way', () => {
    expect(texts('III+7 iMaj7 viio7 viiø')).toEqual(['III7#5', 'iMaj7', 'vii°7', 'viiø7'])
  })

  it('reads no token that is neither grammar', () => {
    for (const token of ['Vi', 'Vfoo', 'iisus4', 'ii+', 'iMaj7♭9'])
      expect(parseNumeral(token), token).toBeNull()
  })

  it('writes every chord of the table on a degree and reads it back, in a line and in a URL', () => {
    for (const quality of CHORD_QUALITIES) {
      const numeral = { degree: 4, shift: -1, quality } as const
      expect(parseNumeral(numeralText(numeral)), quality).toEqual(numeral)
      expect(parseNumerals(numeralsParam([numeral])), quality).toEqual([numeral])
    }
  })

  it('writes lower case exactly the chords with a minor 3rd', () => {
    for (const quality of CHORD_QUALITIES) {
      const minor3rd = qualityIntervals(quality).some(({ degree }) => degree === '♭3')
      expect(numeralText({ degree: 1, shift: 0, quality }).startsWith('ii'), quality).toBe(minor3rd)
    }
  })
})

describe('numeralChord', () => {
  it('reads the key’s own chords, growing with the chord size as the scale’s do', () => {
    expect(chords('I vi ii V', C, 'triads')).toEqual(['C', 'Am', 'Dm', 'G'])
    expect(chords('I vi ii V', C, 'sevenths')).toEqual(['CMaj7', 'Am7', 'Dm7', 'G7'])
    expect(chords('iii vii°', C, 'ninths')).toEqual(['Em7', 'Bm7♭5'])
  })

  it('grows another major chord to a dominant and another minor one to a minor 7th', () => {
    expect(chords('VII III VI ♭VII iv', C, 'sevenths')).toEqual(['B7', 'E7', 'A7', 'B♭7', 'Fm7'])
  })

  it('keeps what is written', () => {
    expect(chords('I7 IV7 V7', C, 'triads')).toEqual(['C7', 'F7', 'G7'])
    expect(chords('IMaj7 vii°7', C, 'triads')).toEqual(['CMaj7', 'B°7'])
  })

  it('keeps a written ♭9 at every size, the chord it leads to growing as ever', () => {
    expect(chords('V7♭9 I', C, 'triads')).toEqual(['G7♭9', 'C'])
    expect(chords('V7♭9 I', C, 'ninths')).toEqual(['G7♭9', 'CMaj9'])
    expect(chords('V7♭9 i', A_MINOR, 'ninths')).toEqual(['E7♭9', 'Am9'])
  })

  it('plays a 6th as written, at every chord size', () => {
    expect(chords('ii7 V7 I6', C, 'ninths')).toEqual(['Dm7', 'G7', 'C6'])
    expect(chords('iiø7 V7 i6', A_MINOR, 'triads')).toEqual(['Bm7♭5', 'E7', 'Am6'])
  })

  it('counts a minor key from natural minor', () => {
    expect(chords('i iv V i', A_MINOR, 'triads')).toEqual(['Am', 'Dm', 'E', 'Am'])
    expect(chords('i VI III VII', A_MINOR, 'sevenths')).toEqual(['Am7', 'FMaj7', 'CMaj7', 'G7'])
  })
})

describe('numeralOf', () => {
  it('writes a chord as its numeral in the key', () => {
    const numerals = ['Am', 'F', 'C', 'G7', 'Bm7♭5', 'Bb', 'Fm'].map((symbol) =>
      numeralOf(parseChordSymbol(symbol), C),
    )
    expect(numerals.map((numeral) => (numeral ? numeralText(numeral) : null))).toEqual([
      'vi',
      'IV',
      'I',
      'V7',
      'viiø7',
      '♭VII',
      'iv',
    ])
  })

  it('writes a chord of any quality as its numeral', () => {
    const D_MINOR: Key = { tonic: note('D'), minor: true }
    const written = (symbols: string[], key: Key) =>
      symbols.map((symbol) => {
        const numeral = numeralOf(parseChordSymbol(symbol), key)
        return numeral ? numeralText(numeral) : null
      })
    expect(written(['Dm7', 'G7', 'C6'], C)).toEqual(['ii7', 'V7', 'I6'])
    expect(written(['Dm9', 'G9', 'CMaj9'], C)).toEqual(['ii9', 'V9', 'IMaj9'])
    expect(written(['Dm7', 'Gm9', 'Asus4'], D_MINOR)).toEqual(['i7', 'iv9', 'Vsus4'])
  })

  it('writes none for a chord whose root is no degree’s, sharpened or flattened', () => {
    expect(numeralOf(parseChordSymbol('F##'), C)).toBeNull()
  })
})

describe('readDegree', () => {
  it('reads a Roman degree in either case, with a flat or sharp before it', () => {
    expect(readDegree('', 'I')).toEqual({ degree: 0, shift: 0 })
    expect(readDegree('♭', 'VII')).toEqual({ degree: 6, shift: -1 })
    expect(readDegree('b', 'iii')).toEqual({ degree: 2, shift: -1 })
    expect(readDegree('#', 'iv')).toEqual({ degree: 3, shift: 1 })
  })

  it('reads nothing that is not a degree', () => {
    expect(readDegree('', 'VIII')).toBeNull()
    expect(readDegree('x', 'I')).toBeNull()
  })
})
