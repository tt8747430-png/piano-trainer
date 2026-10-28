import { describe, expect, it } from 'vitest'
import { chordSymbol, keySymbol } from '@/shared/lib/music'
import { PIECES } from '../content'
import { testSong } from '../testing/test-pieces'
import { factsOf } from './facts'

describe('factsOf', () => {
  it('names each chord a song writes once, in the order it first comes, over any bass', () => {
    const { chords } = factsOf(testSong(['C C/E F G7', 'C F G7 C']))
    expect(chords.map(chordSymbol)).toEqual(['C', 'F', 'G7'])
  })

  it('reads its chords in stretches, each in its key, a bar of no chord ending one', () => {
    const { stretches } = factsOf(testSong(['C F _ G7 C']))
    expect(stretches.map((stretch) => stretch.chords.map(chordSymbol))).toEqual([
      ['C', 'F'],
      ['G7', 'C'],
    ])
    expect(stretches.map((stretch) => keySymbol(stretch.key))).toEqual(['C', 'C'])
    expect(stretches[1]?.bars).toEqual([3, 4])
  })

  it('gives the written bars in the order they are played', () => {
    expect(factsOf(testSong(['C F G C'])).order).toEqual([0, 1, 2, 3])
  })

  it('gives the built-in patterns a song plays', () => {
    const song = testSong(['C F G C'])
    expect(factsOf(song).patterns).toEqual([song.pattern])
  })

  it('works a piece out once, so a list reading it again reads the same object', () => {
    const song = testSong(['C F G C'])
    expect(factsOf(song)).toBe(factsOf(song))
  })

  it('reads every piece of the catalog', () => {
    for (const piece of PIECES) expect(factsOf(piece).order.length).toBeGreaterThan(0)
  })
})
