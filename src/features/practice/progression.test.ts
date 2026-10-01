import { describe, expect, it } from 'vitest'
import { chordSymbol, note, parseNumerals } from '@/shared/lib/music'
import { arrangeProgression, progressionChart } from './progression'

const G = { tonic: note('G'), minor: false }
const C = { tonic: note('C'), minor: false }
const numerals = (text: string) => parseNumerals(text) ?? []
const TWELVE_BAR = 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7'

describe('progressionChart', () => {
  it('writes a chord a bar of 4/4, four bars a line, in the key', () => {
    const chart = progressionChart(numerals('I V vi IV'), G, 'triads')
    expect(chart.key).toEqual(G)
    expect(chart.meter).toBe('4/4')
    expect(
      chart.sections[0]?.lines.map((line) =>
        line.map((bar) => bar.chords.map((chord) => chordSymbol(chord)).join(' ')),
      ),
    ).toEqual([['G', 'D', 'Em', 'C']])
  })

  it('writes a longer progression over more lines', () => {
    expect(progressionChart(numerals(TWELVE_BAR), C, 'triads').sections[0]?.lines).toHaveLength(3)
  })
})

describe('arrangeProgression', () => {
  it('arranges it with a pattern, a bar a chord', () => {
    const performance = arrangeProgression({
      numerals: numerals(TWELVE_BAR),
      key: C,
      pattern: 'block',
      rh: null,
      lh: null,
      inversion: null,
      chordSize: 'triads',
      walk: null,
    })
    expect(performance.bars).toHaveLength(12)
  })

  it('walks it through the keys and home, a key a section', () => {
    const performance = arrangeProgression({
      numerals: numerals('ii V I'),
      key: C,
      pattern: 'block',
      rh: null,
      lh: null,
      inversion: null,
      chordSize: 'sevenths',
      walk: 'semitones-up',
    })
    expect(performance.bars).toHaveLength(39)
    expect(performance.chords.slice(3, 6).map((chord) => chord.symbol)).toEqual([
      'E♭m7',
      'A♭7',
      'D♭Maj7',
    ])
    expect(performance.chords.at(-1)?.symbol).toBe('CMaj7')
  })
})
