import { describe, expect, it } from 'vitest'
import { patternBook } from './book'
import { patternsIn } from './groups'
import { ACCOMPANIMENT_PARTS, isAccompanimentPart } from './parts'
import { partOfShelf, partShelves, pickerShelves } from './shelves'

const book = patternBook([{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }])
const outline = (shelves: ReturnType<typeof partShelves>) =>
  shelves.map(({ shelf, patterns }) => [shelf, patterns.length])

describe('partShelves', () => {
  const choices = { favourites: ['ballad' as const, 'my-1' as const], hidden: ['funk' as const] }

  it('lists a method book’s groups on its part', () => {
    expect(outline(partShelves(book, choices, 'called-to-play'))).toEqual([
      ['five-ways', 5],
      ['techniques', 12],
    ])
    expect(outline(partShelves(book, choices, 'called-to-play-2'))).toEqual([['octaves', 3]])
    expect(outline(partShelves(book, choices, 'seven-types'))).toEqual([['seven-types', 8]])
  })

  it('lists the rhythm styles on Styles, the hidden left out', () => {
    expect(outline(partShelves(book, choices, 'styles'))).toEqual([
      ['genres', patternsIn('genres').length - 1],
    ])
  })

  it('lists on Yours what the learner starred, made and hid, the hidden at the end', () => {
    const shelves = partShelves(book, choices, 'yours')
    expect(outline(shelves)).toEqual([
      ['favourites', 2],
      ['own', 1],
      ['hidden', 1],
    ])
    expect(shelves[0]?.patterns.map((pattern) => pattern.ref)).toEqual(['ballad', 'my-1'])
  })

  it('shows no empty shelf, and nothing the book has lost', () => {
    expect(partShelves(patternBook([]), { favourites: ['my-1'], hidden: [] }, 'yours')).toEqual([])
  })

  it('shows a starred pattern that is hidden on the hidden shelf only', () => {
    const shelves = partShelves(book, { favourites: ['funk', 'ballad'], hidden: ['funk'] }, 'yours')
    expect(shelves[0]?.patterns.map((pattern) => pattern.ref)).toEqual(['ballad'])
    expect(shelves.at(-1)?.patterns.map((pattern) => pattern.ref)).toEqual(['funk'])
  })

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
