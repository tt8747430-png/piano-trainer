import { describe, expect, it } from 'vitest'
import { MARK } from '@/shared/ui/score'
import { chosenBox } from './chosen-box'

const layout = {
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 100, notes: 40 },
    { startTick: 96, ticks: 96, x: 100, width: 100, notes: 100 },
    { startTick: 192, ticks: 96, x: 200, width: 100, notes: 200 },
  ],
}
const bass = { top: 90, bottom: 130 }

describe('chosenBox', () => {
  it('spans exactly the chosen bars of the line, inset from their barlines, over the row’s staff', () => {
    expect(chosenBox(layout, [4, 5, 6], { from: 5, to: 5 }, { staff: bass })).toEqual({
      left: 100 + MARK.inset,
      width: 100 - 2 * MARK.inset,
      top: 90 - MARK.reach,
      height: 40 + 2 * MARK.reach,
    })
    // Bars 5 to 9 on a line of 4 to 6: its 5 and 6, not its 4.
    expect(chosenBox(layout, [4, 5, 6], { from: 5, to: 9 }, { staff: bass })).toMatchObject({
      left: 100 + MARK.inset,
      width: 200 - 2 * MARK.inset,
    })
  })

  it('starts at the first note, not over the line’s clef and key', () => {
    expect(chosenBox(layout, [4, 5, 6], { from: 4, to: 4 }, { staff: bass })).toMatchObject({
      left: 40 - MARK.lead,
    })
  })

  it('fills the chord row where the chords are chosen, and is none off the line', () => {
    expect(chosenBox(layout, [4, 5, 6], { from: 4, to: 4 }, { row: 44 })).toMatchObject({
      top: -44,
      height: 44,
    })
    expect(chosenBox(layout, [4, 5, 6], { from: 7, to: 9 }, { staff: bass })).toBeNull()
  })
})
