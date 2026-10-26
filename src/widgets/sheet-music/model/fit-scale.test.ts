import { describe, expect, it } from 'vitest'
import type { ScoreLayout } from '@/shared/ui/score'
import { engravedHeight, fitScale, SHEET_SCALE, systemFit, widestBar } from './fit-scale'

const WIDE = 1440

describe('fitScale', () => {
  it('fills the height a wide room has', () => {
    expect(fitScale({ width: WIDE, height: 315 }, 210)).toBe(1.5)
    expect(fitScale({ width: WIDE, height: 168 }, 210)).toBe(0.8)
  })

  it('grows no larger than two bars across the room allow, and never past its bounds', () => {
    expect(fitScale({ width: 390, height: 600 }, 210)).toBe(1)
    expect(fitScale({ width: 900, height: 600 }, 210)).toBe(1.25)
    expect(fitScale({ width: 4000, height: 2000 }, 210)).toBe(SHEET_SCALE.max)
    expect(fitScale({ width: WIDE, height: 20 }, 210)).toBe(SHEET_SCALE.min)
  })

  it('engraves at 1 before the room is measured, and at its least in a room with no height', () => {
    expect(fitScale({ width: 0, height: 0 }, 210)).toBe(1)
    expect(fitScale({ width: WIDE, height: -20 }, 210)).toBe(SHEET_SCALE.min)
  })
})

describe('fitScale, with the music’s own bars', () => {
  it('grows on a narrow tall screen as far as two of its bars still show', () => {
    // A phone upright: two bars of 100px fit 390px at 1.95, past the bound.
    expect(fitScale({ width: 390, height: 600 }, 210, 100)).toBe(SHEET_SCALE.max)
    // Bars of 150px: two fit at 1.3.
    expect(fitScale({ width: 390, height: 600 }, 210, 150)).toBe(1.3)
  })

  it('stays at 1 where even one busy bar fills the screen, and fills no more than the height', () => {
    expect(fitScale({ width: 390, height: 600 }, 210, 400)).toBe(1)
    expect(fitScale({ width: 390, height: 252 }, 210, 100)).toBe(1.2)
  })
})

describe('systemFit', () => {
  it('draws a line down a short sheet small enough to show its system whole, its labels over it', () => {
    // A phone on its side: 178px of sheet, the chord row 44px, a grand staff 202 at its own size.
    const fit = systemFit({ room: 178, natural: 202, labels: 44 })
    expect(fit).toBeLessThan(1)
    expect(44 + 202 * fit).toBeCloseTo(178)
  })

  it('is no larger than its width allows, nor than its own size', () => {
    expect(systemFit({ room: 900, natural: 202, labels: 44 })).toBe(1)
    expect(systemFit({ room: 900, natural: 202, labels: 44, most: 0.8 })).toBe(0.8)
  })

  it('never draws it smaller than a panorama’s least, nor before the sheet is measured', () => {
    expect(systemFit({ room: 178, natural: 400, labels: 44 })).toBe(SHEET_SCALE.min)
    expect(systemFit({ room: 0, natural: 202, labels: 44, most: 0.9 })).toBe(0.9)
  })
})

describe('fitScale on a phone on its side (the Player’s line across over its keys)', () => {
  // The labels' row drawn with the staff, as `labelRow` draws it: 44px at full size, never under 31.
  const row = (scale: number) => Math.round(44 * Math.max(0.7, Math.min(1, scale)))

  it('draws the whole system of a busy line in the room over the keys, its labels over it', () => {
    // 852 by 393: 154px under the title; a grand staff whose notes go two ledger lines under the
    // bass, 265px at its own size.
    const scale = fitScale({ width: 804, height: 154 }, 265, 300, row)
    expect(scale).toBeLessThan(0.5)
    expect(row(scale) + 265 * scale).toBeLessThanOrEqual(154)
    expect(row(scale) + 265 * scale).toBeGreaterThan(152)
  })

  it('counts its labels’ row as it grows with the staff where the room is taller', () => {
    const scale = fitScale({ width: 1440, height: 300 }, 265, 300, row)
    expect(scale).toBeGreaterThan(0.7)
    expect(row(scale) + 265 * scale).toBeCloseTo(300, 0)
    expect(row(scale) + 265 * scale).toBeLessThanOrEqual(300)
  })
})

describe('engravedHeight', () => {
  const engraving = {
    height: 150,
    staves: { treble: { top: 15, bottom: 35 }, bass: { top: 65, bottom: 85 } },
  }

  it('is the engraving’s own height at its own size: its notes far under the staves too', () => {
    expect(engravedHeight(engraving, ['treble', 'bass'], ['treble', 'bass'], 0.5)).toBe(300)
  })

  it('leaves out a staff under the ones read, keeping the room the engraving has under its lowest', () => {
    // The right hand practised alone: the bass staff, 50px under the treble's foot, may leave the room.
    expect(engravedHeight(engraving, ['treble', 'bass'], ['treble'], 0.5)).toBe(200)
    // A staff over the ones read is kept: the one read is under it.
    expect(engravedHeight(engraving, ['treble', 'bass'], ['bass'], 0.5)).toBe(300)
  })

  it('is unknown for an engraving with no size', () => {
    expect(engravedHeight({ height: 0, staves: {} }, ['treble'], ['treble'], 1)).toBeUndefined()
  })
})

describe('widestBar', () => {
  const layout = (measures: ScoreLayout['measures']): ScoreLayout => ({
    width: 400,
    height: 210,
    staffTop: 40,
    staffBottom: 170,
    staves: {},
    measures,
    onsets: [],
  })

  it('is the widest bar’s notes at scale 1, past any clef, key and time', () => {
    const engraved = layout([
      { startTick: 0, ticks: 48, x: 0, width: 300, notes: 120 },
      { startTick: 48, ticks: 48, x: 300, width: 240, notes: 320 },
    ])
    expect(widestBar(engraved, 2)).toBe(110)
  })

  it('is unknown for a score with no bars', () => {
    expect(widestBar(layout([]), 1)).toBeUndefined()
  })
})
