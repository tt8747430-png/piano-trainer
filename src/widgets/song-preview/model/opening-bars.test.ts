import { describe, expect, it } from 'vitest'
import { openingBars } from './opening-bars'

describe('openingBars', () => {
  it('reads a song’s first line as its bars, each its chords', () => {
    expect(openingBars({ opening: 'C G Am F', meta: { key: 'C', meter: '4/4' } })).toEqual([
      ['C'],
      ['G'],
      ['Am'],
      ['F'],
    ])
  })

  it('keeps at most four bars', () => {
    expect(
      openingBars({ opening: 'C G Am F C G C', meta: { key: 'C', meter: '4/4' } }),
    ).toHaveLength(4)
  })

  it('reads nothing from no line, or one that does not read', () => {
    expect(openingBars({ meta: {} })).toBeNull()
    expect(openingBars({ opening: 'not a chord ][', meta: { key: 'C', meter: '4/4' } })).toBeNull()
  })
})
