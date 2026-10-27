import { describe, expect, it } from 'vitest'
import { readDraft } from '@/features/score-editor'
import { midi, note } from '@/shared/lib/music'
import { staffOf } from '@/shared/lib/notation'
import { layerAt, linesOf, lineMusic, oneLine, timeBeforeLine } from './line-music'

const draft = readDraft({
  key: 'G',
  meter: '4/4',
  tempo: 90,
  pattern: 'r1',
  sections: [
    { kind: 'verse', lines: ['G@1', 'C-D G'] },
    { kind: 'chorus', lines: ['Em@2'] },
  ],
  staves: [{ notes: 'D4/1 | G4/2 A4/1 B4/3 | C5/2' }],
  hands: { lh: 'r/1 | C3/4 | r/4 | r/4', rh: 'r/1 | r/4 | r/4 | G3/2' },
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

  it('say what each bar’s label prints: a line’s first number, a section’s name, the tempo (ADR 0095)', () => {
    expect(linesOf(draft).map((line) => line.labels)).toEqual([
      [{ number: 1, section: 0, tempo: 90 }],
      [{ number: 2 }, {}],
      [{ number: 4, section: 1 }],
    ])
    // All of it as one line, across: each section named where it starts.
    expect(oneLine(draft)[0]?.labels).toEqual([
      { number: 1, section: 0, tempo: 90 },
      {},
      {},
      { section: 1 },
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

  it('write a line from its own start: each single staff’s notes, the written hands, and the chord symbols', () => {
    const [, second] = linesOf(draft)
    if (!second) throw new Error('a second line')
    const music = lineMusic(draft, second)
    expect(music.staves).toEqual([{ clef: 'treble' }])
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4, blank: ['treble'] },
      { startTick: 96, beats: 4, blank: ['treble', 'bass'] },
    ])
    expect(music.chords).toEqual([
      { startTick: 0, symbol: 'C' },
      { startTick: 48, symbol: 'D' },
      { startTick: 96, symbol: 'G' },
    ])
    expect(music.notes.map((n) => [staffOf(n), n.midi, n.startTick, n.durationTicks])).toEqual([
      ['staff0', 67, 0, 48],
      ['staff0', 69, 48, 24],
      ['staff0', 71, 72, 72],
      ['staff0', 72, 144, 48],
      ['bass', 48, 0, 96],
    ])
  })

  it('leave a staff with nothing on it blank', () => {
    const [, , third] = linesOf(draft)
    if (!third) throw new Error('a third line')
    const music = lineMusic(draft, third)
    expect(music.bars).toEqual([{ startTick: 0, beats: 2, blank: ['staff0', 'bass'] }])
    expect(music.notes.map((n) => [n.hand, n.midi, n.startTick, n.durationTicks])).toEqual([
      ['rh', 55, 0, 48],
    ])
  })

  it('write no piano on a lead sheet: the tune’s staff alone (ADR 0083)', () => {
    const lead = { ...draft, leadSheet: true }
    const [, second] = linesOf(lead)
    if (!second) throw new Error('a second line')
    const music = lineMusic(lead, second)
    expect(music.piano).toBe(false)
    expect(music.notes.every((n) => staffOf(n) === 'staff0')).toBe(true)
    expect(music.bars).toEqual([
      { startTick: 0, beats: 4 },
      { startTick: 96, beats: 4 },
    ])
  })

  it('write a section’s key change on its bars, as the Player does', () => {
    const changing = readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [
        { kind: 'verse', lines: ['C'] },
        { kind: 'chorus', key: 'Eb', lines: ['Eb'] },
      ],
    })
    const [verse, chorus] = linesOf(changing)
    expect(lineMusic(changing, verse!).bars[0]?.key).toBeUndefined()
    expect(lineMusic(changing, chorus!).bars[0]?.key).toEqual({
      tonic: note('E', -1),
      minor: false,
    })
  })

  it('print 4/4 as common time where the song asks (ADR 0114)', () => {
    const [first] = linesOf(draft)
    if (!first) throw new Error('a line')
    expect(lineMusic({ ...draft, timeSymbol: true }, first).timeSymbol).toBe(true)
    expect(lineMusic(draft, first)).not.toHaveProperty('timeSymbol')
  })

  it('print the time signature again only where it changes', () => {
    const [first, second, third] = linesOf(draft)
    if (!first || !second || !third) throw new Error('three lines')
    expect(timeBeforeLine(draft, first)).toBeUndefined()
    expect(timeBeforeLine(draft, second)).toEqual({ count: 4, unit: 4 })
    expect(timeBeforeLine(draft, third)).toEqual({ count: 4, unit: 4 })
  })

  it('write a section’s own meter on its bars, its time printed where it starts (ADR 0095)', () => {
    const changing = readDraft({
      key: 'C',
      meter: '4/4',
      tempo: 90,
      pattern: 'r1',
      sections: [
        { kind: 'verse', meter: '3/4', lines: ['C@1', 'G'] },
        { kind: 'chorus', lines: ['F'] },
      ],
    })
    const [pickup, verse, chorus] = linesOf(changing)
    if (!pickup || !verse || !chorus) throw new Error('three lines')
    expect(lineMusic(changing, verse).bars[0]).toMatchObject({ beats: 3, meter: '3/4' })
    expect(lineMusic(changing, chorus).bars[0]?.meter).toBeUndefined()
    // The verse's pickup is short of its own 3/4, and its bars are 3/4's.
    expect(timeBeforeLine(changing, verse)).toEqual({ count: 3, unit: 4 })
    expect(timeBeforeLine(changing, chorus)).toEqual({ count: 3, unit: 4 })
  })
})

