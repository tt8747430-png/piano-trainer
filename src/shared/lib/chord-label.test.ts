import { describe, expect, it } from 'vitest'
import { chordLabels, chordLabelWidth } from './chord-label'

/** Where each name ends, at the width `chordLabels` reckons. */
const ends = (placed: { x: number; size: number }[], symbols: string[]) =>
  placed.map((label, index) => label.x + (symbols[index]?.length ?? 0) * 0.65 * label.size)

describe('chordLabels', () => {
  it('keeps each chord name at its size and place where it has the room to the next', () => {
    expect(
      chordLabels(
        [
          { x: 0, symbol: 'C' },
          { x: 100, symbol: 'G7' },
        ],
        200,
        16,
      ),
    ).toEqual([
      { x: 0, size: 16 },
      { x: 100, size: 16 },
    ])
  })

  it('draws a name smaller to end before the next one starts', () => {
    const [first] = chordLabels(
      [
        { x: 0, symbol: 'Dbmaj7/Ab' },
        { x: 80, symbol: 'Gbm6/A' },
      ],
      300,
      16,
    )
    expect(first?.size).toBeLessThan(16)
    expect(first?.x).toBe(0)
  })

  it('moves a name on, never under the least that is read, where it would run into the one before', () => {
    const symbols = ['G', 'D7']
    // A narrow bar of 3/4 on a phone: D7 on beat 3 a thumb's width after G.
    const placed = chordLabels(
      symbols.map((symbol, index) => ({ symbol, x: index * 9 })),
      200,
      16,
    )
    expect(placed.every((label) => label.size >= 16 * 0.85)).toBe(true)
    const [gEnd = 0] = ends(placed, symbols)
    expect(placed[1]?.x).toBeGreaterThanOrEqual(gEnd + 6)
  })

  it('keeps the last name inside the line, drawn back from its end', () => {
    const symbols = ['C', 'Abmaj9']
    const placed = chordLabels(
      symbols.map((symbol, index) => ({ symbol, x: index * 90 })),
      110,
      16,
    )
    const [, lastEnd = 0] = ends(placed, symbols)
    expect(lastEnd).toBeLessThanOrEqual(110)
    expect(placed[1]?.size).toBeGreaterThanOrEqual(16 * 0.85)
  })

  it('reckons a name as wide as its letters at its size: where a tap on it lands', () => {
    expect(chordLabelWidth('C', 20)).toBe(13)
    expect(chordLabelWidth('Am7', 20)).toBe(39)
  })
})
