import { describe, expect, it } from 'vitest'
import { midi, note, placeChord, placeScale, spellChord } from '@/shared/lib/music'
import { chordShown, scaleShown } from './marks'

describe('chordShown', () => {
  it('shows a chord’s keys, each by its role and degree', () => {
    const { rh } = placeChord(spellChord(note('C'), 'd7'), { inversion: 0, bothHands: false })
    const shown = chordShown(rh)
    expect(shown.keys).toEqual([midi(60), midi(64), midi(67), midi(70)])
    expect(shown.marks.get(midi(60))).toEqual({ tone: 'root', label: '1', note: 'C' })
    expect(shown.marks.get(midi(70))).toEqual({ tone: '7th', label: '♭7', note: 'B♭' })
  })
})

describe('scaleShown', () => {
  it('shows a scale’s keys, the tonic in its own colour, each with its degree', () => {
    const shown = scaleShown(placeScale(note('D'), 'dorian'))
    expect(shown.keys).toHaveLength(8)
    expect(shown.marks.get(midi(62))).toEqual({ tone: 'tonic', label: '1', note: 'D' })
    expect(shown.marks.get(midi(65))).toEqual({ tone: 'scale', label: '♭3', note: 'F' })
  })
})
