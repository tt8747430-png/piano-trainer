import { describe, expect, it } from 'vitest'
import { createPiecesStore, readMusic, type PieceMusic } from '@/entities/piece'
import { createTakesStore, type Take } from '@/entities/take'
import { createMemoryStorage } from '@/shared/lib'
import { note } from '@/shared/lib/music'
import {
  chartStart,
  deleteSong,
  isScoreStaves,
  makeSong,
  resetVersion,
  saveMusic,
  setSongCredit,
  SINGLE_STAVES_MAX,
  syncRecording,
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

  it('saves the title with the music, an own song’s and a version’s alike (ADR 0114)', () => {
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
  it('starts a score of the staves chosen: the piano, its voices over it, or one voice alone: a lead sheet (ADR 0114, 0097)', () => {
    const key = { tonic: note('C'), minor: false }
    expect(chartStart(key, '4/4')).not.toHaveProperty('staves')
    // Voices named for themselves in their clefs, stacked as a choir is, whatever order chosen in.
    const choir = chartStart(key, '4/4', {
      staves: { piano: true, voices: ['bass', 'tenor', 'alto', 'soprano'] },
    })
    expect(choir.staves).toEqual([
      { name: { en: 'Soprano', ru: 'Сопрано' }, notes: 'r/4' },
      { name: { en: 'Alto', ru: 'Альт' }, notes: 'r/4' },
      { name: { en: 'Tenor', ru: 'Тенор' }, clef: 'treble-8vb', notes: 'r/4' },
      { name: { en: 'Bass', ru: 'Бас' }, clef: 'bass', notes: 'r/4' },
    ])
    expect(choir).not.toHaveProperty('leadSheet')
    expect(chartStart(key, '4/4', { staves: { piano: false, voices: ['voice'] } })).toMatchObject({
      staves: [{ name: { en: 'Voice' }, notes: 'r/4' }],
      leadSheet: true,
    })
  })

  it('reads a list of staves as a score only where it can be one', () => {
    expect(isScoreStaves({ piano: true, voices: [] })).toBe(true)
    expect(isScoreStaves({ piano: true, voices: ['soprano', 'alto', 'tenor', 'bass'] })).toBe(true)
    expect(isScoreStaves({ piano: true, voices: Array(SINGLE_STAVES_MAX + 1).fill('voice') })).toBe(
      false,
    )
    // Without the piano, one voice alone: a lead sheet (ADR 0114); never none.
    expect(isScoreStaves({ piano: false, voices: ['bass'] })).toBe(true)
    expect(isScoreStaves({ piano: false, voices: [] })).toBe(false)
    expect(isScoreStaves({ piano: false, voices: ['soprano', 'alto'] })).toBe(false)
  })

  it('starts at the tempo and with the bars asked, as Flat’s Fine-tune your setup', () => {
    const key = { tonic: note('C'), minor: false }
    const start = chartStart(key, '3/4', { tempo: 120, tempoUnit: '2', bars: 8 })
    expect(start).toMatchObject({ tempo: 120, tempoUnit: '2' })
    expect(start.sections[0]?.lines[0]?.split(' ')).toHaveLength(8)
    expect(start.hands?.rh?.split(' | ')).toHaveLength(8)
    // A quarter note's beat is no unit written.
    expect(chartStart(key, '4/4', { tempoUnit: '4' })).not.toHaveProperty('tempoUnit')
  })

  it('prints 4/4 as common time’s C and 2/2 as cut time’s ¢ where asked, no other meter', () => {
    const key = { tonic: note('C'), minor: false }
    expect(chartStart(key, '4/4', { timeSymbol: true })).toMatchObject({ timeSymbol: true })
    expect(chartStart(key, '2/2', { timeSymbol: true })).toMatchObject({ timeSymbol: true })
    expect(chartStart(key, '3/4', { timeSymbol: true })).not.toHaveProperty('timeSymbol')
    expect(chartStart(key, '4/4')).not.toHaveProperty('timeSymbol')
  })

  it('starts on a pickup bar of the beats asked, before the bars asked (A34)', () => {
    const key = { tonic: note('C'), minor: false }
    const song = chartStart(key, '4/4', { bars: 2, pickup: 1 })
    expect(song.sections[0]?.lines[0]?.split(' ')).toHaveLength(3)
    expect(song.sections[0]?.lines[0]).toMatch(/^\S*@1 /)
    expect(song.hands?.rh).toBe('r/1 | r/4 | r/4')
    expect(chartStart(key, '6/8', { bars: 1, pickup: 1 }).hands?.rh).toBe('r/1:3 | r/2')
  })

  it('makes a song’s score as its staves say, every staff there and readable though empty', () => {
    const store = fresh()
    const key = { tonic: note('C'), minor: false }
    const id = makeSong(store, {
      title: 'Hymn',
      key,
      meter: '6/8',
      staves: { piano: true, voices: ['voice'] },
    })
    const song = store.getState().songs.find((each) => each.id === id)
    expect(song?.staves).toHaveLength(1)
    expect(song).not.toHaveProperty('leadSheet')
    expect(() => readMusic(song!)).not.toThrow()
    expect(readMusic(song!).staves).toMatchObject([{ clef: 'treble', notes: [] }])
  })

  it('makes a song of four bars of no chord, as a notation app’s new score, under the next number (ADR 0114)', () => {
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

  it('starts a song empty: both hands written silent, so the editor opens on empty bars (ADR 0114)', () => {
    const key = { tonic: note('C'), minor: false }
    const silent = 'r/4 | r/4 | r/4 | r/4'
    expect(chartStart(key, '4/4')).toMatchObject({ hands: { rh: silent, lh: silent } })
    // In any meter, each bar's rest the bar's length, as an empty single staff is written.
    const waltz = chartStart(key, '3/4', { staves: { piano: true, voices: ['voice'] } })
    expect(waltz.hands?.rh).toBe(Array(4).fill(waltz.staves?.[0]?.notes).join(' | '))
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

describe('setSongCredit (R32-C)', () => {
  it('writes who wrote an own song into its score’s lines, and an empty line takes it away', () => {
    const store = fresh()
    const id = makeSong(store, {
      title: 'Morning',
      key: { tonic: note('G'), minor: false },
      meter: '3/4',
    })
    if (!id) throw new Error('made')
    setSongCredit(store, id, 'arranger', 'Mary Smith')
    expect(store.getState().songs[0]?.header).toEqual({ arranger: 'Mary Smith' })
    setSongCredit(store, id, 'arranger', '')
    expect(store.getState().songs[0]?.header).toEqual({})
  })
})

describe('syncRecording', () => {
  it('moves a song’s recording on a step within its range, and forgets it once in time', () => {
    const store = fresh()
    syncRecording(store, 'romashki', 24)
    expect(store.getState().recordingSync).toEqual({ romashki: 20 })
    syncRecording(store, 'romashki', -900)
    expect(store.getState().recordingSync).toEqual({ romashki: -500 })
    syncRecording(store, 'romashki', 0)
    expect(store.getState().recordingSync).toEqual({})
  })
})
