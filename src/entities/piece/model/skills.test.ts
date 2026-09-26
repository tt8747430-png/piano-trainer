import { describe, expect, it } from 'vitest'
import { testProgression, testSong } from '../testing/test-pieces'
import { chordRootsOfPiece, skillsOfPiece } from './skills'

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

describe('chordRootsOfPiece', () => {
  it('lists each chord root once, lowest pitch class first', () => {
    expect(chordRootsOfPiece(testSong(['C Am7 F G7 C/E']))).toEqual([0, 5, 7, 9])
  })
})
