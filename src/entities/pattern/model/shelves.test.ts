import { describe, expect, it } from 'vitest'
import { patternBook } from './book'
import { pickerShelves, referenceShelves } from './shelves'
import { patternsIn } from './selectors'

const book = patternBook([{ id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' }])
const outline = (shelves: ReturnType<typeof referenceShelves>) =>
  shelves.map(({ shelf, patterns }) => [shelf, patterns.length])

describe('referenceShelves', () => {
  it('lists favourites, the learner’s own, the groups, and the hidden at the end', () => {
    const shelves = referenceShelves(book, { favourites: ['ballad', 'my-1'], hidden: ['funk'] })
    expect(outline(shelves)).toEqual([
      ['favourites', 2],
      ['own', 1],
      ['lesson-3', 5],
      ['techniques', 12],
      ['seven-types', 8],
      ['genres', patternsIn('genres').length - 1],
      ['hidden', 1],
    ])
    expect(shelves[0]?.patterns.map((pattern) => pattern.ref)).toEqual(['ballad', 'my-1'])
  })

  it('shows no empty shelf, and nothing the book has lost', () => {
    const shelves = referenceShelves(patternBook([]), { favourites: ['my-1'], hidden: [] })
    expect(shelves.map(({ shelf }) => shelf)).toEqual([
      'lesson-3',
      'techniques',
      'seven-types',
      'genres',
    ])
  })

  it('shows a starred pattern that is hidden on the hidden shelf only', () => {
    const shelves = referenceShelves(book, { favourites: ['funk', 'ballad'], hidden: ['funk'] })
    expect(shelves[0]?.patterns.map((pattern) => pattern.ref)).toEqual(['ballad'])
    expect(shelves.at(-1)?.patterns.map((pattern) => pattern.ref)).toEqual(['funk'])
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
