import { describe, expect, it } from 'vitest'
import { repertoire } from '@/entities/piece'
import { piecesIn, selectIsFavourite, selectRoomForSetlist, selectSetlist } from './selectors'
import type { LibraryState } from './store'
import { MOST_SETLISTS } from './types'

const MORNING = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C D G'] }],
} as const
const LIBRARY: LibraryState = {
  favourites: ['silent', 'bz5'],
  setlists: [{ id: 'set-2', name: 'Sunday', pieces: ['bz5'] }],
  nextSetlist: 3,
}

describe('the library’s selectors', () => {
  it('reads a list’s songs in its order, leaving out what the repertoire no longer has', () => {
    const pieces = repertoire({ versions: {}, songs: [MORNING] })
    // A song and a study play; a deleted song, a listing with no chart and a stray id do not.
    const read = piecesIn(['my-1', 'my-9', 'bz4', 'ex3', 'nope', 'bz5'], pieces)
    expect(read.map((piece) => piece.id)).toEqual(['my-1', 'ex3', 'bz5'])
  })

  it('says whether a song is a favourite, and finds a setlist by its id', () => {
    expect(selectIsFavourite('bz5')(LIBRARY)).toBe(true)
    expect(selectIsFavourite('ex3')(LIBRARY)).toBe(false)
    expect(selectSetlist('set-2')(LIBRARY)?.name).toBe('Sunday')
    expect(selectSetlist('set-1')(LIBRARY)).toBeUndefined()
  })

  it('has room for setlists up to the most it keeps', () => {
    expect(selectRoomForSetlist(LIBRARY)).toBe(true)
    const full = Array.from({ length: MOST_SETLISTS }, (_, i) => ({
      id: `set-${i + 1}` as const,
      name: 'List',
      pieces: [],
    }))
    expect(selectRoomForSetlist({ ...LIBRARY, setlists: full })).toBe(false)
  })
})
