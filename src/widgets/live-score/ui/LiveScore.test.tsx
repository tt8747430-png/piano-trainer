import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithSettings } from '@/app/testing/render-with-settings'
import { keyParam, midi, note } from '@/shared/lib/music'
import { LiveScore } from './LiveScore'

const C_MAJOR = keyParam({ tonic: note('C'), minor: false })
const chords = (...keys: number[][]) => keys.map((each) => each.map(midi))

describe('LiveScore', () => {
  it('names each chord played in order for a screen reader, and says the newest', () => {
    renderWithSettings(<LiveScore chords={chords([60, 64, 67], [62, 65, 69])} keyParam={C_MAJOR} />)
    const names = screen.getByRole('list', { name: 'Live score' })
    expect(
      within(names)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['C Major triad', 'Dm Minor triad'])
    expect(screen.getByRole('status')).toHaveTextContent('Dm')
  })

  it('says the tones a chord leaves out', () => {
    renderWithSettings(<LiveScore chords={chords([60, 64, 70])} keyParam={C_MAJOR} />)
    expect(screen.getByRole('status')).toHaveTextContent('No 5th')
  })

  it('names two notes by their interval, and one by its note', () => {
    renderWithSettings(<LiveScore chords={chords([60, 67], [66])} keyParam={C_MAJOR} />)
    const names = screen.getByRole('list', { name: 'Live score' })
    expect(
      within(names)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Perfect fifth', 'G♭'])
  })

  it('says where the music is written before anything is played', () => {
    renderWithSettings(<LiveScore chords={[]} keyParam={C_MAJOR} />)
    expect(screen.getByText('Play, and it is written here.')).toBeInTheDocument()
  })

  it('engraves the chords on a grand staff', async () => {
    const { container } = renderWithSettings(
      <LiveScore chords={chords([48, 64, 67])} keyParam={C_MAJOR} />,
    )
    await waitFor(() =>
      expect(container.querySelector('[data-slot="score"] svg')).toBeInTheDocument(),
    )
  })
})
