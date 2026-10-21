import { describe, expect, it } from 'vitest'
import { chosenBox } from './chosen-box'

const layout = {
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 100, notes: 10 },
    { startTick: 96, ticks: 96, x: 100, width: 100, notes: 100 },
    { startTick: 192, ticks: 96, x: 200, width: 100, notes: 200 },
  ],
  staves: { treble: { top: 20, bottom: 60 }, bass: { top: 90, bottom: 130 } },
}

describe('chosenBox', () => {
  it('spans the chosen bars of the line, inset from their barlines, over its staves', () => {
    expect(chosenBox(layout, [4, 5, 6], { from: 5, to: 9 })).toEqual({
      left: 103,
      width: 194,
      top: 14,
      height: 122,
    })
  })

  it('reaches over the chord row where the chords are chosen, and is none off the line', () => {
    expect(
      chosenBox(layout, [4, 5, 6], { from: 4, to: 4 }, { chords: true, row: 44 }),
    ).toMatchObject({ top: -44, height: 180 })
    expect(chosenBox(layout, [4, 5, 6], { from: 7, to: 9 })).toBeNull()
  })
})
