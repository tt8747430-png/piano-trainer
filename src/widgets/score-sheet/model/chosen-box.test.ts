import { describe, expect, it } from 'vitest'
import { HUG, MARK, type Head } from '@/shared/ui/score'
import { chosenBox } from './chosen-box'

const head = (staff: Head['staff'], tick: number, left: number, top: number): Head => ({
  id: `n-${staff}-${tick}-0`,
  staff,
  tick,
  index: 0,
  left,
  right: left + 12,
  top,
  bottom: top + 10,
})

const layout = {
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 100, notes: 40 },
    { startTick: 96, ticks: 96, x: 100, width: 100, notes: 100 },
    { startTick: 192, ticks: 96, x: 200, width: 100, notes: 200 },
  ],
  onsets: [
    { tick: 0, x: 40 },
    { tick: 96, x: 110 },
    { tick: 144, x: 150 },
    { tick: 192, x: 210 },
  ],
  staves: { treble: { top: 10, bottom: 50 }, bass: { top: 90, bottom: 130 } },
  heads: [
    head('bass', 0, 40, 100),
    head('bass', 96, 110, 95),
    head('bass', 144, 150, 115),
    head('bass', 192, 210, 100),
    head('treble', 96, 110, 20),
  ],
}
const bass = { staff: 'bass' as const, top: 90, bottom: 130 }
const pad = HUG.pad * 10

describe('chosenBox', () => {
  it('hugs exactly the notes chosen on the row’s staff, no neighbour, from the line’s start', () => {
    // The piece's 384 to 480, on a line from 288: its bar 2.
    expect(chosenBox(layout, 288, { from: 384, to: 480 }, { staff: bass })).toEqual({
      left: 110 - pad,
      width: 52 + 2 * pad,
      top: 95 - pad,
      height: 30 + 2 * pad,
    })
    // Over the line's end: its part alone.
    expect(chosenBox(layout, 288, { from: 432, to: 900 }, { staff: bass })).toMatchObject({
      left: 150 - pad,
      width: 72 + 2 * pad,
    })
  })

  it('fills the chord row where the chords are chosen, and is none off the line', () => {
    expect(chosenBox(layout, 0, { from: 0, to: 96 }, { row: 44 })).toMatchObject({
      left: 40 - MARK.lead,
      top: -44,
      height: 44,
    })
    expect(chosenBox(layout, 0, { from: 400, to: 500 }, { staff: bass })).toBeNull()
    expect(chosenBox(layout, 0, null, { staff: bass })).toBeNull()
  })
})
