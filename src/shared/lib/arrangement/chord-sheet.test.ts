import { describe, expect, it } from 'vitest'
import { C_MAJOR, chordSymbol, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import {
  addSection,
  emptySheet,
  insertChord,
  lineSheet,
  moveChord,
  playOrder,
  relayMeter,
  removeChord,
  resizeChord,
  sectionBars,
  sectionChords,
  sheetToChart,
  transposeSheet,
  type ChordSheet,
  type SheetSection,
} from './chord-sheet'

const section = (line: string, more: Partial<SheetSection> = {}): SheetSection => ({
  kind: 'verse',
  repeats: 1,
  variation: 1,
  // "C:2 G:2 | Am" is two bars; a line with no bar lines is a bar per chord.
  bars: (line.includes('|') ? line.split(' | ') : line.split(' ')).map((bar) => ({
    chords: bar.split(' ').map((word) => {
      const [symbol = '', beats = '4'] = word.split(':')
      return { chord: parseChordSymbol(symbol), beats: Number(beats) }
    }),
  })),
  ...more,
})
const written = (s: SheetSection) =>
  sectionChords(s)
    .map(({ chord, beats }) => `${chordSymbol(chord)}:${beats}`)
    .join(' ')

describe('a chord box resized', () => {
  it('resizing C from 4 to 2 beats gives G 2 more', () => {
    expect(written(resizeChord(section('C G'), 0, 2))).toBe('C:2 G:6')
  })
  it("can't pass 8 beats, nor take the next chord below a beat", () => {
    expect(written(resizeChord(section('C G'), 0, 12))).toBe('C:7 G:1')
    expect(written(resizeChord(section('C:2 G:6'), 0, 9))).toBe('C:7 G:1')
  })
  it('never leaves a bar short: the beats of the section stay', () => {
    const resized = resizeChord(section('C Am:2 F:2 G'), 1, 3)
    expect(written(resized)).toBe('C:4 Am:3 F:1 G:4')
  })
  it('the last box grows its section, up to 8 beats, and shrinks to a beat', () => {
    expect(written(resizeChord(section('C G'), 1, 6))).toBe('C:4 G:6')
    expect(written(resizeChord(section('C G'), 1, 1))).toBe('C:4 G:1')
  })
})

describe('the bars of a section', () => {
  it('lay its chords end to end across the bar lines, the last bar part filled', () => {
    const bars = sectionBars(section('C:2 G:4 Am:3'), '4/4')
    expect(bars.map((bar) => bar.pieces.map((p) => `${p.chord}@${p.from}+${p.beats}`))).toEqual([
      ['0@0+2', '1@2+2'],
      ['1@0+2', '2@2+2'],
      ['2@0+1'],
    ])
    expect(bars.map((bar) => bar.beats)).toEqual([4, 4, 1])
  })
})

describe('a chord added, moved or deleted', () => {
  it('added at the end takes what is left of the last bar, or a whole bar', () => {
    expect(written(insertChord(section('C G:2'), 2, parseChordSymbol('Am'), '4/4'))).toBe(
      'C:4 G:2 Am:2',
    )
    expect(written(insertChord(section('C G'), 2, parseChordSymbol('Am'), '4/4'))).toBe(
      'C:4 G:4 Am:4',
    )
  })
  it('put between two chords takes half the beats of the chord before it', () => {
    expect(written(insertChord(section('C G'), 1, parseChordSymbol('E7'), '4/4'))).toBe(
      'C:2 E7:2 G:4',
    )
  })
  it('moveChord keeps every bar’s beats: the chords move, the lengths stay', () => {
    expect(written(moveChord(section('C:2 G:2 Am F'), 0, 3))).toBe('G:2 Am:2 F:4 C:4')
  })
  it('deleted, its beats go to the chord before it in its bar, or the bar goes', () => {
    expect(written(removeChord(section('C:2 G:2 Am'), 1))).toBe('C:4 Am:4')
    expect(written(removeChord(section('C G Am'), 1))).toBe('C:4 Am:4')
    expect(written(removeChord(section('C:2 G:2 Am'), 0))).toBe('G:4 Am:4')
  })
})

describe('a typed line', () => {
  it('reads as one Verse, a chord a bar', () => {
    const sheet = lineSheet(['C', 'G', 'Am', 'F'].map(parseChordSymbol), C_MAJOR, '4/4')
    expect(sheet.sections).toHaveLength(1)
    expect(sheet.sections[0]?.kind).toBe('verse')
    expect(sheet.sections[0] && written(sheet.sections[0])).toBe('C:4 G:4 Am:4 F:4')
  })
})

describe('the sheet played', () => {
  const sheet: ChordSheet = {
    key: C_MAJOR,
    meter: '4/4',
    sections: [section('C G', { repeats: 2 }), section('F:2 G:6', { kind: 'chorus' })],
  }
  it('plays each section its repeats, marking its first and its last bar', () => {
    const order = playOrder(sheet)
    expect(order.map((bar) => `${bar.section}.${bar.repeat}.${bar.bar}`)).toEqual([
      '0.0.0',
      '0.0.1',
      '0.1.0',
      '0.1.1',
      '1.0.0',
      '1.0.1',
    ])
    expect(order.map((bar) => bar.sectionStart)).toEqual([true, false, false, false, true, false])
    expect(order.map((bar) => bar.fill)).toEqual([false, false, false, true, false, true])
    expect(order[4]?.startTick).toBe(16 * TICKS_PER_BEAT)
  })
  it('is a chart of its bars in play order, a chord over a bar line struck again in the next', () => {
    const chart = sheetToChart(sheet)
    const bars = chart.sections.flatMap((s) => s.lines.flat())
    expect(bars).toHaveLength(6)
    expect(bars[5]?.chords.map((c) => `${chordSymbol(c)}:${c.beats}`)).toEqual(['G:4'])
    expect(chart.sections).toHaveLength(3)
  })
  it('fills a part-filled last bar with its last chord', () => {
    const chart = sheetToChart({ ...sheet, sections: [section('C G:2')] })
    const bars = chart.sections.flatMap((s) => s.lines.flat())
    expect(bars[1]?.chords.map((c) => c.beats)).toEqual([4])
  })
})

describe('the time signature changed', () => {
  it('re-lays a chord of whole bars as whole bars of the new time; the others keep their beats', () => {
    const sheet: ChordSheet = {
      key: C_MAJOR,
      meter: '4/4',
      sections: [section('C G Am:2 F:2')],
    }
    const relaid = relayMeter(sheet, '3/4')
    expect(relaid.meter).toBe('3/4')
    expect(relaid.sections[0] && written(relaid.sections[0])).toBe('C:3 G:3 Am:2 F:2')
  })
})

describe('transposed', () => {
  it('moves the key and every chord, spelled in the new key', () => {
    const sheet: ChordSheet = { key: C_MAJOR, meter: '4/4', sections: [section('C G/B Bb')] }
    const moved = transposeSheet(sheet, 2)
    expect(moved.key.tonic).toEqual(parseChordSymbol('D').root)
    expect(moved.sections[0] && written(moved.sections[0])).toBe('D:4 A/C#:4 C:4')
  })
})

describe('sections', () => {
  it('an empty sheet is one empty Verse; a section added is a Verse after the last, at most 12', () => {
    const sheet = emptySheet()
    expect(sheet.sections).toEqual([{ kind: 'verse', repeats: 1, variation: 1, chords: [] }])
    let many = sheet
    for (let i = 0; i < 20; i++) many = addSection(many)
    expect(many.sections).toHaveLength(12)
  })
})
