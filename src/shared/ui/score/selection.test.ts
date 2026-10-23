import { describe, expect, it } from 'vitest'
import { midi as midiOf } from '@/shared/lib/music'
import type { Head, ScoreLayout } from './layout'
import {
  HUG,
  MARK,
  insertBox,
  noteBox,
  noteMark,
  pickAt,
  rangeBox,
  rangeMark,
  spaceOf,
  spanOf,
} from './selection'

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

const laid: ScoreLayout = {
  ...layout,
  width: 500,
  height: 200,
  staffTop: 40,
  staffBottom: 160,
  staves: { treble, bass },
  heads: [
    // A chord of C, E and G at the bar's start; a single note after it; a bass note under both.
    head('treble', 0, 0, 70, 70, 60),
    head('treble', 0, 1, 70, 60, 64),
    head('treble', 0, 2, 70, 50, 67),
    head('treble', 48, 0, 130, 55, 65),
    head('bass', 0, 0, 70, 130, 48),
    head('treble', 96, 0, 215, 60, 72),
  ],
  columns: [
    // The chord's stem up from its heads to 20.
    { staff: 'treble', tick: 0, left: 70, right: 82, top: 20, bottom: 80 },
    { staff: 'treble', tick: 48, left: 130, right: 142, top: 25, bottom: 65 },
    { staff: 'bass', tick: 0, left: 70, right: 82, top: 130, bottom: 140 },
    { staff: 'treble', tick: 96, left: 215, right: 227, top: 30, bottom: 70 },
  ],
}
const pad = HUG.pad * 10

describe('marks that hug the notes (ADR 0088)', () => {
  it('reads a staff space from a staff’s height', () => {
    expect(spaceOf(laid)).toBe(10)
  })

  it('hugs a chord’s heads, its one note alone, or every staff’s at a beat', () => {
    expect(noteMark(laid, { staves: ['treble'], from: 0, to: 1 }, treble)).toEqual({
      left: 70 - pad,
      top: 50 - pad,
      width: 12 + 2 * pad,
      height: 30 + 2 * pad,
    })
    expect(
      noteMark(laid, { staves: ['treble'], from: 0, to: 1, midi: midiOf(64) }, treble),
    ).toEqual({ left: 70 - pad, top: 60 - pad, width: 12 + 2 * pad, height: 10 + 2 * pad })
    const beat = noteMark(laid, { from: 0, to: 1 }, spanOf([treble, bass]))
    expect(beat.top).toBe(50 - pad)
    expect(beat.top + beat.height).toBe(140 + pad)
  })

  it('falls back to a column’s box where no head is drawn (a rest)', () => {
    expect(noteMark(laid, { staves: ['bass'], from: 48, to: 49 }, bass)).toEqual(
      noteBox(laid, 48, bass),
    )
  })

  it('hugs a range from its first note’s left to its last’s right, its notes’ top to foot, no neighbour', () => {
    const box = rangeMark(laid, { staves: ['treble'], from: 0, to: 96 }, treble)
    expect(box).toEqual({
      left: 70 - pad,
      top: 50 - pad,
      width: 72 + 2 * pad,
      height: 30 + 2 * pad,
    })
    // Bar 2's note, the neighbour, is left out.
    expect((box?.left ?? 0) + (box?.width ?? 0)).toBeLessThan(215)
  })

  it('hugs a range’s rests with its heads', () => {
    const rested = {
      ...laid,
      rests: [{ staff: 'treble' as const, tick: 144, left: 300, right: 311, top: 55, bottom: 85 }],
    }
    const box = rangeMark(rested, { staves: ['treble'], from: 96, to: 192 }, treble)
    expect(box).toEqual({
      left: 215 - pad,
      top: 55 - pad,
      width: 96 + 2 * pad,
      height: 30 + 2 * pad,
    })
    // One key of a chord hugs its head alone.
    expect(noteMark(rested, { from: 144, to: 145, midi: midiOf(60) }, treble)).toEqual(
      noteBox(rested, 144, treble),
    )
  })

  it('boxes a range of no heads (the chord row) from its first place to where it ends', () => {
    const box = rangeMark(laid, { staves: [], from: 96, to: 192 }, treble)
    expect(box?.left).toBe(215 - MARK.lead)
    expect((box?.left ?? 0) + (box?.width ?? 0)).toBe(350 - MARK.inset)
    expect(rangeMark(laid, { staves: [], from: 300, to: 400 }, treble)).toBeNull()
  })
})

describe('what a click chooses (ADR 0088)', () => {
  it('chooses the head under it, one note of a chord', () => {
    expect(pickAt(laid, 76, 65)).toEqual({ staff: 'treble', tick: 0, index: 1, midi: 64 })
    expect(pickAt(laid, 76, 73)).toEqual({ staff: 'treble', tick: 0, index: 0, midi: 60 })
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

  it('leaves out the heads `accept` turns away', () => {
    expect(pickAt(laid, 136, 60, (each) => each.tick !== 48)).toBeNull()
  })
})
