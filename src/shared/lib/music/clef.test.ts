import { describe, expect, it } from 'vitest'
import { clefsInForce } from './clef'

describe('clefsInForce', () => {
  it('holds each hand’s clef from the bar that changes it to the next change', () => {
    expect(
      clefsInForce([{}, { clefs: { lh: 'treble' } }, {}, { clefs: { lh: 'bass', rh: 'bass' } }]),
    ).toEqual([
      { rh: 'treble', lh: 'bass' },
      { rh: 'treble', lh: 'treble' },
      { rh: 'treble', lh: 'treble' },
      { rh: 'bass', lh: 'bass' },
    ])
  })
})
