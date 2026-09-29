import { describe, expect, it } from 'vitest'
import { chordSymbol } from './chord'
import { parseChordSymbol } from './chord-symbol'
import type { Key } from './key'
import { note } from './note'
import {
  numeralChord,
  numeralOf,
  numeralsParam,
  numeralText,
  parseNumerals,
  type NumeralSize,
} from './numerals'

const C: Key = { tonic: note('C'), minor: false }
const A_MINOR: Key = { tonic: note('A'), minor: true }
const chords = (text: string, key: Key, size: NumeralSize) =>
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

  it('writes none for a chord a numeral does not name', () => {
    expect(numeralOf(parseChordSymbol('Csus4'), C)).toBeNull()
  })
})
