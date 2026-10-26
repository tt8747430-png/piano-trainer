import { describe, expect, it } from 'vitest'
import {
  arrange,
  parseFigure,
  type ChartBar,
  type EventPattern,
  type Performance,
} from '@/shared/lib/arrangement'
import { note, parseChordSymbol, type Meter } from '@/shared/lib/music'
import { beatAt, beatCells, beatGroupFrom, playedBeatCells } from './beats'

const BEATS: EventPattern = {
  id: 'beats',
  rh: { kind: 'events', events: parseFigure('0/4 C,4/4 C,8/4 C,12/4 C') },
  lh: { kind: 'events', events: parseFigure('0/16 L1+L8') },
}

/** A bar of `beats` beats holding its chords end to end, each `[symbol, beats]`; none, no chord. */
const bar = (beats: number, ...chords: [string, number][]): ChartBar => ({
  chords: chords.map(([symbol, length]) => ({ ...parseChordSymbol(symbol), beats: length })),
  beats,
})

/** Sections of lines of bars, in C, played as written or with the repeats taken. */
const played = (meter: Meter, sections: ChartBar[][][], unfold = false): Performance =>
  arrange(
    {
      key: { tonic: note('C'), minor: false },
      meter,
      sections: sections.map((lines) => ({ lines })),
    },
    { tonic: note('C'), pattern: BEATS, unfold },
  )

/** Each written bar's cells as `from–to` with the symbols of the chords starting in them. */
const cellsOf = (performance: Performance) =>
  beatCells(performance).map(({ cells }) =>
    cells.map(
      ({ from, to, chords }) =>
        `${from}–${to}${chords.map((chord) => ` ${performance.chords[chord]?.symbol}`).join('')}`,
    ),
  )

describe('beatCells', () => {
  it('counts a bar in its meter’s beats, each chord in the beat it starts in', () => {
    const four = played('4/4', [[[bar(4, ['C', 4]), bar(4, ['F', 2], ['G', 2])]]])
    expect(cellsOf(four)).toEqual([
      ['0–24 C', '24–48', '48–72', '72–96'],
      ['0–24 F', '24–48', '48–72 G', '72–96'],
    ])
    expect(cellsOf(played('3/4', [[[bar(3, ['Am', 3])]]]))).toEqual([['0–24 Am', '24–48', '48–72']])
  })

  it('counts 6/8 in two dotted beats', () => {
    expect(cellsOf(played('6/8', [[[bar(2, ['C', 1], ['G', 1])]]]))).toEqual([
      ['0–24 C', '24–48 G'],
    ])
  })

  it('names a chord starting off the beat in the beat it starts in, two in one beat both', () => {
    const off = played('4/4', [[[bar(4, ['C', 1.5], ['F', 2.5]), bar(4, ['G', 0.5], ['C', 3.5])]]])
    expect(cellsOf(off)).toEqual([
      ['0–24 C', '24–48 F', '48–72', '72–96'],
      ['0–24 G C', '24–48', '48–72', '72–96'],
    ])
  })

  it('gives a short bar the beats it lasts, a part beat rounded up: a pickup’s on its bar’s beats', () => {
    // A pickup of a beat and a half is the end of its bar: half of beat 3, then beat 4.
    const pickup = played('4/4', [[[bar(1.5, ['G', 1.5]), bar(4, ['C', 4]), bar(2, ['F', 2])]]])
    expect(cellsOf(pickup)).toEqual([
      ['0–12 G', '12–36'],
      ['0–24 C', '24–48', '48–72', '72–96'],
      ['0–24 F', '24–48'],
    ])
  })

  it('leaves a bar of no chord its beats, naming none', () => {
    expect(cellsOf(played('3/4', [[[bar(3)]]]))).toEqual([['0–24', '24–48', '48–72']])
  })

  it('takes each bar as written once, from its first pass, with its section and line', () => {
    // C F repeated, then a section of G: played C F C F G.
    const repeated = played(
      '4/4',
      [
        [
          [
            { ...bar(4, ['C', 4]), repeatStart: true },
            { ...bar(4, ['F', 4]), barline: 'repeat' },
          ],
        ],
        [[bar(4, ['Am', 4])], [bar(4, ['G', 4])]],
      ],
      true,
    )
    expect(
      beatCells(repeated).map(({ written, played, section, line, cells }) => ({
        written,
        played,
        section,
        line,
        first: cells[0]?.chords,
      })),
    ).toEqual([
      { written: 0, played: 0, section: 0, line: 0, first: [0] },
      { written: 1, played: 1, section: 0, line: 0, first: [1] },
      { written: 2, played: 4, section: 1, line: 0, first: [4] },
      { written: 3, played: 5, section: 1, line: 1, first: [5] },
    ])
  })
})

