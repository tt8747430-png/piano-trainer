import { describe, expect, it } from 'vitest'
import { chordSymbol, note } from '@/shared/lib/music'
import { arrangeWalk, walkChart, WALK } from './walk'

const symbols = (chart: ReturnType<typeof walkChart>) =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) => line.flatMap((bar) => bar.chords.map(chordSymbol))),
  )

describe('walkChart', () => {
  it('walks a scale’s chords up to the tonic’s octave and back, a bar each, four bars a line', () => {
    const chart = walkChart(note('C'), 'major', 'triads')
    expect(symbols(chart)).toEqual([
      'C',
      'Dm',
      'Em',
      'F',
      'G',
      'Am',
      'B°',
      'C',
      'B°',
      'Am',
      'G',
      'F',
      'Em',
      'Dm',
      'C',
    ])
    expect(chart.sections[0]?.lines.map((line) => line.length)).toEqual([4, 4, 4, 3])
    expect(chart.meter).toBe('4/4')
  })

  it('grows each chord to its 9th only where the 9th is available', () => {
    expect(symbols(walkChart(note('C'), 'major', 'ninths')).slice(0, 7)).toEqual([
      'CMaj9',
      'Dm9',
      'Em7',
      'FMaj9',
      'G9',
      'Am9',
      'Bm7♭5',
    ])
  })

  it('writes a mode in its parent’s key', () => {
    expect(walkChart(note('D'), 'dorian', 'sevenths').key).toEqual({
      tonic: note('C'),
      minor: false,
    })
  })
})

describe('arrangeWalk', () => {
  it('arranges the walk with the chosen pattern, fifteen bars', () => {
    const performance = arrangeWalk({
      root: note('D'),
      kind: 'dorian',
      pattern: WALK.pattern,
      rh: null,
      lh: null,
      chordSize: 'sevenths',
    })
    expect(performance.bars).toHaveLength(15)
    expect(performance.chords[0]?.symbol).toBe('Dm7')
    expect(performance.chords[3]?.symbol).toBe('G7')
  })
})
