import { describe, expect, it } from 'vitest'
import { midi, note, tensionTones } from '@/shared/lib/music'
import { tensionChord, tensionMark } from './tension-keys'

describe('tensionChord', () => {
  it('places the chord from its root at middle C, each key marked by role and degree', () => {
    const chord = tensionChord(note('C'), 'd7')
    expect(chord.keys).toEqual([60, 64, 67, 70])
    expect(chord.marks.get(midi(70))).toEqual({ tone: '7th', label: '♭7' })
  })
})

describe('tensionMark', () => {
  const toneOf = (quality: 'm7' | 'd7', degree: string) => {
    const tone = tensionTones(note('C'), quality).find((each) => each.degree === degree)
    if (!tone) throw new Error(`C${quality} has no ${degree}`)
    return tone
  }

  it('marks a tension or a chord tone in its role’s colour, with its degree', () => {
    const ninth = toneOf('d7', '9')
    expect(tensionMark(ninth)).toEqual({ tone: ninth.role, label: '9' })
    expect(tensionMark(toneOf('m7', '♭3'))).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('marks an avoid note plainly, so no colour calls it a chord tone', () => {
    expect(toneOf('m7', '3').group).toBe('avoid')
    expect(tensionMark(toneOf('m7', '3'))).toEqual({ tone: 'scale', label: '3' })
  })
})
