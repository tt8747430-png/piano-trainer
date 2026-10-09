import { describe, expect, it } from 'vitest'
import { LEFT_FIGURES, RIGHT_FIGURES } from '../content/figures'
import { PATTERNS } from '../content/patterns'
import { BUILT_IN_PATTERNS, patternBook } from './book'
import type { OwnPattern } from './own'

const MINE: OwnPattern = { id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }
const book = patternBook([MINE])

describe('patternBook', () => {
  it('finds a built-in pattern by its id, as the catalogue writes it', () => {
    const ballad = book.get('ballad')
    expect(ballad).toMatchObject({
      ref: 'ballad',
      group: 'genres',
      name: PATTERNS.ballad.name,
      idea: PATTERNS.ballad.idea,
      rh: 'bal',
      lh: 'bal',
    })
    expect(ballad?.pattern).toBe(BUILT_IN_PATTERNS.require('ballad').pattern)
  })

  it('finds the learner’s own, named in both languages, its idea its two figures', () => {
    const own = book.get('my-1')
    expect(own).toMatchObject({ ref: 'my-1', group: 'own', name: { en: 'Sunday', ru: 'Sunday' } })
    expect(own?.idea).toEqual({
      en: `${RIGHT_FIGURES.jaz.name.en} · ${LEFT_FIGURES.walk.name.en}`,
      ru: `${RIGHT_FIGURES.jaz.name.ru} · ${LEFT_FIGURES.walk.name.ru}`,
    })
    expect(own?.pattern).toMatchObject({
      id: 'my-1',
      rh: RIGHT_FIGURES.jaz.figure,
      lh: LEFT_FIGURES.walk.figure,
    })
    expect(book.own.map((entry) => entry.ref)).toEqual(['my-1'])
  })

  it('has no pattern for a ref it does not hold', () => {
    expect(book.get('my-2')).toBeUndefined()
    expect(BUILT_IN_PATTERNS.get('my-1')).toBeUndefined()
    expect(BUILT_IN_PATTERNS.own).toEqual([])
    expect(() => book.require('my-2')).toThrow(RangeError)
    expect(book.require('my-1').ref).toBe('my-1')
  })

  it('plays an own pattern with a tune figure as the built-in tune patterns do', () => {
    const tune = patternBook([{ id: 'my-4', name: 'Tune', rh: 'mel', lh: 'o' }]).get('my-4')
    expect(tune?.pattern).toMatchObject({ withoutMelody: BUILT_IN_PATTERNS.require('r4').pattern })
  })
})
