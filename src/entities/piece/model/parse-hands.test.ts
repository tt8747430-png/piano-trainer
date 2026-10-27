import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import type { ChartBar } from '@/shared/lib/arrangement'
import { ContentError } from './content-error'
import { parseChart } from './parse-chart'
import { testSong } from '../testing/test-pieces'
import type { Hands } from './types'
import { writeHand } from './write-hands'

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
      { midi: 60, spelled: note('C'), startTick: 0, durationTicks: 24 },
      { midi: 64, spelled: note('E'), startTick: 24, durationTicks: 24 },
      { midi: 67, spelled: note('G'), startTick: 48, durationTicks: 48 },
    ])
    expect(second?.hands?.lh).toBeUndefined()
  })

  it('reads a clef change first in a bar, written or left to the pattern, and writes it back', () => {
    const hands = { lh: 'clef:treble C4/1 E4/1 G4/2 | - | clef:bass -' }
    const bars = barsOf(['C G F'], hands)
    expect(bars.map((bar) => bar.clefs)).toEqual([{ lh: 'treble' }, undefined, { lh: 'bass' }])
    expect(bars[0]?.hands?.lh).toHaveLength(3)
    // Written back, a bar left to the pattern is a bar of rest: every bar is written (ADR 0091).
    expect(
      writeHand(
        bars.map((bar) => bar.hands?.lh ?? []),
        bars.map(() => 96),
        bars.map((bar) => bar.clefs?.lh),
      ),
    ).toBe('clef:treble C4/1 E4/1 G4/2 | r/4 | clef:bass r/4')
    expect(errorOf(['C'], { rh: 'clef:alto C4/4' }).message).toMatch(/no clef "alto"/)
  })

  it('reads notes struck together, each with its finger', () => {
    const [bar] = barsOf(['C'], { rh: 'C4^1+E4^3+G4^5/4' })
    expect(bar?.hands?.rh?.map((n) => [n.midi, n.startTick, n.durationTicks, n.finger])).toEqual([
      [60, 0, 96, 1],
      [64, 0, 96, 3],
      [67, 0, 96, 5],
    ])
  })

  it('places a token on a beat counted from 1, so a held note and the notes over it are both written', () => {
    const [bar] = barsOf(['C'], { lh: 'C3/4 E3+G3/1@2 E3+G3/1 r/.5 G3/.5@4.5' })
    expect(bar?.hands?.lh?.map((n) => [n.midi, n.startTick, n.durationTicks])).toEqual([
      [48, 0, 96],
      [52, 24, 24],
      [55, 24, 24],
      [52, 48, 24],
      [55, 48, 24],
      [55, 84, 12],
    ])
  })

  it('writes a bar with no notes as silence, not the pattern', () => {
    const [bar] = barsOf(['C'], { lh: 'r/4' })
    expect(bar?.hands).toEqual({ lh: [] })
  })

  it('holds a note across the barline into a bar the hand writes too', () => {
    const [first] = barsOf(['C G'], { lh: 'C3/6 | G3/2@3' })
    expect(first?.hands?.lh).toEqual([
      { midi: 48, spelled: note('C'), startTick: 0, durationTicks: 144 },
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
    ['C9/1', 'cannot read "C9/1"'],
    ['C4/25', 'cannot read "C4/25"'],
    ['C4/1e8', 'cannot read "C4/1e8"'],
  ])('names the bar of a token it cannot read: %j', (token, problem) => {
    const error = errorOf(['G C'], { lh: `- | ${token}` })
    expect(error.position).toEqual({ section: 1, line: 1, bar: 2 })
    expect(error.message).toContain(problem)
  })

  it('reads a triplet as thirds of a beat and a 32nd as an eighth of one', () => {
    const [bar] = barsOf(['C'], {
      rh: 'C4/1:3 D4/1:3 E4/1:3 C5/.125 B4/.125 A4/.125 G4/.125 F4/1:6 G4/5:6 C4/1.5',
    })
    expect(bar?.hands?.rh?.map((n) => [n.startTick, n.durationTicks])).toEqual([
      [0, 8],
      [8, 8],
      [16, 8],
      [24, 3],
      [27, 3],
      [30, 3],
      [33, 3],
      [36, 4],
      [40, 20],
      [60, 36],
    ])
  })

  it('reads a token’s marks onto each of its notes', () => {
    const [bar] = barsOf(['C'], { rh: 'C4+E4/1[acc,stacc] G4/3[8va,(]' })
    expect(bar?.hands?.rh?.map((n) => n.marks)).toEqual([
      { articulations: ['accent', 'staccato'] },
      { articulations: ['accent', 'staccato'] },
      { octave: '8va', slurStart: true },
    ])
  })

  it('names a token whose marks it cannot read', () => {
    const error = errorOf(['C'], { rh: 'C4/4[nope]' })
    expect(error.message).toContain('cannot read "C4/4[nope]"')
  })

  it('names a note held into a bar the pattern plays', () => {
    const error = errorOf(['C G'], { lh: 'C3/6 | -' })
    expect(error.position).toEqual({ section: 1, line: 1, bar: 1 })
    expect(error.message).toContain('holds a note into a bar the pattern plays')
  })
})
