import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { scaleOverlay } from './scale-overlay'

describe('scaleOverlay', () => {
  it('marks the key’s scale in every octave, its tonic as the tonic, each key with its note', () => {
    const marks = scaleOverlay({ tonic: note('E', -1), minor: false })
    expect(marks.get(midi(63))).toEqual({ tone: 'tonic', label: 'E♭' })
    expect(marks.get(midi(75))).toEqual({ tone: 'tonic', label: 'E♭' })
    expect(marks.get(midi(68))).toEqual({ tone: 'scale', label: 'A♭' })
    expect(marks.has(midi(64))).toBe(false)
  })

  it('takes a minor key’s natural minor', () => {
    const marks = scaleOverlay({ tonic: note('A'), minor: true })
    expect(marks.get(midi(57))?.tone).toBe('tonic')
    expect(marks.has(midi(68))).toBe(false)
    expect(marks.get(midi(67))?.label).toBe('G')
  })
})
