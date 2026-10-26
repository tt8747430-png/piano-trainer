import { describe, expect, it } from 'vitest'
import { createLibraryStore, MOST_PIECES, MOST_SETLISTS } from '@/entities/library'
import { createMemoryStorage } from '@/shared/lib'
import { addToSetlist } from './add-to-setlist'
import { createSetlist } from './create-setlist'
import { deleteSetlist } from './delete-setlist'
import { duplicateSetlist } from './duplicate-setlist'
import { moveInSetlist } from './move-in-setlist'
import { removeFromSetlist } from './remove-from-setlist'
import { renameSetlist } from './rename-setlist'
import { toggleFavourite } from './toggle-favourite'

const store = () =>
  createLibraryStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const copy = (name: string) => `${name} (copy)`

/** A library with one setlist of these songs, and that setlist's id. */
function withSetlist(pieces: readonly string[]) {
  const library = store()
  const id = createSetlist(library, 'Sunday')
  if (!id) throw new Error('made')
  for (const piece of pieces) addToSetlist(library, id, piece)
  return { library, id }
}
const songsOf = (library: ReturnType<typeof store>, id: string) =>
  library.getState().setlists.find((setlist) => setlist.id === id)?.pieces

describe('toggleFavourite', () => {
  it('keeps a song among the favourites, the newest first, and lets it go', () => {
    const library = store()
    toggleFavourite(library, 'bz5')
    toggleFavourite(library, 'silent')
    expect(library.getState().favourites).toEqual(['silent', 'bz5'])
    toggleFavourite(library, 'bz5')
    expect(library.getState().favourites).toEqual(['silent'])
  })

  it('lets the oldest go past the most it keeps', () => {
    const library = store()
    const many = Array.from({ length: MOST_PIECES }, (_, i) => `piece-${i}`)
    library.setState({ favourites: many })
    toggleFavourite(library, 'bz5')
    expect(library.getState().favourites).toHaveLength(MOST_PIECES)
    expect(library.getState().favourites[0]).toBe('bz5')
    expect(library.getState().favourites).not.toContain(`piece-${MOST_PIECES - 1}`)
  })
})

describe('createSetlist', () => {
  it('makes an empty setlist under the next number, its name trimmed, and hands back its id', () => {
    const library = store()
    expect(createSetlist(library, '  Sunday ')).toBe('set-1')
    expect(createSetlist(library, 'Practice')).toBe('set-2')
    expect(library.getState()).toMatchObject({
      setlists: [
        { id: 'set-1', name: 'Sunday', pieces: [] },
        { id: 'set-2', name: 'Practice', pieces: [] },
      ],
      nextSetlist: 3,
    })
  })

  it('makes none without a name, or once the library holds as many as it keeps', () => {
    const library = store()
    expect(createSetlist(library, '   ')).toBeNull()
    expect(library.getState().setlists).toEqual([])
    for (let i = 0; i < MOST_SETLISTS; i++) createSetlist(library, `List ${i}`)
    expect(createSetlist(library, 'One more')).toBeNull()
    expect(library.getState().setlists).toHaveLength(MOST_SETLISTS)
  })
})

describe('renameSetlist', () => {
  it('names a setlist anew, trimmed; an empty name changes nothing', () => {
    const { library, id } = withSetlist([])
    renameSetlist(library, id, '  Easter ')
    expect(library.getState().setlists[0]?.name).toBe('Easter')
    renameSetlist(library, id, '  ')
    expect(library.getState().setlists[0]?.name).toBe('Easter')
  })
})

describe('duplicateSetlist', () => {
  it('copies a setlist after it, its songs in order, named as a copy within 40 characters', () => {
    const { library, id } = withSetlist(['bz5', 'silent'])
    createSetlist(library, 'Practice')
    expect(duplicateSetlist(library, id, copy)).toBe('set-3')
    expect(library.getState().setlists.map(({ id, name }) => [id, name])).toEqual([
      ['set-1', 'Sunday'],
      ['set-3', 'Sunday (copy)'],
      ['set-2', 'Practice'],
    ])
    expect(songsOf(library, 'set-3')).toEqual(['bz5', 'silent'])
    renameSetlist(library, id, 'A setlist with a name of forty letters')
    const longer = duplicateSetlist(library, id, copy)
    expect(longer && library.getState().setlists[1]?.name).toBe(
      'A setlist with a name of forty… (copy)',
    )
  })

  it('copies nothing that is not there, or once the library is full', () => {
    const { library, id } = withSetlist([])
    expect(duplicateSetlist(library, 'set-9', copy)).toBeNull()
    for (let i = 1; i < MOST_SETLISTS; i++) createSetlist(library, `List ${i}`)
    expect(duplicateSetlist(library, id, copy)).toBeNull()
  })
})

describe('deleteSetlist', () => {
  it('takes a setlist away, and never gives its number again', () => {
    const { library, id } = withSetlist(['bz5'])
    deleteSetlist(library, id)
    expect(library.getState().setlists).toEqual([])
    expect(createSetlist(library, 'Again')).toBe('set-2')
  })
})

describe('addToSetlist and removeFromSetlist', () => {
  it('adds a song at the end, once, and takes it out', () => {
    const { library, id } = withSetlist(['bz5', 'silent', 'bz5'])
    expect(songsOf(library, id)).toEqual(['bz5', 'silent'])
    removeFromSetlist(library, id, 'bz5')
    expect(songsOf(library, id)).toEqual(['silent'])
  })

  it('adds nothing past the most a list keeps, nor to a setlist not there', () => {
    const { library, id } = withSetlist([])
    const many = Array.from({ length: MOST_PIECES }, (_, i) => `piece-${i}`)
    library.setState({ setlists: [{ id, name: 'Full', pieces: many }] })
    addToSetlist(library, id, 'bz5')
    expect(songsOf(library, id)).toHaveLength(MOST_PIECES)
    addToSetlist(library, 'set-9', 'bz5')
    expect(library.getState().setlists).toHaveLength(1)
  })
})

describe('moveInSetlist', () => {
  it('puts the songs in the order they were dropped in', () => {
    const { library, id } = withSetlist(['a', 'b', 'c'])
    moveInSetlist(library, id, ['c', 'a', 'b'])
    expect(songsOf(library, id)).toEqual(['c', 'a', 'b'])
  })

  it('keeps a song a search hid, or one the repertoire no longer has, in its place', () => {
    const { library, id } = withSetlist(['a', 'gone', 'b', 'c'])
    moveInSetlist(library, id, ['c', 'a', 'b'])
    expect(songsOf(library, id)).toEqual(['c', 'gone', 'a', 'b'])
  })
})
