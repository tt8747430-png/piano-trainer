import { describe, expect, it } from 'vitest'
import { leftAt, xAtTick } from './layout'
import type { ScoreLayout } from './layout'

const layout: ScoreLayout = {
  width: 400,
  height: 210,
  staffTop: 40,
  staffBottom: 170,
  staves: { treble: { top: 40, bottom: 80 }, bass: { top: 130, bottom: 170 } },
  measures: [
    { startTick: 0, ticks: 48, x: 0, width: 200, notes: 40 },
    { startTick: 48, ticks: 48, x: 200, width: 200, notes: 220 },
  ],
  onsets: [
    { tick: 0, x: 60 },
    { tick: 24, x: 130 },
    { tick: 48, x: 220 },
  ],
}

describe('xAtTick', () => {
  it('puts an onset at its own x', () => {
    expect(xAtTick(layout, 24)).toBe(130)
  })

  it('puts a tick between onsets in proportion', () => {
    expect(xAtTick(layout, 12)).toBe(95)
  })

  it('runs past a bar’s last onset toward its end', () => {
    expect(xAtTick(layout, 72)).toBe(310)
    expect(xAtTick(layout, 999)).toBe(400)
  })
})

describe('leftAt (ADR 0096)', () => {
  const drawn: ScoreLayout = {
    ...layout,
    heads: [
      // The treble's head at the bar's start with a sharp before it, the bass's under it.
      {
        id: 'n-treble-0-0',
        staff: 'treble',
        tick: 0,
        index: 0,
        left: 48,
        right: 72,
        top: 50,
        bottom: 60,
      },
      {
        id: 'n-bass-0-0',
        staff: 'bass',
        tick: 0,
        index: 0,
        left: 60,
        right: 72,
        top: 140,
        bottom: 150,
      },
    ],
    rests: [{ staff: 'bass', tick: 24, left: 128, right: 138, top: 140, bottom: 160 }],
  }

  it('is the left edge of what is drawn at a tick: its heads with their accidentals, on every staff', () => {
    expect(leftAt(drawn, 0)).toBe(48)
  })

  it('is one staff’s alone where it is asked for', () => {
    expect(leftAt(drawn, 0, ['bass'])).toBe(60)
  })

  it('takes a rest drawn there, and the tick’s own x where nothing is', () => {
    expect(leftAt(drawn, 24)).toBe(128)
    expect(leftAt(drawn, 24, ['treble'])).toBe(130)
    expect(leftAt(drawn, 12)).toBe(95)
  })
})
