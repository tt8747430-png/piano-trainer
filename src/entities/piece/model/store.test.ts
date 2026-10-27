// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createMemoryStorage } from '@/shared/lib'
import type { PieceMusic } from './music'
import { createPiecesStore, PIECES_STORAGE_KEY, PIECES_VERSION } from './store'

const restored = (state: unknown, version = PIECES_VERSION) => {
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
  staves: [{ notes: 'B4/4' }],
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
      version: PIECES_VERSION,
    })
  })

  it('restores what was saved', () => {
    const saved = { versions: { bz1: MUSIC }, songs: [SONG], nextSong: 2 }
    expect(restored(saved)).toEqual(saved)
  })

  it('keeps 4/4 printed as common time, and reads anything else there as its figures (ADR 0114)', () => {
    const common = {
      ...MUSIC,
      meter: '4/4',
      sections: [{ kind: 'verse', lines: ['C'] }],
      staves: [{ notes: 'C4/4' }],
      hands: { lh: 'C3/4' },
    }
    expect(
      restored({ versions: { bz1: { ...common, commonTime: true } } }).versions.bz1?.commonTime,
    ).toBe(true)
    expect(
      restored({ versions: { bz1: { ...common, commonTime: 'yes' } } }).versions.bz1,
    ).not.toHaveProperty('commonTime')
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

  it('keeps a section’s own meter, and drops music whose section is counted in another kind (ADR 0095)', () => {
    const changing = {
      ...MUSIC,
      sections: [
        { kind: 'verse', lines: ['Bm'] },
        { kind: 'chorus', meter: '6/8', lines: ['G A'] },
        { kind: 'ending', meter: '7/8', lines: ['Bm'] },
      ],
      hands: { lh: 'B2/4 | - | - | -' },
    }
    const sections = restored({ versions: { bz1: changing } }).versions.bz1?.sections
    expect(sections?.map((section) => section.meter)).toEqual([undefined, '6/8', undefined])
    const simple = { ...changing, sections: [{ kind: 'verse', meter: '3/4', lines: ['Bm'] }] }
    expect(restored({ versions: { bz1: simple } }).versions).toEqual({})
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
      bz3: { ...MUSIC, staves: [{ notes: 'Q4/1' }] },
      bz4: { ...MUSIC, staves: [{ notes: 'B4/4' }, { name: 'Two' }] },
      bz7: { ...MUSIC, staves: 'B4/4' },
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

  it('reads a save of its own version alone: one with voices or instruments is another shape (ADR 0091)', () => {
    const sung = { ...MUSIC, voices: ['D4/4'], instruments: ['flute', 'cello'] }
    const kept = restored({ versions: { bz1: sung } }).versions.bz1
    expect(kept).toBeDefined()
    expect(kept).not.toHaveProperty('voices')
    expect(kept).not.toHaveProperty('instruments')
  })

  it('keeps each single staff with its name and clef, top down (ADR 0097)', () => {
    const named = {
      ...MUSIC,
      staves: [
        { name: 'Voice', notes: 'B4/4' },
        { name: { en: 'Cello', ru: 'Виолончель' }, clef: 'bass', notes: 'B2/4' },
        { name: '   ', clef: 'alto', notes: 'r/4' },
        { name: `  ${'Flute'.repeat(10)}  `, notes: 'r/4' },
      ],
    }
    expect(restored({ versions: { bz1: named } }).versions.bz1?.staves).toEqual([
      { name: 'Voice', notes: 'B4/4' },
      { name: { en: 'Cello', ru: 'Виолончель' }, clef: 'bass', notes: 'B2/4' },
      { notes: 'r/4' },
      // A name as the editor keeps one: trimmed, at most its letters.
      { name: 'Flute'.repeat(8), notes: 'r/4' },
    ])
  })

  it('keeps a lead sheet only where the score has a single staff (ADR 0083, 0094, 0097)', () => {
    const read = (music: object) => restored({ versions: { bz1: music } }).versions.bz1
    // A lead sheet: the single staves and the chord symbols, the piano out of sight.
    expect(read({ ...MUSIC, leadSheet: true })).toEqual({ ...MUSIC, leadSheet: true })
    // Never every staff: with no other, the piano is shown.
    const { staves: _, ...pianoOnly } = MUSIC
    expect(read({ ...pianoOnly, leadSheet: true })).toEqual(pianoOnly)
    expect(read({ ...MUSIC, staves: [], leadSheet: true })).toEqual(pianoOnly)
    expect(read({ ...MUSIC, leadSheet: 'yes' })).toEqual(MUSIC)
  })

  it('keeps the words that read on the staff they are on, and drops a verse longer than it (ADR 0093)', () => {
    const staves = [{ notes: 'B4/2 A4/2' }]
    const sung = { ...MUSIC, staves, lyrics: ['one two', 'eins'] }
    expect(restored({ versions: { bz1: sung } }).versions.bz1?.lyrics).toEqual(['one two', 'eins'])
    const long = { ...sung, lyrics: ['one two three'] }
    expect(restored({ versions: { bz1: long } }).versions.bz1).toEqual({ ...MUSIC, staves })
    expect(restored({ versions: { bz1: { ...sung, lyrics: 'one two' } } }).versions.bz1).toEqual({
      ...MUSIC,
      staves,
    })
    // On the second staff, by its place.
    const second = {
      ...MUSIC,
      staves: [...MUSIC.staves!, ...staves],
      lyrics: ['one two'],
      lyricsOn: 1,
    }
    expect(restored({ versions: { bz1: second } }).versions.bz1).toEqual(second)
    // On a staff the music has not: the words are read on the top one.
    const lost = { ...sung, lyrics: ['one'], lyricsOn: 3 }
    expect(restored({ versions: { bz1: lost } }).versions.bz1).toEqual({
      ...MUSIC,
      staves,
      lyrics: ['one'],
    })
  })

  it('keeps lyrics on the upper staff of a piece with a single staff, read on its notes (ADR 0093)', () => {
    const hands = { rh: 'B4/2 A4/2 | - | - | -', lh: 'B2/4 | - | - | -' }
    const upper = { ...MUSIC, hands, lyrics: ['one two'], lyricsOn: 'rh' }
    expect(restored({ versions: { bz1: upper } }).versions.bz1).toEqual(upper)
    // Too long for the upper staff's notes: the words go, as a verse longer than its tune does.
    const long = { ...upper, lyrics: ['one two three'] }
    expect(restored({ versions: { bz1: long } }).versions.bz1).toEqual({ ...MUSIC, hands })
    // On the top single staff, where a piece with one has them, is not written.
    const tuned = { ...MUSIC, lyrics: ['one'], lyricsOn: 0 }
    expect(restored({ versions: { bz1: tuned } }).versions.bz1).toEqual({
      ...MUSIC,
      lyrics: ['one'],
    })
  })

  it('keeps a version’s own title of 1 to 80 characters, trimmed, and drops another (ADR 0094)', () => {
    const versions = {
      bz1: { ...MUSIC, title: '  Thanks  ' },
      bz2: { ...MUSIC, title: '   ' },
      bz3: { ...MUSIC, title: 'x'.repeat(81) },
      bz5: { ...MUSIC, title: 5 },
    }
    const read = restored({ versions }).versions
    expect(read.bz1).toEqual({ ...MUSIC, title: 'Thanks' })
    for (const id of ['bz2', 'bz3', 'bz5']) expect(read[id]).toEqual(MUSIC)
  })

  it('drops a single staff longer than its chart', () => {
    const versions = { bz1: { ...MUSIC, staves: [{ notes: 'B4/4' }, { notes: 'B4/16 B4/1' }] } }
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
      version: PIECES_VERSION,
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
      const newValue = JSON.stringify({ state, version: PIECES_VERSION })
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
