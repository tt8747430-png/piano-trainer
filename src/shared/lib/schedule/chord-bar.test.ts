import { describe, expect, it } from 'vitest'
import { buildChord, note, placeChord } from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { chordBar } from './chord-bar'

const DIMINISHED_7TH = buildChord(note('C'), {
  triad: 'dim',
  size: 7,
  seventh: 'diminished',
  added: 'none',
  alterations: [],
})

describe('chordBar', () => {
  it('holds the chord for a whole bar, the left hand’s root on the bass staff', () => {
    const placed = placeChord(DIMINISHED_7TH.tones, { inversion: 0, bothHands: true })
    const music = chordBar(placed)
    expect(music.notes.map((n) => [n.midi, n.hand, n.durationTicks])).toEqual([
      [48, 'lh', 48],
      [60, 'rh', 48],
      [63, 'rh', 48],
      [66, 'rh', 48],
      [69, 'rh', 48],
    ])
    const [measure] = notate(music).measures
    const [chord] = measure?.staves.treble[0]?.events ?? []
    expect(chord).toMatchObject({ kind: 'notes', duration: { value: 1 } })
    expect(chord?.kind === 'notes' ? chord.notes.map((n) => n.accidental) : []).toEqual([
      null,
      -1,
      -1,
      -2,
    ])
    expect(measure?.staves.bass[0]?.events).toMatchObject([
      { kind: 'notes', notes: [{ midi: 48 }] },
    ])
  })
})
