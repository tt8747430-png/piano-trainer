import { describe, expect, it } from 'vitest'
import type { Head, ScoreLayout } from './layout'
import { followScroll, PLAYHEAD, playheadSpan, playheadX } from './playhead-place'

/** A head 12 px wide and 10 high. */
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

const layout: ScoreLayout = {
  width: 400,
  height: 200,
  staffTop: 40,
  staffBottom: 160,
  staves: { treble: { top: 40, bottom: 80 }, bass: { top: 120, bottom: 160 } },
  measures: [
    // The line's first bar: its clef and key before its notes.
    { startTick: 0, ticks: 96, x: 0, width: 200, notes: 70 },
    { startTick: 96, ticks: 96, x: 200, width: 150, notes: 215 },
  ],
  onsets: [
    { tick: 0, x: 70 },
    { tick: 48, x: 130 },
    { tick: 96, x: 215 },
  ],
  heads: [
    // A sharp before the treble's head at the bar's start: its box reaches left to 60.
    { ...head('treble', 0, 70, 50), left: 60 },
    head('bass', 0, 70, 130),
    head('treble', 48, 130, 55),
    head('bass', 96, 215, 140),
  ],
  rests: [],
}
/** A staff space here: a quarter of a staff's height. */
const space = 10
const lead = PLAYHEAD.lead * space

describe('the playhead (ADR 0096)', () => {
  it('stands just before what sounds, clear of its accidentals, on every staff', () => {
    expect(playheadX(layout, 0)).toBe(60 - lead)
    expect(playheadX(layout, 48)).toBe(130 - lead)
    expect(playheadX(layout, 96)).toBe(215 - lead)
  })

  it('moves between two onsets in proportion to the ticks between them', () => {
    expect(playheadX(layout, 24)).toBe((60 + 130) / 2 - lead)
  })

  it('moves on toward the barline after a bar’s last onset', () => {
    expect(playheadX(layout, 72)).toBe((130 - lead + 200) / 2)
  })

  it('spans the system, its highest staff’s top line to its lowest’s foot, wherever it stands', () => {
    const reach = PLAYHEAD.reach * space
    expect(playheadSpan(layout)).toEqual({ top: 40 - reach, height: 120 + 2 * reach })
  })
})

describe('followScroll', () => {
  it('leaves the view while the playhead is in its middle half', () => {
    expect(followScroll(300, { left: 0, width: 800 })).toBeNull()
  })

  it('scrolls to put the playhead a quarter in once it leaves', () => {
    expect(followScroll(700, { left: 0, width: 800 })).toBe(500)
    expect(followScroll(100, { left: 400, width: 800 })).toBe(0)
  })
})
