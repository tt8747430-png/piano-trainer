import { describe, expect, it } from 'vitest'
import type { Performance, PerformanceNote } from '@/shared/lib/arrangement'
import { midi, note as spelled, TICKS_PER_BEAT } from '@/shared/lib/music'
import { feedbackOf } from './feedback'
import type { Take } from './types'

const B = TICKS_PER_BEAT

/** A written note of the right hand at a beat. */
const written = (key: number, beat: number): PerformanceNote => ({
  midi: midi(key),
  spelled: spelled('C'),
  hand: 'rh',
  startTick: beat * B,
  durationTicks: B,
  velocity: 80,
})

/** One bar of 4/4: C D E F, a quarter each; at 60 a minute each beat is a second. */
const MUSIC: Pick<Performance, 'notes' | 'bars'> = {
  notes: [written(60, 0), written(62, 1), written(64, 2), written(65, 3)],
  bars: [{ startTick: 0, beats: 4, section: 0, line: 0, chords: [] }],
}

const played = (key: number, at: number) => ({ midi: midi(key), at, held: 200, velocity: 80 })

const take = (...notes: ReturnType<typeof played>[]): Take => ({
  id: 'take-1',
  pieceId: 'bz1',
  made: 0,
  tempo: 60,
  meter: '4/4',
  fromBar: 1,
  length: 4000,
  bars: [0, 4000],
  notes,
  pedals: [],
})

describe('feedbackOf', () => {
  it('judges each note right, wrong, missed, early or late', () => {
    const feedback = feedbackOf(
      MUSIC,
      take(played(60, 30), played(61, 1000), played(64, 1800), played(65, 3150)),
    )
    expect(feedback.notes.map((each) => each.verdict)).toEqual(['right', 'wrong', 'early', 'late'])
    expect(feedback.counts).toEqual({ right: 1, wrong: 1, missed: 0, early: 1, late: 1 })
    expect(feedback.percent).toBe(25)
  })

  it('misses a note no key was played for', () => {
    const feedback = feedbackOf(MUSIC, take(played(60, 0), played(62, 1000), played(64, 2000)))
    expect(feedback.notes.map((each) => each.verdict)).toEqual([
      'right',
      'right',
      'right',
      'missed',
    ])
    expect(feedback.percent).toBe(75)
  })

  it('scores on timing alone in the Rhythm game: any key counts', () => {
    const feedback = feedbackOf(
      MUSIC,
      take(played(40, 0), played(41, 1000), played(42, 2200), played(43, 3000)),
      { rhythm: true },
    )
    expect(feedback.notes.map((each) => each.verdict)).toEqual(['right', 'right', 'late', 'right'])
    expect(feedback.counts.wrong).toBe(0)
  })

  it('judges nothing outside the take', () => {
    expect(feedbackOf(MUSIC, { ...take(), fromBar: 2, bars: [0, 4000] }).notes).toEqual([])
  })
})
