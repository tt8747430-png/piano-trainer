import { describe, expect, it } from 'vitest'
import { lineFit } from './line-fit'

describe('lineFit', () => {
  it('draws a line at its own size where the sheet holds it whole', () => {
    expect(lineFit({ room: 600, staves: 2, headed: true })).toBe(1)
  })

  it('draws it smaller to fit a short sheet: its heading, labels, tempo and staves in sight', () => {
    // 296px: a phone on its side with the keys folded.
    const fit = lineFit({ room: 296, staves: 2, headed: true })
    expect(fit).toBeLessThan(1)
    expect(52 + 44 + (210 + 32) * fit).toBeCloseTo(296)
  })

  it('leaves out the heading the across view has not', () => {
    expect(lineFit({ room: 296, staves: 2, headed: false })).toBeGreaterThan(
      lineFit({ room: 296, staves: 2, headed: true }),
    )
  })

  it('never draws it smaller than it is read', () => {
    expect(lineFit({ room: 120, staves: 3, headed: true })).toBe(0.6)
  })
})
