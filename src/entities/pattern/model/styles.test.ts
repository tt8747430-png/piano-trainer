import { describe, expect, it } from 'vitest'
import { barSteps, DRUM_VOICES } from '@/shared/lib/arrangement'
import { KIT_PIECES } from '@/shared/lib/schedule'
import { WRITTEN_STYLES } from '../content/styles'
import { BUILT_IN_PATTERNS, patternBook } from './book'
import { BUILT_IN_STYLES, DEFAULT_STYLE_ID, styleBook, styleVariations } from './styles'

describe('the Chord player’s styles', () => {
  it('every grid and bass line is 16 steps a 4/4 bar, the meter’s steps otherwise', () => {
    for (const style of WRITTEN_STYLES) {
      const steps = barSteps(style.meter ?? '4/4')
      for (const variation of style.variations) {
        const lines = [
          variation.bass,
          variation.fill?.bass,
          ...Object.values(variation.drums ?? {}),
          ...Object.values(variation.fill?.drums ?? {}),
        ].filter((line) => line !== undefined)
        for (const line of lines) expect(line, `${style.id}: ${line}`).toHaveLength(steps)
      }
    }
  })
  it('every variation has piano, bass and drums but the hymns’ and classical’s (the piano, a hymn’s bass)', () => {
    for (const style of BUILT_IN_STYLES) {
      expect(style.variations.length, style.id).toBeGreaterThanOrEqual(1)
      expect(style.variations.length, style.id).toBeLessThanOrEqual(4)
      for (const parts of style.variations) {
        expect(parts.piano, style.id).not.toBeNull()
        const pianoAlone = style.family === 'classical' || style.id === 'hymn-1'
        const noDrums = pianoAlone || style.family === 'hymn'
        expect(parts.bass === null, style.id).toBe(pianoAlone)
        expect(parts.drums === null, style.id).toBe(noDrums)
      }
    }
  })
  it('the first and default style is Pop 1, ids are unique, the families are the brief’s', () => {
    expect(BUILT_IN_STYLES[0]?.id).toBe(DEFAULT_STYLE_ID)
    expect(new Set(BUILT_IN_STYLES.map((s) => s.id)).size).toBe(BUILT_IN_STYLES.length)
    const book = styleBook(BUILT_IN_PATTERNS)
    expect(book.families.map((group) => group.family)).toEqual([
      'pop',
      'rock',
      'ballad',
      'worship',
      'hymn',
      'hiphop',
      'disco',
      'funk',
      'reggae',
      'latin',
      'jazz',
      'blues',
      'classical',
      'patterns',
    ])
    expect(book.families[0]?.styles.map((s) => s.id)).toEqual([
      'pop-1',
      'pop-2',
      'pop-3',
      'pop-4',
      'pop-5',
    ])
  })
  it('swing styles are the jazz and blues ones and a few grooves; waltzes are in 3/4', () => {
    const swung = BUILT_IN_STYLES.filter((s) => s.swing).map((s) => s.id)
    expect(swung).toEqual(
      expect.arrayContaining(['swing-1', 'swing-2', 'jazz-waltz', 'shuffle', 'slow-blues']),
    )
    expect(BUILT_IN_STYLES.filter((s) => s.meter === '3/4').map((s) => s.id)).toEqual([
      'jazz-waltz',
      'waltz',
    ])
  })
  it('Accompaniment’s patterns are piano-only styles, the learner’s own among them', () => {
    const book = styleBook(patternBook([{ id: 'my-1', name: 'Mine', rh: 'b1', lh: 'o' }]))
    const patterns = book.families.at(-1)?.styles ?? []
    expect(patterns.some((s) => s.id === 'pattern:pop8')).toBe(true)
    expect(patterns.at(-1)).toMatchObject({ id: 'pattern:my-1', shelf: 'own', hasDrums: false })
    expect(styleVariations(patterns[0]!)).toEqual([1])
    expect(book.get('pattern:gone').id).toBe('pop-1')
  })
  it('the kernel’s drum voices are the drum sounds’ kit pieces', () => {
    expect([...DRUM_VOICES]).toEqual([...KIT_PIECES])
  })
})
