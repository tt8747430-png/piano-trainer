import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

/** Opens the Tools sheet from the Player's bar. */
async function openTools(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Tools' }))
  return screen.findByRole('dialog', { name: 'Tools' })
}

describe('the Player’s Tools sheet (R29 B8)', () => {
  it('opens from the bar before the gear, its rows in groups', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const sheet = await openTools(user)
    for (const group of ['Quick tools', 'On the score', 'More'])
      expect(within(sheet).getByRole('region', { name: group })).toBeInTheDocument()
    for (const row of ['Metronome', 'Print', 'Audio and MIDI', 'Transpose', 'Display'])
      expect(within(sheet).getByRole('button', { name: new RegExp(`^${row}`) })).toBeInTheDocument()
  })

  it('opens the Player’s Settings at Display: one home', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(within(await openTools(user)).getByRole('button', { name: 'Display' }))
    const settings = await screen.findByRole('dialog', { name: 'Display' })
    expect(within(settings).getByRole('radiogroup', { name: 'Cursor' })).toBeInTheDocument()
  })

  it('opens the Version sheet from Change version', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(within(await openTools(user)).getByRole('button', { name: /^Change version/ }))
    expect(await screen.findByRole('dialog', { name: 'Choose your version' })).toBeInTheDocument()
  })

  it('opens Transpose’s popover', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(within(await openTools(user)).getByRole('button', { name: 'Transpose' }))
    expect(await screen.findByRole('button', { name: 'Down a semitone' })).toBeInTheDocument()
  })
})
