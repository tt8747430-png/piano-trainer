import { describe, expect, it } from 'vitest'
import { barLabels } from './bar-labels'

/** A verse of three bars under its tempo, then a chorus of two. */
const BARS = [
  { section: 0, tempo: 84 },
  { section: 0 },
  { section: 0 },
  { section: 1 },
  { section: 1 },
]

describe('barLabels', () => {
  it('numbers a line’s first bar, names a section at its first bar and says a tempo where it is marked', () => {
    expect(barLabels(BARS, 0, 3)).toEqual([{ number: 1, section: 0, tempo: 84 }, {}, {}])
  })

  it('names a section where it starts inside a line, a later line’s first bar numbered alone (ADR 0087, 0097)', () => {
    expect(barLabels(BARS, 1, 5)).toEqual([{ number: 2 }, {}, { section: 1 }, {}])
    expect(barLabels(BARS, 3, 5)).toEqual([{ number: 4, section: 1 }, {}])
  })

  it('names a section again where the repeats play it again', () => {
    const played = [{ section: 0 }, { section: 1 }, { section: 0 }]
    expect(barLabels(played, 0, 3)).toEqual([
      { number: 1, section: 0 },
      { section: 1 },
      { section: 0 },
    ])
  })
})
