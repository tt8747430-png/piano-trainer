import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ScoreLayout } from './layout'
import { LabelRow } from './LabelRow'

/** Three narrow bars of 4/4, 60px each. */
const layout: ScoreLayout = {
  width: 180,
  height: 210,
  staffTop: 40,
  staffBottom: 170,
  staves: { treble: { top: 40, bottom: 80 }, bass: { top: 130, bottom: 170 } },
  measures: [
    { startTick: 0, ticks: 96, x: 0, width: 60, notes: 30 },
    { startTick: 96, ticks: 96, x: 60, width: 60, notes: 70 },
    { startTick: 192, ticks: 96, x: 120, width: 60, notes: 130 },
  ],
  onsets: [
    { tick: 0, x: 30 },
    { tick: 96, x: 70 },
    { tick: 192, x: 130 },
  ],
}

const HEADINGS = ['Verse 1', 'Chorus']

/** Each bar's label element, by its bar's place on the line. */
const labelsOf = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>('[data-slot="bar-label"]'),
]

describe('LabelRow', () => {
  it('prints a bar’s number, its section’s name and its tempo in that order at its start (ADR 0097)', () => {
    const { container } = render(
      <LabelRow
        layout={layout}
        labels={[{ number: 1, section: 0, tempo: 84 }, {}, { section: 1 }]}
        headings={HEADINGS}
        chords={[]}
        meter="4/4"
        row={20}
      />,
    )
    expect(labelsOf(container).map((label) => label.textContent)).toEqual([
      '1 · Verse 1 · \u{1D15F}= 84',
      'Chorus',
    ])
  })

  it('runs a label on to the next bar’s label, or the line’s end, and cuts it short there', () => {
    const { container } = render(
      <LabelRow
        layout={layout}
        labels={[{ number: 1, section: 0 }, {}, { section: 1 }]}
        headings={['A long section name', 'Chorus']}
        chords={[]}
        meter="4/4"
        row={20}
      />,
    )
    const [first, last] = labelsOf(container)
    expect(first).toHaveClass('truncate')
    // Over the second bar, which says nothing, to just before the third's label.
    expect(first).toHaveStyle({ left: '4px', maxWidth: '112px' })
    expect(last).toHaveStyle({ left: '124px', maxWidth: '52px' })
  })

  it('prints the chord symbols at their onsets, sharps and flats as signs, a detail after one', () => {
    render(
      <LabelRow
        layout={layout}
        labels={[{ number: 1 }, {}, {}]}
        headings={[]}
        chords={[
          { startTick: 0, symbol: 'F#m/Bb' },
          { startTick: 96, symbol: 'C', detail: 'root position' },
        ]}
        meter="4/4"
        row={44}
      />,
    )
    expect(screen.getByText('F♯m/B♭')).toBeInTheDocument()
    expect(screen.getByText('root position')).toHaveClass('text-muted-foreground')
  })

  it('leaves out a chord outside the line, and says a compound meter’s tempo by its dotted quarter', () => {
    const { container } = render(
      <LabelRow
        layout={layout}
        labels={[{ number: 1, tempo: 58 }, {}, {}]}
        headings={[]}
        chords={[{ startTick: 288, symbol: 'G' }]}
        meter="6/8"
        row={44}
      />,
    )
    expect(screen.queryByText('G')).not.toBeInTheDocument()
    expect(container).toHaveTextContent('\u{1D15F}\u{1D16D}= 58')
  })

  it('prints a section’s name and a tempo as a sheet that edits them prints them: its own buttons', () => {
    render(
      <LabelRow
        layout={layout}
        labels={[{ number: 1, section: 0, tempo: 84 }, {}, { section: 1 }]}
        headings={HEADINGS}
        chords={[]}
        meter="4/4"
        row={20}
        printed={(part, content) => (
          <button type="button" aria-label={part.kind === 'tempo' ? 'Tempo' : part.name}>
            {content}
          </button>
        )}
      />,
    )
    expect(screen.getByRole('button', { name: 'Verse 1' })).toHaveTextContent('Verse 1')
    expect(screen.getByRole('button', { name: 'Chorus' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tempo' })).toHaveTextContent('\u{1D15F}= 84')
    // The number is a bar's, which the bar's own button says.
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('draws its labels at the line’s size, the row as tall as it is given', () => {
    const { container } = render(
      <LabelRow
        layout={layout}
        labels={[{ number: 1 }, {}, {}]}
        headings={[]}
        chords={[]}
        meter="4/4"
        row={31}
        size={0.5}
      />,
    )
    expect(container.querySelector('[data-slot="line-labels"]')).toHaveStyle({ height: '31px' })
    expect(labelsOf(container)[0]).toHaveStyle({ fontSize: '0.375rem' })
  })
})
