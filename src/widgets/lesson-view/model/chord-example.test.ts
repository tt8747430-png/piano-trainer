import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { placeExample } from './chord-example'

describe('placeExample', () => {
  it('places a chord from middle C, each tone marked by role and degree', () => {
    const example = placeExample('Cm7')
    expect(example.name).toBe('Cm7')
    expect(example.keys).toEqual([60, 63, 67, 70])
    expect(example.marks.get(midi(63))).toEqual({ tone: '3rd', label: '♭3' })
  })

  it('puts a slash chord’s bass in the octave below, unmarked when it is no chord tone', () => {
    const example = placeExample('C/D')
    expect(example.name).toBe('C/D')
    expect(example.keys).toEqual([50, 60, 64, 67])
    expect(example.marks.has(midi(50))).toBe(false)
  })

  it('marks a bass that is a chord tone as that tone', () => {
    const example = placeExample('F6/D')
    expect(example.keys[0]).toBe(50)
    expect(example.marks.get(midi(50))?.label).toBe('6')
  })
})
