import { describe, expect, it } from 'vitest'
import { chordSymbol } from './chord'
import { parseKey, type Key } from './key'
import { modeKey, readInMode } from './modal'
import { numeralChord, numeralText, parseNumerals } from './numerals'

const key = (text: string): Key => {
  const read = parseKey(text)
  if (!read) throw new Error(text)
  return read
}
const line = (text: string) => parseNumerals(text) ?? []
/** A line re-read in a mode, as its numerals and its chords at a size. */
const inMode = (
  text: string,
  tonic: string,
  mode: Parameters<typeof modeKey>[1],
  size: 'triads' | 'sevenths' = 'triads',
) => {
  const at = modeKey(key(tonic).tonic, mode)
  const numerals = readInMode(line(text), at, mode)
  return {
    numerals: numerals.map(numeralText).join(' '),
    chords: numerals.map((each) => chordSymbol(numeralChord(each, at, size, mode))).join(' '),
  }
}

describe('a progression in a mode', () => {
  it('stands on the major or the minor key of its tonic, as the mode’s third is', () => {
    expect(modeKey(key('D').tonic, 'dorian')).toEqual(key('Dm'))
    expect(modeKey(key('G').tonic, 'mixolydian')).toEqual(key('G'))
    expect(modeKey(key('E').tonic, 'phrygian')).toEqual(key('Em'))
    expect(modeKey(key('F').tonic, 'lydian')).toEqual(key('F'))
    expect(modeKey(key('B').tonic, 'locrian')).toEqual(key('Bm'))
  })

  it('reads each degree as the mode’s own chord, written against its major or minor key', () => {
    // The same degrees, I IV V, in each mode: its own chord on each.
    expect(inMode('I IV V', 'C', 'mixolydian')).toEqual({ numerals: 'I IV v', chords: 'C F Gm' })
    expect(inMode('I IV V', 'D', 'dorian')).toEqual({ numerals: 'i IV v', chords: 'Dm G Am' })
    expect(inMode('I II VII', 'F', 'lydian')).toEqual({ numerals: 'I II vii', chords: 'F G Em' })
    expect(inMode('I II', 'E', 'phrygian')).toEqual({ numerals: 'i ♭II', chords: 'Em F' })
    expect(inMode('I VII', 'C', 'mixolydian')).toEqual({ numerals: 'I ♭VII', chords: 'C B♭' })
    expect(inMode('VI', 'A', 'dorian')).toEqual({ numerals: 'vi°', chords: 'F#°' })
    expect(inMode('I II V', 'B', 'locrian')).toEqual({ numerals: 'i° ♭II ♭V', chords: 'B° C F' })
    expect(inMode('IV', 'F', 'lydian')).toEqual({ numerals: '#iv°', chords: 'B°' })
  })

  it('grows each chord as the mode does: Mixolydian’s I a dominant 7th, its ♭VII a major 7th', () => {
    expect(inMode('I VII IV', 'C', 'mixolydian', 'sevenths').chords).toBe('C7 B♭Maj7 FMaj7')
    expect(inMode('I IV', 'D', 'dorian', 'sevenths').chords).toBe('Dm7 G7')
  })

  it('keeps a chromatic, applied or written-out chord as written', () => {
    expect(inMode('♭VI V7/V V7', 'C', 'mixolydian').numerals).toBe('♭VI V7/V V7')
  })

  it('keeps a numeral’s bass on the chord re-read', () => {
    expect(inMode('V/5', 'D', 'dorian').numerals).toBe('v/5')
  })
})
