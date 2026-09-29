import { describe, expect, it } from 'vitest'
import { midi, note, noteName, type IntervalName, type SpelledNote } from '@/shared/lib/music'
import { intervalExample, intervalRoot, tonesText } from './interval-example'

const written = (root: SpelledNote, name: IntervalName) =>
  intervalExample(root, name).music.notes.map((n) => [n.midi, noteName(n.spelled), n.startTick])

describe('intervalExample', () => {
  it('puts the lower note on the root in octave 4 and the upper its semitones above', () => {
    const third = intervalExample(note('C'), 'm3')
    expect([third.low, third.high]).toEqual([60, 63])
    expect(third.shown.keys).toEqual([60, 63])
    expect(third.shown.marks.get(midi(60))).toEqual({ tone: 'tonic', label: '1' })
    expect(third.shown.marks.get(midi(63))).toEqual({ tone: 'scale', label: '♭3' })
  })

  it('writes the two notes as half notes in one bar, the upper spelled by letters', () => {
    expect(written(note('C'), 'm3')).toEqual([
      [60, 'C', 0],
      [63, 'E♭', 24],
    ])
    expect(written(note('D', -1), 'm2')).toEqual([
      [61, 'D♭', 0],
      [62, 'E𝄫', 24],
    ])
    expect(written(note('D', -1), 'm3')[1]).toEqual([64, 'F♭', 24])
    expect(written(note('F'), 'A4')[1]).toEqual([71, 'B', 24])
  })

  it('shows a unison’s one key as the tonic', () => {
    const unison = intervalExample(note('C'), 'r')
    expect(unison.shown.keys).toEqual([60])
    expect(unison.shown.marks.get(midi(60))).toEqual({ tone: 'tonic', label: '1' })
  })

  it('reaches past the octave for a compound interval', () => {
    const thirteenth = intervalExample(note('C'), 'M13')
    expect(thirteenth.high).toBe(81)
    expect(thirteenth.shown.marks.get(midi(81))?.label).toBe('13')
  })
})

describe('intervalRoot', () => {
  it('shows the root alone, as the tonic', () => {
    expect(intervalRoot(note('B')).keys).toEqual([71])
  })
})

describe('tonesText', () => {
  it('writes whole tones with a half as ½', () => {
    expect([0, 1, 3, 4, 21].map(tonesText)).toEqual(['0', '½', '1½', '2', '10½'])
  })
})
