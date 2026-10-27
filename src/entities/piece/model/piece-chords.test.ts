import { describe, expect, it } from 'vitest'
import { testProgression, testSong } from '../testing/test-pieces'
import { pieceChords } from './piece-chords'
import { defineListing } from './types'

describe('pieceChords', () => {
  it('lists a chart’s chord symbols as it writes them, in the order they first come, the first four', () => {
    expect(pieceChords(testSong(['G Cm Fm Eb', 'G Cm Ab Bb']))).toEqual(['G', 'Cm', 'Fm', 'E♭'])
  })

  it('lists each chord once, a slash chord as its chord over any bass', () => {
    expect(pieceChords(testSong(['C Am-C F G7 C/E C D/F#']), 8)).toEqual([
      'C',
      'Am',
      'F',
      'G7',
      'D',
    ])
    const song = testSong(['C Am F G7 C/E'])
    expect(pieceChords(song, 2)).toEqual(['C', 'Am'])
    expect(pieceChords(song)).toEqual(['C', 'Am', 'F', 'G7'])
  })

  it('reads a song written in degrees in its key, at its chord size', () => {
    expect(pieceChords(testProgression('ii:min:4 V:dom:4 I:maj:8', { key: 'F' }))).toEqual([
      'Gm7',
      'C7',
      'FMaj7',
    ])
  })

  it('lists none for a song of no chord symbol (ADR 0114) or a listing', () => {
    expect(pieceChords(testSong(['_ _']))).toEqual([])
    expect(pieceChords(testSong(['C _ G7']))).toEqual(['C', 'G7'])
    expect(
      pieceChords(defineListing({ id: 'list', title: 'To come', key: 'C', meter: '4/4' })),
    ).toEqual([])
  })
})
