import { describe, expect, it } from 'vitest'
import { PALETTE_TABS, tabOpen } from './palette-tabs'

describe('the palette’s tabs', () => {
  it('lists what is done to every note: their values, pitch, marks and dynamics', () => {
    expect(PALETTE_TABS).toEqual(['notes', 'pitch', 'articulations', 'dynamics'])
  })

  it('works in every row but the chord names’', () => {
    expect(tabOpen('melody')).toBe(true)
    expect(tabOpen('lh')).toBe(true)
    expect(tabOpen('chords')).toBe(false)
  })
})
