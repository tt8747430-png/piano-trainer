import { describe, expect, it } from 'vitest'
import type { ScoreLayout } from './layout'
import { MARK, insertBox, noteBox, rangeBox, spanOf } from './selection'

const layout: Pick<ScoreLayout, 'measures' | 'onsets'> = {
  measures: [
    // The line's first bar: its clef and key before its notes.
    { startTick: 0, ticks: 96, x: 0, width: 200, notes: 60 },
    { startTick: 96, ticks: 96, x: 200, width: 150, notes: 200 },
    { startTick: 192, ticks: 96, x: 350, width: 150, notes: 350 },
  ],
  onsets: [
    { tick: 0, x: 70 },
    { tick: 48, x: 130 },
    { tick: 96, x: 215 },
    { tick: 192, x: 365 },
  ],
}
const treble = { top: 40, bottom: 80 }
const bass = { top: 120, bottom: 160 }

describe('the one selection', () => {
  it('spans the staves it is over, top to foot', () => {
    expect(spanOf([bass, treble])).toEqual({ top: 40, bottom: 160 })
  })

  it('marks a note as a padded box round its column, the same wherever it is drawn', () => {
    expect(noteBox(layout, 48, treble)).toEqual({
      left: 130 - MARK.lead,
      width: MARK.width,
      top: 40 - MARK.reach,
      height: 40 + 2 * MARK.reach,
    })
  })

  it('marks an empty place as a slim line where the next note goes, never a box', () => {
    const line = insertBox(layout, 96, treble)
    expect(line.width).toBeLessThan(5)
    expect(line.left).toBeLessThan(215)
    expect(line.top).toBe(40 - MARK.reach)
  })

  it('boxes exactly the bars chosen, from the first’s notes (its clef and key left out) to the last’s barline', () => {
    const box = rangeBox(layout, 0, 1, treble)
    expect(box.left).toBe(60 - MARK.lead)
    expect(box.left + box.width).toBe(350 - MARK.inset)
    expect(box.top).toBe(40 - MARK.reach)
    expect(box.height).toBe(40 + 2 * MARK.reach)
    // One bar: its own, not the line's.
    const one = rangeBox(layout, 2, 2, treble)
    expect(one.left).toBe(350 + MARK.inset)
    expect(one.left + one.width).toBe(500 - MARK.inset)
  })
})
