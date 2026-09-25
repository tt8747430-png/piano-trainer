import { describe, expect, it } from 'vitest'
import { chordSymbol, note } from '@/shared/lib/music'
import { ContentError } from './content-error'
import { parseChart } from './parse-chart'
import { testSong } from '../testing/test-pieces'

/** Each bar as its chords' symbols with their beats: 'G 2'. */
const read = (lines: readonly string[], meter: '4/4' | '3/4' = '4/4') =>
  parseChart(testSong(lines, { meter })).sections.flatMap((section) =>
    section.lines.flatMap((line) =>
      line.map((bar) => bar.chords.map((chord) => `${chordSymbol(chord)} ${chord.beats}`)),
    ),
  )

function errorOf(lines: readonly string[]): ContentError {
  try {
    parseChart(testSong(lines))
  } catch (error) {
    if (error instanceof ContentError) return error
    throw error
  }
  throw new Error('the chart parsed')
}

describe('parseChart', () => {
  it('shares a bar equally among chords without beats', () => {
    expect(read(['C Dm G-C'])).toEqual([['C 4'], ['Dm 4'], ['G 2', 'C 2']])
  })

  it('reads given beats', () => {
    const chart = parseChart(testSong(['C@1-C/E@1-Dsus4@1-D/F#@1']))
    const bar = chart.sections[0]?.lines[0]?.[0]
    expect(bar?.chords.map((chord) => chord.beats)).toEqual([1, 1, 1, 1])
    expect(bar?.beats).toBe(4)
  })

  it('lets a bar of given beats be shorter than the meter', () => {
    expect(read(['Dm@1-Edim@1 A7@2'])).toEqual([['Dm 1', 'E° 1'], ['A7 2']])
    const chart = parseChart(testSong(['Dm@1-Edim@1']))
    expect(chart.sections[0]?.lines[0]?.[0]?.beats).toBe(2)
  })

  it('shares what given beats leave', () => {
    expect(read(['Gm/E@2-Asus4-A7'])).toEqual([['Gm/E 2', 'Asus4 1', 'A7 1']])
  })

  it('reads half beats', () => {
    expect(read(['C@1.5-G@.5 F'], '3/4')).toEqual([['C 1.5', 'G 0.5'], ['F 3']])
  })

  it('reads method codes, a bar’s first code standing for the chords without one', () => {
    const methods = (lines: string[]) =>
      parseChart(testSong(lines)).sections[0]?.lines[0]?.flatMap((bar) =>
        bar.chords.map((chord) => chord.method),
      )
    expect(methods(['C:t1 F'])).toEqual(['t1', undefined])
    expect(methods(['C-G:1'])).toEqual(['1', '1'])
  })

  it('spells a slash bass that is a chord tone as that tone', () => {
    const chord = parseChart(testSong(['D#/G'])).sections[0]?.lines[0]?.[0]?.chords[0]
    expect(chord?.bass).toEqual(note('F', 2))
  })

  it('keeps sections, lines and bars as written, in the piece’s key', () => {
    const chart = parseChart(
      testSong([], {
        key: 'Ebm',
        meter: '3/4',
        sections: [
          { kind: 'verse', lines: ['Ebm B', 'Ebm'] },
          { kind: 'chorus', lines: ['Ab'] },
        ],
      }),
    )
    expect(chart.key).toEqual({ tonic: note('E', -1), mode: 'minor' })
    expect(chart.beatsPerBar).toBe(3)
    expect(chart.sections.map((section) => section.lines.map((line) => line.length))).toEqual([
      [2, 1],
      [1],
    ])
  })

  it('names the section, line and bar of an unknown chord', () => {
    const error = errorOf(['C', 'C F Hm'])
    expect(error.pieceId).toBe('bz0')
    expect(error.position).toEqual({ section: 1, line: 2, bar: 3 })
    expect(error.message).toContain('bz0 · section 1, line 2, bar 3')
    expect(error.message).toContain('"Hm"')
  })

  it.each([
    ['C:zz', 'method code "zz"'],
    ['C@0', '"0"'],
    ['C@x', '"x"'],
    ['C@0.3', '"0.3"'],
    ['C@4-G', 'leave no beats'],
    ['C-D-E-F-G', '5 chords'],
    ['  ', 'empty line'],
  ])('refuses %j', (line, problem) => {
    const error = errorOf([line])
    expect(error.message).toContain(problem)
    expect(error.position.section).toBe(1)
    expect(error.position.line).toBe(1)
  })
})
