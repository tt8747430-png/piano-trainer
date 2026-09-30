import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { placeExample } from './chord-example'

describe('placeExample', () => {
  it('places a chord from middle C, each tone marked by role and degree', () => {
    const example = placeExample('Cm7')
    expect(example.keys).toEqual([60, 63, 67, 70])
    expect(example.marks.get(midi(63))).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('puts a slash chord’s bass in the octave below, unmarked when it is no chord tone', () => {
    const example = placeExample('C/D')
    expect(example.keys).toEqual([50, 60, 64, 67])
    expect(example.marks.has(midi(50))).toBe(false)
  })

  it('plays a slash chord over a chord tone as that inversion, from the bass nearest middle C', () => {
    // As the lessons teach it: C/E is E G C; from C E G the nearest F is C F A and the nearest G is B D G.
    expect(placeExample('C/E').keys).toEqual([64, 67, 72])
    expect(placeExample('F/C').keys).toEqual([60, 65, 69])
    expect(placeExample('G/B').keys).toEqual([59, 62, 67])
  })

  it('marks a bass that is a chord tone as that tone', () => {
    const example = placeExample('F6/D')
    expect(example.keys).toEqual([62, 65, 69, 72])
    expect(example.marks.get(midi(62))?.label).toBe('6')
  })
})
