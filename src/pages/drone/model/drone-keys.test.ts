import { describe, expect, it } from 'vitest'
import { droneKeys } from './drone-keys'

describe('droneKeys (R29 B11)', () => {
  it('holds the root in its octave, and what its kind adds over it', () => {
    expect(droneKeys({ root: 0, kind: 'note', octave: 3 })).toEqual([48])
    expect(droneKeys({ root: 9, kind: 'fifth', octave: 2 })).toEqual([45, 52])
    expect(droneKeys({ root: 2, kind: 'major', octave: 4 })).toEqual([62, 66, 69])
    expect(droneKeys({ root: 2, kind: 'minor', octave: 4 })).toEqual([62, 65, 69])
  })
})
