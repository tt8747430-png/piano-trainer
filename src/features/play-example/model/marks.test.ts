import { describe, expect, it } from 'vitest'
import {
  midi,
  note,
  placeChord,
  placeScale,
  placeScaleChords,
  spellChord,
} from '@/shared/lib/music'
import { chordShown, chordsRange, scaleShown } from './marks'

describe('chordShown', () => {
  it('shows a chord’s keys, each by its role and degree', () => {
    const { rh } = placeChord(spellChord(note('C'), 'd7'), { inversion: 0, bothHands: false })
    const shown = chordShown(rh)
    expect(shown.keys).toEqual([midi(60), midi(64), midi(67), midi(70)])
    expect(shown.marks.get(midi(60))).toEqual({ tone: 'root', label: '1' })
    expect(shown.marks.get(midi(70))).toEqual({ tone: '7th', label: '♭7' })
  })
})

describe('scaleShown', () => {
  it('shows a scale’s keys, the tonic in its own colour, each with its degree', () => {
    const shown = scaleShown(placeScale(note('D'), 'dorian'))
    expect(shown.keys).toHaveLength(8)
    expect(shown.marks.get(midi(62))).toEqual({ tone: 'tonic', label: '1' })
    expect(shown.marks.get(midi(65))).toEqual({ tone: 'scale', label: '♭3' })
  })

  it('puts a hand’s finger on each key where it has one', () => {
    const shown = scaleShown(placeScale(note('C'), 'major'), [1, 2, 3, 1, 2, 3, 4, 5])
    expect(shown.marks.get(midi(65))).toMatchObject({ label: '4', finger: 1 })
  })
})

describe('chordsRange', () => {
  it('spans every key the chords play, from the tonic to the top of the last chord', () => {
    expect(chordsRange(placeScaleChords(note('C'), 'major', 3, 0))).toEqual({ from: 60, to: 77 })
    expect(chordsRange(placeScaleChords(note('C'), 'major', 4, 0))).toEqual({ from: 60, to: 81 })
  })
})
