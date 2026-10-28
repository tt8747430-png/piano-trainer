import { describe, expect, it } from 'vitest'
import { spellChord, type ChordQuality } from './chord'
import { blockFingering, handFingers, placedFingering } from './chord-fingering'
import { note, type SpelledNote } from './note'
import { midi } from './pitch'
import { voiceChord } from './voicing'

const C4 = 60
const keys = (...semitones: number[]) => semitones.map((each) => midi(C4 + each))
const digits = (fingers: readonly number[]) => fingers.join('')

/** Each inversion's fingering, right hand then left: `135/531`. */
const byInversion = (quality: ChordQuality, root: SpelledNote = note('C')) =>
  blockFingering(spellChord(root, quality)).map(({ rh, lh }) => `${digits(rh)}/${digits(lh)}`)

describe('blockFingering', () => {
  it.each<[ChordQuality, string[]]>([
    // The books' triads: the right hand's 2 beside a 4th on top, the left hand's beside a 4th below.
    ['maj', ['135/531', '125/531', '135/521']],
    ['min', ['135/531', '125/531', '135/521']],
    ['dim', ['135/531', '125/531', '135/521']],
    ['aug', ['135/531', '135/531', '135/531']],
    // A 4th next to the 5th finger takes the 2: sus4 1-3-5 in the right hand, sus2 1-2-5.
    ['sus4', ['135/521', '125/531', '125/521']],
    ['sus2', ['125/531', '125/521', '135/521']],
    ['five', ['15/51']],
    // Four notes: 1-2-3-5 and 5-3-2-1, the 4 on a 2nd at the 5th finger's end.
    ['maj7', ['1235/5321', '1245/5321', '1235/5321', '1235/5421']],
    ['d7', ['1235/5321', '1245/5321', '1235/5321', '1235/5421']],
    ['m7', ['1235/5321', '1245/5321', '1235/5321', '1235/5421']],
    ['hd', ['1235/5321', '1245/5321', '1235/5321', '1235/5421']],
    ['o7', ['1235/5321', '1235/5321', '1235/5321', '1235/5321']],
    ['six', ['1245/5321', '1235/5321', '1235/5421', '1235/5321']],
    // Two 2nds together at the 5th finger's end take 3-4-5.
    ['add9', ['1235/5321', '1245/5321', '1345/5321', '1235/5431']],
    // The nine chords above with Vita Piano's lessons agree with its tables, inversion by inversion.
  ])('fingers %s in each inversion', (quality, rows) => {
    expect(byInversion(quality)).toEqual(rows)
  })

  it('is the same shape on any root: D major as C major', () => {
    expect(byInversion('maj', note('D'))).toEqual(byInversion('maj'))
  })

  it('fingers a chord of five notes or more by the hands that share it', () => {
    // The left hand's root, the right hand's 3rd, 5th, 7th and 9th.
    expect(byInversion('maj9')).toEqual(['1235/5', '1235/5'])
    expect(byInversion('n13')).toEqual(['1235/51', '1235/51'])
  })
})

describe('handFingers', () => {
  it('spreads a hand over two keys by their distance', () => {
    expect(digits(handFingers(keys(0, 2), 'rh'))).toBe('12')
    expect(digits(handFingers(keys(0, 4), 'rh'))).toBe('13')
    expect(digits(handFingers(keys(0, 5), 'rh'))).toBe('14')
    expect(digits(handFingers(keys(0, 7), 'rh'))).toBe('15')
    expect(digits(handFingers(keys(0, 11), 'lh'))).toBe('51')
    expect(digits(handFingers(keys(0, 3), 'lh'))).toBe('31')
  })

  it('takes a lone key with the thumb in the right hand and the 5th finger in the left', () => {
    expect(handFingers(keys(0), 'rh')).toEqual([1])
    expect(handFingers(keys(0), 'lh')).toEqual([5])
  })

  it('holds three keys within a 4th with neighbouring fingers', () => {
    expect(digits(handFingers(keys(0, 2, 4), 'rh'))).toBe('123')
    expect(digits(handFingers(keys(0, 2, 4), 'lh'))).toBe('321')
  })

  it('fingers the rootless voicings as the left hand holds them', () => {
    // Dm9 type A F A C E, type B C E F A; G13 type A F A B E.
    expect(digits(handFingers(keys(5, 9, 12, 16), 'lh'))).toBe('5321')
    expect(digits(handFingers(keys(0, 4, 5, 9), 'lh'))).toBe('5321')
    expect(digits(handFingers(keys(5, 9, 11, 16), 'lh'))).toBe('5321')
  })

  it('reads the keys from the lowest, whatever order they come in', () => {
    expect(digits(handFingers(keys(7, 0, 4), 'rh'))).toBe('135')
  })
})

describe('placedFingering', () => {
  const fingered = (
    quality: ChordQuality,
    voicing: Parameters<typeof voiceChord>[1],
    inversion = 0,
  ) => {
    const { lh, rh } = placedFingering(
      voiceChord(spellChord(note('C'), quality), voicing, inversion),
    )
    return `${digits(lh)}/${digits(rh)}`
  }

  it('takes a dropped voice or a doubled melody with the left thumb', () => {
    expect(fingered('maj7', 'drop2')).toBe('1/125')
    expect(fingered('maj7', 'locked', 2)).toBe('1/1235')
  })

  it('fingers a left-hand voicing as a block', () => {
    expect(fingered('maj7', 'rootlessA')).toBe('5321/')
    expect(fingered('m7', 'soWhat')).toBe('41/135')
  })
})
