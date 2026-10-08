import { describe, expect, it } from 'vitest'
import { chordSymbol, type Chord } from './chord'
import { parseChordSymbol } from './chord-symbol'
import type { Key } from './key'
import { note } from './note'
import { chordInKey, passingChords } from './passing-chords'

const C = parseChordSymbol('C')
const E_FLAT = parseChordSymbol('Eb')
const C_MAJOR = { tonic: note('C'), minor: false }
const rows = (from: Chord, to: Chord, key: Key = C_MAJOR) =>
  passingChords(from, to, key).map((each) => [each.kind, each.chords.map(chordSymbol).join(' ')])

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
      ['commonToneDiminished', 'E♭°7'],
      ['backdoor', 'D♭7'],
      ['backdoorTwoFive', 'A♭m7 D♭7'],
      ['plagal', 'A♭'],
      ['minorPlagal', 'A♭m'],
      ['gospelWalkUp', 'B D♭'],
    ])
  })

  it('leaves out a chord that is the From or the To, and walks down when the target is below', () => {
    const fromG7 = rows(parseChordSymbol('G7'), C).map(([kind]) => kind)
    expect(fromG7).not.toContain('secondaryDominant')
    expect(rows(E_FLAT, C)).toContainEqual(['walkDown', 'D7 D♭7'])
  })

  it('makes a minor target’s ii half-diminished and its plagal chord its own iv', () => {
    const toAm = rows(C, parseChordSymbol('Am'))
    expect(toAm).toContainEqual(['secondaryTwoFive', 'Bm7♭5 E7'])
    expect(toAm).toContainEqual(['plagal', 'Dm'])
  })

  it('says a chord once: the subdominant is the plagal chord, not a second row with a 7th', () => {
    const subdominants = (to: string) =>
      rows(C, parseChordSymbol(to)).filter(([, chords]) => /^(A♭|Dm)(Maj7|7)?$/.test(chords ?? ''))
    expect(subdominants('Eb')).toEqual([['plagal', 'A♭']])
    expect(subdominants('Am')).toEqual([['plagal', 'Dm']])
  })

  it('borrows from a major target’s minor only: no back door and no minor plagal into a minor chord', () => {
    const kinds = rows(C, parseChordSymbol('Am')).map(([kind]) => kind)
    expect(kinds).not.toContain('backdoor')
    expect(kinds).not.toContain('backdoorTwoFive')
    expect(kinds).not.toContain('minorPlagal')
    expect(kinds).not.toContain('gospelWalkUp')
    expect(rows(parseChordSymbol('F'), C)).toContainEqual(['minorPlagal', 'Fm'])
  })

  it('walks up to a major chord from its ♭VI and ♭VII, the gospel lesson’s A♭, B♭, C', () => {
    expect(rows(parseChordSymbol('F'), C)).toContainEqual(['gospelWalkUp', 'A♭ B♭'])
  })

  it('walks through the key between two of its chords a third or a fourth apart', () => {
    const walk = (from: string, to: string, key: Key = C_MAJOR) =>
      rows(parseChordSymbol(from), parseChordSymbol(to), key).filter(
        ([kind]) => kind === 'diatonicWalk',
      )
    expect(walk('C', 'Em')).toEqual([['diatonicWalk', 'Dm']])
    expect(walk('C', 'F')).toEqual([['diatonicWalk', 'Dm Em']])
    expect(walk('C', 'G')).toEqual([['diatonicWalk', 'B° Am']])
    expect(walk('C', 'Am')).toEqual([['diatonicWalk', 'B°']])
    expect(walk('F', 'G')).toEqual([])
    expect(walk('C', 'Eb')).toEqual([])
    expect(walk('Am', 'C', { tonic: note('A'), minor: true })).toEqual([['diatonicWalk', 'B°']])
    expect(walk('C', 'F', { tonic: note('G'), minor: false })).toEqual([])
  })

  it('leads a diminished 7th down into a minor chord, and opens one on a major chord’s own root', () => {
    const toDm = rows(C, parseChordSymbol('Dm'))
    expect(toDm).toContainEqual(['diminishedApproach', 'C#°7'])
    expect(toDm).toContainEqual(['diminishedAbove', 'E♭°7'])
    expect(toDm.map(([kind]) => kind)).not.toContain('commonToneDiminished')
    const toC = rows(parseChordSymbol('F'), C)
    expect(toC).toContainEqual(['diminishedApproach', 'B°7'])
    expect(toC).toContainEqual(['commonToneDiminished', 'C°7'])
    expect(toC.map(([kind]) => kind)).not.toContain('diminishedAbove')
  })

  it('leads a diminished 7th into a slash chord’s bass, the gospel F, F♯°7, C/G, its notes said once', () => {
    const diminished = passingChords(parseChordSymbol('F'), parseChordSymbol('C/G'), C_MAJOR)
      .filter((way) => way.category === 'diminished')
      .map((way) => [way.kind, way.chords.map(chordSymbol).join(' ')])
    expect(diminished).toEqual([['diminishedApproach', 'F#°7']])
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
