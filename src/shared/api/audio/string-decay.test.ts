import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { stringDecay, stringLevel } from './string-decay'

describe('a string’s decay (ADR 0034)', () => {
  it('dies away while it rings: softer at 2 s than at 0.5 s', () => {
    const a4 = midi(69)
    expect(stringLevel(a4, 2)).toBeLessThan(stringLevel(a4, 0.5))
    expect(stringLevel(a4, 0)).toBe(1)
  })

  it('rings longer the lower its key, from 1.5 s at the top to 6 s at the bottom', () => {
    expect(stringDecay(midi(108))).toBeCloseTo(1.5)
    expect(stringDecay(midi(21))).toBeCloseTo(6)
    expect(stringLevel(midi(36), 2)).toBeGreaterThan(stringLevel(midi(84), 2))
  })
})
