import { describe, expect, it } from 'vitest'
import { lineFit } from './line-fit'

describe('lineFit', () => {
  it('draws a line at its own size where the sheet holds it whole', () => {
    expect(lineFit({ room: 600, staves: 2 })).toBe(1)
  })

  it('draws it smaller to fit a short sheet: its labels, tempo and staves in sight', () => {
    // 260px: a phone on its side with the keys out. A section's name is in the labels' row, no
    // heading over the line (ADR 0097).
    const fit = lineFit({ room: 260, staves: 2 })
    expect(fit).toBeLessThan(1)
    expect(44 + (202 + 32) * fit).toBeCloseTo(260)
  })

  it('keeps the verses under the tune in sight too (ADR 0097)', () => {
    const fit = lineFit({ room: 296, staves: 2, verses: 2 })
    expect(fit).toBeLessThan(lineFit({ room: 296, staves: 2 }))
    expect(44 + (202 + 2 * 22 + 32) * fit).toBeCloseTo(296)
  })

  it('draws it as small as the Player’s, its whole system over the keys, never smaller', () => {
    // A phone on its side with the keys out: 142px under the title.
    const fit = lineFit({ room: 142, staves: 2, natural: 266 })
    expect(fit).toBeLessThan(0.6)
    expect(lineFit({ room: 120, staves: 3 })).toBe(0.4)
  })

  it('fits the line as engraved where it is known: its notes far over or under its staves', () => {
    // A line across of the whole piece: 266px at its own size, ledger lines under the bass.
    const fit = lineFit({ room: 264, staves: 2, natural: 266 })
    expect(44 + 266 * fit).toBeCloseTo(264)
    expect(fit).toBeLessThan(lineFit({ room: 264, staves: 2 }))
  })
})
