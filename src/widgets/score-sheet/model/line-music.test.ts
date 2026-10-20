import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { layerAt, linesOf, lineMusic, timeBeforeLine } from './line-music'

const draft = readDraft({
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['G@1', 'C-D G'] },
    { kind: 'chorus', lines: ['Em@2'] },
  ],
  melody: 'D4/1 | G4/2 A4/1 B4/3 | C5/2',
  hands: { lh: '- | C3/4 | - | -', rh: '- | - | - | G3/2' },
})

describe('the sheet’s lines', () => {
  it('are the chart’s lines, each with its section and bars', () => {
    expect(
      linesOf(draft).map((line) => [line.section, line.line, line.bars.map((b) => b.index)]),
    ).toEqual([
      [0, 0, [0]],
      [0, 1, [1, 2]],
      [1, 0, [3]],
    ])
  })

  it('cut a line longer than a screen holds into even parts, as many bars at most', () => {
    const long = readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['C F G C', 'C F G'] }],
    })
    const parts = (most: number) =>
      linesOf(long, most).map((line) => [line.line, line.bars.map((b) => b.index), line.start])
    expect(parts(3)).toEqual([
      [0, [0, 1], 0],
      [0, [2, 3], 192],
      [1, [4, 5, 6], 384],
    ])
    expect(parts(2)).toEqual([
      [0, [0, 1], 0],
      [0, [2, 3], 192],
      [1, [4, 5], 384],
      [1, [6], 576],
    ])
    expect(parts(4)).toEqual([
      [0, [0, 1, 2, 3], 0],
      [1, [4, 5, 6], 384],
    ])
  })

  it('write a line from its own start: the melody on its staff, the written hands, and the chord symbols', () => {
    const [, second] = linesOf(draft)
    if (!second) throw new Error('a second line')
    const music = lineMusic(draft, second)
    expect(music.melodyStaff).toBe(true)
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4, blank: ['treble'] },
      { startTick: 96, beats: 4, blank: ['treble', 'bass'] },
    ])
    expect(music.chords).toEqual([
      { startTick: 0, symbol: 'C' },
      { startTick: 48, symbol: 'D' },
      { startTick: 96, symbol: 'G' },
    ])
    expect(music.notes.map((n) => [n.hand, n.midi, n.startTick, n.durationTicks])).toEqual([
      ['melody', 67, 0, 48],
      ['melody', 69, 48, 24],
      ['melody', 71, 72, 72],
      ['melody', 72, 144, 48],
      ['lh', 48, 0, 96],
    ])
  })

  it('leave a staff with nothing on it blank', () => {
    const [, , third] = linesOf(draft)
    if (!third) throw new Error('a third line')
    const music = lineMusic(draft, third)
    expect(music.bars).toEqual([{ startTick: 0, beats: 2, blank: ['melody', 'bass'] }])
    expect(music.notes.map((n) => [n.hand, n.midi, n.startTick, n.durationTicks])).toEqual([
      ['rh', 55, 0, 48],
    ])
  })

  it('print the time signature again only where it changes', () => {
    const [first, second, third] = linesOf(draft)
    if (!first || !second || !third) throw new Error('three lines')
    expect(timeBeforeLine(draft, first)).toBeUndefined()
    expect(timeBeforeLine(draft, second)).toEqual({ count: 4, unit: 4 })
    expect(timeBeforeLine(draft, third)).toEqual({ count: 4, unit: 4 })
  })
})

describe('layerAt', () => {
  const layout = {
    staves: {
      melody: { top: 40, bottom: 80 },
      treble: { top: 130, bottom: 170 },
      bass: { top: 220, bottom: 260 },
    },
  } as unknown as Parameters<typeof layerAt>[1]

  it('writes the staff nearest a point, the chord row over the staves', () => {
    expect([-5, 60, 110, 150, 200, 300].map((y) => layerAt(y, layout, true))).toEqual([
      'chords',
      'melody',
      'rh',
      'rh',
      'lh',
      'lh',
    ])
    expect(layerAt(-5, layout, false)).toBe('melody')
  })
})
