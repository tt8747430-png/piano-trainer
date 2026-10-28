import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'
import { namesAt, noteColumns, onsetsOf, passage, staffAt } from './staff-taps'

const B = TICKS_PER_BEAT

const music: TimedMusic = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  bars: [{ startTick: 0, beats: 4 }],
  chords: [],
  notes: [
    { midi: midi(64), spelled: note('E'), hand: 'rh', startTick: 0, durationTicks: 2 * B },
    { midi: midi(60), spelled: note('C'), hand: 'rh', startTick: 0, durationTicks: 2 * B },
    { midi: midi(62), spelled: note('D'), hand: 'rh', startTick: 2 * B, durationTicks: 2 * B },
  ],
}

describe('the staff’s taps', () => {
  it('splits the staff half-way between onsets, each column at least a finger wide', () => {
    expect(
      noteColumns([
        { tick: 0, x: 40 },
        { tick: 2 * B, x: 100 },
      ]),
    ).toEqual([
      { tick: 0, left: 20, width: 50 },
      { tick: 2 * B, left: 70, width: 50 },
    ])
    // Two close onsets: each column a finger wide (44px), centred on its note.
    const [close] = noteColumns([
      { tick: 0, x: 40 },
      { tick: B, x: 46 },
    ])
    expect(close).toEqual({ tick: 0, left: 18, width: 44 })
    // Two half notes on a card's small staff (43px apart): each column grown to a finger's width.
    expect(
      noteColumns([
        { tick: 0, x: 30 },
        { tick: 2 * B, x: 76 },
      ]),
    ).toEqual([
      { tick: 0, left: 8, width: 44 },
      { tick: 2 * B, left: 54, width: 44 },
    ])
  })

  it('takes the notes struck in a stretch as music of their own, from its start', () => {
    expect(passage(music, 2 * B, 4 * B).notes).toEqual([
      { midi: midi(62), spelled: note('D'), hand: 'rh', startTick: 0, durationTicks: 2 * B },
    ])
  })

  it('names the notes struck together, lowest first', () => {
    expect(namesAt(music, 0)).toBe('C E')
  })

  it('lists where the notes start, each once, in seconds at a tempo', () => {
    // 24 ticks a beat at 60 beats a minute: two seconds from the first onset to the next.
    expect(onsetsOf(music, 60)).toEqual({ ticks: [0, 2 * B], seconds: [0, 2] })
  })

  it('marks a note sounding on its own staff, the right hand’s first', () => {
    const both: TimedMusic = {
      ...music,
      notes: [
        { midi: midi(48), spelled: note('C'), hand: 'lh', startTick: 0, durationTicks: 2 * B },
        { midi: midi(64), spelled: note('E'), hand: 'rh', startTick: 0, durationTicks: 2 * B },
        { midi: midi(43), spelled: note('G'), hand: 'lh', startTick: 2 * B, durationTicks: 2 * B },
      ],
    }
    expect(staffAt(both, 0)).toBe('treble')
    expect(staffAt(both, 48)).toBe('bass')
  })
})
