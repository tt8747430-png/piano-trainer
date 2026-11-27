import { describe, expect, it } from 'vitest'
import { C_MAJOR, parseChordSymbol, TICKS_PER_BEAT } from '@/shared/lib/music'
import { imitatedOrder, imitatedPlay, SECTION } from './arranger'
import { NO_MARKS, type ChordSheet, type SectionMarks, type SheetSection } from './chord-sheet'

const section = (line: string, marks: Partial<SectionMarks> = {}, repeats = 1): SheetSection => ({
  kind: 'verse',
  repeats,
  variation: 1,
  marks: { ...NO_MARKS, ...marks },
  bars: line
    .split(' ')
    .map((symbol) => ({ chords: [{ chord: parseChordSymbol(symbol), beats: 4 }] })),
})
const sheetOf = (...sections: SheetSection[]): ChordSheet => ({
  key: C_MAJOR,
  meter: '4/4',
  sections,
})

describe('the band standing in for an arranger', () => {
  it('plays each pass on its Main, a Fill-in into the next on the pass’s last bar', () => {
    const sheet = sheetOf(
      section('C G', { mains: ['A'], into: 'fill' }),
      section('F C', { mains: ['B'] }),
    )
    const { bars } = imitatedPlay(sheet)
    expect(bars.map((bar) => [bar.main, bar.fill, bar.lamp])).toEqual([
      ['A', false, SECTION.main.A],
      ['A', true, SECTION.fill.B],
      ['B', false, SECTION.main.B],
      // A section with no way set fills its last bar as the band always does.
      ['B', true, SECTION.main.B],
    ])
  })
  it('takes a Break and an Ending as the bars they fall on', () => {
    const sheet = sheetOf(
      section('C G', { mains: ['A'], into: 'break' }),
      section('F C', { mains: ['A'], ending: 2 }),
    )
    const { bars } = imitatedPlay(sheet)
    expect(bars.map((bar) => [bar.break, bar.ending, bar.lamp])).toEqual([
      [false, false, SECTION.main.A],
      [true, false, SECTION.break],
      [false, false, SECTION.main.A],
      [false, true, SECTION.ending[2]],
    ])
  })
  it('a section with no way set fills its last bar as the band always does', () => {
    const { bars } = imitatedPlay(sheetOf(section('C G', {}, 2)))
    expect(bars.map((bar) => bar.fill)).toEqual([false, false, false, true])
  })
  it('a Main pressed while it plays is heard from the bar it could still change', () => {
    const sheet = sheetOf(section('C G Am F', { mains: ['A'] }))
    const { bars } = imitatedPlay(
      sheet,
      [],
      [
        { bar: 2, section: SECTION.fill.C },
        { bar: 3, section: SECTION.ending[1] },
      ],
    )
    expect(bars.map((bar) => [bar.main, bar.fill, bar.ending])).toEqual([
      ['A', false, false],
      ['A', false, false],
      ['A', true, false],
      ['C', false, true],
    ])
  })
  it('starts on a Main and an Intro pressed before Start, the sheet’s own given way', () => {
    const sheet = sheetOf(section('C G', { mains: ['A'], intro: 1 }))
    const play = imitatedPlay(sheet, [SECTION.main.B, SECTION.intro[3]])
    expect(play.intro).toBe(3)
    expect(play.bars[0]?.main).toBe('B')
  })
  it('plays an Intro from the sheet’s last bars before its first, on the opening Main', () => {
    const sheet = sheetOf(section('C G Am F', { mains: ['A'], intro: 1 }))
    const order = imitatedOrder(sheet, imitatedPlay(sheet))
    expect(order.intro).toBe(2)
    expect(order.bars.map((bar) => [bar.bar, bar.repeat, bar.startTick / TICKS_PER_BEAT])).toEqual([
      [2, -1, 0],
      [3, -1, 4],
      [0, 0, 8],
      [1, 0, 12],
      [2, 0, 16],
      [3, 0, 20],
    ])
    expect(order.marks.slice(0, 2).map((bar) => [bar.main, bar.fill, bar.lamp])).toEqual([
      ['A', false, SECTION.intro[1]],
      ['A', true, SECTION.intro[1]],
    ])
  })
})
