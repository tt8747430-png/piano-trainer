import { describe, expect, it } from 'vitest'
import { CIRCLE_OF_FIFTHS, circleFunctions, randomKey } from './circle'
import { keyName } from './key'
import { note } from './note'

describe('CIRCLE_OF_FIFTHS', () => {
  it('goes round by fifths from C, each major over its relative minor, spelled as the app spells tonics', () => {
    expect(CIRCLE_OF_FIFTHS.map((place) => keyName(place.major))).toEqual([
      'C',
      'G',
      'D',
      'A',
      'E',
      'B',
      'F#',
      'D♭',
      'A♭',
      'E♭',
      'B♭',
      'F',
    ])
    expect(CIRCLE_OF_FIFTHS.map((place) => keyName(place.minor))).toEqual([
      'Am',
      'Em',
      'Bm',
      'F#m',
      'C#m',
      'G#m',
      'E♭m',
      'B♭m',
      'Fm',
      'Cm',
      'Gm',
      'Dm',
    ])
  })
})

describe('circleFunctions', () => {
  it('puts a major key’s seven chords on its place and its neighbours’', () => {
    expect(circleFunctions({ tonic: note('C'), minor: false })).toEqual([
      { place: 0, ring: 'major', numeral: 'I' },
      { place: 11, ring: 'minor', numeral: 'ii' },
      { place: 1, ring: 'minor', numeral: 'iii' },
      { place: 11, ring: 'major', numeral: 'IV' },
      { place: 1, ring: 'major', numeral: 'V' },
      { place: 0, ring: 'minor', numeral: 'vi' },
      { place: 2, ring: 'minor', numeral: 'vii°' },
    ])
  })

  it('does the same for a minor key, its ii° on the place inside its relative’s V', () => {
    expect(circleFunctions({ tonic: note('A'), minor: true }).map((f) => f.numeral)).toEqual([
      'i',
      'ii°',
      'III',
      'iv',
      'v',
      'VI',
      'VII',
    ])
    expect(circleFunctions({ tonic: note('A'), minor: true })[1]).toEqual({
      place: 2,
      ring: 'minor',
      numeral: 'ii°',
    })
  })
})

describe('randomKey', () => {
  it('picks any of the 24 keys but the one shown', () => {
    const c = { tonic: note('C'), minor: false }
    expect(randomKey(() => 0, c)).toEqual({ tonic: note('A'), minor: true })
    expect(randomKey(() => 0.9999, c)).toEqual({ tonic: note('D'), minor: true })
  })
})
