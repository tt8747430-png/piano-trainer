import { describe, expect, it } from 'vitest'
import table from './hand-poses.json'
import { POSE_TABLE } from './pose-table'
import { fingerAngles } from './poses'

const ROW = (dx: number) => (dx - POSE_TABLE.from) / POSE_TABLE.step

describe('fingerAngles (R36)', () => {
  const poses = table.hands.rh.index
  const at = (row: number) => poses.white.up[row] ?? []

  it('reads the table at its offsets', () => {
    const middle = Math.round(ROW(0))
    expect(fingerAngles('rh', 'index', { dx: 0, black: 0, press: 0 })).toEqual(at(middle))
    expect(fingerAngles('rh', 'index', { dx: 0, black: 0, press: 1 })).toEqual(
      poses.white.down[middle],
    )
    expect(fingerAngles('rh', 'index', { dx: 0, black: 1, press: 0 })).toEqual(
      poses.black.up[middle],
    )
  })

  it('goes between its offsets, and between up and down, smoothly', () => {
    const dx = POSE_TABLE.step / 2
    const row = Math.floor(ROW(dx))
    const halfway = fingerAngles('rh', 'index', { dx, black: 0, press: 0 })
    halfway.forEach((angle, j) =>
      expect(angle).toBeCloseTo(((at(row)[j] ?? 0) + (at(row + 1)[j] ?? 0)) / 2, 9),
    )
    const pressing = fingerAngles('rh', 'index', { dx: 0, black: 0, press: 0.5 })
    const middle = Math.round(ROW(0))
    pressing.forEach((angle, j) =>
      expect(angle).toBeCloseTo(
        ((poses.white.up[middle]?.[j] ?? 0) + (poses.white.down[middle]?.[j] ?? 0)) / 2,
        9,
      ),
    )
  })

  it('holds its last offset past the table’s reach', () => {
    const last = POSE_TABLE.from + POSE_TABLE.step * (POSE_TABLE.count - 1)
    expect(fingerAngles('rh', 'index', { dx: last + 0.05, black: 0, press: 0 })).toEqual(
      at(POSE_TABLE.count - 1),
    )
    expect(fingerAngles('rh', 'index', { dx: POSE_TABLE.from - 0.05, black: 0, press: 0 })).toEqual(
      at(0),
    )
  })

  it('has every finger of both hands, 21 offsets each way', () => {
    for (const side of ['rh', 'lh'] as const)
      for (const finger of ['thumb', 'index', 'middle', 'ring', 'pinky'] as const)
        for (const key of ['white', 'black'] as const)
          for (const press of ['up', 'down'] as const) {
            const rows = table.hands[side][finger][key][press]
            expect(rows).toHaveLength(POSE_TABLE.count)
            for (const row of rows)
              for (const angle of row) expect(Number.isFinite(angle)).toBe(true)
          }
  })
})
