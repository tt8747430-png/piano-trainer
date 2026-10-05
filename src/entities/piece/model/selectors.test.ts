import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { PIECES } from '../content'
import {
  choosableChordSize,
  entriesInKey,
  entryById,
  isOwnKey,
  pieceById,
  piecesPlaying,
  selectHasVersion,
  selectOwnSong,
  selectVersion,
} from './selectors'

describe('lookups', () => {
  it('find a piece by id', () => {
    expect(pieceById('bz5')?.title).toBe('Мир, душа, храни')
  })

  it('find a listing only as an entry', () => {
    expect(pieceById('bz4')).toBeUndefined()
    expect(entryById('bz4')?.kind).toBe('listing')
  })

  it.each(['nope', 'constructor', ''])('find nothing for %j', (id) => {
    expect(entryById(id)).toBeUndefined()
    expect(pieceById(id)).toBeUndefined()
  })
})

describe('the learner’s pieces', () => {
  const music = {
    key: 'G',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['G'] }],
  } as const
  const state = {
    versions: { bz1: music, bz4: music, romashki: music, gone: music },
    songs: [{ ...music, id: 'my-1', title: 'Morning' }] as const,
  }

  it('find a version of a song, study or listing, never of one written in degrees or an unknown id', () => {
    expect(selectVersion(state, 'bz1')).toBe(music)
    expect(selectHasVersion(state, 'bz4')).toBe(true)
    expect(selectHasVersion(state, 'bz5')).toBe(false)
    expect(selectHasVersion(state, 'romashki')).toBe(false)
    expect(selectHasVersion(state, 'gone')).toBe(false)
    expect(selectHasVersion(state, 'constructor')).toBe(false)
  })

  it('find an own song by its id', () => {
    expect(selectOwnSong(state, 'my-1')?.title).toBe('Morning')
    expect(selectOwnSong(state, 'my-2')).toBeUndefined()
  })
})

describe('entriesInKey', () => {
  it('lists the songs, listings and studies written in a key, however their tonic is spelled', () => {
    const inG = entriesInKey({ tonic: note('G'), minor: false }).map((entry) => entry.id)
    expect(inG).toContain('bz5')
    expect(entriesInKey({ tonic: note('D', 1), minor: true }).map((entry) => entry.id)).toEqual([
      'bz7',
    ])
    expect(entriesInKey({ tonic: note('B'), minor: false })).toEqual([])
  })
})

describe('choosableChordSize', () => {
  it('is the own chord size of a piece written in degrees where the learner may change it, else null', () => {
    expect(choosableChordSize(piece('romashki'))).toBe('sevenths')
    expect(choosableChordSize(piece('bz5'))).toBeNull()
  })
})

describe('isOwnKey', () => {
  it('holds for the piece’s tonic, however it is spelled', () => {
    expect(isOwnKey(piece('bz5'), note('G'))).toBe(true)
    expect(isOwnKey(piece('bz5'), note('A'))).toBe(false)
  })
})

function piece(id: string) {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}

describe('piecesPlaying', () => {
  it('finds the pieces that play a pattern as their own or by a method their chart names', () => {
    const ids = (pattern: Parameters<typeof piecesPlaying>[0]) =>
      piecesPlaying(pattern).map((piece) => piece.id)
    expect(ids('pop8')).toContain('romashki')
    // Called to Play's songs play M1 and name the others by method code: `2` is M2.
    expect(ids('M2')).toContain('hgta')
    expect(PIECES.find((piece) => piece.id === 'hgta')?.pattern).toBe('M1')
    expect(piecesPlaying('pop8')).toBe(piecesPlaying('pop8'))
  })
})
