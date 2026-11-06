import { describe, expect, it } from 'vitest'
import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { midi, note as spelled, TICKS_PER_BEAT } from '@/shared/lib/music'
import { barShares, nextStep, practiceSummary } from './practice-summary'
import type { Take } from './types'

const B = TICKS_PER_BEAT

const written = (key: number, beat: number): PerformanceNote => ({
  midi: midi(key),
  spelled: spelled('C'),
  hand: 'rh',
  startTick: beat * B,
  durationTicks: B,
  velocity: 80,
})

/** Two bars of 4/4, a quarter each beat; at 60 a minute each beat is a second. */
const MUSIC: Pick<Performance, 'notes' | 'bars'> = {
  notes: [0, 1, 2, 3, 4, 5, 6, 7].map((beat) => written(60 + beat, beat)),
  bars: [
    { startTick: 0, beats: 4, section: 0, line: 0, chords: [] },
    { startTick: 4 * B, beats: 4, section: 0, line: 0, chords: [] },
  ],
}

const take = (made: number, keys: readonly number[], tempo = 60): Take => ({
  id: `take-${made + 1}`,
  pieceId: 'bz1',
  made,
  tempo,
  meter: '4/4',
  fromBar: 1,
  bars: [0, 4000, 8000],
  length: 8000,
  pedals: [],
  notes: keys.map((key, beat) => ({ midi: midi(key), at: beat * 1000, held: 200, velocity: 80 })),
})

describe('barShares', () => {
  it('gives each bar its share of judged notes played right, null where none was judged', () => {
    const feedback = {
      notes: [
        { tick: 0, midi: midi(60), verdict: 'right' as const },
        { tick: B, midi: midi(61), verdict: 'wrong' as const },
      ],
    }
    expect(barShares(feedback, MUSIC.bars)).toEqual([0.5, null])
  })
})

describe('practiceSummary', () => {
  it('says the last take’s share, the best, its bars and its speed', () => {
    const all = [60, 61, 62, 63, 64, 65, 66, 67]
    const firstHalf = [60, 61, 62, 63, 0, 0, 0, 0]
    const summary = practiceSummary(MUSIC, [take(2, firstHalf, 45), take(1, all)], 60)
    expect(summary).toEqual({ last: 50, best: 100, bars: [1, 0], speed: 0.75 })
  })

  it('says nothing before the first take', () => {
    expect(practiceSummary(MUSIC, [], 60)).toBeNull()
  })
})

describe('nextStep', () => {
  it('loops the weakest pair of bars at 70 % while they are under 80 % right', () => {
    expect(nextStep({ bars: [1, 0.9, 0.4, 0.6, 1], speed: 1 })).toEqual({
      kind: 'loop',
      bars: { first: 2, last: 3 },
      speed: 0.7,
    })
  })

  it('loops a weak last bar alone', () => {
    expect(nextStep({ bars: [1, 0.5], speed: 1 })).toEqual({
      kind: 'loop',
      bars: { first: 1, last: 1 },
      speed: 0.7,
    })
  })

  it('climbs the tempo once every bar is strong, 50 → 75 → 100 %', () => {
    expect(nextStep({ bars: [1, 0.9], speed: 0.5 })).toEqual({ kind: 'tempo', speed: 0.75 })
    expect(nextStep({ bars: [1, 0.9], speed: 0.75 })).toEqual({ kind: 'tempo', speed: 1 })
  })

  it('offers nothing once the song is played well at full speed', () => {
    expect(nextStep({ bars: [1, 0.95], speed: 1 })).toBeNull()
  })
})
