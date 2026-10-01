import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import type { PieceMusic } from './music'
import { createPiecesStore, PIECES_STORAGE_KEY } from './store'

const restored = (state: unknown, version = 1) => {
  const storage = createMemoryStorage()
  storage.setItem(PIECES_STORAGE_KEY, JSON.stringify({ state, version }))
  return createPiecesStore({ storage, otherTabs: new EventTarget() }).getState()
}

const MUSIC: PieceMusic = {
  key: 'Bm',
  meter: '12/8',
  tempo: 56,
  pattern: 'r1',
  sections: [{ kind: 'verse', n: 1, lines: ['Bm A G-Em F#7'] }],
  melody: 'B4/4',
  hands: { lh: 'B2/4 | - | - | -' },
}
const SONG = { id: 'my-1', title: 'Morning', ...MUSIC }

describe('createPiecesStore', () => {
  it('starts with no versions and no songs, and saves under pt-pieces', () => {
    const storage = createMemoryStorage()
    const store = createPiecesStore({ storage, otherTabs: new EventTarget() })
    expect(store.getState()).toEqual({ versions: {}, songs: [], nextSong: 1 })
    store.setState({ versions: { bz1: MUSIC } })
    expect(JSON.parse(storage.getItem('pt-pieces') ?? 'null')).toEqual({
      state: { versions: { bz1: MUSIC }, songs: [], nextSong: 1 },
      version: 1,
    })
  })

  it('restores what was saved', () => {
    const saved = { versions: { bz1: MUSIC }, songs: [SONG], nextSong: 2 }
    expect(restored(saved)).toEqual(saved)
  })

  it('drops music that does not parse, or names an unknown pattern, meter or tempo', () => {
    const versions = {
      bz1: MUSIC,
      bz2: { ...MUSIC, sections: [{ kind: 'verse', lines: ['Qm'] }] },
      bz3: { ...MUSIC, melody: 'Q4/1' },
      bz5: { ...MUSIC, hands: { rh: 'C4/4' } },
      bz6: { ...MUSIC, pattern: 'nope' },
      bz8: { ...MUSIC, meter: '5/4' },
      bz9: { ...MUSIC, tempo: 300 },
      bz10: { ...MUSIC, key: 'H' },
      bz12: { ...MUSIC, sections: [{ kind: 'bridge', lines: ['C'] }] },
      bz13: 'Bm A G',
    }
    expect(Object.keys(restored({ versions }).versions)).toEqual(['bz1'])
  })

  it('drops a melody longer than its chart', () => {
    const versions = { bz1: { ...MUSIC, melody: 'B4/16 B4/1' } }
    expect(restored({ versions }).versions).toEqual({})
  })

  it('keeps a song with a title of 1 to 80 characters and an own id, once', () => {
    const songs = [
      { ...SONG, title: '  Morning  ' },
      { ...SONG, id: 'my-2', title: '   ' },
      { ...SONG, id: 'my-3', title: 'x'.repeat(81) },
      { ...SONG, id: 'song-4' },
      { ...SONG, title: 'Twice' },
      { ...SONG, id: 'my-5', tempo: 10 },
    ]
    expect(restored({ songs, nextSong: 9 }).songs).toEqual([SONG])
  })

  it('keeps nextSong past every own id', () => {
    expect(restored({ songs: [{ ...SONG, id: 'my-7' }], nextSong: 3 }).nextSong).toBe(8)
    expect(restored({ nextSong: 'many' }).nextSong).toBe(1)
  })

  it('follows another tab’s saves', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createPiecesStore({ storage, otherTabs })
    const saved = JSON.stringify({
      state: { versions: { bz1: MUSIC }, songs: [], nextSong: 1 },
      version: 1,
    })
    storage.setItem(PIECES_STORAGE_KEY, saved)
    otherTabs.dispatchEvent(
      new StorageEvent('storage', { key: PIECES_STORAGE_KEY, newValue: saved }),
    )
    expect(store.getState().versions).toEqual({ bz1: MUSIC })
  })
})
