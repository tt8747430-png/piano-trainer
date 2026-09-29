import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { tensionChord } from './tension-keys'

describe('tensionChord', () => {
  it('places the chord from its root at middle C, each key marked by role and degree', () => {
    const chord = tensionChord(note('C'), 'd7')
    expect(chord.keys).toEqual([60, 64, 67, 70])
    expect(chord.marks.get(midi(70))).toEqual({ tone: '7th', label: '♭7' })
  })
})
