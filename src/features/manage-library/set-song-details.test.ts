import { describe, expect, it } from 'vitest'
import { createLibraryStore, NO_DETAILS } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'
import { setSongDetails } from './set-song-details'

const store = () =>
  createLibraryStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })

describe('a song’s details (R30 S5)', () => {
  it('keeps what is given, its tags tidied, and survives a reload', () => {
    const storage = createMemoryStorage()
    const library = createLibraryStore({ storage, otherTabs: new EventTarget() })
    setSongDetails(library, 'amazing', { genre: 'hymn', tags: [' Sunday ', 'sunday', 'Choir'] })
    expect(library.getState().songDetails.amazing).toEqual({
      ...NO_DETAILS,
      genre: 'hymn',
      tags: ['sunday', 'choir'],
    })
    const again = createLibraryStore({ storage, otherTabs: new EventTarget() })
    expect(again.getState().songDetails.amazing?.tags).toEqual(['sunday', 'choir'])
  })

  it('merges a change into what is kept, and forgets a song whose details say nothing', () => {
    const library = store()
    setSongDetails(library, 'ode', { language: 'en' })
    setSongDetails(library, 'ode', { level: 'beginner' })
    expect(library.getState().songDetails.ode).toMatchObject({ language: 'en', level: 'beginner' })
    setSongDetails(library, 'ode', { language: null, level: null })
    expect(library.getState().songDetails).not.toHaveProperty('ode')
  })
})
