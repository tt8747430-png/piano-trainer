import { describe, expect, it } from 'vitest'
import { chordLabelWidth } from '@/shared/lib'
import { xAtTick } from '@/shared/ui/score'
import { chordFieldBox, chordRowTick, printedChords } from './field-place'

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

describe('the chord symbols printed over a line', () => {
  it('stands each at its chord’s onset, printed as a lead sheet prints it, with its width', () => {
    expect(printedChords(layout, chords, 16)).toEqual([
      { tick: 0, symbol: 'G', x: 40, size: 16, width: chordLabelWidth('G', 16) },
      { tick: 96, symbol: 'B♭7', x: 110, size: 16, width: chordLabelWidth('B♭7', 16) },
    ])
  })
})

describe('the chord-symbol field’s place (ADR 0096)', () => {
  const printed = printedChords(layout, chords, 16)
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
