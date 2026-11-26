import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('Walk the chords, a run of its own (the run boards)', () => {
  it('opens on its Setup, titled by its scale; Start plays it, saying where it stands', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/walk?root=D&kind=dorian')
    const setup = await screen.findByRole('dialog', { name: 'Setup' })
    await user.click(within(setup).getByRole('button', { name: 'Start' }))
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Walk the chords in D Dorian' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Setup' })).not.toBeInTheDocument()
    expect(audio.played).toHaveLength(1)
    // Up the scale's seven chords to the tonic's octave and back.
    expect(screen.getByRole('meter', { name: 'Chord 1 of 15' })).toBeInTheDocument()
  })

  it('changes the root and the chord size in its Setup', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/walk?root=D&kind=dorian')
    const setup = await screen.findByRole('dialog', { name: 'Setup' })
    await user.click(within(setup).getByRole('radio', { name: '7ths' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ chordSize: 'sevenths' }),
    )
    const roots = within(setup).getByRole('radiogroup', { name: 'Root' })
    await user.click(within(roots).getByRole('radio', { name: 'E' }))
    await waitFor(() =>
      expect(router.state.location.search).toMatchObject({ root: 'E', kind: 'dorian' }),
    )
  })

  it('plays and stops from its floating Play, and opens its Setup again from Tempo', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/play/walk')
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Setup' })).getByRole('button', {
        name: 'Start',
      }),
    )
    const transport = screen.getByRole('toolbar', { name: 'Setup, play and tempo' })
    await user.click(within(transport).getByRole('button', { name: 'Stop' }))
    expect(audio.stops).toBeGreaterThan(0)
    await user.click(within(transport).getByRole('button', { name: 'Tempo' }))
    expect(await screen.findByRole('dialog', { name: 'Setup' })).toBeInTheDocument()
  })

  it('closes to the scale’s page when opened directly', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/play/walk?root=D&kind=dorian')
    const setup = await screen.findByRole('dialog', { name: 'Setup' })
    await user.click(within(setup).getByRole('button', { name: 'Close' }))
    await user.click(within(screen.getByRole('banner')).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/practice/scales'))
    expect(router.state.location.search).toMatchObject({ root: 'D', kind: 'dorian' })
  })
})
