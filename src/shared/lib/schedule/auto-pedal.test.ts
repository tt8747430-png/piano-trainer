import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart, type Performance } from '@/shared/lib/arrangement'
import { C_MAJOR, note, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import { autoPedal, withPedal } from './auto-pedal'

const B = TICKS_PER_BEAT

const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const

/** Bars of chords, each `symbol@beats` (`_` a bar of no chord). */
const perform = (...bars: string[][]): Performance => {
  const chart: Chart = {
    key: C_MAJOR,
    meter: '4/4',
    sections: [
      {
        lines: [
          bars.map((chords) => ({
            chords: chords
              .filter((each) => each !== '_')
              .map((each) => {
                const [symbol = '', beats = '4'] = each.split('@')
                return { ...parseChordSymbol(symbol), beats: Number(beats) }
              }),
            beats: 4,
          })),
        ],
      },
    ],
    pedal: [{ tick: 0, kind: 'down' }],
  }
  return arrange(chart, { tonic: note('C'), pattern: BLOCK })
}

const line = (performance: Performance) =>
  autoPedal(performance).map(({ tick, kind }) => `${kind}@${tick / B}`)

describe('autoPedal', () => {
  it('changes the pedal with each new chord, and lets it up at the end', () => {
    expect(line(perform(['C@2', 'G@2'], ['G@4'], ['Am@4']))).toEqual([
      'down@0',
      'change@2',
      'change@8',
      'up@12',
    ])
  })

  it('lets it up through a bar of no chord, pressing it again at the next chord', () => {
    expect(line(perform(['C@4'], ['_'], ['F@4']))).toEqual(['down@0', 'up@4', 'down@8', 'up@12'])
  })

  it('changes it at each bar where the music has no chord symbols', () => {
    expect(line(perform(['_'], ['_'], ['_']))).toEqual(['down@0', 'change@4', 'change@8', 'up@12'])
  })
})

describe('withPedal', () => {
  it('plays the pedal as written, not at all, or automatically', () => {
    const written = perform(['C@2', 'G@2'])
    expect(withPedal(written, 'written')).toBe(written)
    expect(withPedal(written, 'off').pedal).toEqual([])
    expect(withPedal(written, 'automatic').pedal).toEqual(autoPedal(written))
  })
})
