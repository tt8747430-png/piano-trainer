import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

describe('the piano’s settings in place (R33)', () => {
  it('opens from the rail’s ⚙ over the page, with what matters while playing', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/practice/chord-finder')
    await user.click(await screen.findByRole('button', { name: 'Piano settings' }))
    const sheet = await screen.findByRole('dialog', { name: 'Piano' })
    expect(router.state.location.pathname).toBe('/practice/chord-finder')
    for (const name of ['Key size', 'Note names', 'Pedals'])
      expect(within(sheet).getByRole('radiogroup', { name })).toBeInTheDocument()
    expect(within(sheet).getByRole('slider', { hidden: true })).toHaveAttribute(
      'aria-valuenow',
      '100',
    )
    // A phone has no letters to play: no computer keyboard's switch.
    expect(within(sheet).queryByRole('switch', { name: /computer keyboard/ })).toBeNull()
    await user.click(within(sheet).getByRole('link', { name: 'All piano settings' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/on-screen-piano'))
  })

  it('plays the keys as loud as its Volume, and shows all three pedals when chosen', async () => {
    const user = userEvent.setup()
    const { audio } = await renderApp('/practice/chord-finder')
    expect(audio.volume).toBe(1)
    await user.click(await screen.findByRole('button', { name: 'Piano settings' }))
    const sheet = await screen.findByRole('dialog', { name: 'Piano' })
    const volume = within(sheet).getByRole('slider', { hidden: true })
    act(() => volume.focus())
    fireEvent.keyDown(volume, { key: 'Home' })
    await waitFor(() => expect(audio.volume).toBe(0))
    await user.click(within(sheet).getByRole('radio', { name: 'All three' }))
    expect(screen.getByRole('button', { name: /^Soft pedal/, hidden: true })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Sostenuto pedal/, hidden: true }),
    ).toBeInTheDocument()
  })
})
