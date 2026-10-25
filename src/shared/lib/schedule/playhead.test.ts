import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { advanceLoop, startLoop, tickAt } from './loop'
import { passTickAt } from './playhead'
import { audibleHands, schedule } from './schedule'

/** One bar of C, a chord on each beat: four beat groups, four seconds at 60 bpm. */
const chart: Chart = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [{ lines: [[{ chords: [{ ...parseChordSymbol('C'), beats: 4 }], beats: 4 }]] }],
}
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const ONE_BAR = arrange(chart, { tonic: note('C'), pattern: BEATS })
const HANDS = audibleHands('both')

describe('passTickAt', () => {
  const pass = schedule(ONE_BAR, { tempo: 60, hands: HANDS })

  it('is each beat group’s tick as it sounds', () => {
    expect(pass.cues.map((cue) => cue.tick)).toEqual([0, 24, 48, 72])
    expect(passTickAt(pass, 0)).toBe(0)
    expect(passTickAt(pass, 2)).toBe(48)
  })

  it('moves between two beat groups in proportion to the time between them', () => {
    expect(passTickAt(pass, 0.5)).toBe(12)
    expect(passTickAt(pass, 2.25)).toBe(54)
  })

  it('moves on to the pass’s end after its last beat group, and stays there', () => {
    expect(passTickAt(pass, 3.5)).toBe(84)
    expect(passTickAt(pass, 9)).toBe(96)
  })

  it('is nowhere before the music starts: a count-in', () => {
    const counted = schedule(ONE_BAR, { tempo: 60, hands: HANDS, countIn: true })
    expect(passTickAt(counted, 3.9)).toBeNull()
    expect(passTickAt(counted, 4.5)).toBe(12)
  })

  it('starts where a pass starts, a passage’s end its own', () => {
    const passage = schedule(ONE_BAR, { tempo: 60, hands: HANDS, fromTick: 24, toTick: 72 })
    expect(passTickAt(passage, 0)).toBe(24)
    expect(passTickAt(passage, 1.5)).toBe(60)
    expect(passTickAt(passage, 5)).toBe(72)
  })
})

describe('tickAt: Listen’s loop', () => {
  const options = { tempo: 60, hands: HANDS, range: { from: 0, to: 96 }, fromTick: 48 }

  it('follows the pass sounding on the clock, none before its first beat group', () => {
    const loop = startLoop(ONE_BAR, options, 10)
    expect(tickAt(loop, 9.5)).toBeNull()
    expect(tickAt(loop, 10.5)).toBe(60)
  })

  it('goes round into the next pass, from the passage’s start', () => {
    const loop = advanceLoop(startLoop(ONE_BAR, options, 10), 11.5)
    expect(tickAt(loop, 11.9)).toBeCloseTo(93.6)
    expect(tickAt(loop, 12.5)).toBe(12)
  })
})
