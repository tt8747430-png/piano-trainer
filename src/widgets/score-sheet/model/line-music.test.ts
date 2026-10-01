import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { linesOf, lineMusic, timeBeforeLine } from './line-music'

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

  it('write a line from its own start: the melody, the written hands, and the chord symbols', () => {
    const [, second] = linesOf(draft)
    if (!second) throw new Error('a second line')
    const music = lineMusic(draft, second)
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4 },
      { startTick: 48, beats: 4, blank: ['bass'] },
    ])
    expect(music.chords).toEqual([
      { startTick: 0, symbol: 'C' },
      { startTick: 24, symbol: 'D' },
      { startTick: 48, symbol: 'G' },
    ])
    expect(music.notes.map((n) => [n.hand, n.midi, n.startTick, n.durationTicks])).toEqual([
      ['melody', 67, 0, 24],
      ['melody', 69, 24, 12],
      ['melody', 71, 36, 36],
      ['melody', 72, 72, 24],
      ['lh', 48, 0, 48],
    ])
  })

  it('leave a staff with nothing on it blank', () => {
    const [, , third] = linesOf(draft)
    if (!third) throw new Error('a third line')
    const music = lineMusic(draft, third)
    expect(music.bars).toEqual([{ startTick: 0, beats: 2, blank: ['bass'] }])
    expect(music.notes.map((n) => [n.hand, n.midi, n.startTick, n.durationTicks])).toEqual([
      ['rh', 55, 0, 24],
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
