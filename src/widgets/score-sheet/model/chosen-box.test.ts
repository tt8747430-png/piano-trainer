import { describe, expect, it } from 'vitest'
import { chosenBox } from './chosen-box'

const layout = {
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 100, notes: 40 },
    { startTick: 96, ticks: 96, x: 100, width: 100, notes: 100 },
    { startTick: 192, ticks: 96, x: 200, width: 100, notes: 200 },
  ],
  staves: { treble: { top: 20, bottom: 60 }, bass: { top: 90, bottom: 130 } },
}

describe('chosenBox', () => {
  it('spans the chosen bars of the line, inset from their barlines, a staff space past its staves', () => {
    expect(chosenBox(layout, [4, 5, 6], { from: 5, to: 9 })).toEqual({
      left: 104,
      width: 192,
      top: 10,
      height: 130,
    })
  })

  it('covers only the staff of the row chosen in, a staff space past it', () => {
    expect(
      chosenBox(layout, [4, 5, 6], { from: 5, to: 5 }, { staff: { top: 90, bottom: 130 } }),
    ).toMatchObject({ top: 80, height: 60 })
  })

  it('starts at the first note, not over the line’s clef and key', () => {
    expect(chosenBox(layout, [4, 5, 6], { from: 4, to: 4 })).toMatchObject({ left: 32, width: 64 })
  })

  it('reaches over the chord row where the chords are chosen, and is none off the line', () => {
    expect(
      chosenBox(layout, [4, 5, 6], { from: 4, to: 4 }, { chords: true, row: 44 }),
    ).toMatchObject({ top: -44, height: 184 })
    expect(chosenBox(layout, [4, 5, 6], { from: 7, to: 9 })).toBeNull()
  })
})
