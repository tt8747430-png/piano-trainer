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

const labelsOf = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-slot="bar-label"]')].map((label) => label.textContent)

describe('SheetLabels', () => {
  it('prints a section’s name at its first bar beside the line’s number, a tempo after them (ADR 0095)', () => {
    const { container } = render(
      <SheetLabels
        layout={layout}
        performance={TWO_BARS}
        headings={['Verse 1']}
        positions={false}
        tempos={[84]}
      />,
    )
    expect(labelsOf(container)).toEqual(['1 · Verse 1 · \u{1D15F}= 84'])
  })

  it('numbers a line’s first bar only, as LilyPond numbers a system’s start (each bar still tapped)', () => {
    // The piece's bars 5 and 6, a line of a score laid out in lines.
    const sixBars = { ...TWO_BARS, bars: [0, 1, 2].flatMap(() => TWO_BARS.bars) }
    const { container } = render(
      <SheetLabels
        layout={layout}
        performance={sixBars}
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

  it('says how the right hand plays each chord after its name, with Chord positions', () => {
    render(<SheetLabels layout={layout} performance={TWO_BARS} headings={[]} positions />)
    // Each chord's inversion as the right hand voices it, after its name, smaller.
    const named = screen.getAllByText(/^(Root|1st|2nd)$/)
    expect(named).toHaveLength(2)
    expect(named[0]).toHaveClass('text-muted-foreground')
  })
})
