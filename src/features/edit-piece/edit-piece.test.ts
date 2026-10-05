import { describe, expect, it } from 'vitest'
import { createPiecesStore, type PieceMusic } from '@/entities/piece'
import { createTakesStore, type Take } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { note } from '@/shared/lib/music'
import { chartStart, deleteSong, makeSong, renameSong, resetVersion, saveMusic } from './index'

const fresh = () =>
  createPiecesStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const freshTakes = () =>
  createTakesStore({ storage: createMemoryStorage(), otherTabs: new EventTarget() })
const ORIGINAL: PieceMusic = {
  key: 'G',
  meter: '3/4',
  tempo: 80,
  pattern: 'r2',
  sections: [{ kind: 'verse', lines: ['G G7 C G'] }],
}
const CHANGED: PieceMusic = { ...ORIGINAL, sections: [{ kind: 'verse', lines: ['G Em C D'] }] }

describe('saveMusic', () => {
  it('saves a version, and removes it once it is the original again', () => {
    const store = fresh()
    saveMusic(store, { kind: 'version', id: 'amazing', original: ORIGINAL }, CHANGED)
    expect(store.getState().versions).toEqual({ amazing: CHANGED })
    saveMusic(store, { kind: 'version', id: 'amazing', original: ORIGINAL }, { ...ORIGINAL })
    expect(store.getState().versions).toEqual({})
  })

  it('keeps a listing’s chart once it is more than the chart it starts from', () => {
    const store = fresh()
    const start = chartStart({ tonic: note('C'), minor: true }, '3/4')
    saveMusic(store, { kind: 'version', id: 'bz4', original: start }, ORIGINAL)
    expect(store.getState().versions).toEqual({ bz4: ORIGINAL })
    saveMusic(store, { kind: 'version', id: 'bz4', original: start }, start)
    expect(store.getState().versions).toEqual({})
  })

  it('replaces an own song’s music, keeping its id and title', () => {
    const store = fresh()
    const id = makeSong(store, {
      title: 'Morning',
      key: { tonic: note('G'), minor: false },
      meter: '3/4',
    })
    if (!id) throw new Error('made')
    saveMusic(store, { kind: 'song', id }, CHANGED)
    expect(store.getState().songs).toEqual([{ id, title: 'Morning', ...CHANGED }])
  })
})

describe('the learner’s songs', () => {
  it('makes a song of four bars of its key’s tonic chord, under the next number', () => {
    const store = fresh()
    const minor = { tonic: note('E', -1), minor: true }
    expect(makeSong(store, { title: '  Evening  ', key: minor, meter: '6/8' })).toBe('my-1')
    expect(store.getState()).toMatchObject({
      songs: [
        {
          id: 'my-1',
          title: 'Evening',
          key: 'Ebm',
          meter: '6/8',
          tempo: 90,
          pattern: 'r1',
          sections: [{ kind: 'verse', lines: ['E♭m E♭m E♭m E♭m'] }],
        },
      ],
      nextSong: 2,
    })
  })

  it('makes nothing without a title', () => {
    const store = fresh()
    expect(
      makeSong(store, { title: '   ', key: { tonic: note('C'), minor: false }, meter: '4/4' }),
    ).toBeNull()
    expect(store.getState().songs).toEqual([])
  })

  it('renames a song, and deletes it without giving its number again', () => {
    const store = fresh()
    const key = { tonic: note('C'), minor: false }
    const first = makeSong(store, { title: 'One', key, meter: '4/4' })
    if (!first) throw new Error('made')
    renameSong(store, first, ' Two ')
    expect(store.getState().songs[0]?.title).toBe('Two')
    renameSong(store, first, '')
    expect(store.getState().songs[0]?.title).toBe('Two')
    deleteSong(store, freshTakes(), first)
    expect(store.getState().songs).toEqual([])
    expect(makeSong(store, { title: 'Three', key, meter: '4/4' })).toBe('my-2')
  })

  it('deletes a song’s takes with it, and no other piece’s', () => {
    const store = fresh()
    const takes = freshTakes()
    const song = makeSong(store, {
      title: 'One',
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
    })
    if (!song) throw new Error('made')
    const take = (id: Take['id'], pieceId: string): Take => ({
      id,
      pieceId,
      made: 0,
      tempo: 90,
      meter: '4/4',
      length: 0,
      notes: [],
      pedal: [],
    })
    takes.setState({ takes: [take('take-1', song), take('take-2', 'bz1')], nextTake: 3 })
    deleteSong(store, takes, song)
    expect(takes.getState().takes.map((each) => each.id)).toEqual(['take-2'])
  })
})

describe('resetVersion', () => {
  it('takes the learner’s version away', () => {
    const store = fresh()
    saveMusic(store, { kind: 'version', id: 'amazing', original: ORIGINAL }, CHANGED)
    resetVersion(store, 'amazing')
    expect(store.getState().versions).toEqual({})
  })
})
