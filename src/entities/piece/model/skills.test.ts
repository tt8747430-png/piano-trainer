import { describe, expect, it } from 'vitest'
import { noteName } from '@/shared/lib/music'
import { testProgression, testSong } from '../testing/test-pieces'
import { chordsOfPiece, skillsOfPiece } from './skills'

describe('skillsOfPiece', () => {
  it('lists the chord qualities a chart uses, in table order', () => {
    expect(skillsOfPiece(testSong(['G7 C Am7 F G7']))).toEqual([
      'chord:maj',
      'chord:m7',
      'chord:d7',
    ])
  })

  it('reads a progression at its default chord size', () => {
    expect(skillsOfPiece(testProgression('ii:min:4 V:dom:4 I:maj:8'))).toEqual([
      'chord:maj7',
      'chord:m7',
      'chord:d7',
    ])
  })
})

describe('chordsOfPiece', () => {
  it('lists each chord once as written, in order, a slash chord by its own chord', () => {
    expect(
      chordsOfPiece(testSong(['C Am7 F G7 C/E Ab'])).map(
        ({ root, quality }) => `${noteName(root)} ${quality}`,
      ),
    ).toEqual(['C maj', 'A m7', 'F maj', 'G d7', 'A♭ maj'])
  })

  it('passes over a bar of no chord, and lists none for a song of none (ADR 0094)', () => {
    expect(chordsOfPiece(testSong(['C _ G7'])).map(({ root }) => noteName(root))).toEqual([
      'C',
      'G',
    ])
    expect(chordsOfPiece(testSong(['_ _']))).toEqual([])
    expect(skillsOfPiece(testSong(['_ _']))).toEqual([])
  })
})
