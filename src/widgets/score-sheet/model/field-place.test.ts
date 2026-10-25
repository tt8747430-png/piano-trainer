import { describe, expect, it } from 'vitest'
import { chordLabelWidth } from '@/shared/lib'
import type { Midi } from '@/shared/lib/music'
import { rowChords, xAtTick, type Lyric } from '@/shared/ui/score'
import {
  chordFieldBox,
  chordRowTick,
  fingeringFieldBox,
  lyricAt,
  lyricsFieldBox,
} from './field-place'

const layout = {
  width: 300,
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 100, notes: 40 },
    { startTick: 96, ticks: 96, x: 100, width: 200, notes: 110 },
  ],
  onsets: [
    { tick: 0, x: 40 },
    { tick: 96, x: 110 },
    { tick: 144, x: 200 },
  ],
}
const chords = [
  { startTick: 0, symbol: 'G' },
  { startTick: 96, symbol: 'Bb7' },
]

describe('the chord-symbol field’s place (ADR 0096)', () => {
  // The symbols as the labels' row prints them, at full size.
  const printed = rowChords(layout, chords, 1)
  // Every beat of the line, where a chord may start.
  const places = [0, 24, 48, 72, 96, 120, 144, 168]
  const xOf = (tick: number) => xAtTick(layout, tick)

  it('stands over the chord row on the symbol printed at the tick, as wide as it', () => {
    expect(chordFieldBox(layout, printed, 96, 44)).toEqual({
      left: 110,
      top: -44,
      width: chordLabelWidth('B♭7', 16),
      height: 44,
    })
  })

  it('stands at the beat where no symbol is printed', () => {
    expect(chordFieldBox(layout, printed, 144, 31)).toMatchObject({ left: 200, top: -31 })
  })

  it('takes a click on a symbol printed for its chord, anywhere along it', () => {
    // Its end is nearer beat 2's place than its own onset.
    const end = 110 + chordLabelWidth('B♭7', 16) - 1
    expect(chordRowTick(printed, places, end, xOf)).toBe(96)
  })

  it('takes a click on the empty row for the beat nearest it', () => {
    expect(chordRowTick(printed, places, 196, xOf)).toBe(144)
    expect(chordRowTick(printed, places, 160, xOf)).toBe(120)
  })
})

describe('the Lyrics field’s place (ADR 0096)', () => {
  const syllable = (tick: number, verse: number, left: number, top: number): Lyric => ({
    staff: 'melody',
    tick,
    verse,
    left,
    right: left + 24,
    top,
    bottom: top + 22,
  })
  const sung = {
    ...layout,
    staves: { melody: { top: 10, bottom: 50 }, treble: { top: 150, bottom: 190 } },
    heads: [
      {
        id: 'n-melody-96-0',
        staff: 'melody' as const,
        tick: 96,
        index: 0,
        left: 110,
        right: 122,
        top: 30,
        bottom: 40,
      },
    ],
    syllables: [syllable(0, 0, 32, 64), syllable(0, 1, 32, 86), syllable(96, 0, 104, 64)],
  }

  it('stands on the syllable printed under the note in the verse', () => {
    expect(lyricsFieldBox(sung, 'melody', 96, 0)).toEqual({
      left: 104,
      top: 64,
      width: 24,
      height: 22,
    })
  })

  it('stands under the note on its verse’s line where it sings nothing yet', () => {
    // Verse 2's line, where its first syllable stands; under the note's head.
    expect(lyricsFieldBox(sung, 'melody', 96, 1)).toMatchObject({ left: 110, top: 86, height: 22 })
    // A verse not begun on the line: a verse's height under the last one.
    expect(lyricsFieldBox(sung, 'melody', 96, 2)).toMatchObject({ top: 86 + 22 })
  })

  it('stands under the staff where no word is printed on the line', () => {
    const bare = { ...sung, syllables: [] }
    const box = lyricsFieldBox(bare, 'melody', 96, 0)
    expect(box.top).toBeGreaterThan(50)
    expect(box.top).toBeLessThan(150)
    expect(lyricsFieldBox(bare, 'melody', 96, 1).top).toBeGreaterThan(box.top)
  })

  it('finds the syllable a tap is on, by its note and verse', () => {
    expect(lyricAt(sung, { x: 40, y: 90 })).toMatchObject({ tick: 0, verse: 1 })
    expect(lyricAt(sung, { x: 110, y: 70 })).toMatchObject({ tick: 96, verse: 0 })
    expect(lyricAt(sung, { x: 80, y: 70 })).toBeNull()
  })
})

describe('the fingering field’s place (ADR 0096)', () => {
  const head = (index: number, top: number, midi: number) => ({
    id: `n-treble-0-${index}`,
    staff: 'treble' as const,
    tick: 0,
    index,
    left: 40,
    right: 52,
    top,
    bottom: top + 10,
    midi: midi as Midi,
  })
  const chord = {
    ...layout,
    staves: { treble: { top: 10, bottom: 50 } },
    heads: [head(0, 45, 60), head(1, 35, 64), head(2, 25, 67)],
    columns: [{ staff: 'treble' as const, tick: 0, left: 40, right: 53, top: -5, bottom: 55 }],
  }

  it('stands over the chord at the caret, its heads and stem', () => {
    expect(fingeringFieldBox(chord, 'treble', 0)).toEqual({
      left: 40,
      top: -5,
      width: 13,
      height: 60,
    })
  })

  it('stands over the one note of the chord chosen', () => {
    expect(fingeringFieldBox(chord, 'treble', 0, 64 as Midi)).toEqual({
      left: 40,
      top: 35,
      width: 12,
      height: 10,
    })
  })
})