describe('beatAt', () => {
  const four = played('4/4', [[[bar(4, ['C', 4]), bar(4, ['F', 2], ['G', 2])]]])

  it('finds the bar played and the beat a tick is in, and where that beat starts', () => {
    expect(beatAt(four, 0)).toEqual({ bar: 0, beat: 0, startTick: 0 })
    expect(beatAt(four, 30)).toEqual({ bar: 0, beat: 1, startTick: 24 })
    expect(beatAt(four, 96)).toEqual({ bar: 1, beat: 0, startTick: 96 })
    expect(beatAt(four, 150)).toEqual({ bar: 1, beat: 2, startTick: 144 })
  })

  it('stays on the first beat before the music and on the last past its end', () => {
    expect(beatAt(four, -10)).toEqual({ bar: 0, beat: 0, startTick: 0 })
    expect(beatAt(four, 192)).toEqual({ bar: 1, beat: 3, startTick: 168 })
  })

  it('counts dotted beats in 6/8 and a pickup on its bar’s beats', () => {
    expect(beatAt(played('6/8', [[[bar(2, ['C', 2])]]]), 30)).toEqual({
      bar: 0,
      beat: 1,
      startTick: 24,
    })
    const pickup = played('4/4', [[[bar(1.5, ['G', 1.5]), bar(4, ['C', 4])]]])
    expect(beatAt(pickup, 6)).toEqual({ bar: 0, beat: 0, startTick: 0 })
    expect(beatAt(pickup, 20)).toEqual({ bar: 0, beat: 1, startTick: 12 })
    expect(beatAt(pickup, 36)).toEqual({ bar: 1, beat: 0, startTick: 36 })
  })

  it('finds a repeat’s bar as played, its second time', () => {
    const repeated = played(
      '4/4',
      [
        [
          [
            { ...bar(4, ['C', 4]), repeatStart: true },
            { ...bar(4, ['F', 4]), barline: 'repeat' },
          ],
        ],
      ],
      true,
    )
    expect(beatAt(repeated, 200)).toEqual({ bar: 2, beat: 0, startTick: 192 })
  })
})

describe('playedBeatCells', () => {
  it('counts every bar as played, a repeat each time, each with its own chords', () => {
    // C F-Dm repeated, then G: played C F-Dm C F-Dm G.
    const repeated = played(
      '4/4',
      [
        [
          [
            { ...bar(4, ['C', 4]), repeatStart: true },
            { ...bar(2, ['F', 1], ['Dm', 1]), barline: 'repeat' },
          ],
          [bar(4, ['G', 4])],
        ],
      ],
      true,
    )
    const cells = playedBeatCells(repeated)
    expect(
      cells.map(({ written, played, line, cells }) => ({
        written,
        played,
        line,
        cells: cells.map(({ from, chords }) => [
          from,
          ...chords.map((chord) => repeated.chords[chord]?.symbol),
        ]),
      })),
    ).toEqual([
      { written: 0, played: 0, line: 0, cells: [[0, 'C'], [24], [48], [72]] },
      {
        written: 1,
        played: 1,
        line: 0,
        cells: [
          [0, 'F'],
          [24, 'Dm'],
        ],
      },
      { written: 0, played: 2, line: 0, cells: [[0, 'C'], [24], [48], [72]] },
      {
        written: 1,
        played: 3,
        line: 0,
        cells: [
          [0, 'F'],
          [24, 'Dm'],
        ],
      },
      { written: 2, played: 4, line: 1, cells: [[0, 'G'], [24], [48], [72]] },
    ])
    // The second pass's chords are its own.
    expect(cells[2]?.cells[0]?.chords).toEqual([3])
  })

  it('counts a pickup played again on its bar’s beats, as its first pass and the cursor do', () => {
    // A pickup of a beat and a half, G then D on its last beat, repeated with the bars after it.
    const repeated = played(
      '4/4',
      [
        [
          [
            { ...bar(1.5, ['G', 0.5], ['D', 1]), repeatStart: true },
            bar(4, ['C', 4]),
            { ...bar(2.5, ['F', 2.5]), barline: 'repeat' },
          ],
        ],
      ],
      true,
    )
    const pickups = playedBeatCells(repeated).filter(({ written }) => written === 0)
    const named = pickups.map(({ cells }) =>
      cells.map(({ from, chords }) => [
        from,
        ...chords.map((chord) => repeated.chords[chord]?.symbol),
      ]),
    )
    expect(named).toEqual([
      [
        [0, 'G'],
        [12, 'D'],
      ],
      [
        [0, 'G'],
        [12, 'D'],
      ],
    ])
    // The cursor on D the second time stands in the cell the strip names it in.
    const second = repeated.bars[3]
    expect(second && beatAt(repeated, second.startTick + 12).beat).toBe(1)
  })
})

describe('beatGroupFrom', () => {
  // Beat groups on every beat of two bars, C and G: at 0, 24, … 168.
  const four = played('4/4', [[[bar(4, ['C', 4]), bar(4, ['G', 4])]]])

  it('is the beat group at a tick, else the next after it: where a beat tapped takes the cursor', () => {
    expect(beatGroupFrom(four, 0)).toBe(0)
    expect(beatGroupFrom(four, 24)).toBe(1)
    expect(beatGroupFrom(four, 25)).toBe(2)
    expect(beatGroupFrom(four, 96)).toBe(4)
  })

  it('is the last past the last beat group, and none in music of no notes', () => {
    expect(beatGroupFrom(four, 170)).toBe(7)
    expect(beatGroupFrom({ ...four, beatGroups: [] }, 0)).toBeNull()
  })
})
