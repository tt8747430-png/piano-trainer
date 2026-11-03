import { describe, expect, it } from 'vitest'
import type { ChordParts } from '@/shared/lib/music'
import { partsFromParams, partsParams, readColour } from './chord-params'

const TRIAD: ChordParts = {
  triad: 'maj',
  size: 5,
  seventh: 'minor',
  added: [],
  alterations: [],
}
const parts = (change: Partial<ChordParts>): ChordParts => ({ ...TRIAD, ...change })

describe('the parts’ URL params', () => {
  it('write the colour notes as a symbol does, alterations first, and read them back', () => {
    const ninthSharpEleven = parts({ size: 9, alterations: ['b9', 's11'] })
    expect(partsParams(ninthSharpEleven)).toEqual({
      triad: 'maj',
      size: 9,
      seventh: 'minor',
      colour: 'b9,#11',
    })
    expect(partsFromParams(partsParams(ninthSharpEleven))).toEqual(ninthSharpEleven)
    expect(partsParams(TRIAD).colour).toBe('')
  })

  it('write a triad’s added tones by their numbers, and read back only those it knows', () => {
    const sixNine = parts({ triad: 'min', added: ['add6', 'add9'] })
    expect(partsParams(sixNine).colour).toBe('6,9')
    expect(partsFromParams(partsParams(sixNine))).toEqual(sixNine)
    expect(readColour('9,six,#11', 5)).toEqual({ added: ['add9', 'addS11'], alterations: [] })
    expect(readColour(true, 5)).toEqual({ added: [], alterations: [] })
  })

  it('read a #11 as added over a triad and altered over a 7th chord', () => {
    expect(readColour('#11', 5)).toEqual({ added: ['addS11'], alterations: [] })
    expect(readColour('#11,13', 7)).toEqual({ added: ['add13'], alterations: ['s11'] })
  })
})
