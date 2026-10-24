import { describe, expect, it } from 'vitest'
import { createPiecesStore, readMusic, type PieceMusic } from '@/entities/piece'
import { createTakesStore, type Take } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { note } from '@/shared/lib/music'
import {
  chartStart,
  deleteSong,
  makeSong,
  resetVersion,
  saveMusic,
  SCORE_TEMPLATES,
  templateOf,
} from './index'

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

  it('saves the title with the music, an own song’s and a version’s alike (ADR 0094)', () => {
    const store = fresh()
    const id = makeSong(store, {
      title: 'Morning',
      key: { tonic: note('G'), minor: false },
      meter: '3/4',
    })
    if (!id) throw new Error('made')
    saveMusic(store, { kind: 'song', id }, { ...CHANGED, title: 'Evening' })
    expect(store.getState().songs).toEqual([{ id, ...CHANGED, title: 'Evening' }])
    // A version whose title alone changed is a version; Reset takes it away with the music.
    const target = { kind: 'version', id: 'amazing', original: ORIGINAL } as const
    saveMusic(store, target, { ...ORIGINAL, title: 'Grace' })
    expect(store.getState().versions).toEqual({ amazing: { ...ORIGINAL, title: 'Grace' } })
    resetVersion(store, 'amazing')
    expect(store.getState().versions).toEqual({})
  })
})

describe('the learner’s songs', () => {
  it('names the template a setup is, and none for rows no template has', () => {
    expect(templateOf(SCORE_TEMPLATES.leadSheet)).toBe('leadSheet')
    expect(templateOf({ chordNames: false, melody: false, piano: true })).toBe('piano')
    expect(templateOf({ chordNames: true, melody: true, piano: true })).toBe('pianoAndMelody')
    expect(templateOf({ chordNames: false, melody: true, piano: true })).toBeUndefined()
  })

  it('starts a lead sheet: the tune’s staff and the chord names, the piano hidden (ADR 0083)', () => {
    const key = { tonic: note('C'), minor: false }
    expect(chartStart(key, '4/4', SCORE_TEMPLATES.leadSheet)).toMatchObject({
      melody: expect.any(String),
      hidden: ['piano'],
    })
    // Never every staff: with no tune, the piano stays.
    expect(
      chartStart(key, '4/4', { chordNames: true, melody: false, piano: false }),
    ).not.toHaveProperty('hidden')
  })

  it('makes a song’s score as its setup says, every staff there and readable though empty', () => {
    const store = fresh()
    const key = { tonic: note('C'), minor: false }
    const setup = { chordNames: false, melody: true, piano: true } as const
    const id = makeSong(store, { title: 'Hymn', key, meter: '6/8', setup })
    const song = store.getState().songs.find((each) => each.id === id)
    expect(song).toMatchObject({ melody: expect.any(String), hidden: ['chords'] })
    expect(() => readMusic(song!)).not.toThrow()
    expect(readMusic(song!).melody).toEqual([])
  })

  it('makes a song of four bars of no chord, as a notation app’s new score, under the next number (ADR 0094)', () => {
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
          sections: [{ kind: 'verse', lines: ['_ _ _ _'] }],
        },
      ],
      nextSong: 2,
    })
  })

  it('starts a song empty: both hands written silent, so the editor opens on empty bars (ADR 0091)', () => {
    const key = { tonic: note('C'), minor: false }
    const silent = 'r/4 | r/4 | r/4 | r/4'
    expect(chartStart(key, '4/4')).toMatchObject({ hands: { rh: silent, lh: silent } })
    // In any meter, each bar's rest the bar's length, as the tune's empty staff is written.
    const waltz = chartStart(key, '3/4', SCORE_TEMPLATES.pianoAndMelody)
    expect(waltz.hands?.rh).toBe(Array(4).fill(waltz.melody).join(' | '))
    const { chart } = readMusic(waltz)
    expect(chart.sections[0]?.lines[0]?.every((bar) => bar.hands?.rh?.length === 0)).toBe(true)
  })

  it('makes nothing without a title', () => {
    const store = fresh()
    expect(
      makeSong(store, { title: '   ', key: { tonic: note('C'), minor: false }, meter: '4/4' }),
    ).toBeNull()
    expect(store.getState().songs).toEqual([])
  })

  it('deletes a song without giving its number again', () => {
    const store = fresh()
    const key = { tonic: note('C'), minor: false }
    const first = makeSong(store, { title: 'One', key, meter: '4/4' })
    if (!first) throw new Error('made')
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
      fromBar: 1,
      length: 0,
      notes: [],
      pedals: [],
      bars: [0, 2667],
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
