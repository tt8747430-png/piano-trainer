import { describe, expect, it } from 'vitest'
import { arrange, parseFigure, type Chart } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { chartBar, chartSections, gridColumns, gridRows, sectionBars } from './chart-sections'

describe('gridColumns', () => {
  const bars = (...slots: number[]) => slots.map((slot) => ({ cells: slot, slot }))

  it('holds as many whole bars of the commonest length as the room does', () => {
    expect(gridColumns(bars(4, 4, 4, 4), 8)).toBe(8)
    expect(gridColumns(bars(3, 3, 3), 8)).toBe(6)
    expect(gridColumns(bars(2, 2, 3, 2), 8)).toBe(8)
    expect(gridColumns(bars(4, 4), 32)).toBe(32)
  })

  it('takes a bar longer than the room whole', () => {
    expect(gridColumns(bars(12, 4), 8)).toBe(12)
    expect(gridColumns([], 8)).toBe(1)
  })
})

describe('gridRows', () => {
  it('lays bars on rows of whole places, a pickup at the end of a whole bar’s', () => {
    const pickup = { cells: 1, slot: 4 }
    const bar = { cells: 4, slot: 4 }
    expect(gridRows([pickup, bar, bar, bar, bar], 8)).toEqual([
      [
        { index: 0, column: 0, lead: 3 },
        { index: 1, column: 4, lead: 0 },
      ],
      [
        { index: 2, column: 0, lead: 0 },
        { index: 3, column: 4, lead: 0 },
      ],
      [{ index: 4, column: 0, lead: 0 }],
    ])
  })

  it('moves a bar that does not fit to the next row, and takes one longer than a row alone', () => {
    const three = { cells: 3, slot: 3 }
    const four = { cells: 4, slot: 4 }
    expect(gridRows([four, three, four], 8).map((row) => row.map(({ index }) => index))).toEqual([
      [0, 1],
      [2],
    ])
    expect(gridRows([{ cells: 12, slot: 12 }, four], 8)).toEqual([
      [{ index: 0, column: 0, lead: 0 }],
      [{ index: 1, column: 0, lead: 0 }],
    ])
    expect(gridRows([], 8)).toEqual([])
  })
})

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

  it('keeps each bar as written once, where the Player plays the repeats (ADR 0067, 0098)', () => {
    const repeated: Chart = {
      ...CHART,
      sections: [
        {
          lines: [
            [
              { ...bar('C'), repeatStart: true },
              { ...bar('F'), barline: 'repeat' },
            ],
            [bar('G')],
          ],
        },
      ],
    }
    const played = arrange(repeated, { tonic: note('C'), pattern: BLOCK, unfold: true })
    // Played C F C F G.
    expect(played.bars).toHaveLength(5)
    expect(chartSections(played)).toEqual([[[0, 1], [2]]])
    expect(chartBar(played, 2)).toEqual({
      symbols: ['G'],
      methods: [],
      signature: null,
      short: false,
    })
  })
})

describe('sectionBars', () => {
  it('spans a section from its first bar to its last, and none where it has no bars', () => {
    expect(sectionBars([[3, 4], [5]])).toEqual({ first: 3, last: 5 })
    expect(sectionBars([[7]])).toEqual({ first: 7, last: 7 })
    expect(sectionBars([])).toBeNull()
  })
})

describe('chartBar', () => {
  it('gives a bar its chords’ symbols, the methods they name, and whether it is short', () => {
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
    expect(chartBar(performance, 0)).toEqual({
      symbols: ['G7'],
      methods: [],
      signature: null,
      short: true,
    })
    expect(chartBar(performance, 1)).toEqual({
      symbols: ['C', 'F'],
      methods: ['t1'],
      signature: null,
      short: false,
    })
    expect(chartBar(performance, 2)).toBeNull()
  })

  it('gives a section’s first bar in a meter of its own its signature, and the bar back in the piece’s (ADR 0095)', () => {
    const changing: Chart = {
      ...CHART,
      sections: [
        { lines: [[bar('C')]] },
        {
          meter: '2/4',
          lines: [
            [
              { chords: [{ ...parseChordSymbol('F'), beats: 2 }], beats: 2 },
              { chords: [{ ...parseChordSymbol('G'), beats: 2 }], beats: 2 },
            ],
          ],
        },
        { lines: [[bar('C')]] },
      ],
    }
    const performance = arrange(changing, { tonic: note('C'), pattern: BLOCK })
    expect([0, 1, 2, 3].map((written) => chartBar(performance, written)?.signature)).toEqual([
      null,
      '2/4',
      null,
      '4/4',
    ])
  })
})
