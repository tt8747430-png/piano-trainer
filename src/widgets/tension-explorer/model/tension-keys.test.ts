import { describe, expect, it } from 'vitest'
import { midi, note, tensionTones } from '@/shared/lib/music'
import { tensionChord, withNoteOnTop } from './tension-keys'

const C = note('C')
const toneOf = (degree: string) => {
  const tone = tensionTones(C, 'd7').find((each) => each.degree === degree)
  if (!tone) throw new Error(`C7 has no ${degree}`)
  return tone
}

describe('tensionChord', () => {
  it('places the chord from its root at middle C, each key marked by role and degree', () => {
    const chord = tensionChord(C, 'd7')
    expect(chord.keys).toEqual([60, 64, 67, 70])
    expect(chord.marks.get(midi(70))).toEqual({ tone: '7th', label: '♭7' })
  })
})

describe('withNoteOnTop', () => {
  it('puts a note on the nearest key above the chord, marked by its role and degree', () => {
    const chord = tensionChord(C, 'd7')
    const ninth = withNoteOnTop(chord, toneOf('9'))
    expect(ninth.keys).toEqual([60, 64, 67, 70, 74])
    expect(ninth.marks.get(midi(74))).toEqual({ tone: '9th', label: '9' })
    expect(withNoteOnTop(chord, toneOf('♭7')).keys.at(-1)).toBe(82)
    expect(withNoteOnTop(chord, toneOf('1')).keys.at(-1)).toBe(72)
  })
})
