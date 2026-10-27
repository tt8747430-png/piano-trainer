import { describe, expect, it } from 'vitest'
import { pieceById, PIECES, type Piece } from '@/entities/piece'
import { testProgression, testSong } from '@/entities/piece/testing/test-pieces'
import { keySymbol, parseNumerals } from '@/shared/lib/music'
import { progressionPlaces, progressionsOf, songsWith } from './in-songs'

const piece = (id: string): Piece => {
  const found = pieceById(id)
  if (!found) throw new Error(id)
  return found
}
const numerals = (line: string) => parseNumerals(line) ?? []
/** Each place as its bars as printed, from 1, and its key: `1-4 G`. */
const places = (of: Piece, line: string, minor = false) =>
  progressionPlaces(of, numerals(line), minor).map(
    ({ bars, key }) => `${bars.first + 1}-${bars.last + 1} ${keySymbol(key)}`,
  )
const ids = (of: Piece) => progressionsOf(of).map(({ progression }) => progression.id)

describe('progressionPlaces', () => {
  it('finds Amazing Grace’s I–IV–I in G, in bars 1–4 and 9–12', () => {
    expect(places(piece('amazing'), 'I IV I')).toEqual(['1-4 G', '9-12 G'])
  })

  it('looks only in the key’s mode the line is written for', () => {
    expect(places(piece('amazing'), 'i iv i', true)).toEqual([])
    const minor = testSong(['Am Dm Am E'], { key: 'Am' })
    expect(places(minor, 'i iv i', true)).toEqual(['1-3 Am'])
    expect(places(minor, 'I IV I')).toEqual([])
  })

  it('reads a section written in a key of its own in that key', () => {
    const song = testSong([], {
      sections: [
        { kind: 'verse', lines: ['C F C G'] },
        { kind: 'chorus', key: 'D', lines: ['D G D A'] },
      ],
    })
    expect(places(song, 'I IV I')).toEqual(['1-3 C', '5-7 D'])
  })

  it('runs on over lines and sections, never over a key change or a bar of no chord', () => {
    expect(places(testSong(['C F', 'C G']), 'I IV I')).toEqual(['1-3 C'])
    expect(places(testSong(['C F _ C']), 'I IV I')).toEqual([])
    const changed = testSong([], {
      sections: [
        { kind: 'verse', lines: ['C F'] },
        { kind: 'chorus', key: 'F', lines: ['C'] },
      ],
    })
    expect(places(changed, 'I IV I')).toEqual([])
  })

  it('reads a song written in degrees in its key', () => {
    const song = testProgression('I:maj:4 IV:maj:4 I:maj:4 V:dom:4', { key: 'D' })
    expect(places(song, 'I IV I V')).toEqual(['1-4 D'])
  })

  it('loops the bars as the Player plays them, its repeats taken', () => {
    const song = testSong(['|: C G :| Am F C'])
    const [place] = progressionPlaces(song, numerals('I V vi IV'), false)
    // Written: C G Am F; played: C G C G Am F, so the place is played from its second pass.
    expect(place?.bars).toEqual({ first: 0, last: 3 })
    expect(place?.played).toEqual({ first: 2, last: 5 })
  })
})

describe('progressionsOf', () => {
  it('names Amazing Grace’s progressions, each not wholly inside a longer one there', () => {
    // I–IV–I–V in bars 1–7 holds the I–IV–I of bars 1–4, but not that of bars 9–12.
    expect(ids(piece('amazing'))).toEqual(['gospel-hymn', 'authentic', 'plagal'])
  })

  it('gives each the key it is found in first', () => {
    const [first] = progressionsOf(piece('amazing'))
    expect(first && keySymbol(first.key)).toBe('G')
  })

  it('names none for a song of no chord symbol', () => {
    expect(progressionsOf(testSong(['_ _ _ _']))).toEqual([])
  })
})

describe('songsWith', () => {
  it('lists the songs a progression is found in, each with its places', () => {
    const found = songsWith(PIECES, numerals('I IV I'), false)
    expect(found.map(({ piece }) => piece.id)).toContain('amazing')
    expect(found.every(({ places }) => places.length > 0)).toBe(true)
  })

  it('finds the catalog’s songs in their own keys', () => {
    const keys = new Set(
      songsWith(PIECES, numerals('I IV I'), false).flatMap(({ places }) =>
        places.map(({ key }) => keySymbol(key)),
      ),
    )
    expect(keys.size).toBeGreaterThan(1)
  })

  it('finds no song for a line of one chord', () => {
    expect(songsWith(PIECES, numerals('I'), false)).toEqual([])
  })
})
