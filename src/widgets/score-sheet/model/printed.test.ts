import { describe, expect, it } from 'vitest'
import type { ScoreLayout } from '@/shared/ui/score'
import { signTargets } from './printed'

/** A line of two measures over the tune's staff and the grand staff, its head's signs drawn. */
const layout: ScoreLayout = {
  width: 400,
  height: 300,
  staffTop: 30,
  staffBottom: 270,
  staves: {
    melody: { top: 30, bottom: 70 },
    treble: { top: 130, bottom: 170 },
    bass: { top: 230, bottom: 270 },
  },
  measures: [
    { startTick: 0, ticks: 96, x: 10, width: 200, notes: 100 },
    { startTick: 96, ticks: 96, x: 210, width: 190, notes: 250 },
  ],
  onsets: [],
  signs: [
    { kind: 'clef', staff: 'melody', measure: 0, left: 12, right: 39, top: 15, bottom: 90 },
    { kind: 'key', staff: 'melody', measure: 0, left: 49, right: 59, top: 20, bottom: 50 },
    { kind: 'time', staff: 'melody', measure: 0, left: 69, right: 87, top: 30, bottom: 70 },
    { kind: 'clef', staff: 'treble', measure: 0, left: 12, right: 39, top: 115, bottom: 190 },
    { kind: 'key', staff: 'treble', measure: 0, left: 49, right: 59, top: 120, bottom: 150 },
    { kind: 'time', staff: 'treble', measure: 0, left: 69, right: 87, top: 130, bottom: 170 },
    { kind: 'clef', staff: 'bass', measure: 1, left: 220, right: 238, top: 230, bottom: 260 },
  ],
}

describe('signTargets (ADR 0094)', () => {
  it('names each sign by what it changes and the piece’s bar it stands at, no clef on the tune’s staff', () => {
    const targets = signTargets(layout, [8, 9])
    expect(targets.map((target) => target.printed)).toEqual([
      { kind: 'key', bar: 8 },
      { kind: 'time', bar: 8 },
      { kind: 'clef', bar: 8, staff: 'treble' },
      { kind: 'key', bar: 8 },
      { kind: 'time', bar: 8 },
      { kind: 'clef', bar: 9, staff: 'bass' },
    ])
  })

  it('grows each target to meet its neighbours halfway, from the line’s start, short of the first note', () => {
    const [, , clef, key, time] = signTargets(layout, [0, 1])
    if (!clef || !key || !time) throw new Error('the treble staff’s signs')
    expect(clef.box.left).toBe(10)
    expect(clef.box.right).toBe(44)
    expect(key.box).toMatchObject({ left: 44, right: 64 })
    expect(time.box.left).toBe(64)
    expect(time.box.right).toBeLessThan(100)
    // Over its staff's lines at least, a clef as tall as it is drawn.
    expect(key.box.top).toBeLessThan(130)
    expect(key.box.bottom).toBeGreaterThan(170)
    expect(clef.box).toMatchObject({ top: 115, bottom: 190 })
  })

  it('takes the place of a key printing no sharps or flats, after a line’s head clefs, for its key', () => {
    // C major: the head's clefs and time signatures alone printed.
    const keyless: ScoreLayout = {
      ...layout,
      signs: (layout.signs ?? []).filter((sign) => sign.kind !== 'key'),
    }
    const targets = signTargets(keyless, [0, 1], true)
    expect(targets.map((target) => target.printed)).toEqual([
      { kind: 'key', bar: 0 },
      { kind: 'time', bar: 0 },
      { kind: 'clef', bar: 0, staff: 'treble' },
      { kind: 'key', bar: 0 },
      { kind: 'time', bar: 0 },
      { kind: 'clef', bar: 1, staff: 'bass' },
    ])
    // Between the treble clef and the time signature: the room no signature takes.
    const [, , clef, key, time] = targets
    expect(key?.box.left).toBe(clef?.box.right)
    expect(key?.box.right).toBe(time?.box.left)
    expect(key?.box.right).toBeGreaterThan(key?.box.left ?? Infinity)
    // A key with its signature takes no place besides it.
    expect(signTargets(layout, [0, 1], true)).toEqual(signTargets(layout, [0, 1]))
  })
})
