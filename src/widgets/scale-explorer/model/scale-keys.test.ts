import { describe, expect, it } from 'vitest'
import { midi, note, placeScaleChords } from '@/shared/lib/music'
import { chordKeyPlays, chordMarks, chordsHolding, heardName } from './scale-keys'

const C = note('C')
const TRIADS = placeScaleChords(C, 'major', 3, 0)

describe('chordMarks', () => {
  it('puts each degree’s numeral over its chord on its key', () => {
    const marks = chordMarks(TRIADS)
    expect(marks.get(midi(60))).toEqual({ tone: 'tonic', label: 'C', caption: 'I' })
    expect(marks.get(midi(62))).toEqual({ tone: 'scale', label: 'Dm', caption: 'ii' })
    expect(marks.size).toBe(7)
  })
})

describe('chordKeyPlays', () => {
  it('plays a degree’s chord from its key, and any other key alone', () => {
    const plays = chordKeyPlays(TRIADS)
    expect(plays(midi(62))).toEqual([62, 65, 69])
    expect(plays(midi(61))).toEqual([61])
    expect(plays(midi(72))).toEqual([72])
  })
})

describe('chordsHolding', () => {
  it('finds the chords that hold a note, in any octave', () => {
    expect(chordsHolding(TRIADS, midi(64)).map((c) => c.numeral)).toEqual(['I', 'iii', 'vi'])
    expect(chordsHolding(TRIADS, midi(76)).map((c) => c.numeral)).toEqual(['I', 'iii', 'vi'])
  })

  it('finds none for a note outside the scale', () => {
    expect(chordsHolding(TRIADS, midi(61))).toEqual([])
  })
})

describe('heardName', () => {
  it('spells a note of the scale as the scale does, any other as its key does (spellInKey)', () => {
    expect(heardName(midi(70), note('F'), 'major')).toBe('B♭')
    expect(heardName(midi(66), note('F'), 'major')).toBe('G♭')
    expect(heardName(midi(66), note('G'), 'major')).toBe('F#')
    expect(heardName(midi(66), note('A'), 'harmonic')).toBe('F#')
  })
})
