import { describe, expect, it } from 'vitest'
import { midi as midiOf } from '@/shared/lib/music'
import type { Head, ScoreLayout } from './layout'
import {
  barsBand,
  caretLine,
  loopEnds,
  MARK,
  pickAt,
  rangeBand,
  spaceOf,
  spanOf,
} from './selection'

/** A head 12 px wide and 10 high, its top `top`. */
const head = (
  staff: Head['staff'],
  tick: number,
  index: number,
  left: number,
  top: number,
  midi: number,
): Head => ({
  id: `n-${staff}-${tick}-${index}`,
  staff,
  tick,
  index,
  midi: midiOf(midi),
  left,
  right: left + 12,
  top,
  bottom: top + 10,
})

const treble = { top: 40, bottom: 80 }
const bass = { top: 120, bottom: 160 }

const laid: ScoreLayout = {
  width: 500,
  height: 200,
  staffTop: 40,
  staffBottom: 160,
  staves: { treble, bass },
  measures: [
    // The line's first bar: its clef and key before its notes.
    { startTick: 0, ticks: 96, x: 0, width: 200, notes: 60 },
    { startTick: 96, ticks: 96, x: 200, width: 150, notes: 215 },
    { startTick: 192, ticks: 96, x: 350, width: 150, notes: 365 },
  ],
  onsets: [
    { tick: 0, x: 70 },
    { tick: 48, x: 130 },
    { tick: 96, x: 215 },
    { tick: 192, x: 365 },
  ],
  heads: [
    // A chord of C, E and G at the bar's start; a single note after it; a bass note under both.
    head('treble', 0, 0, 70, 70, 60),
    head('treble', 0, 1, 70, 60, 64),
    head('treble', 0, 2, 70, 50, 67),
    // A sharp before it: its box reaches left to 120.
    { ...head('treble', 48, 0, 130, 55, 66), left: 120 },
    head('bass', 0, 0, 70, 130, 48),
    head('treble', 96, 0, 215, 60, 72),
  ],
  columns: [
    // The chord's stem up from its heads to 20.
    { staff: 'treble', tick: 0, left: 70, right: 82, top: 20, bottom: 80 },
    { staff: 'treble', tick: 48, left: 120, right: 142, top: 25, bottom: 65 },
    { staff: 'bass', tick: 0, left: 70, right: 82, top: 130, bottom: 140 },
    { staff: 'treble', tick: 96, left: 215, right: 227, top: 30, bottom: 70 },
  ],
  rests: [{ staff: 'treble', tick: 144, left: 300, right: 311, top: 55, bottom: 85 }],
  // The line's head: its clef, then its key, before its first notes at 70.
  signs: [
    { kind: 'clef', staff: 'treble', measure: 0, left: 5, right: 25, top: 30, bottom: 90 },
    { kind: 'key', staff: 'treble', measure: 0, left: 30, right: 50, top: 40, bottom: 70 },
  ],
}
const space = 10
const reach = MARK.reach * space
const pad = MARK.pad * space
const lead = MARK.lead * space

