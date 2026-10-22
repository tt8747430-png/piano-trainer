import { describe, expect, it } from 'vitest'
import { chordLabelSizes } from './chord-label'

describe('chordLabelSizes', () => {
  it('keeps each chord name at its size where it has the room to the next', () => {
    expect(
      chordLabelSizes(
        [
          { x: 0, symbol: 'C' },
          { x: 100, symbol: 'G7' },
        ],
        200,
        16,
      ),
    ).toEqual([16, 16])
  })

  it('draws a name smaller to end before the next one starts', () => {
    const [size = 0] = chordLabelSizes(
      [
        { x: 0, symbol: 'Dbmaj7/Ab' },
        { x: 80, symbol: 'Gbm6/A' },
      ],
      300,
      16,
    )
    expect(size).toBeLessThan(16)
    // Its nine characters, each 0.6 of the size, end before the gap to the next.
    expect(9 * 0.6 * size).toBeLessThanOrEqual(80 - 4)
  })

  it('never draws one under the least that is read, and fits the last to the line’s end', () => {
    const sizes = chordLabelSizes(
      [
        { x: 0, symbol: 'Ebm7b5/Bbb' },
        { x: 10, symbol: 'C' },
        { x: 90, symbol: 'Abmaj9' },
      ],
      110,
      16,
    )
    expect(sizes[0]).toBe(16 * 0.7)
    expect(sizes[2]).toBeLessThan(16)
  })
})
