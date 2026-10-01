import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import { arpeggioExercise } from './arpeggio'

const rh = (performance: Performance) => performance.notes.filter((n) => n.hand === 'rh')

describe('arpeggioExercise', () => {
  it('climbs a chord’s tones two octaves and back, fingered as taught', () => {
    const arpeggio = arpeggioExercise({ root: note('C'), quality: 'maj', inversion: 0, octaves: 2 })
    expect(
      rh(arpeggio)
        .map((n) => noteName(n.spelled))
        .join(' '),
    ).toBe('C E G C E G C G E C G E C')
    expect(
      rh(arpeggio)
        .map((n) => n.finger)
        .join(''),
    ).toBe('1231235321321')
    expect(arpeggio.chords.map((chord) => chord.symbol)).toEqual(['C'])
  })

  it('starts on the tone its inversion puts at the bottom, under the chord over its bass', () => {
    const arpeggio = arpeggioExercise({ root: note('C'), quality: 'maj', inversion: 1, octaves: 1 })
    expect(rh(arpeggio).map((n) => [noteName(n.spelled), n.midi])).toEqual([
      ['E', 64],
      ['G', 67],
      ['C', 72],
      ['E', 76],
      ['C', 72],
      ['G', 67],
      ['E', 64],
    ])
    expect(arpeggio.chords[0]?.symbol).toBe('C/E')
  })

  it('writes a 7th chord in fours, in its root’s minor key when its 3rd is minor', () => {
    const arpeggio = arpeggioExercise({ root: note('D'), quality: 'm7', inversion: 0, octaves: 1 })
    expect(
      rh(arpeggio)
        .map((n) => noteName(n.spelled))
        .join(' '),
    ).toBe('D F A C D C A F D')
    expect(arpeggio.key).toEqual({ tonic: note('D'), minor: true })
  })
})
