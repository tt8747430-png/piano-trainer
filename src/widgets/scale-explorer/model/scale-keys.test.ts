import { describe, expect, it } from 'vitest'
import {
  midi,
  note,
  placeScale,
  placeScaleChords,
  scaleFingering,
  spellScale,
} from '@/shared/lib/music'
import {
  chordKeyPlays,
  chordMarks,
  chordsHolding,
  chordsRange,
  heardName,
  scaleMarks,
} from './scale-keys'

const C = note('C')
const TRIADS = placeScaleChords(C, 'major', 3, 0)

describe('scaleMarks', () => {
  it('marks the tonic and the other degrees, with a hand’s fingers under them', () => {
    const marks = scaleMarks(placeScale(C, 'major'), scaleFingering(C, 'major', 'rh', 0))
    expect(marks.get(midi(60))).toEqual({ tone: 'tonic', label: '1', finger: 1 })
    expect(marks.get(midi(65))).toEqual({ tone: 'scale', label: '4', finger: 1 })
  })

  it('marks without fingers when none are asked for', () => {
    expect(scaleMarks(placeScale(C, 'major'), null).get(midi(62))).toEqual({
      tone: 'scale',
      label: '2',
    })
  })
})

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
  it('spells a note of the scale as the scale does, any other with a sharp', () => {
    const f = spellScale(note('F'), 'major')
    expect(heardName(midi(70), f)).toBe('B♭')
    expect(heardName(midi(66), f)).toBe('F#')
  })
})

describe('chordsRange', () => {
  it('spans every key the chords play, from the tonic to the top of the last chord', () => {
    expect(chordsRange(TRIADS)).toEqual({ from: 60, to: 77 })
    expect(chordsRange(placeScaleChords(C, 'major', 4, 0))).toEqual({ from: 60, to: 81 })
  })
})
