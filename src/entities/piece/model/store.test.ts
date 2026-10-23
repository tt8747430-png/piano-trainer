// @vitest-environment jsdom
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

  it('keeps a section’s own key, and drops one no signature writes', () => {
    const changing = {
      ...MUSIC,
      sections: [
        { kind: 'verse', lines: ['C'] },
        { kind: 'verse', key: 'Db', lines: ['Db'] },
        { kind: 'verse', key: 'A#', lines: ['C'] },
      ],
      hands: { lh: 'B2/4 | - | -' },
    }
    const sections = restored({ versions: { bz1: changing } }).versions.bz1?.sections
    expect(sections?.map((section) => section.key)).toEqual([undefined, 'Db', undefined])
  })

  it('keeps a section’s own pattern, and drops one the book has not', () => {
    const patterned = {
      ...MUSIC,
      sections: [
        { kind: 'verse', pattern: 'M3', lines: ['C'] },
        { kind: 'verse', pattern: 'my-1', lines: ['C'] },
        { kind: 'verse', lines: ['C'] },
      ],
      hands: { lh: 'B2/4 | - | -' },
    }
    const sections = restored({ versions: { bz1: patterned } }).versions.bz1?.sections
    expect(sections?.map((section) => section.pattern)).toEqual(['M3', undefined, undefined])
  })

  it('drops music that does not parse, or names an unknown pattern, meter, tempo or a key no signature writes', () => {
    const versions = {
      bz1: MUSIC,
      bz2: { ...MUSIC, sections: [{ kind: 'verse', lines: ['Qm'] }] },
      bz3: { ...MUSIC, melody: 'Q4/1' },
      bz5: { ...MUSIC, hands: { rh: 'C4/4' } },
      bz6: { ...MUSIC, pattern: 'nope' },
      bz8: { ...MUSIC, meter: '5/4' },
      bz9: { ...MUSIC, tempo: 300 },
      bz10: { ...MUSIC, key: 'H' },
      bz11: { ...MUSIC, key: 'A#' },
      bz12: { ...MUSIC, sections: [{ kind: 'bridge', lines: ['C'] }] },
      bz13: 'Bm A G',
    }
    expect(Object.keys(restored({ versions }).versions)).toEqual(['bz1'])
  })

  it('keeps the tune’s and each voice’s instrument where every one names one', () => {
    const kept = restored({
      versions: { bz1: { ...MUSIC, voices: ['D4/4'], instruments: ['flute', 'cello', 'oboe'] } },
    })
    expect(kept.versions.bz1?.instruments).toEqual(['flute', 'cello'])
    const wrong = restored({
      versions: { bz1: { ...MUSIC, voices: ['D4/4'], instruments: ['flute', 'kazoo'] } },
    })
    expect(wrong.versions.bz1).not.toHaveProperty('instruments')
    // A voice that does not read goes, and its instrument with it.
    const dropped = restored({
      versions: {
        bz1: { ...MUSIC, voices: ['Q4/1', 'D4/4'], instruments: ['flute', 'oboe', 'cello'] },
      },
    })
    expect(dropped.versions.bz1?.instruments).toEqual(['flute', 'cello'])
  })

  it('keeps up to three more voices that read and fit the chart, dropping any that does not', () => {
    const voices = ['D4/4', 'F#4/2 G4/2', 'B3/4', 'A3/4']
    expect(restored({ versions: { bz1: { ...MUSIC, voices } } }).versions.bz1?.voices).toEqual([
      'D4/4',
      'F#4/2 G4/2',
      'B3/4',
    ])
    const wrong = restored({ versions: { bz1: { ...MUSIC, voices: ['Q4/1', 'D4/4'] } } })
    expect(wrong.versions.bz1?.voices).toEqual(['D4/4'])
    const long = restored({ versions: { bz1: { ...MUSIC, voices: ['D4/40'] } } })
    expect(long.versions.bz1).toBeDefined()
    expect(long.versions.bz1).not.toHaveProperty('voices')
  })

  it('keeps the piano hidden only while a sung staff stays in sight (ADR 0083)', () => {
    const hidden = (music: object) => restored({ versions: { bz1: music } }).versions.bz1?.hidden
    // A lead sheet: the tune's staff and the chord names, the piano out of sight.
    expect(hidden({ ...MUSIC, hidden: ['piano'] })).toEqual(['piano'])
    expect(hidden({ ...MUSIC, voices: ['D4/4'], hidden: ['melody', 'piano'] })).toEqual([
      'melody',
      'piano',
    ])
    // Never every staff: with no other in sight, the piano is shown.
    const { melody: _, ...pianoOnly } = MUSIC
    expect(hidden({ ...pianoOnly, hidden: ['piano', 'chords'] })).toEqual(['chords'])
    expect(hidden({ ...MUSIC, hidden: ['melody', 'piano'] })).toEqual(['melody'])
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

  it('keeps the music it holds as it was where another tab’s save leaves it so', () => {
    const storage = createMemoryStorage()
    const otherTabs = new EventTarget()
    const store = createPiecesStore({ storage, otherTabs })
    const savedElsewhere = (state: unknown) => {
      const newValue = JSON.stringify({ state, version: 1 })
      storage.setItem(PIECES_STORAGE_KEY, newValue)
      otherTabs.dispatchEvent(new StorageEvent('storage', { key: PIECES_STORAGE_KEY, newValue }))
    }
    savedElsewhere({ versions: { bz1: MUSIC }, songs: [SONG], nextSong: 2 })
    const { versions, songs } = store.getState()
    const other = { ...SONG, id: 'my-2', title: 'Evening' }
    savedElsewhere({ versions: { bz1: MUSIC }, songs: [SONG, other], nextSong: 3 })
    expect(store.getState().versions.bz1).toBe(versions.bz1)
    expect(store.getState().songs[0]).toBe(songs[0])
    expect(store.getState().songs[1]).toEqual(other)
  })
})
