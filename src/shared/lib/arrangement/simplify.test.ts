import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseChordSymbol } from '@/shared/lib/music'
import { isSimpleChart, simplifyChart } from './simplify'
import type { Chart, ChartBar, ChartChord, ChartSection } from './types'

const chord = (symbol: string, beats: number, method?: string): ChartChord => ({
  ...parseChordSymbol(symbol),
  beats,
  ...(method ? { method } : {}),
})
const bar = (...chords: ChartChord[]): ChartBar => ({
  chords,
  beats: chords.reduce((sum, each) => sum + each.beats, 0),
})
/** A bar of no chord symbol (ADR 0094). */
const NONE: ChartBar = { chords: [], beats: 4 }

/** A chart in G major of these sections. */
const chart = (...sections: ChartSection[]): Chart => ({
  key: { tonic: note('G'), minor: false },
  meter: '4/4',
  sections,
})
/** A section of these lines. */
const lines = (...written: ChartBar[][]): ChartSection => ({ lines: written })

/** Each bar's chords, by line. */
const symbols = (written: Chart) =>
  written.sections.flatMap((section) =>
    section.lines.map((line) => line.map((each) => each.chords.map(chordSymbol).join(' '))),
  )

describe('simplifyChart', () => {
  it('plays every chord as its plain triad, a bar of no chord as it is', () => {
    const written = chart(
      lines(
        [bar(chord('Em7', 2), chord('G/B', 2)), bar(chord('Cmaj7', 4))],
        [NONE, bar(chord('Dsus4', 2), chord('D7', 2))],
      ),
    )
    expect(symbols(simplifyChart(written))).toEqual([
      ['Em G', 'C'],
      ['', 'D D'],
    ])
  })

  it('keeps every chord’s length and method, each bar’s hands and barlines, each section’s key and meter', () => {
    const hands = { rh: [], lh: [] }
    const section: ChartSection = {
      lines: [[{ ...bar(chord('A7', 3, 't1'), chord('Dm7', 1)), repeatStart: true, hands }]],
      key: { tonic: note('D'), minor: true },
      meter: '3/4',
    }
    expect(simplifyChart(chart(section)).sections).toEqual([
      {
        lines: [
          [
            {
              chords: [
                { root: note('A'), quality: 'maj', beats: 3, method: 't1' },
                { root: note('D'), quality: 'min', beats: 1 },
              ],
              beats: 4,
              repeatStart: true,
              hands,
            },
          ],
        ],
        key: { tonic: note('D'), minor: true },
        meter: '3/4',
      },
    ])
  })

  it('leaves a chart of plain triads as it is', () => {
    const plain = chart(lines([bar(chord('G', 4)), NONE, bar(chord('Em', 2), chord('C', 2))]))
    expect(simplifyChart(plain)).toEqual(plain)
  })
})

describe('isSimpleChart', () => {
  it('is a chart Simplify would not change: plain triads and bars of none alone', () => {
    expect(isSimpleChart(chart(lines([bar(chord('G', 4)), NONE, bar(chord('Am', 4))])))).toBe(true)
    expect(isSimpleChart(chart(lines([NONE])))).toBe(true)
    expect(isSimpleChart(chart(lines([bar(chord('G', 4))], [bar(chord('C/E', 4))])))).toBe(false)
    expect(isSimpleChart(chart(lines([bar(chord('Bdim', 4))])))).toBe(false)
  })

  it('reads every section', () => {
    expect(isSimpleChart(chart(lines([bar(chord('G', 4))]), lines([bar(chord('D7', 4))])))).toBe(
      false,
    )
  })
})
