import { describe, expect, it } from 'vitest'
import { chordSymbol, type Chord } from './chord'
import { parseChordSymbol } from './chord-symbol'
import { note } from './note'
import { chordInKey, passingChords } from './passing-chords'

const C = parseChordSymbol('C')
const E_FLAT = parseChordSymbol('Eb')
const rows = (from: Chord, to: Chord) =>
  passingChords(from, to).map((each) => [each.kind, each.chords.map(chordSymbol).join(' ')])

describe('passingChords', () => {
  it('suggests The Ultimate Piano’s chords from C to E♭', () => {
    expect(rows(C, E_FLAT)).toEqual([
      ['secondaryDominant', 'B♭7'],
      ['tritoneSub', 'E7'],
      ['secondaryTwoFive', 'Fm7 B♭7'],
      ['approachBelow', 'D7'],
      ['walkUp', 'D♭7 D7'],
      ['doubleApproach', 'D7 E°7'],
      ['diminishedApproach', 'D°7'],
      ['subdominant', 'A♭'],
      ['backdoor', 'D♭7'],
      ['plagal', 'A♭Maj7'],
      ['minorPlagal', 'A♭m7'],
    ])
  })

  it('leaves out a chord that is the From or the To, and walks down when the target is below', () => {
    const fromG7 = rows(parseChordSymbol('G7'), C).map(([kind]) => kind)
    expect(fromG7).not.toContain('secondaryDominant')
    expect(rows(E_FLAT, C)).toContainEqual(['walkDown', 'D7 D♭7'])
  })

  it('makes a minor target’s ii half-diminished and its IV minor, its plagal chord the minor one', () => {
    const toAm = rows(C, parseChordSymbol('Am'))
    expect(toAm).toContainEqual(['secondaryTwoFive', 'Bm7♭5 E7'])
    expect(toAm).toContainEqual(['subdominant', 'Dm'])
    expect(toAm.map(([kind]) => kind)).not.toContain('plagal')
    expect(toAm).toContainEqual(['minorPlagal', 'Dm7'])
  })

  it('spells a walk’s dominants as the app spells a chord’s root', () => {
    expect(rows(parseChordSymbol('A'), parseChordSymbol('Db'))).toContainEqual([
      'walkUp',
      'B♭7 B7 C7',
    ])
  })
})

describe('chordInKey', () => {
  it('holds a chord whose every tone is the key’s', () => {
    const key = { tonic: note('C'), minor: false }
    expect(chordInKey(parseChordSymbol('Dm7'), key)).toBe(true)
    expect(chordInKey(parseChordSymbol('Bb7'), key)).toBe(false)
  })
})
