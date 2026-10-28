import { describe, expect, it } from 'vitest'
import { C_MAJOR, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { noteLine, twoHands, type NoteLineMeter } from './note-line'

const B = TICKS_PER_BEAT

const timed = (text: string, meter: NoteLineMeter = '4/4') =>
  noteLine(text, { hand: 'rh', meter, key: C_MAJOR }).notes.map((n) => [
    n.midi,
    n.startTick,
    n.durationTicks,
  ])

describe('noteLine', () => {
  it('writes each note a quarter note unless its value says otherwise', () => {
    expect(timed('C4 D4 E4 F4')).toEqual([
      [60, 0, B],
      [62, B, B],
      [64, 2 * B, B],
      [65, 3 * B, B],
    ])
    expect(timed('G4/2 C5/8 C5/8 D5/4')).toEqual([
      [67, 0, 2 * B],
      [72, 2 * B, 0.5 * B],
      [72, 2.5 * B, 0.5 * B],
      [74, 3 * B, B],
    ])
  })

  it('writes sixteenths, four to a beat', () => {
    expect(timed('C5/16 B4/16 C5/16 G5/16 C5')).toEqual([
      [72, 0, 0.25 * B],
      [71, 0.25 * B, 0.25 * B],
      [72, 0.5 * B, 0.25 * B],
      [79, 0.75 * B, 0.25 * B],
      [72, B, B],
    ])
  })

  it('makes a dotted sixteenth whole in ticks, as a 32nd is', () => {
    expect(timed('C5/16. D5/16. E5/8')).toEqual([
      [72, 0, 0.375 * B],
      [74, 0.375 * B, 0.375 * B],
      [76, 0.75 * B, 0.5 * B],
    ])
  })

  it('makes a dotted note half as long again', () => {
    expect(timed('C4/4. D4/8 E4/2')).toEqual([
      [60, 0, 1.5 * B],
      [62, 1.5 * B, 0.5 * B],
      [64, 2 * B, 2 * B],
    ])
  })

  it('writes whole bars of its meter, a short last bar filled out', () => {
    const line = noteLine('C4 D4 E4', { hand: 'rh', meter: '4/4', key: C_MAJOR })
    expect(line.bars).toEqual([{ startTick: 0, beats: 4 }])
    const waltz = noteLine('C4 E4 G4 C5', { hand: 'rh', meter: '3/4', key: C_MAJOR })
    expect(waltz.bars).toEqual([
      { startTick: 0, beats: 3 },
      { startTick: 3 * B, beats: 3 },
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

  it('leaves a rest’s beats silent', () => {
    expect(timed('C4 r/4 E4/2')).toEqual([
      [60, 0, B],
      [64, 2 * B, 2 * B],
    ])
  })

  it('ties a note to the next of its pitch, into one note', () => {
    expect(timed('C4/2 E4/2~ E4/4 D4/4 C4/2')).toEqual([
      [60, 0, 2 * B],
      [64, 2 * B, 3 * B],
      [62, 5 * B, B],
      [60, 6 * B, 2 * B],
    ])
    expect(() => timed('C4/2~ D4/2')).toThrow(RangeError)
    expect(() => timed('C4/2 C4/2~')).toThrow(RangeError)
    expect(() => timed('r/2~ C4/2')).toThrow(RangeError)
  })

  it('counts a compound meter in dotted quarters: an eighth a third of the beat', () => {
    expect(timed('C4/8 D4/8 E4/8 F4/4. G4/4 A4/8 G4/4.', '6/8')).toEqual([
      [60, 0, B / 3],
      [62, B / 3, B / 3],
      [64, (2 * B) / 3, B / 3],
      [65, B, B],
      [67, 2 * B, (2 * B) / 3],
      [69, (8 * B) / 3, B / 3],
      [67, 3 * B, B],
    ])
    expect(noteLine('C4/4. D4/4.', { hand: 'rh', meter: '6/8', key: C_MAJOR }).bars).toEqual([
      { startTick: 0, beats: 2 },
    ])
  })

  it('needs a note, not only rests', () => {
    expect(() => timed('r/1')).toThrow(RangeError)
  })
})

describe('twoHands', () => {
  it('puts two hands’ lines together, as long as the longer', () => {
    const options = { meter: '4/4', key: { tonic: note('C'), minor: false } } as const
    const both = twoHands(
      noteLine('C5/1', { ...options, hand: 'rh' }),
      noteLine('C3/1 G2/1', { ...options, hand: 'lh' }),
    )
    expect(both.bars).toHaveLength(2)
    expect(both.notes.map((n) => [n.hand, n.midi])).toEqual([
      ['rh', 72],
      ['lh', 48],
      ['lh', 43],
    ])
  })
})
