import { describe, expect, it } from 'vitest'
import { chordSymbol } from '@/shared/lib/music'
import { chartOf } from './chart'
import { musicOf, type PieceMusic } from './music'
import { repertoire, versionOf } from './repertoire'
import { testSong } from '../testing/test-pieces'
import { entryById, pieceById } from './selectors'
import { isPiece, type ChartPiece, type Piece } from './types'
import type { OwnSong } from './own'

const chartPiece = (id: string): ChartPiece => {
  const piece = pieceById(id)
  if (!piece || piece.kind === 'progression') throw new Error(`${id} is no chart piece`)
  return piece
}
const firstChord = (piece: Piece | undefined) => {
  if (!piece) return undefined
  const [bar] = chartOf(piece).sections[0]?.lines[0] ?? []
  return bar?.chords[0] ? chordSymbol(bar.chords[0]) : undefined
}
const VERSION: PieceMusic = {
  ...musicOf(chartPiece('bz1')),
  sections: [{ kind: 'verse', lines: ['Em A'] }],
}
const SONG: OwnSong = {
  id: 'my-1',
  title: 'Morning',
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [{ kind: 'verse', lines: ['G C D G'] }],
}

describe('repertoire', () => {
  it('gives the catalog’s pieces as they are, with no version', () => {
    const pieces = repertoire({ versions: {}, songs: [] })
    expect(pieces.piece('bz1')).toBe(pieceById('bz1'))
    expect(pieces.hasVersion('bz1')).toBe(false)
    expect(pieces.ownSongs).toEqual([])
  })

  it('plays a song in the learner’s version, keeping its title, credits and source', () => {
    const pieces = repertoire({ versions: { bz1: VERSION }, songs: [] })
    const version = pieces.piece('bz1')
    expect(firstChord(version)).toBe('Em')
    expect(version).toMatchObject({ id: 'bz1', kind: 'song', title: 'Боже, спасибо' })
    expect(version?.kind !== 'progression' && version?.credits).toEqual(chartPiece('bz1').credits)
    expect(pieces.hasVersion('bz1')).toBe(true)
    expect(pieces.original('bz1')).toBe(entryById('bz1'))
  })

  it('makes a listing with a version a song that plays', () => {
    const listing = entryById('bz4')
    expect(listing && isPiece(listing)).toBe(false)
    const pieces = repertoire({
      versions: {
        bz4: {
          ...VERSION,
          key: 'Cm',
          meter: '3/4',
          sections: [{ kind: 'verse', lines: ['Cm Fm'] }],
        },
      },
      songs: [],
    })
    expect(pieces.piece('bz4')).toMatchObject({
      id: 'bz4',
      kind: 'song',
      title: 'Как лань желает',
      key: 'Cm',
    })
    expect(pieces.entry('bz4')?.kind).toBe('song')
  })

  it('leaves a progression and an unknown id as they are', () => {
    const pieces = repertoire({ versions: { twofive: VERSION, gone: VERSION }, songs: [] })
    expect(pieces.piece('twofive')).toBe(pieceById('twofive'))
    expect(pieces.hasVersion('twofive')).toBe(false)
    expect(pieces.piece('gone')).toBeUndefined()
    expect(pieces.hasVersion('gone')).toBe(false)
  })

  it('gives the learner’s own songs, in the order made', () => {
    const pieces = repertoire({
      versions: {},
      songs: [SONG, { ...SONG, id: 'my-2', title: 'Evening' }],
    })
    expect(pieces.piece('my-1')).toMatchObject({
      id: 'my-1',
      kind: 'song',
      title: 'Morning',
      key: 'G',
    })
    expect(pieces.ownSongs.map((song) => song.title)).toEqual(['Morning', 'Evening'])
    expect(pieces.original('my-1')).toBeUndefined()
  })
})

describe('versionOf', () => {
  const RECORDING = { src: 'voice.m4a', start: 1, tempo: 72 }
  const sung = testSong(['Am Dm', 'E Am'], { key: 'Am', recording: RECORDING })

  it('keeps the recording while the version keeps the key, the meter and every bar’s length', () => {
    const music = {
      ...musicOf(sung),
      tempo: 80,
      sections: [{ kind: 'verse' as const, lines: ['Am F', 'E7 Am'] }],
    }
    expect(versionOf(sung, music).recording).toEqual(RECORDING)
  })

  it('drops it when a bar is added, the key moves or a bar changes length', () => {
    const own = musicOf(sung)
    const longer = { ...own, sections: [{ kind: 'verse' as const, lines: ['Am Dm', 'E Am Am'] }] }
    const shorter = { ...own, sections: [{ kind: 'verse' as const, lines: ['Am@2 Dm', 'E Am'] }] }
    for (const music of [longer, shorter, { ...own, key: 'Bm' as const }]) {
      expect(versionOf(sung, music).recording).toBeUndefined()
    }
  })
})
