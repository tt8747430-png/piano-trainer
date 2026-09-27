import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { separateVoices, type BarChord } from './voices'

const chord = (
  hand: BarChord['hand'],
  start: number,
  end: number,
  ...keys: number[]
): BarChord => ({
  hand,
  start,
  end,
  rolled: false,
  notes: keys.map((key) => ({
    midi: midi(key),
    spelled: note('C'),
    tiedFrom: false,
    tiedTo: false,
  })),
})
const starts = (voice: { chords: readonly BarChord[] }) => voice.chords.map((c) => [c.start, c.end])

describe('separateVoices', () => {
  it('keeps a hand’s chords that follow each other in one voice', () => {
    const voices = separateVoices([chord('rh', 0, 12, 60), chord('rh', 12, 48, 64)])
    expect(voices).toHaveLength(1)
    expect(voices[0]?.stem).toBe('auto')
  })

  it('opens a second voice for a held note, the higher voice’s stems up', () => {
    const voices = separateVoices([
      chord('lh', 0, 48, 36),
      chord('lh', 0, 12, 43),
      chord('lh', 12, 24, 43),
    ])
    expect(voices.map((v) => [v.stem, starts(v)])).toEqual([
      [
        'up',
        [
          [0, 12],
          [12, 24],
        ],
      ],
      ['down', [[0, 48]]],
    ])
  })

  it('puts the tune in the upper voice over the right hand', () => {
    const voices = separateVoices([chord('rh', 0, 48, 60, 64), chord('melody', 0, 24, 76)])
    expect(voices.map((v) => [v.stem, v.chords[0]?.hand])).toEqual([
      ['up', 'melody'],
      ['down', 'rh'],
    ])
  })

  it('cuts short the voice that frees first when a third would be needed', () => {
    const voices = separateVoices([
      chord('rh', 0, 48, 60),
      chord('rh', 0, 24, 67),
      chord('rh', 12, 36, 72),
    ])
    expect(voices).toHaveLength(2)
    expect(voices.flatMap(starts)).toEqual(
      expect.arrayContaining([
        [0, 12],
        [12, 36],
      ]),
    )
  })

  it('writes one hand’s chords of one onset and different lengths as one, the shorter', () => {
    const voices = separateVoices([
      chord('melody', 0, 48, 76),
      chord('rh', 0, 48, 60),
      chord('rh', 0, 12, 64),
    ])
    expect(voices[1]?.chords.map((c) => [c.start, c.end, c.notes.length])).toEqual([[0, 12, 2]])
  })

  it('keeps the tune voice 1 when it lies under the right hand, its stems down', () => {
    const voices = separateVoices([chord('rh', 0, 48, 72, 76), chord('melody', 0, 48, 60)])
    expect(voices.map((v) => [v.stem, v.chords[0]?.hand])).toEqual([
      ['down', 'melody'],
      ['up', 'rh'],
    ])
  })

  it('no longer ties into the next bar a note written shorter than it sounds', () => {
    const held = chord('rh', 0, 48, 60)
    const voices = separateVoices([
      chord('melody', 0, 48, 76),
      { ...held, notes: held.notes.map((n) => ({ ...n, tiedTo: true })) },
      chord('rh', 0, 12, 64),
    ])
    expect(voices[1]?.chords[0]?.notes.map((n) => [n.midi, n.tiedTo])).toEqual([
      [60, false],
      [64, false],
    ])
  })
})
