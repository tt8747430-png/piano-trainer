import { describe, expect, it } from 'vitest'
import { xAtTick } from './layout'
import type { ScoreLayout } from './engrave'

const layout: ScoreLayout = {
  width: 400,
  height: 210,
  staffTop: 40,
  staffBottom: 170,
  staves: { treble: { top: 40, bottom: 80 }, bass: { top: 130, bottom: 170 } },
  measures: [
    { startTick: 0, ticks: 48, x: 0, width: 200 },
    { startTick: 48, ticks: 48, x: 200, width: 200 },
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
