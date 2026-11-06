import { describe, expect, it } from 'vitest'
import { patternBook } from './book'
import { ACCOMPANIMENT_PARTS, isAccompanimentPart } from './parts'
import { partOfShelf, pickerShelves } from './shelves'

const book = patternBook([{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }])
describe('partOfShelf', () => {
  it('puts every shelf on one part: a group on its book’s or on Styles, the learner’s on Yours', () => {
    expect(ACCOMPANIMENT_PARTS).toEqual([
      'called-to-play',
      'called-to-play-2',
      'seven-types',
      'gorshkov',
      'styles',
      'yours',
    ])
    expect(
      (
        [
          'favourites',
          'own',
          'five-ways',
          'techniques',
          'seven-types',
          'gorshkov',
          'genres',
          'hidden',
        ] as const
      ).map(partOfShelf),
    ).toEqual([
      'yours',
      'yours',
      'called-to-play',
      'called-to-play',
      'seven-types',
      'gorshkov',
      'styles',
      'yours',
    ])
    expect(isAccompanimentPart('styles')).toBe(true)
    expect(isAccompanimentPart('genres')).toBe(false)
  })
})

describe('pickerShelves', () => {
  it('leaves the hidden out, all but the one playing now', () => {
    const hidden = { favourites: [], hidden: ['funk', 'rock'] as const }
    const genres = (chosen: 'funk' | 'block') =>
      pickerShelves(book, { ...hidden, hidden: [...hidden.hidden] }, chosen)
        .find(({ shelf }) => shelf === 'genres')
        ?.patterns.map((pattern) => pattern.ref)
    expect(genres('block')).not.toContain('funk')
    expect(genres('funk')).toContain('funk')
    expect(genres('funk')).not.toContain('rock')
    expect(pickerShelves(book, { favourites: [], hidden: [] }, 'block').at(-1)?.shelf).toBe(
      'genres',
    )
  })

  it('leaves a hidden favourite out too, unless it plays now', () => {
    const choices = { favourites: ['funk' as const, 'my-1' as const], hidden: ['funk' as const] }
    const favourites = (chosen: 'funk' | 'block') =>
      pickerShelves(book, choices, chosen)
        .find(({ shelf }) => shelf === 'favourites')
        ?.patterns.map((pattern) => pattern.ref)
    expect(favourites('block')).toEqual(['my-1'])
    expect(favourites('funk')).toEqual(['funk', 'my-1'])
  })
})
