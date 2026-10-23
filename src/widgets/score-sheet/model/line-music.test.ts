import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { midi, note } from '@/shared/lib/music'
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

  it('cuts a line wider than a screen holds into as few lines as hold it, even by width', () => {
    const long = readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [{ kind: 'verse', lines: ['C F G C', 'C F G'] }],
    })
    const parts = (most: number, widths: readonly number[] = Array(7).fill(100)) =>
      linesOf(long, { room: most * 100, widths }).map((line) => [
        line.line,
        line.bars.map((b) => b.index),
        line.start,
      ])
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
    // A dense first bar stands alone, the light ones after it share a line.
    expect(parts(3, [250, 60, 60, 60, 100, 100, 100])).toEqual([
      [0, [0], 0],
      [0, [1, 2, 3], 96],
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

  it('write what the pattern plays in a bar a hand leaves to it, its staff marked so (ADR 0083)', () => {
    const [, second] = linesOf(draft)
    if (!second) throw new Error('a second line')
    const at = (key: number, startTick: number, durationTicks: number) => ({
      midi: midi(key),
      spelled: note('C'),
      startTick,
      durationTicks,
    })
    const played = {
      // The last held past its bar's end: cut at the barline.
      rh: [at(64, 24, 96), at(67, 120, 200)],
      // Bar 2's left hand is written: the pattern's there is not shown.
      lh: [at(36, 24, 96), at(43, 120, 96)],
    }
    const music = lineMusic(draft, second, played)
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4, pattern: ['treble'] },
      { startTick: 96, beats: 4, pattern: ['treble', 'bass'] },
    ])
    expect(
      music.notes
        .filter((n) => n.hand !== 'melody')
        .map((n) => [n.hand, n.midi, n.startTick, n.durationTicks]),
    ).toEqual([
      ['rh', 64, 0, 96],
      ['rh', 67, 96, 96],
      ['lh', 48, 0, 96],
      ['lh', 43, 96, 96],
    ])
  })

  it('write no piano on a lead sheet: the tune’s staff alone (ADR 0083)', () => {
    const lead = { ...draft, hidden: ['piano' as const] }
    const [, second] = linesOf(lead)
    if (!second) throw new Error('a second line')
    const music = lineMusic(lead, second, { rh: [], lh: [] })
    expect(music.piano).toBe(false)
    expect(music.notes.every((n) => n.hand === 'melody')).toBe(true)
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4 },
      { startTick: 96, beats: 4 },
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
