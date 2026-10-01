import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { describe, expect, it } from 'vitest'
import type { Chart } from '@/shared/lib/arrangement'
import { CHORD_QUALITIES, chordSymbol, note, PITCH_CLASSES, rootSpelling } from '@/shared/lib/music'
import { arrangeChromatic, chromaticChart } from './chromatic'
import { chordsParam, CHROMATIC, CHROMATIC_DIRECTIONS, readChords } from './chromatic-choice'

const symbols = (chart: Chart) =>
  chart.sections.flatMap((section) =>
    section.lines.flatMap((line) => line.flatMap((bar) => bar.chords.map(chordSymbol))),
  )

const [firstQuality, ...otherQualities] = CHORD_QUALITIES
if (!firstQuality) throw new Error('the table is empty')
/** Every quality of the table, as a walk's chords. */
const EVERY_CHORD = [firstQuality, ...otherQualities] as const

describe('chromaticChart', () => {
  it('walks a chord up by semitones to its root’s octave, a bar each, four bars a line, in C', () => {
    const chart = chromaticChart(note('G'), ['m9'], 'up')
    expect(symbols(chart)).toEqual([
      'Gm9',
      'G#m9',
      'Am9',
      'B♭m9',
      'Bm9',
      'Cm9',
      'C#m9',
      'Dm9',
      'E♭m9',
      'Em9',
      'Fm9',
      'F#m9',
      'Gm9',
    ])
    expect(chart.sections[0]?.lines.map((line) => line.length)).toEqual([4, 4, 4, 1])
    expect(chart.key).toEqual({ tonic: note('C'), minor: false })
    expect(chart.meter).toBe('4/4')
  })

  it('plays every chosen chord on a root before the next, in the table’s order, each spelled its way', () => {
    expect(symbols(chromaticChart(note('G'), ['n9', 'm9', 'maj9'], 'up')).slice(0, 6)).toEqual([
      'Gm9',
      'GMaj9',
      'G9',
      'G#m9',
      'A♭Maj9',
      'A♭9',
    ])
  })

  it('goes down to the octave below, or up and back with the octave once', () => {
    expect(symbols(chromaticChart(note('C'), ['maj'], 'down'))).toEqual([
      'C',
      'B',
      'B♭',
      'A',
      'A♭',
      'G',
      'F#',
      'F',
      'E',
      'E♭',
      'D',
      'D♭',
      'C',
    ])
    const both = symbols(chromaticChart(note('C'), ['maj'], 'both'))
    expect(both).toHaveLength(25)
    expect(both.slice(11, 14)).toEqual(['B', 'C', 'B'])
    expect(both.at(-1)).toBe('C')
  })
})

describe('the chords param', () => {
  it('reads known chords once each in the table’s order; none is the walk’s own', () => {
    expect(readChords('n9.m9.xx.m9')).toEqual(['m9', 'n9'])
    expect(readChords('xx')).toEqual(CHROMATIC.chords)
    expect(readChords('')).toEqual(CHROMATIC.chords)
    expect(readChords(undefined)).toEqual(CHROMATIC.chords)
    expect(chordsParam(['n9', 'm9'])).toBe('m9.n9')
  })
})

describe('arrangeChromatic', () => {
  it.each(CHROMATIC_DIRECTIONS)(
    'arranges every chord from every root going %s, every note on the piano',
    (direction) => {
      for (const pc of PITCH_CLASSES) {
        const performance = arrangeChromatic(
          {
            root: rootSpelling(pc, false),
            chords: EVERY_CHORD,
            direction,
            pattern: CHROMATIC.pattern,
            rh: null,
            lh: null,
            inversion: null,
          },
          BUILT_IN_PATTERNS,
        )
        expect(performance.bars).toHaveLength(
          (direction === 'both' ? 25 : 13) * CHORD_QUALITIES.length,
        )
        expect(performance.notes.filter((n) => n.midi < 21 || n.midi > 108)).toEqual([])
      }
    },
  )
})
