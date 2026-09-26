import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { chartSections } from './chart-sections'

const bar = (symbol: string) => ({ chords: [{ ...parseChordSymbol(symbol), beats: 4 }], beats: 4 })
const CHART: Chart = {
  key: { tonic: note('C'), minor: false },
  beatsPerBar: 4,
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
