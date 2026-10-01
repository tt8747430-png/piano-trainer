import { describe, expect, it } from 'vitest'
import { createPatternsStore } from '@/entities/pattern'
import { createMemoryStorage } from '@/shared/lib'
import { deleteOwnPattern } from './delete-own-pattern'
import { saveOwnPattern } from './save-own-pattern'
import { toggleFavourite } from './toggle-favourite'
import { toggleHidden } from './toggle-hidden'

const store = () =>
  createPatternsStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const DRAFT = { name: '  Sunday ', rh: 'jaz', lh: 'walk' } as const

describe('toggleFavourite', () => {
  it('stars a pattern at the end of the favourites, and unstars it', () => {
    const patterns = store()
    toggleFavourite(patterns, 'ballad')
    toggleFavourite(patterns, 'M1')
    expect(patterns.getState().favourites).toEqual(['ballad', 'M1'])
    toggleFavourite(patterns, 'ballad')
    expect(patterns.getState().favourites).toEqual(['M1'])
  })
})

describe('toggleHidden', () => {
  it('hides a built-in pattern from the picker, and shows it again', () => {
    const patterns = store()
    toggleHidden(patterns, 'funk')
    expect(patterns.getState().hidden).toEqual(['funk'])
    toggleHidden(patterns, 'funk')
    expect(patterns.getState().hidden).toEqual([])
  })
})

describe('saveOwnPattern', () => {
  it('makes a new pattern under the next number, its name trimmed, and hands back its id', () => {
    const patterns = store()
    expect(saveOwnPattern(patterns, DRAFT)).toBe('my-1')
    expect(saveOwnPattern(patterns, { ...DRAFT, name: 'Monday' })).toBe('my-2')
    expect(patterns.getState()).toMatchObject({
      own: [
        { id: 'my-1', name: 'Sunday', rh: 'jaz', lh: 'walk' },
        { id: 'my-2', name: 'Monday' },
      ],
      nextOwn: 3,
    })
  })

  it('rewrites a pattern in its place under its id', () => {
    const patterns = store()
    const id = saveOwnPattern(patterns, DRAFT)
    if (!id) throw new Error('saved')
    saveOwnPattern(patterns, { name: 'Sunday best', rh: 'b1', lh: 'o' }, id)
    expect(patterns.getState().own).toEqual([{ id, name: 'Sunday best', rh: 'b1', lh: 'o' }])
    expect(patterns.getState().nextOwn).toBe(2)
  })

  it('saves nothing without a name', () => {
    const patterns = store()
    expect(saveOwnPattern(patterns, { ...DRAFT, name: '   ' })).toBeNull()
    expect(patterns.getState().own).toEqual([])
  })
})

describe('deleteOwnPattern', () => {
  it('deletes the pattern and its star, and never gives its number again', () => {
    const patterns = store()
    const id = saveOwnPattern(patterns, DRAFT)
    if (!id) throw new Error('saved')
    toggleFavourite(patterns, id)
    deleteOwnPattern(patterns, id)
    expect(patterns.getState()).toMatchObject({ own: [], favourites: [], nextOwn: 2 })
    expect(saveOwnPattern(patterns, DRAFT)).toBe('my-2')
  })
})
