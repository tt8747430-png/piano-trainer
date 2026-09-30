import { describe, expect, it } from 'vitest'
import type { ChordParts } from '@/shared/lib/music'
import { partsFromParams, partsParams, readAlterations } from './chord-params'

const TRIAD: ChordParts = {
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: 'none',
  alterations: [],
}
const parts = (change: Partial<ChordParts>): ChordParts => ({ ...TRIAD, ...change })

describe('the parts’ URL params', () => {
  it('write the alterations as a symbol does, and read back only that', () => {
    const ninthSharpEleven = parts({ size: 9, alterations: ['b9', 's11'] })
    expect(partsParams(ninthSharpEleven)).toEqual({
      triad: 'maj',
      size: 9,
      seventh: 'minor',
      added: 'none',
      alter: 'b9s11',
    })
    expect(partsFromParams(partsParams(ninthSharpEleven))).toEqual(ninthSharpEleven)
    expect(partsParams(TRIAD).alter).toBe('')
    expect(readAlterations('b5b9s9')).toEqual(['b5', 'b9', 's9'])
    expect(readAlterations('s11b9')).toEqual([])
    expect(readAlterations('b9b9')).toEqual([])
    expect(readAlterations(7)).toEqual([])
  })
})
