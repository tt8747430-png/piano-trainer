import { describe, expect, it } from 'vitest'
import { chordSymbol, readChordSymbol } from '@/shared/lib/music'
import { bassesOf, wizardChord, wizardOf } from './chord-wizard'

describe('the chord wizard', () => {
  it('builds a chord from its root, its quality and its bass, as Flat’s wizard does', () => {
    const minor7 = { letter: 'D', accidental: 0, quality: 'm7', inversion: 0 } as const
    expect(chordSymbol(wizardChord(minor7))).toBe('Dm7')
    expect(chordSymbol(wizardChord({ ...minor7, accidental: 1 }))).toBe('D#m7')
    // An inversion puts a chord tone in the bass, spelled as the chord spells it.
    expect(chordSymbol(wizardChord({ ...minor7, letter: 'A', inversion: 1 }))).toBe('Am7/C')
    expect(
      chordSymbol(
        wizardChord({ ...minor7, letter: 'E', accidental: -1, quality: 'maj', inversion: 2 }),
      ),
    ).toBe('E♭/B♭')
  })

  it('offers each tone of the chord but the root as a bass: two for a triad, three for a seventh', () => {
    expect(bassesOf({ letter: 'C', accidental: 0, quality: 'maj' }).map((n) => n.letter)).toEqual([
      'E',
      'G',
    ])
    expect(bassesOf({ letter: 'G', accidental: 0, quality: 'd7' }).map((n) => n.letter)).toEqual([
      'B',
      'D',
      'F',
    ])
  })

  it('reads what is typed back into its choices, else starts on C major', () => {
    expect(wizardOf(readChordSymbol('F#m7/A'))).toEqual({
      letter: 'F',
      accidental: 1,
      quality: 'm7',
      inversion: 1,
    })
    expect(wizardOf(readChordSymbol('Bb'))).toEqual({
      letter: 'B',
      accidental: -1,
      quality: 'maj',
      inversion: 0,
    })
    expect(wizardOf(null)).toEqual({ letter: 'C', accidental: 0, quality: 'maj', inversion: 0 })
  })
})
