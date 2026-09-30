import { describe, expect, it } from 'vitest'
import { midi, note, placeScale } from '@/shared/lib/music'
import { keyMarks } from './key-marks'

describe('keyMarks', () => {
  it('marks the tonic in its own colour and every note with its degree', () => {
    const marks = keyMarks(placeScale(note('G'), 'major'))
    expect(marks.get(midi(67))).toEqual({ tone: 'tonic', label: '1' })
    expect(marks.get(midi(78))).toEqual({ tone: 'scale', label: '7' })
  })
})
