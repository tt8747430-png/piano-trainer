import { describe, expect, it } from 'vitest'
import type { Performance } from '@/shared/lib/arrangement'
import { note, noteName } from '@/shared/lib/music'
import { inversionsExercise } from './inversions'

const chordsOf = (performance: Performance, hand: 'rh' | 'lh') => {
  const starts = [...new Set(performance.notes.map((n) => n.startTick))].sort((a, b) => a - b)
  return starts.map((tick) =>
    performance.notes
      .filter((n) => n.hand === hand && n.startTick === tick)
      .sort((a, b) => a.midi - b.midi),
  )
}

describe('inversionsExercise', () => {
  it('climbs a triad through its inversions to the octave and back, a chord each half note', () => {
    const exercise = inversionsExercise({ root: note('C'), quality: 'maj' })
    expect(chordsOf(exercise, 'rh').map((c) => c.map((n) => n.midi))).toEqual([
      [60, 64, 67],
      [64, 67, 72],
      [67, 72, 76],
      [72, 76, 79],
      [67, 72, 76],
      [64, 67, 72],
      [60, 64, 67],
    ])
    expect(exercise.notes[1]?.durationTicks).toBe(24)
  })

  it('fingers each inversion as it is taught, the root under it in the left hand', () => {
    const exercise = inversionsExercise({ root: note('C'), quality: 'maj' })
    const right = chordsOf(exercise, 'rh').map((c) => c.map((n) => n.finger).join(''))
    expect(right.slice(0, 4)).toEqual(['135', '125', '135', '135'])
    expect(chordsOf(exercise, 'lh').map((c) => c.map((n) => noteName(n.spelled)))).toEqual(
      Array(7).fill(['C']),
    )
  })

  it('takes a 7th chord through its four inversions, spelled as the chord spells it', () => {
    const exercise = inversionsExercise({ root: note('B', -1), quality: 'd7' })
    const right = chordsOf(exercise, 'rh')
    expect(right).toHaveLength(9)
    expect(right[1]?.map((n) => noteName(n.spelled))).toEqual(['D', 'F', 'A♭', 'B♭'])
    expect(right[0]?.map((n) => n.finger).join('')).toBe('1235')
    expect(exercise.chords.map((chord) => chord.symbol)).toEqual(['B♭7'])
  })

  it('keeps every root’s chord under C6', () => {
    for (const letter of ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const)
      for (const quality of ['maj', 'maj7', 'd7'] as const) {
        const keys = inversionsExercise({ root: note(letter, 1), quality }).notes.map((n) => n.midi)
        expect(Math.max(...keys)).toBeLessThanOrEqual(84)
      }
  })
})
