import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import { pieceById } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import { arrange, parseFigure, type Chart, type ChartBar } from '@/shared/lib/arrangement'
import { note, parseChordSymbol } from '@/shared/lib/music'
import { lessonKeys, sectionBarsPlayed, sectionLessons } from './section-lessons'

/** The piece as the Player plays it, its repeats taken, as the song's page reads it. */
function played(id: string) {
  const piece = pieceById(id)
  if (!piece) throw new Error(`no piece ${id}`)
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

const BLOCK = {
  id: 'block',
  rh: { kind: 'events', events: parseFigure('0/16 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const
const BEATS = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1') },
} as const

/** A 4/4 bar written as a chart writes it: `G`, `C-G`, `C@1-G@3`, `C:t1`. */
function bar(written: string, marks: Partial<ChartBar> = {}): ChartBar {
  const chords = written.split('-').map((token) => {
    const [symbolAndBeats = '', method] = token.split(':')
    const [symbol = '', beats] = symbolAndBeats.split('@')
    return {
      ...parseChordSymbol(symbol),
      beats: beats ? Number(beats) : 4 / written.split('-').length,
      ...(method ? { method } : {}),
    }
  })
  return { chords, beats: 4, ...marks }
}
type ChartSection = Chart['sections'][number]

const section = (...lines: string[]): ChartSection => ({
  lines: lines.map((line) => line.split(' ').map((written) => bar(written))),
})
const chart = (...sections: ChartSection[]): Chart => ({
  key: { tonic: note('C'), minor: false },
  meter: '4/4',
  sections,
})
const arranged = (written: Chart) =>
  arrange(written, {
    tonic: note('C'),
    pattern: BLOCK,
    methods: new Map([['t1', BEATS]]),
    unfold: true,
  })

describe('sectionLessons', () => {
  it('teaches a verse of two lines alike as one sequence played round twice', () => {
    const verse = sectionLessons(played('bz5'), 'bz5', 0)
    expect(verse).toMatchObject({ bars: { first: 0, last: 7 }, rounds: 2 })
    expect(verse?.chords.map((chord) => [chord.symbol, chord.key])).toEqual([
      ['G', 'bz5:chord:G'],
      ['C', 'bz5:chord:C'],
      ['Em', 'bz5:chord:Em'],
      ['G/B', 'bz5:chord:G/B'],
      ['C/E', 'bz5:chord:C/E'],
      ['Dsus4', 'bz5:chord:Dsus4'],
      ['D/F#', 'bz5:chord:D/F#'],
    ])
    expect(verse?.sequences).toEqual([
      {
        kind: 'sequence',
        symbols: ['G', 'C', 'Em', 'G/B', 'C', 'C/E', 'Dsus4', 'D/F#'],
        bars: { first: 0, last: 3 },
        key: 'bz5:bars:1-4',
      },
    ])
    // The last chord back to the first where one round meets the next.
    expect(verse?.changes.map((change) => [change.from, change.to, change.key])).toEqual([
      ['G', 'C', 'bz5:bars:1-2'],
      ['C', 'Em', 'bz5:bars:2-3'],
      ['Em', 'G/B', 'bz5:bars:3-3'],
      ['G/B', 'C', 'bz5:bars:3-4'],
      ['C', 'C/E', 'bz5:bars:4-4'],
      ['C/E', 'Dsus4', 'bz5:bars:4-4'],
      ['Dsus4', 'D/F#', 'bz5:bars:4-4'],
      ['D/F#', 'G', 'bz5:bars:4-5'],
    ])
    expect(verse?.patterns).toEqual([
      {
        kind: 'pattern',
        pattern: 'r4',
        symbol: 'G',
        bars: { first: 0, last: 0 },
        key: 'bz5:bars:1-1',
      },
    ])
  })

  it('teaches a section of different lines a sequence each, played once', () => {
    const performance = played('bz5')
    const chorus = sectionLessons(performance, 'bz5', 1)
    expect(chorus).toMatchObject({ bars: { first: 8, last: 17 }, rounds: 1 })
    // Each chord where it first sounds in the chorus: its sheet shows it voiced there.
    for (const lesson of chorus?.chords ?? []) {
      const first = performance.chords.findIndex(
        (chord) => chord.symbol === lesson.symbol && chord.bar >= 8,
      )
      expect(lesson.chord, lesson.symbol).toBe(first)
    }
    expect(chorus?.sequences.map((sequence) => sequence.key)).toEqual([
      'bz5:bars:9-12',
      'bz5:bars:13-16',
      'bz5:bars:17-18',
    ])
    // Each change once, where it first comes.
    expect(
      chorus?.changes.filter((change) => change.from === 'Em' && change.to === 'D/F#'),
    ).toEqual([expect.objectContaining({ bars: { first: 8, last: 8 } })])
  })

  it('takes a line a line before it has as the same sequence (ex3: two lines of one key)', () => {
    const study = sectionLessons(played('ex3'), 'ex3', 0)
    expect(study?.rounds).toBe(1)
    expect(study?.sequences.map((sequence) => [sequence.symbols, sequence.key])).toEqual([
      [['C', 'Dm', 'G', 'C'], 'ex3:bars:1-4'],
      [['F', 'C', 'G', 'C'], 'ex3:bars:5-8'],
    ])
    expect(study?.changes.map((change) => `${change.from}→${change.to}`)).toEqual([
      'C→Dm',
      'Dm→G',
      'G→C',
      'C→F',
      'F→C',
      'C→G',
    ])
    expect(study?.patterns.map((pattern) => [pattern.pattern, pattern.symbol])).toEqual([
      ['M1', 'C'],
    ])
    const lines = sectionLessons(arranged(chart(section('C G', 'F C', 'C G'))), 'my-1', 0)
    expect(lines?.sequences.map((sequence) => sequence.key)).toEqual([
      'my-1:bars:1-2',
      'my-1:bars:3-4',
    ])
  })

  it('goes round where its bars come back alike, a chord held over between rounds (twinkle, `G C D G` twice)', () => {
    const partB = sectionLessons(played('twinkle'), 'twinkle', 1)
    expect(partB).toMatchObject({ rounds: 2, bars: { first: 4, last: 7 } })
    expect(partB?.sequences.map((sequence) => sequence.key)).toEqual(['twinkle:bars:5-6'])
    const held = sectionLessons(arranged(chart(section('G C D G', 'G C D G'))), 'my-1', 0)
    expect(held?.rounds).toBe(2)
    expect(held?.chords.map((chord) => chord.symbol)).toEqual(['G', 'C', 'D'])
    expect(held?.sequences.map((sequence) => sequence.bars)).toEqual([{ first: 0, last: 3 }])
    // G held over from one round into the next is no change.
    expect(held?.changes.map((change) => `${change.from}→${change.to}`)).toEqual([
      'G→C',
      'C→D',
      'D→G',
    ])
  })

  it('goes round where its chords come back alike in bars of another rhythm', () => {
    const lessons = sectionLessons(arranged(chart(section('C G', 'C@1-G@3 C-G'))), 'my-1', 0)
    expect(lessons).toMatchObject({ rounds: 3 })
    expect(lessons?.sequences.map((sequence) => sequence.bars)).toEqual([{ first: 0, last: 1 }])
  })

  it('never goes round on one chord held', () => {
    const held = sectionLessons(arranged(chart(section('C C C C'))), 'my-1', 0)
    expect(held).toMatchObject({ rounds: 1, changes: [] })
    expect(held?.sequences.map((sequence) => sequence.symbols)).toEqual([['C']])
  })

  it('reads a section with its repeats as the Player plays them, every pass', () => {
    const repeated: Chart = chart(
      {
        lines: [
          [bar('Em', { repeatStart: true }), bar('D', { barline: 'repeat' }), bar('C')],
          [bar('G')],
        ],
      },
      section('F'),
    )
    const performance = arranged(repeated)
    expect(sectionBarsPlayed(performance, 0)).toEqual({ first: 0, last: 5 })
    expect(sectionBarsPlayed(performance, 1)).toEqual({ first: 6, last: 6 })
    expect(sectionBarsPlayed(performance, 2)).toBeNull()
    const verse = sectionLessons(performance, 'my-1', 0)
    expect(verse?.sequences.map((sequence) => [sequence.symbols, sequence.key])).toEqual([
      [['Em', 'D', 'Em', 'D', 'C'], 'my-1:bars:1-5'],
      [['G'], 'my-1:bars:6-6'],
    ])
    expect(sectionLessons(performance, 'my-1', 2)).toBeNull()
  })

  it('has a pattern lesson for each pattern its chords are played by', () => {
    const lessons = sectionLessons(arranged(chart(section('C F:t1 G:t1 C'))), 'my-1', 0)
    expect(
      lessons?.patterns.map((pattern) => [pattern.pattern, pattern.symbol, pattern.key]),
    ).toEqual([
      ['block', 'C', 'my-1:bars:1-1'],
      ['beats', 'F', 'my-1:bars:2-2'],
    ])
  })

  it('loops a pattern on one chord: the section’s first alone in a bar, else any chord alone', () => {
    const lessons = sectionLessons(arranged(chart(section('C-G F:t1 G:t1 C'))), 'my-1', 0)
    expect(
      lessons?.patterns.map((pattern) => [pattern.pattern, pattern.symbol, pattern.key]),
    ).toEqual([
      ['block', 'C', 'my-1:bars:4-4'],
      ['beats', 'F', 'my-1:bars:2-2'],
    ])
    // No bar of one chord: its first bar, as it plays there.
    const shared = sectionLessons(arranged(chart(section('C-G F-C'))), 'my-1', 0)
    expect(shared?.patterns.map((pattern) => [pattern.symbol, pattern.key])).toEqual([
      ['C', 'my-1:bars:1-1'],
    ])
  })

  it('has no pattern lesson for a section written out note by note', () => {
    const written = { hands: { rh: [], lh: [] } }
    const performance = arranged(chart({ lines: [[bar('C', written), bar('G', written)]] }))
    expect(sectionLessons(performance, 'my-1', 0)?.patterns).toEqual([])
  })

  it('has nothing to learn in a section of no chord symbol', () => {
    const silent: ChartBar = { chords: [], beats: 4, hands: { rh: [], lh: [] } }
    const lessons = sectionLessons(arranged(chart({ lines: [[silent, silent]] })), 'my-1', 0)
    expect(lessons).toMatchObject({ chords: [], sequences: [], changes: [], patterns: [] })
    expect(lessons && lessonKeys(lessons)).toEqual([])
  })
})

describe('lessonKeys', () => {
  it('keys each lesson once, a sequence looping a change’s bars or a pattern’s bar counted once', () => {
    const ending = sectionLessons(played('bz5'), 'bz5', 2)
    // Its one chord, its sequence and its pattern's bar: the same one bar.
    expect(ending && lessonKeys(ending)).toEqual(['bz5:chord:G', 'bz5:bars:19-19'])
  })
})
