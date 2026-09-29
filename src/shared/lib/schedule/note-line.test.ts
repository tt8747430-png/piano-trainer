import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { noteLine } from './note-line'

const C_MAJOR = { tonic: note('C'), minor: false }
const timed = (text: string, meter: '2/4' | '3/4' | '4/4' = '4/4') =>
  noteLine(text, { hand: 'rh', meter, key: C_MAJOR }).notes.map((n) => [
    n.midi,
    n.startTick,
    n.durationTicks,
  ])

describe('noteLine', () => {
  it('writes each note a quarter note unless its value says otherwise', () => {
    expect(timed('C4 D4 E4 F4')).toEqual([
      [60, 0, 12],
      [62, 12, 12],
      [64, 24, 12],
      [65, 36, 12],
    ])
    expect(timed('G4/2 C5/8 C5/8 D5/4')).toEqual([
      [67, 0, 24],
      [72, 24, 6],
      [72, 30, 6],
      [74, 36, 12],
    ])
  })

  it('makes a dotted note half as long again', () => {
    expect(timed('C4/4. D4/8 E4/2')).toEqual([
      [60, 0, 18],
      [62, 18, 6],
      [64, 24, 24],
    ])
  })

  it('writes whole bars of its meter, a short last bar filled out', () => {
    const line = noteLine('C4 D4 E4', { hand: 'rh', meter: '4/4', key: C_MAJOR })
    expect(line.bars).toEqual([{ startTick: 0, beats: 4 }])
    const waltz = noteLine('C4 E4 G4 C5', { hand: 'rh', meter: '3/4', key: C_MAJOR })
    expect(waltz.bars).toEqual([
      { startTick: 0, beats: 3 },
      { startTick: 36, beats: 3 },
    ])
    expect(waltz.meter).toBe('3/4')
  })

  it('keeps each note’s spelling and hand, in the key it is written in', () => {
    const line = noteLine('F#3 B♭2/2', {
      hand: 'lh',
      meter: '4/4',
      key: { tonic: note('G'), minor: false },
    })
    expect(line.notes.map((n) => [n.spelled, n.hand])).toEqual([
      [note('F', 1), 'lh'],
      [note('B', -1), 'lh'],
    ])
    expect(line.key.tonic).toEqual(note('G'))
  })

  it('refuses what it cannot read', () => {
    expect(() => timed('X4')).toThrow(/X4/)
    expect(() => timed('C4/3')).toThrow(/C4\/3/)
    expect(() => timed('')).toThrow(RangeError)
  })
})
