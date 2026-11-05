// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createPracticeLibraryStore } from '@/entities/practice-library'
import { createMemoryStorage } from '@/shared/lib'
import { deleteProgression } from './delete-progression'
import { saveProgression } from './save-progression'
import { togglePracticeFavourite } from './toggle-favourite'

const store = () =>
  createPracticeLibraryStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const DRAFT = { name: '  Sad loop ', line: 'vi-IV-I-V', minor: false }

describe('togglePracticeFavourite', () => {
  it('makes one of a kind a favourite at the end of its kind’s, and not again, each kind apart', () => {
    const library = store()
    togglePracticeFavourite(library, 'exercises', 'hanon')
    togglePracticeFavourite(library, 'exercises', 'modes')
    togglePracticeFavourite(library, 'progressions', 'axis')
    expect(library.getState().favourites).toEqual({
      exercises: ['hanon', 'modes'],
      progressions: ['axis'],
    })
    togglePracticeFavourite(library, 'exercises', 'hanon')
    expect(library.getState().favourites.exercises).toEqual(['modes'])
  })
})

describe('saveProgression', () => {
  it('keeps a new progression under the next number, its name trimmed', () => {
    const library = store()
    expect(saveProgression(library, DRAFT)).toBe('mine-1')
    expect(saveProgression(library, { ...DRAFT, name: 'Another' })).toBe('mine-2')
    expect(library.getState().progressions[0]).toEqual({ ...DRAFT, id: 'mine-1', name: 'Sad loop' })
    expect(library.getState().nextOwn).toBe(3)
  })

  it('changes one in its place, and keeps one deleted meanwhile as a new one', () => {
    const library = store()
    saveProgression(library, DRAFT)
    expect(saveProgression(library, { ...DRAFT, line: 'I-V' }, 'mine-1')).toBe('mine-1')
    expect(library.getState().progressions).toEqual([
      { ...DRAFT, id: 'mine-1', name: 'Sad loop', line: 'I-V' },
    ])
    expect(saveProgression(library, DRAFT, 'mine-7')).toBe('mine-2')
  })

  it('keeps nothing without a name or with a line that does not read', () => {
    const library = store()
    expect(saveProgression(library, { ...DRAFT, name: '  ' })).toBeNull()
    expect(saveProgression(library, { ...DRAFT, line: 'nothing' })).toBeNull()
    expect(library.getState().progressions).toEqual([])
  })
})

describe('deleteProgression', () => {
  it('deletes it with its favourite, and never gives its number again', () => {
    const library = store()
    saveProgression(library, DRAFT)
    togglePracticeFavourite(library, 'progressions', 'mine-1')
    deleteProgression(library, 'mine-1')
    expect(library.getState().progressions).toEqual([])
    expect(library.getState().favourites.progressions).toEqual([])
    expect(saveProgression(library, DRAFT)).toBe('mine-2')
  })
})
