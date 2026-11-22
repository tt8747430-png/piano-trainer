import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Practice → Circle of fifths (R29 B11)', () => {
  it('a sector shows its key and its signature, and Play the chords walks its chords', async () => {
    const user = userEvent.setup()
    const { audio, router } = await renderApp('/practice/circle-of-fifths')
    await screen.findByRole('heading', { level: 1, name: 'Circle of fifths' })
    // C major until a key is tapped.
    expect(screen.getByRole('heading', { level: 2, name: 'C major' })).toBeInTheDocument()
    expect(screen.getByText('No sharps or flats')).toBeInTheDocument()
    const wheel = screen.getByRole('group', { name: /^Circle of fifths/ })
    await user.click(within(wheel).getByRole('button', { name: 'D major' }))
    expect(screen.getByRole('heading', { level: 2, name: 'D major' })).toBeInTheDocument()
    expect(screen.getByText('2 sharps')).toBeInTheDocument()
    expect(within(wheel).getByRole('button', { name: 'D major' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(router.state.location.search).toMatchObject({ key: 'D' })
    await user.click(screen.getByRole('button', { name: 'Play the chords' }))
    const keys = (audio.played.at(-1)?.sounds ?? []).flatMap((sound) =>
      sound.kind === 'note' ? [sound.midi] : [],
    )
    // D major's seven triads, D, Em, F♯m, G, A, Bm, C♯°, from D3 up.
    expect(keys.slice(0, 3)).toEqual([50, 54, 57])
    expect(keys).toHaveLength(21)
  })

  it('goes to the relative minor in one tap, and opens the key in Scales and keys', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/circle-of-fifths?key=D')
    await screen.findByRole('heading', { level: 1, name: 'Circle of fifths' })
    await user.click(screen.getByRole('button', { name: 'B minor' }))
    expect(screen.getByRole('heading', { level: 2, name: 'B minor' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: 'Open in Scales and keys' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Scales and keys' }),
    ).toBeInTheDocument()
    expect(router.state.location.search).toMatchObject({ root: 'B', kind: 'natural' })
  })
})