describe('the one selection’s marks (ADR 0096)', () => {
  it('reads a staff space from a staff’s height, and spans the staves a mark is over', () => {
    expect(spaceOf(laid)).toBe(10)
    expect(spanOf([bass, treble])).toEqual({ top: 40, bottom: 160 })
  })

  it('bands a range over its staff, from its first note’s left edge to its last’s right edge', () => {
    // Bar 1 on the treble: the chord and the sharp note after it, not bar 2's.
    expect(rangeBand(laid, { staves: ['treble'], from: 0, to: 96 }, treble)).toEqual({
      left: 70 - pad,
      width: 142 + pad - (70 - pad),
      top: 40 - reach,
      height: 40 + 2 * reach,
    })
  })

  it('takes the line from top to foot whatever its notes reach, and its rests', () => {
    const band = rangeBand(laid, { staves: ['treble'], from: 96, to: 192 }, treble)
    expect(band).toEqual({
      left: 215 - pad,
      width: 311 + pad - (215 - pad),
      top: 40 - reach,
      height: 40 + 2 * reach,
    })
  })

  it('bands the chord row from its first place to where its last ends, and none off the line', () => {
    const row = { top: -40, bottom: -4 }
    const band = rangeBand(laid, { staves: [], from: 96, to: 192 }, row)
    expect(band?.left).toBe(215 - lead)
    expect((band?.left ?? 0) + (band?.width ?? 0)).toBe(350 - MARK.inset * space)
    expect(rangeBand(laid, { staves: [], from: 300, to: 400 }, row)).toBeNull()
  })

  it('bands the bars of a loop over every staff, barline to barline, its line’s clef and key left out', () => {
    const band = barsBand(laid, 0, 1, spanOf([treble, bass]))
    // From between the line's key and its notes.
    expect(band.left).toBe(60)
    expect(band.left + band.width).toBe(350 - MARK.inset * space)
    expect(band.top).toBe(40 - reach)
    expect(band.height).toBe(120 + 2 * reach)
    // One bar: its own, in from its barlines so the bars beside it stay clear.
    const one = barsBand(laid, 2, 2, spanOf([treble, bass]))
    expect(one.left).toBe(350 + MARK.inset * space)
    expect(one.left + one.width).toBe(500 - MARK.inset * space)
  })

  it('stands the loop’s ends on its barlines, clear of a sharp after the first', () => {
    // Bar 2 starts with a sharp right after its barline: the start stands on the barline.
    const sharp = {
      ...laid,
      heads: [...(laid.heads ?? []), { ...head('treble', 96, 1, 215, 50, 73), left: 203 }],
    }
    expect(loopEnds(sharp, 1, 2)).toEqual({ start: 200, end: 500 })
    // At a line's start, between its clef and key and its first notes.
    expect(loopEnds(laid, 0, 0)).toEqual({ start: 60, end: 200 })
    // A line read with no signs: just before its first notes.
    expect(loopEnds({ ...laid, signs: [] }, 0, 1)).toEqual({ start: 70 - lead, end: 350 })
  })

  it('draws the caret as a line on its staff, just before the notes it is on and their sharps', () => {
    expect(caretLine(laid, 48, ['treble'], treble)).toEqual({
      left: 120 - lead,
      top: 40 - reach,
      height: 40 + 2 * reach,
    })
    // On an empty place, where the next note goes; in the chord row, before the chord.
    expect(caretLine(laid, 24, ['treble'], treble).left).toBe(100 - lead)
    expect(caretLine(laid, 96, [], { top: -40, bottom: -4 }).left).toBe(215 - lead)
  })
})

describe('what a click chooses (ADR 0096)', () => {
  it('chooses the head under it, one note of a chord', () => {
    expect(pickAt(laid, 76, 65)).toEqual({ staff: 'treble', tick: 0, index: 1, midi: 64 })
    expect(pickAt(laid, 76, 73)).toEqual({ staff: 'treble', tick: 0, index: 0, midi: 60 })
  })

  it('chooses a grace note on its head before its note’s (ADR 0114)', () => {
    const graced = {
      ...laid,
      graces: [{ ...head('treble', 0, 0, 58, 50, 62), id: 'g-treble-0-0', right: 66, bottom: 57 }],
    }
    expect(pickAt(graced, 61, 53)).toEqual({ staff: 'treble', tick: 0, index: 0, grace: true })
    // Its note's head is still its note's.
    expect(pickAt(graced, 76, 73)).toEqual({ staff: 'treble', tick: 0, index: 0, midi: 60 })
  })

  it('chooses the chord whole on its stem', () => {
    expect(pickAt(laid, 81, 30)).toEqual({ staff: 'treble', tick: 0 })
  })

  it('chooses nothing on empty staff: between notes, after the last, in the margins', () => {
    expect(pickAt(laid, 105, 60)).toBeNull()
    expect(pickAt(laid, 300, 60)).toBeNull()
    expect(pickAt(laid, 10, 60)).toBeNull()
    expect(pickAt(laid, 76, 110)).toBeNull()
  })
})
