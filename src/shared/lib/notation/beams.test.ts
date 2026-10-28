import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT, type Meter, type TimeSignature } from '@/shared/lib/music'
import { beamPlan } from './beams'
import type { NoteValue, ScoreEvent } from './types'
import { ticksOf } from './values'

/**
 * A voice's events from `value[.][t]` and `r<value>`, laid end to end from `start`; `t` a triplet,
 * each beat of them a tuplet of its own.
 */
function voice(text: string, meter: Meter, start = 0): ScoreEvent[] {
  let tick = start
  return text.split(' ').map((token) => {
    const rest = token.startsWith('r')
    const dotted = token.endsWith('.')
    const triplet = token.includes('t')
    const value = Number(token.replace(/[^0-9]/g, '')) as NoteValue
    const duration = {
      value,
      dots: dotted ? 1 : 0,
      ...(triplet ? { tuplet: { num: 3, numbase: 2 } } : {}),
    } as const
    const inTuplet = triplet ? { tupletAt: Math.floor(tick / TICKS_PER_BEAT) * TICKS_PER_BEAT } : {}
    const event: ScoreEvent = rest
      ? { kind: 'rest', tick, duration, hidden: false, ...inTuplet }
      : { kind: 'notes', tick, duration, notes: [], ...inTuplet }
    tick += ticksOf(duration, meter)
    return event
  })
}

const time = (count: number, unit: number): TimeSignature => ({ count, unit }) as TimeSignature

describe('beamPlan', () => {
  it('beams 4/4 eighths by the half bar, as LilyPond (4 4)', () => {
    const events = voice('8 8 8 8 8 8 8 8', '4/4')
    expect(beamPlan(events, '4/4', time(4, 4), 0).beams).toEqual([
      [0, 1, 2, 3],
      [4, 5, 6, 7],
    ])
  })

  it('never beams across the middle of a 4/4 bar', () => {
    const events = voice('4 8 8 8 8 4', '4/4')
    expect(beamPlan(events, '4/4', time(4, 4), 0).beams).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('beams three eighths before a rest in the first half', () => {
    const events = voice('8 8 8 r8 r2', '4/4')
    expect(beamPlan(events, '4/4', time(4, 4), 0).beams).toEqual([[0, 1, 2]])
  })

  it('beams a beam with sixteenths by the beat', () => {
    const events = voice('16 16 16 16 8 8 2', '4/4')
    expect(beamPlan(events, '4/4', time(4, 4), 0).beams).toEqual([
      [0, 1, 2, 3],
      [4, 5],
    ])
  })

  it('beams 3/4 eighths over the whole bar', () => {
    const events = voice('4 8 8 8 8', '3/4')
    expect(beamPlan(events, '3/4', time(3, 4), 0).beams).toEqual([[1, 2, 3, 4]])
  })

  it('beams 2/4 eighths by the beat', () => {
    const events = voice('8 8 8 8', '2/4')
    expect(beamPlan(events, '2/4', time(2, 4), 0).beams).toEqual([
      [0, 1],
      [2, 3],
    ])
  })

  it('beams 6/8 eighths by the dotted quarter', () => {
    const events = voice('8 8 8 8 8 8', '6/8')
    expect(beamPlan(events, '6/8', time(6, 8), 0).beams).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ])
  })

  it('counts a pickup from where its bar would start', () => {
    // A 4/4 pickup of two beats: its eighths are the bar's second half, one beam.
    const events = voice('8 8 8 8', '4/4', 2 * TICKS_PER_BEAT)
    expect(beamPlan(events, '4/4', time(4, 4), 0).beams).toEqual([[0, 1, 2, 3]])
  })

  it('puts each beat of triplets in a tuplet of its own, its eighths beamed', () => {
    const events = voice('8t 8t 8t 8t 8t 8t 2', '4/4')
    const plan = beamPlan(events, '4/4', time(4, 4), 0)
    expect(plan.tuplets).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ])
    expect(plan.beams).toEqual([
      [0, 1, 2],
      [3, 4, 5],
    ])
  })

  it('leaves a lone eighth and the quarters unbeamed', () => {
    const events = voice('4. 8 4 4', '4/4')
    expect(beamPlan(events, '4/4', time(4, 4), 0).beams).toEqual([])
  })
  describe('the meters of ADR 0114, as LilyPond’s beat structure', () => {
    it('beams 2/2 eighths by the half', () => {
      const events = voice('8 8 8 8 8 8 8 8', '2/2')
      expect(beamPlan(events, '2/2', time(2, 2), 0).beams).toEqual([
        [0, 1, 2, 3],
        [4, 5, 6, 7],
      ])
    })

    it('beams 3/2 eighths by the half', () => {
      const events = voice('8 8 8 8 8 8 8 8 8 8 8 8', '3/2')
      expect(beamPlan(events, '3/2', time(3, 2), 0).beams).toEqual([
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
      ])
    })

    it('beams 5/4 eighths 3+2', () => {
      const events = voice('8 8 8 8 8 8 8 8 8 8', '5/4')
      expect(beamPlan(events, '5/4', time(5, 4), 0).beams).toEqual([
        [0, 1, 2, 3, 4, 5],
        [6, 7, 8, 9],
      ])
    })

    it('beams 6/4 eighths 3+3', () => {
      const events = voice('8 8 8 8 8 8 8 8 8 8 8 8', '6/4')
      expect(beamPlan(events, '6/4', time(6, 4), 0).beams).toEqual([
        [0, 1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10, 11],
      ])
    })

    it('beams 7/8 eighths 2+2+3', () => {
      const events = voice('8 8 8 8 8 8 8', '7/8')
      expect(beamPlan(events, '7/8', time(7, 8), 0).beams).toEqual([
        [0, 1],
        [2, 3],
        [4, 5, 6],
      ])
    })

    it('beams 9/8 eighths by the dotted quarter', () => {
      const events = voice('8 8 8 8 8 8 8 8 8', '9/8')
      expect(beamPlan(events, '9/8', time(9, 8), 0).beams).toEqual([
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ])
    })
  })
})
