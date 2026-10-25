import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import type { DiagramChord } from '@/features/practice'
import { createFakeAudio } from '@/shared/api/audio'
import { createFakeMidi } from '@/shared/api/midi'
import { midi, note, pitchClass } from '@/shared/lib/music'
import { ServicesProvider } from '@/shared/lib/services'
import { ChordSummary } from './ChordSummary'

/** Two chords as their diagrams draw them: C#m7 and EMaj7, the right hand's keys over their roots. */
const CHORDS: readonly DiagramChord[] = [
  {
    chord: 0,
    symbol: 'C#m7',
    keys: [49, 59, 64, 68].map(midi),
    bass: true,
    notes: [note('C', 1), note('B'), note('E'), note('G', 1)],
    pitchClasses: [1, 4, 8, 11].map(pitchClass),
  },
  {
    chord: 1,
    symbol: 'EMaj7',
    keys: [52, 59, 63, 68].map(midi),
    bass: true,
    notes: [note('E'), note('B'), note('D', 1), note('G', 1)],
    pitchClasses: [4, 8, 11, 3].map(pitchClass),
  },
]

const renderSummary = (chords: readonly DiagramChord[]) =>
  renderWithSettings(
    <ServicesProvider services={{ audio: createFakeAudio(), midi: createFakeMidi() }}>
      <ChordSummary chords={chords} />
    </ServicesProvider>,
  )

describe('ChordSummary', () => {
  it('lists the chords in order, each its keys over its symbol', () => {
    renderSummary(CHORDS)
    const list = screen.getByRole('list', { name: 'Chords' })
    const chords = within(list).getAllByRole('button')
    expect(chords.map((chord) => chord.textContent)).toEqual(['C#m7', 'EMaj7'])
    expect(within(chords[1] as HTMLElement).getByRole('img')).toHaveAccessibleName('EMaj7: E B D# G#')
  })

  it('opens a chord’s sheet from its diagram, and closes it', async () => {
    const user = userEvent.setup()
    renderSummary(CHORDS)
    await user.click(screen.getByRole('button', { name: 'EMaj7: E B D# G#' }))
    const sheet = await screen.findByRole('dialog', { name: 'EMaj7 chord' })
    const [, close] = within(sheet).getAllByRole('button', { name: 'Close' })
    if (!close) throw new Error('a Close at the foot')
    await user.click(close)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows nothing for music of no chord symbol', () => {
    renderSummary([])
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