describe('layerAt', () => {
  const layout = {
    staves: {
      staff0: { top: 40, bottom: 80 },
      treble: { top: 130, bottom: 170 },
      bass: { top: 220, bottom: 260 },
    },
  } as unknown as Parameters<typeof layerAt>[1]

  it('writes the staff nearest a point, the chord row over the staves', () => {
    expect([-5, 60, 110, 150, 200, 300].map((y) => layerAt(y, layout, true))).toEqual([
      'chords',
      'staff0',
      'rh',
      'rh',
      'lh',
      'lh',
    ])
    expect(layerAt(-5, layout, false)).toBe('staff0')
  })
})

describe('the words on a line (ADR 0093)', () => {
  const worded = readDraft({
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: ['C G'] }],
    staves: [{ notes: 'C4/2 D4/2 | E4/4' }],
    lyrics: ['one two three'],
  })
  const sung = (music: ReturnType<typeof lineMusic>) =>
    music.notes.flatMap((n) => (n.lyrics ? [n.lyrics[0]?.text] : []))

  it('carries each note’s syllables, left out where the View hides the words', () => {
    const [line] = linesOf(worded)
    if (!line) throw new Error('a line')
    expect(sung(lineMusic(worded, line))).toEqual(['one', 'two', 'three'])
    expect(sung(lineMusic(worded, line, false))).toEqual([])
  })

  it('carries the syllables of the staff the lyrics are on alone: the upper staff’s under a tune', () => {
    // The same syllables on both staves: the upper staff's sing, the tune's are not its lyrics.
    const tune = worded.staves[0]?.notes ?? []
    const rh = tune.map((n) => ({ ...n, midi: midi(n.midi + 12) }))
    const upper = { ...worded, lyricsOn: 'rh' as const, hands: { ...worded.hands, rh } }
    const [line] = linesOf(upper)
    if (!line) throw new Error('a line')
    const music = lineMusic(upper, line)
    expect(music.notes.filter((n) => n.lyrics).map((n) => n.hand)).toEqual(['rh', 'rh', 'rh'])
  })
})
