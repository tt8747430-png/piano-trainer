import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { advanceLoop, beatGroupAt, startLoop, tempoAt } from './loop'
import { audibleHands } from './schedule'

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
const OPTIONS = {
  tempo: 60,
  hands: audibleHands('both'),
  range: { from: 0, to: 48 },
  fromTick: 0,
}

describe('startLoop', () => {
  it('queues one pass from the cursor to the passage’s end, at the given time', () => {
    const loop = startLoop(ONE_BAR, { ...OPTIONS, fromTick: 24 }, 10)
    expect(loop.passes).toHaveLength(1)
    expect(loop.passes[0]).toMatchObject({ start: 10, end: 2, tempo: 60 })
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
    expect(advanceLoop(counted, 17.5).passes.map((pass) => pass.start)).toEqual([10, 18])
  })

  it('plays the passage again from its start, with the metronome and without the count-in', () => {
    const late = startLoop(
      ONE_BAR,
      { ...OPTIONS, fromTick: 24, countIn: true, metronome: true },
      10,
    )
    const again = advanceLoop(late, 15.5).passes[1]
    expect(again).toMatchObject({ start: 16, end: 4 })
    expect(again?.cues[0]).toEqual({ beatGroup: 0, at: 0 })
    expect(again?.sounds.filter((sound) => sound.kind === 'click')).toHaveLength(4)
  })

  it('loops only the passage', () => {
    const passage = startLoop(ONE_BAR, { ...OPTIONS, range: { from: 12, to: 36 }, fromTick: 24 }, 0)
    const again = advanceLoop(passage, 0.5).passes[1]
    expect(again?.cues.map((cue) => cue.beatGroup)).toEqual([1, 2])
    expect(again).toMatchObject({ start: 1, end: 2 })
  })

  it('drops a pass once it is over, and follows into the next', () => {
    const next = advanceLoop(advanceLoop(counted, 17.5), 18)
    expect(next.passes.map((pass) => pass.start)).toEqual([18])
    expect(beatGroupAt(next, 19)).toBe(1)
  })
})

describe('speed training', () => {
  it('plays each pass faster by the step, up to where it stops, and says the tempo sounding', () => {
    let loop = startLoop(ONE_BAR, { ...OPTIONS, tempo: 60, speedUp: { step: 30, until: 120 } }, 0)
    for (let time = 0; time < 12; time += 0.25) loop = advanceLoop(loop, time)
    expect(tempoAt(loop, 0.1)).toBeNull()
    const started = startLoop(
      ONE_BAR,
      { ...OPTIONS, tempo: 60, speedUp: { step: 30, until: 120 } },
      0,
    )
    const second = advanceLoop(started, 3.5)
    expect(second.passes.map((pass) => [pass.start, pass.tempo, pass.end])).toEqual([
      [0, 60, 4],
      [4, 90, 48 / 18],
    ])
    expect(tempoAt(second, 1)).toBe(60)
    expect(tempoAt(second, 4.5)).toBe(90)
    const third = advanceLoop(advanceLoop(second, 4), 6.2)
    expect(third.passes.at(-1)?.tempo).toBe(120)
    const fourth = advanceLoop(third, 20)
    expect(fourth.passes.at(-1)?.tempo).toBe(120)
  })
})
