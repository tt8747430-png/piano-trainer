import { describe, expect, it } from 'vitest'
import { parseChordSymbol } from './chord-symbol'
import { parseKey, type Key } from './key'
import { findNumerals, numeralReadings, standsFor } from './numeral-find'
import { parseNumeral, parseNumerals } from './numerals'

const key = (text: string): Key => {
  const read = parseKey(text)
  if (!read) throw new Error(text)
  return read
}
const chords = (line: string) => line.split(' ').map(parseChordSymbol)
/** Where a line of numerals is found in a line of chords, as chord indexes `first-last`. */
const found = (line: string, inKey: string, wanted: string) =>
  findNumerals(numeralReadings(chords(line), key(inKey)), parseNumerals(wanted) ?? []).map(
    ({ first, last }) => `${first}-${last}`,
  )
const numeral = (text: string) => {
  const read = parseNumeral(text)
  if (!read) throw new Error(text)
  return read
}

describe('standsFor', () => {
  it('takes a chord for a plain triad on its degree where it holds the triad', () => {
    expect(standsFor(numeral('V7'), numeral('V'))).toBe(true)
    expect(standsFor(numeral('vi7'), numeral('vi'))).toBe(true)
    expect(standsFor(numeral('IMaj7'), numeral('I'))).toBe(true)
    expect(standsFor(numeral('I6'), numeral('I'))).toBe(true)
    expect(standsFor(numeral('iiø7'), numeral('ii°'))).toBe(true)
  })

  it('takes a sus chord for the triad it stands for, its 4th or 2nd in place of the 3rd', () => {
    expect(standsFor(numeral('Vsus4'), numeral('V'))).toBe(true)
    expect(standsFor(numeral('Isus2'), numeral('i'))).toBe(true)
  })

  it('never takes another degree, another 3rd or another 5th', () => {
    expect(standsFor(numeral('IV'), numeral('V'))).toBe(false)
    expect(standsFor(numeral('v'), numeral('V'))).toBe(false)
    expect(standsFor(numeral('♭VII'), numeral('VII'))).toBe(false)
    expect(standsFor(numeral('I+'), numeral('I'))).toBe(false)
    expect(standsFor(numeral('vii°'), numeral('vii'))).toBe(false)
  })

  it('asks a chord written out for every tone it writes', () => {
    expect(standsFor(numeral('I'), numeral('I7'))).toBe(false)
    expect(standsFor(numeral('IMaj7'), numeral('I7'))).toBe(false)
    expect(standsFor(numeral('I9'), numeral('I7'))).toBe(true)
    expect(standsFor(numeral('V7'), numeral('V7♭9'))).toBe(false)
  })

  it('takes an applied chord only for the same chord applied to the same degree', () => {
    expect(standsFor(numeral('V7/vi'), numeral('V/vi'))).toBe(true)
    expect(standsFor(numeral('V7/ii'), numeral('V/vi'))).toBe(false)
    expect(standsFor(numeral('V7/vi'), numeral('V'))).toBe(false)
  })
})

describe('findNumerals', () => {
  it('finds Amazing Grace’s I–IV–I in G, its G7 heard as the I it colours', () => {
    expect(found('G G7 C G G G D D7 G G7 C G Em D G G', 'G', 'I IV I')).toEqual(['0-3', '8-11'])
  })

  it('finds a progression in any key, its chords as the key reads them', () => {
    expect(found('C G Am F', 'C', 'I V vi IV')).toEqual(['0-3'])
    expect(found('Eb Bb Cm Ab', 'Eb', 'I V vi IV')).toEqual(['0-3'])
    expect(found('Am F C G', 'Am', 'i VI III VII')).toEqual(['0-3'])
  })

  it('holds a chord over several, the first of the last chord ending it', () => {
    expect(found('C C G G Am Am F F C', 'C', 'I V vi IV')).toEqual(['0-6'])
  })

  it('reads a progression whose line repeats a chord as the chord held', () => {
    expect(found('C G G Dm', 'C', 'I v v ii')).toEqual([])
    expect(found('C Gm Dm', 'C', 'I v v ii')).toEqual(['0-2'])
  })

  it('takes a 7th, a 6th or a sus where the line writes the triad', () => {
    expect(found('C Am7 F6 Gsus4 G7', 'C', 'I vi IV V')).toEqual(['0-3'])
  })

  it('finds a secondary dominant as the dominant of the chord it leads to', () => {
    expect(found('C E7 Am F G C', 'C', 'I V/vi vi IV V I')).toEqual(['0-5'])
  })

  it('finds every place it comes, a loop’s last chord starting it again', () => {
    expect(found('C F C F C', 'C', 'I IV I')).toEqual(['0-2', '2-4'])
    expect(found('C G C F C G C', 'C', 'I V I')).toEqual(['0-2', '4-6'])
  })

  it('finds nothing for a line of one chord, nor for chords out of order', () => {
    expect(found('C C C', 'C', 'I')).toEqual([])
    expect(found('C F G', 'C', 'I V IV')).toEqual([])
    expect(found('C F C', 'C', '')).toEqual([])
  })
})
