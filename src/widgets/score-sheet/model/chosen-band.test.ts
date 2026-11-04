import { describe, expect, it } from 'vitest'
import { MARK, type Head } from '@/shared/ui/score'
import { chordRow, chosenBand } from './chosen-band'

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
/** A staff space here, and the marks' measures in it. */
const inset = MARK.inset * 10
const reach = MARK.reach * 10

describe('chosenBand (ADR 0096)', () => {
  it('bands what is chosen on the row’s staff by beats, bar line to bar line, from the line’s start (R29-P16)', () => {
    // The piece's 384 to 480, on a line from 288: its bar 2, in from both its barlines.
    expect(chosenBand(layout, 288, { from: 384, to: 480 }, { staff: bass })).toEqual({
      left: 100 + inset,
      width: 200 - inset - (100 + inset),
      top: 90 - reach,
      height: 40 + 2 * reach,
    })
    // Over the line's end: its part alone, from its second beat's notes to the line's last barline.
    expect(chosenBand(layout, 288, { from: 432, to: 900 }, { staff: bass })).toMatchObject({
      left: 150 - MARK.lead * 10,
      width: 300 - inset - (150 - MARK.lead * 10),
    })
  })

  it('snaps a note chosen inside a beat out to the whole beat', () => {
    const beats = [0, 48, 96, 144, 192, 240].map((tick) => ({
      measure: Math.floor(tick / 96),
      tick,
      end: tick + 48,
    }))
    // A note from 100 to 120 of a beat of 96–144: the beat's notes on, to the next beat's.
    expect(chosenBand(layout, 0, { from: 100, to: 120 }, { staff: bass, beats })).toMatchObject({
      left: 100 + inset,
      width: 150 - MARK.lead * 10 - (100 + inset),
    })
  })

  it('fills the chord row where the chords are chosen, and is none off the line', () => {
    expect(chosenBand(layout, 0, { from: 0, to: 96 }, { row: 44 })).toMatchObject({
      left: 40 - MARK.lead * 10,
      top: -44,
      height: 44,
    })
    expect(chosenBand(layout, 0, { from: 400, to: 500 }, { staff: bass })).toBeNull()
    expect(chosenBand(layout, 0, null, { staff: bass })).toBeNull()
  })

  it('takes the chord row as a span the marks fill, over the staff', () => {
    expect(chordRow(layout, 44)).toEqual({ top: -44 + reach, bottom: -reach })
  })
})
