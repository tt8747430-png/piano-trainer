import { describe, expect, it } from 'vitest'
import { chordLabelWidth } from '@/shared/lib'
import { rowChords } from './row-chords'

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

describe('the chord symbols the labels’ row prints over a line', () => {
  it('stands each at its chord’s onset, printed as a lead sheet prints it, with the width it takes', () => {
    expect(
      rowChords(
        layout,
        [
          { startTick: 0, symbol: 'G' },
          { startTick: 96, symbol: 'Bb7' },
        ],
        1,
      ),
    ).toEqual([
      { startTick: 0, symbol: 'G', x: 40, size: 16, width: chordLabelWidth('G', 16) },
      { startTick: 96, symbol: 'B♭7', x: 110, size: 16, width: chordLabelWidth('B♭7', 16) },
    ])
  })

  it('draws them at the line’s size, what follows a symbol taking its room too', () => {
    const [chord] = rowChords(layout, [{ startTick: 96, symbol: 'C', detail: 'root' }], 0.5)
    expect(chord).toMatchObject({ size: 8, width: chordLabelWidth('C root', 8) })
  })

  it('leaves out the chords outside the line’s bars', () => {
    expect(rowChords(layout, [{ startTick: 192, symbol: 'D' }], 1)).toEqual([])
  })
})
