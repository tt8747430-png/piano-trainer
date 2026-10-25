import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { separateVoices, type BarChord } from './voices'

const chord = (start: number, end: number, ...keys: number[]): BarChord => ({
  start,
  end,
  notes: keys.map((key) => ({
    midi: midi(key),
    spelled: note('C'),
    tiedFrom: false,
    tiedTo: false,
  })),
})
const starts = (voice: { chords: readonly BarChord[] }) => voice.chords.map((c) => [c.start, c.end])

describe('separateVoices', () => {
  it('keeps a staff’s chords that follow each other in one voice', () => {
    const voices = separateVoices([chord(0, 12, 60), chord(12, 48, 64)])
    expect(voices).toHaveLength(1)
    expect(voices[0]?.stem).toBe('auto')
  })

  it('opens a second voice for a held note, the higher voice’s stems up', () => {
    const voices = separateVoices([chord(0, 48, 36), chord(0, 12, 43), chord(12, 24, 43)])
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

  it('cuts short the voice that frees first when a third would be needed', () => {
    const voices = separateVoices([chord(0, 48, 60), chord(0, 24, 67), chord(12, 36, 72)])
    expect(voices).toHaveLength(2)
    expect(voices.flatMap(starts)).toEqual(
      expect.arrayContaining([
        [0, 12],
        [12, 36],
      ]),
    )
  })

  it('writes a third voice’s chord of one onset with the voice it joins, the shorter length kept', () => {
    const voices = separateVoices([chord(0, 48, 76), chord(0, 48, 60), chord(0, 12, 64)])
    expect(voices[1]?.chords.map((c) => [c.start, c.end, c.notes.length])).toEqual([[0, 12, 2]])
  })

  it('no longer ties into the next bar a note written shorter than it sounds', () => {
    const held = chord(0, 48, 60)
    const voices = separateVoices([
      chord(0, 48, 76),
      { ...held, notes: held.notes.map((n) => ({ ...n, tiedTo: true })) },
      chord(0, 12, 64),
    ])
    expect(voices[1]?.chords[0]?.notes.map((n) => [n.midi, n.tiedTo])).toEqual([
      [60, false],
      [64, false],
    ])
  })
})
