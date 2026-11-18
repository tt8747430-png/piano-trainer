import { describe, expect, it } from 'vitest'
import { ACCOMPANIMENT_PARTS, isAccompanimentPart } from './parts'
import { partOfShelf } from './shelves'

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
