import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseChordSymbol, type Key } from '@/shared/lib/music'
import { chartInKeys } from './chart-in-keys'
import type { Chart } from './types'

const C_MAJOR: Key = { tonic: note('C'), minor: false }
const wholeBar = (symbol: string) => ({
  chords: [{ ...parseChordSymbol(symbol), beats: 4 }],
  beats: 4,
})
const TWO_FIVE_ONE: Chart = {
  key: C_MAJOR,
  meter: '4/4',
  sections: [{ lines: [[wholeBar('Dm7'), wholeBar('G7')], [wholeBar('Cmaj7')]] }],
}
const symbols = (chart: Chart, section: number) =>
  chart.sections[section]?.lines.flat().flatMap((bar) => bar.chords.map(chordSymbol))

describe('chartInKeys', () => {
  it('plays a chart once per key, a section each, written in C', () => {
    const walked = chartInKeys(TWO_FIVE_ONE, [C_MAJOR, { tonic: note('D', -1), minor: false }])
    expect(walked.key).toEqual(C_MAJOR)
    expect(walked.meter).toBe('4/4')
    expect(walked.sections).toHaveLength(2)
    expect(symbols(walked, 0)).toEqual(['Dm7', 'G7', 'CMaj7'])
    expect(symbols(walked, 1)).toEqual(['E♭m7', 'A♭7', 'D♭Maj7'])
    expect(walked.sections[1]?.lines).toHaveLength(2)
  })

  it('moves a slash chord’s bass with it', () => {
    const chart: Chart = { ...TWO_FIVE_ONE, sections: [{ lines: [[wholeBar('C/E')]] }] }
    expect(symbols(chartInKeys(chart, [{ tonic: note('D'), minor: false }]), 0)).toEqual(['D/F#'])
  })
})
