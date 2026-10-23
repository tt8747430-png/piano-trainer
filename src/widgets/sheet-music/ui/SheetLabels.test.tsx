import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TWO_BARS } from '@/features/practice/testing/performances'
import type { ScoreLayout } from '@/shared/ui/score'
import { SheetLabels } from './SheetLabels'

/** Two narrow bars, 60px each. */
const layout: ScoreLayout = {
  width: 120,
  height: 210,
  staffTop: 40,
  staffBottom: 170,
  staves: { treble: { top: 40, bottom: 80 }, bass: { top: 130, bottom: 170 } },
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 60, notes: 30 },
    { startTick: 96, ticks: 96, x: 60, width: 60, notes: 70 },
  ],
  onsets: [
    { tick: 0, x: 30 },
    { tick: 96, x: 70 },
  ],
}

describe('SheetLabels', () => {
  it('keeps a bar’s number and section name to its own bar, cut short where it is longer', () => {
    render(
      <SheetLabels
        layout={layout}
        performance={TWO_BARS}
        headings={['A long section name']}
        positions={false}
      />,
    )
    const label = screen.getByText('1 · A long section name')
    expect(label).toHaveClass('truncate')
    // The bar's width less the number's inset on either side: clear of the next bar's number.
    expect(label).toHaveStyle({ left: '4px', maxWidth: '52px' })
  })

  it('numbers a line’s first bar only, as LilyPond numbers a system’s start (each bar still tapped)', () => {
    const { container } = render(
      <SheetLabels
        layout={layout}
        performance={TWO_BARS}
        headings={[]}
        positions={false}
        chordNames={false}
        firstBar={4}
        tempos={[undefined, undefined, undefined, undefined, undefined, 72]}
      />,
    )
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.queryByText('6')).not.toBeInTheDocument()
    // A tempo on a later bar of the line is still said there, without the bar's number.
    expect(container).toHaveTextContent(/^5\u{1D15F}= 72$/u)
  })

  it('prints a chord name’s sharps and flats as signs, and a 6/8 tempo by its dotted quarter', () => {
    const { container } = render(
      <SheetLabels
        layout={layout}
        performance={{
          ...TWO_BARS,
          meter: '6/8',
          chords: [{ ...TWO_BARS.chords[0]!, startTick: 0, symbol: 'F#m/Bb' }],
        }}
        headings={[]}
        positions={false}
        tempos={[58]}
      />,
    )
    expect(screen.getByText('F♯m/B♭')).toBeInTheDocument()
    expect(container).toHaveTextContent('\u{1D15F}\u{1D16D}= 58')
  })
})
