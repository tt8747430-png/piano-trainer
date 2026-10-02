import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { exercisePerformance } from './performance'

const C_MAJOR = { tonic: note('C'), minor: false }
const EIGHTH = TICKS_PER_BEAT / 2
const at = (i: number, key: number, hand: 'rh' | 'lh' = 'rh') => ({
  midi: midi(key),
  spelled: note('C'),
  hand,
  startTick: i * EIGHTH,
  durationTicks: EIGHTH,
})

describe('exercisePerformance', () => {
  it('lays notes out in bars of 4/4, four to a line, filling the last bar', () => {
    const notes = Array.from({ length: 35 }, (_, i) => at(i, 60))
    const performance = exercisePerformance({
      key: C_MAJOR,
      notes,
      harmony: [{ chord: { root: note('C'), quality: 'maj' }, startTick: 0 }],
    })
    expect(performance.bars.map((bar) => [bar.line, bar.beats])).toEqual([
      [0, 4],
      [0, 4],
      [0, 4],
      [0, 4],
      [1, 4],
    ])
    expect(performance.totalTicks).toBe(5 * 4 * TICKS_PER_BEAT)
    // A chord lasts until the next, the last to the end.
    expect(performance.chords[0]?.durationTicks).toBe(performance.totalTicks)
  })

  it('names each passage by its chord, the bar it starts in holding it', () => {
    const performance = exercisePerformance({
      key: C_MAJOR,
      notes: Array.from({ length: 16 }, (_, i) => at(i, 60)),
      harmony: [
        { chord: { root: note('D'), quality: 'm7' }, startTick: 0 },
        { chord: { root: note('G'), quality: 'd7' }, startTick: 48 },
      ],
    })
    expect(
      performance.chords.map((chord) => [chord.symbol, chord.bar, chord.durationTicks]),
    ).toEqual([
      ['Dm7', 0, 48],
      ['G7', 1, 48],
    ])
    expect(performance.bars.map((bar) => bar.chords)).toEqual([[0], [1]])
    expect(performance.notes.map((n) => n.chord)).toEqual([
      ...Array(8).fill(0),
      ...Array(8).fill(1),
    ])
  })

  it('groups the notes that start together, lowest first', () => {
    const performance = exercisePerformance({
      key: C_MAJOR,
      notes: [at(0, 60), at(0, 48, 'lh'), at(1, 62)],
      harmony: [{ chord: { root: note('C'), quality: 'maj' }, startTick: 0 }],
    })
    expect(performance.notes.map((n) => n.midi)).toEqual([48, 60, 62])
    expect(performance.beatGroups.map((group) => [group.tick, group.notes])).toEqual([
      [0, [0, 1]],
      [EIGHTH, [2]],
    ])
  })
})
