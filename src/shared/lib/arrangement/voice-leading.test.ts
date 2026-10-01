import { describe, expect, it } from 'vitest'
import { midi, parseChordSymbol, pitchClass, spellChord } from '@/shared/lib/music'
import { inversionPitchClasses, voiceInversion } from './voice-leading'

const pcs = (symbol: string) => {
  const chord = parseChordSymbol(symbol)
  return inversionPitchClasses(spellChord(chord.root, chord.quality))
}

describe('inversionPitchClasses', () => {
  it('plays a chord of up to four notes whole, a bigger one rootless with its 9th first', () => {
    expect(pcs('C')).toEqual([0, 4, 7])
    expect(pcs('Dm7')).toEqual([2, 5, 9, 0])
    expect(pcs('Dm9')).toEqual([4, 5, 9, 0]) // E F A C
    expect(pcs('G13')).toEqual([9, 11, 5, 4]) // A B F E: root and 5th out
  })
})

const pc = (...classes: number[]) => classes.map(pitchClass)
const keys = (...midis: number[]) => midis.map(midi)

describe('voiceInversion', () => {
  it('stacks from the inversion’s note, its lowest from E3 to E4', () => {
    expect(voiceInversion(null, pc(0, 4, 7), 0)).toEqual([60, 64, 67]) // C4 E4 G4
    expect(voiceInversion(null, pc(0, 4, 7), 1)).toEqual([64, 67, 72]) // E4 G4 C5
    expect(voiceInversion(null, pc(0, 4, 7), 2)).toEqual([55, 60, 64]) // G3 C4 E4
  })

  it('gives a triad asked for its 3rd inversion its 2nd', () => {
    expect(voiceInversion(null, pc(0, 4, 7), 3)).toEqual([55, 60, 64])
  })

  it('lays a 9th chord from its 7th', () => {
    expect(voiceInversion(null, pc(4, 5, 9, 0), 3)).toEqual([60, 64, 65, 69]) // C E F A
  })

  it('takes the octave nearer the last chord when there are two', () => {
    expect(voiceInversion(keys(67, 71, 74), pc(4, 7, 11), 0)).toEqual([64, 67, 71]) // E4, not E3
    expect(voiceInversion(keys(53, 57, 60), pc(4, 7, 11), 0)).toEqual([52, 55, 59]) // E3, not E4
  })
})
