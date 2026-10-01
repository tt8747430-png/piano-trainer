import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import type { ChartBar } from '@/shared/lib/arrangement'
import { ContentError } from './content-error'
import { parseChart } from './parse-chart'
import { testSong } from '../testing/test-pieces'
import type { Hands } from './types'

const barsOf = (lines: readonly string[], hands: Hands, meter: '4/4' | '3/4' = '4/4'): ChartBar[] =>
  parseChart(testSong(lines, { hands, meter })).sections.flatMap((section) => section.lines.flat())

function errorOf(lines: readonly string[], hands: Hands): ContentError {
  try {
    parseChart(testSong(lines, { hands }))
  } catch (error) {
    if (error instanceof ContentError) return error
    throw error
  }
  throw new Error('the hands parsed')
}

describe('a written hand', () => {
  it('leaves a bar marked - to the pattern, and writes the others note after note', () => {
    const [first, second] = barsOf(['C G'], { rh: '- | C4/1 E4/1 G4/2' })
    expect(first?.hands).toBeUndefined()
    expect(second?.hands?.rh).toEqual([
      { midi: 60, spelled: note('C'), startTick: 0, durationTicks: 12 },
      { midi: 64, spelled: note('E'), startTick: 12, durationTicks: 12 },
      { midi: 67, spelled: note('G'), startTick: 24, durationTicks: 24 },
    ])
    expect(second?.hands?.lh).toBeUndefined()
  })

  it('reads notes struck together, each with its finger', () => {
    const [bar] = barsOf(['C'], { rh: 'C4^1+E4^3+G4^5/4' })
    expect(bar?.hands?.rh?.map((n) => [n.midi, n.startTick, n.durationTicks, n.finger])).toEqual([
      [60, 0, 48, 1],
      [64, 0, 48, 3],
      [67, 0, 48, 5],
    ])
  })

  it('places a token on a beat counted from 1, so a held note and the notes over it are both written', () => {
    const [bar] = barsOf(['C'], { lh: 'C3/4 E3+G3/1@2 E3+G3/1 r/.5 G3/.5@4.5' })
    expect(bar?.hands?.lh?.map((n) => [n.midi, n.startTick, n.durationTicks])).toEqual([
      [48, 0, 48],
      [52, 12, 12],
      [55, 12, 12],
      [52, 24, 12],
      [55, 24, 12],
      [55, 42, 6],
    ])
  })

  it('writes a bar with no notes as silence, not the pattern', () => {
    const [bar] = barsOf(['C'], { lh: 'r/4' })
    expect(bar?.hands).toEqual({ lh: [] })
  })

  it('holds a note across the barline into a bar the hand writes too', () => {
    const [first] = barsOf(['C G'], { lh: 'C3/6 | G3/2@3' })
    expect(first?.hands?.lh).toEqual([
      { midi: 48, spelled: note('C'), startTick: 0, durationTicks: 72 },
    ])
  })

  it('reads every bar of every section in order', () => {
    const bars = parseChart(
      testSong([], {
        sections: [
          { kind: 'verse', lines: ['C', 'F'] },
          { kind: 'chorus', lines: ['G'] },
        ],
        hands: { rh: '- | - | B3/4' },
      }),
    ).sections.flatMap((section) => section.lines.flat())
    expect(bars.map((bar) => bar.hands?.rh?.length)).toEqual([undefined, undefined, 1])
  })

  it('needs one entry for each bar of the chart', () => {
    expect(errorOf(['C G'], { rh: 'C4/4' }).message).toContain(
      'the right hand has 1 bar entries for a chart of 2 bars',
    )
  })

  it.each([
    ['Q4/1', 'cannot read "Q4/1"'],
    ['C4/0', 'cannot read "C4/0"'],
    ['C4^6/1', 'cannot read "C4^6/1"'],
    ['C4/1@5', 'starts past its bar'],
    ['C4/1@0', 'cannot read "C4/1@0"'],
  ])('names the bar of a token it cannot read: %j', (token, problem) => {
    const error = errorOf(['G C'], { lh: `- | ${token}` })
    expect(error.position).toEqual({ section: 1, line: 1, bar: 2 })
    expect(error.message).toContain(problem)
  })

  it('names a note held into a bar the pattern plays', () => {
    const error = errorOf(['C G'], { lh: 'C3/6 | -' })
    expect(error.position).toEqual({ section: 1, line: 1, bar: 1 })
    expect(error.message).toContain('holds a note into a bar the pattern plays')
  })
})
