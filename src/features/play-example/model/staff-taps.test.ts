import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { namesAt, noteColumns, passage } from './staff-taps'

const music: TimedMusic = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  chords: [],
  notes: [
    { midi: midi(64), spelled: note('E'), hand: 'rh', startTick: 0, durationTicks: 24 },
    { midi: midi(60), spelled: note('C'), hand: 'rh', startTick: 0, durationTicks: 24 },
    { midi: midi(62), spelled: note('D'), hand: 'rh', startTick: 24, durationTicks: 24 },
  ],
}

describe('the staff’s taps', () => {
  it('splits the staff half-way between onsets, each column at least a finger wide', () => {
    expect(
      noteColumns([
        { tick: 0, x: 40 },
        { tick: 24, x: 100 },
      ]),
    ).toEqual([
      { tick: 0, left: 20, width: 50 },
      { tick: 24, left: 70, width: 50 },
    ])
    const [close] = noteColumns([
      { tick: 0, x: 40 },
      { tick: 12, x: 46 },
    ])
    expect(close?.width).toBe(24)
  })

  it('takes the notes struck in a stretch as music of their own, from its start', () => {
    expect(passage(music, 24, 48).notes).toEqual([
      { midi: midi(62), spelled: note('D'), hand: 'rh', startTick: 0, durationTicks: 24 },
    ])
  })

  it('names the notes struck together, lowest first', () => {
    expect(namesAt(music, 0)).toBe('C E')
  })
})
