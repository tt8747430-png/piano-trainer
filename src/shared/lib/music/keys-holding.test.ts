import { describe, expect, it } from 'vitest'
import { keysHolding } from './keys-holding'
import { note, noteName } from './note'
import { numeralText } from './numerals'
import type { ChordQuality } from './chord'

/** Each key that holds a chord, written as `C major: I`. */
const holding = (root: Parameters<typeof note>, quality: ChordQuality) =>
  keysHolding(note(...root), quality).map(
    ({ key, numeral }) =>
      `${noteName(key.tonic)} ${key.minor ? 'minor' : 'major'}: ${numeralText(numeral)}`,
  )

describe('keysHolding', () => {
  it('finds every major and minor key that holds a triad, with its numeral, the majors first', () => {
    expect(holding(['C'], 'maj')).toEqual([
      'C major: I',
      'G major: IV',
      'F major: V',
      'A minor: III',
      'E minor: VI',
      // A minor key with its raised 7th has its V major, and with its raised 6th its IV.
      'F minor: V',
      'G minor: IV',
      'D minor: VII',
    ])
  })

  it('reads a minor key with its raised 6th and 7th, as a minor key plays them', () => {
    expect(holding(['E'], 'maj')).toEqual(
      expect.arrayContaining(['A minor: V', 'E major: I', 'B major: IV', 'A major: V']),
    )
    expect(holding(['G', 1], 'dim')).toEqual(expect.arrayContaining(['A minor: #vii°']))
  })

  it('spells the chord as each key spells it: C♯ is D♭ in a key of flats', () => {
    const keys = keysHolding(note('C', 1), 'maj')
    const dFlat = keys.find(({ key }) => !key.minor && noteName(key.tonic) === 'D♭')
    expect(dFlat && noteName(dFlat.chord.root)).toBe('D♭')
    expect(dFlat && numeralText(dFlat.numeral)).toBe('I')
  })

  it('finds a 7th chord in the keys that hold all four of its notes', () => {
    expect(holding(['D'], 'm7')).toEqual([
      'C major: ii7',
      'B♭ major: iii7',
      'F major: vi7',
      'A minor: iv7',
      'C minor: ii7',
      'G minor: v7',
      'D minor: i7',
    ])
  })

  it('goes by spelling: no key holds D–F–A as F♯ minor writes its raised 7th, E♯', () => {
    expect(holding(['D'], 'min')).not.toContain('F# minor: vi')
  })

  it('finds no key for a chord no major or minor key holds, as the altered dominant', () => {
    expect(holding(['C'], 'alt')).toEqual([])
  })
})
