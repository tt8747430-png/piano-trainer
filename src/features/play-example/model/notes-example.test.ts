import { describe, expect, it } from 'vitest'
import { C_MAJOR, midi, note } from '@/shared/lib/music'
import { noteLine } from '@/shared/lib/schedule'
import { barOf, barShown, barsOf, notesShown, rowsOf } from './notes-example'

describe('notesShown', () => {
  it('marks each key a line plays with its note’s name, once', () => {
    const line = noteLine('E4 G4 E4 B♭4', {
      hand: 'rh',
      meter: '4/4',
      key: { tonic: note('C'), minor: false },
    })
    const shown = notesShown(line)
    expect(shown.keys).toEqual([64, 67, 70])
    expect(shown.marks.get(midi(70))).toEqual({ tone: 'scale', label: 'B♭' })
  })
})

describe('barOf and barShown', () => {
  const line = noteLine('C4 D4 E4 F4 G4 A4 B4 C5', {
    hand: 'rh',
    meter: '4/4',
    key: { tonic: note('C'), minor: false },
  })

  it('finds the bar a tick falls in', () => {
    const second = line.bars[1]!.startTick
    expect(barOf(line, 0)).toBe(0)
    expect(barOf(line, second - 1)).toBe(0)
    expect(barOf(line, second)).toBe(1)
  })

  it('marks only the keys of one bar', () => {
    expect(barShown(line, 0).keys).toEqual([60, 62, 64, 65])
    expect(barShown(line, 1).keys).toEqual([67, 69, 71, 72])
  })
})

describe('rows of a line', () => {
  const line = noteLine('C4/8 C#4/8 D4/8 D#4/8 E4/8 F4/8 F#4/8 G4/8 G#4/2 A4/2 B4/2 C5/2', {
    hand: 'rh',
    meter: '4/4',
    key: C_MAJOR,
  })

  it('puts as many bars on a row as their notes fit, one bar at least', () => {
    // Eight eighths, then two halves, then two halves: 8 · 2 · 2 notes.
    expect(rowsOf(line, 9)).toEqual([
      { from: 0, to: 1 },
      { from: 1, to: 3 },
    ])
    expect(rowsOf(line, 10)).toEqual([
      { from: 0, to: 2 },
      { from: 2, to: 3 },
    ])
    expect(rowsOf(line, 4)).toEqual([
      { from: 0, to: 1 },
      { from: 1, to: 3 },
    ])
    expect(rowsOf(line, 1)).toEqual([
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ])
    expect(rowsOf(line, 100)).toEqual([{ from: 0, to: 3 }])
  })

  it('cuts a row of bars out as music of its own, from its first tick', () => {
    const row = barsOf(line, 1, 3)
    expect(row.bars.map((bar) => bar.startTick)).toEqual([
      0,
      line.bars[2]!.startTick - line.bars[1]!.startTick,
    ])
    expect(row.notes.map((n) => n.midi)).toEqual([68, 69, 71, 72])
    expect(row.notes[0]?.startTick).toBe(0)
  })
})
