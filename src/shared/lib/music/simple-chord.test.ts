import { describe, expect, it } from 'vitest'
import { CHORD_QUALITIES, chordSymbol, qualityIntervals } from './chord'
import { parseChordSymbol } from './chord-symbol'
import { note } from './note'
import { isSimpleChord, simplifyChord } from './simple-chord'

const simplified = (symbol: string): string => chordSymbol(simplifyChord(parseChordSymbol(symbol)))

describe('simplifyChord', () => {
  it.each([
    ['CMaj7', 'C'],
    ['Cm7', 'Cm'],
    ['C7', 'C'],
    ['C°', 'Cm'],
    ['C°7', 'Cm'],
    ['Cm7b5', 'Cm'],
    ['C+', 'C'],
    ['Csus2', 'C'],
    ['Csus4', 'C'],
    ['C7sus4', 'C'],
    ['C9', 'C'],
    ['C13', 'C'],
    ['Cm(maj7)', 'Cm'],
    ['C6/9', 'C'],
    ['C7#9', 'C'],
    ['C7alt', 'C'],
    ['C#m9', 'C#m'],
    ['Bbadd9', 'B♭'],
  ])('plays %s as %s, its plain triad on its root', (symbol, plain) => {
    expect(simplified(symbol)).toBe(plain)
  })

  it('drops a slash chord’s bass, a chord tone or not', () => {
    expect(simplified('C/E')).toBe('C')
    expect(simplified('D/F#')).toBe('D')
    expect(simplified('Am7/G')).toBe('Am')
    expect(simplified('C/Bb')).toBe('C')
  })

  it('keeps a plain triad as it is, its root as spelled', () => {
    expect(simplifyChord({ root: note('G', 1), quality: 'min' })).toEqual({
      root: note('G', 1),
      quality: 'min',
    })
    expect(simplified('Db')).toBe('D♭')
  })

  // The table has no power chord (`C5`): a chart cannot write one. Its 5th alone has no minor 3rd,
  // so the rule makes every quality without one major.
  it.each(CHORD_QUALITIES)(
    'makes %s minor exactly where it has a minor 3rd and no major 3rd',
    (quality) => {
      const degrees = qualityIntervals(quality).map((interval) => interval.degree)
      const minor = degrees.includes('♭3') && !degrees.includes('3')
      expect(simplifyChord({ root: note('D'), quality }).quality).toBe(minor ? 'min' : 'maj')
    },
  )
})

describe('isSimpleChord', () => {
  it('is a plain major or minor triad on its root, over no other bass', () => {
    expect(isSimpleChord(parseChordSymbol('C'))).toBe(true)
    expect(isSimpleChord(parseChordSymbol('F#m'))).toBe(true)
    expect(isSimpleChord(parseChordSymbol('C/E'))).toBe(false)
    expect(isSimpleChord(parseChordSymbol('Cdim'))).toBe(false)
    expect(isSimpleChord(parseChordSymbol('C7'))).toBe(false)
    expect(isSimpleChord(parseChordSymbol('Csus4'))).toBe(false)
  })
})
