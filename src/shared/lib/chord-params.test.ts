import { describe, expect, it } from 'vitest'
import type { ChordParts } from '@/shared/lib/music'
import { partsFromParams, partsParams, readAdded, readAlterations } from './chord-params'

const TRIAD: ChordParts = {
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: [],
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
      added: '',
      alter: 'b9s11',
    })
    expect(partsFromParams(partsParams(ninthSharpEleven))).toEqual(ninthSharpEleven)
    expect(partsParams(TRIAD).alter).toBe('')
    expect(readAlterations('b5b9s9')).toEqual(['b5', 'b9', 's9'])
    expect(readAlterations('s11b9')).toEqual([])
    expect(readAlterations('b9b9')).toEqual([])
    expect(readAlterations(7)).toEqual([])
  })

  it('write the added tones by their ids, in order, and read back only that', () => {
    const sixNine = parts({ triad: 'min', added: ['add6', 'add9'] })
    expect(partsParams(sixNine).added).toBe('add6add9')
    expect(partsFromParams(partsParams(sixNine))).toEqual(sixNine)
    expect(readAdded('add2add11')).toEqual(['add2', 'add11'])
    expect(readAdded('addS11add13')).toEqual(['addS11', 'add13'])
    expect(readAdded('add9add6')).toEqual([])
    expect(readAdded('six')).toEqual([])
    expect(readAdded(9)).toEqual([])
  })
})
