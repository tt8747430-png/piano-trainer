import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { chartBar, chartSections } from './chart-sections'

const bar = (symbol: string) => ({ chords: [{ ...parseChordSymbol(symbol), beats: 4 }], beats: 4 })
const CHART: Chart = {
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections: [
    { lines: [[bar('C'), bar('F')], [bar('G')]] },
    { lines: [[bar('Am'), bar('F'), bar('C')]] },
  ],
}
const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const

describe('chartSections', () => {
  it('groups the bars by section, then line by line as the chart writes them', () => {
    const performance = arrange(CHART, { tonic: note('C'), pattern: BLOCK })
    expect(chartSections(performance)).toEqual([[[0, 1], [2]], [[3, 4, 5]]])
  })
})

describe('chartBar', () => {
  it('gives a bar its chords’ symbols, the methods they name, and a short bar’s signature', () => {
    const chart: Chart = {
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      sections: [
        {
          lines: [
            [
              { chords: [{ ...parseChordSymbol('G7'), beats: 1 }], beats: 1 },
              {
                chords: [
                  { ...parseChordSymbol('C'), beats: 2, method: 't1' },
                  { ...parseChordSymbol('F'), beats: 2, method: 't1' },
                ],
                beats: 4,
              },
            ],
          ],
        },
      ],
    }
    const performance = arrange(chart, { tonic: note('C'), pattern: BLOCK })
    expect(chartBar(performance, 0)).toEqual({ symbols: ['G7'], methods: [], signature: '1/4' })
    expect(chartBar(performance, 1)).toEqual({
      symbols: ['C', 'F'],
      methods: ['t1'],
      signature: null,
    })
    expect(chartBar(performance, 2)).toBeNull()
  })
})
