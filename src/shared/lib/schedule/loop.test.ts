import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { advanceLoop, beatGroupAt, startLoop } from './loop'
import { audibleHands } from './schedule'

/** One bar of C, a chord on each beat: four beat groups, four seconds at 60 bpm. */
const chart: Chart = {
  key: { tonic: note('C'), mode: 'major' },
  beatsPerBar: 4,
  sections: [{ lines: [[{ chords: [{ ...parseChordSymbol('C'), beats: 4 }], beats: 4 }]] }],
}
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const ONE_BAR = arrange(chart, { tonic: note('C'), pattern: BEATS })
const OPTIONS = { tempo: 60, hands: audibleHands('both') }

describe('startLoop', () => {
  it('queues one pass from the learner’s beat group, at the given time on the clock', () => {
    const loop = startLoop(ONE_BAR, { ...OPTIONS, fromTick: 24 }, 10)
    expect(loop.passes).toHaveLength(1)
    expect(loop.passes[0]?.start).toBe(10)
    expect(loop.passes[0]?.end).toBe(2)
    expect(beatGroupAt(loop, 10)).toBe(2)
  })
})

describe('beatGroupAt', () => {
  const loop = startLoop(ONE_BAR, { ...OPTIONS, countIn: true }, 10)

  it('has none during the count-in', () => {
    expect(beatGroupAt(loop, 9)).toBeNull()
    expect(beatGroupAt(loop, 13.9)).toBeNull()
  })

  it('follows the beat group sounding at a time on the clock', () => {
    expect(beatGroupAt(loop, 14)).toBe(0)
    expect(beatGroupAt(loop, 15.5)).toBe(1)
    expect(beatGroupAt(loop, 17.99)).toBe(3)
  })
})

describe('advanceLoop', () => {
  const counted = startLoop(ONE_BAR, { ...OPTIONS, countIn: true, metronome: true }, 10)

  it('keeps the loop as it is until the next pass is due', () => {
    expect(advanceLoop(counted, 17.4)).toBe(counted)
  })

  it('queues the next pass half a second before the last one ends', () => {
    const next = advanceLoop(counted, 17.5)
    expect(next.passes.map((pass) => pass.start)).toEqual([10, 18])
  })

  it('plays the whole piece again, with the metronome and without the count-in', () => {
    const late = startLoop(
      ONE_BAR,
      { ...OPTIONS, fromTick: 24, countIn: true, metronome: true },
      10,
    )
    const again = advanceLoop(late, 15.5).passes[1]
    expect(again?.start).toBe(16)
    expect(again?.end).toBe(4)
    expect(again?.cues[0]).toEqual({ beatGroup: 0, at: 0 })
    expect(again?.sounds.filter((sound) => sound.kind === 'click')).toHaveLength(4)
  })

  it('drops a pass once it is over, and follows into the next', () => {
    const next = advanceLoop(advanceLoop(counted, 17.5), 18)
    expect(next.passes.map((pass) => pass.start)).toEqual([18])
    expect(beatGroupAt(next, 19)).toBe(1)
  })
})
