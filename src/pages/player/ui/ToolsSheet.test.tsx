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
    for (const tool of ['Metronome', 'Recorder'])
      expect(within(sheet).getByRole('group', { name: tool })).toBeInTheDocument()
    for (const row of ['Tuner', 'Print', 'Audio and MIDI', 'Transpose', 'Display'])
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

  it('annotates the place the cursor is in, typed, saved with the song (R29 B8, D7)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/play/bz5')
    await user.click(within(await openTools(user)).getByRole('button', { name: 'Annotations' }))
    const bar = await screen.findByRole('toolbar', { name: 'Annotations' })
    await user.click(within(bar).getByRole('button', { name: 'Pause' }))
    await user.click(within(bar).getByRole('button', { name: 'Fingering' }))
    await user.click(await screen.findByRole('button', { name: '3' }))
    expect(piecesStore.getState().annotations.bz5).toEqual([
      { at: 0, staff: 'treble', kind: 'pause' },
      { at: 0, staff: 'treble', kind: 'fingering', value: 3 },
    ])
    await user.click(within(bar).getByRole('button', { name: 'Clear the marks here' }))
    expect(piecesStore.getState().annotations).toEqual({})
    await user.click(within(bar).getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('toolbar', { name: 'Annotations' })).toBeNull()
  })

  it('offers Voice commands only where the browser hears speech, saying so', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    const sheet = await openTools(user)
    const voice = within(sheet).getByRole('switch', { name: 'Voice commands' })
    expect(voice).toHaveAttribute('aria-disabled', 'true')
    expect(voice.closest('label')).toHaveAttribute('title', 'Not available in this browser')
  })

  it('coaches in one line until put away, the progress along the score’s head', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    expect(await screen.findByText('Tap Play to listen to the song.')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Progress' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    )
    await user.click(screen.getByRole('button', { name: 'Hide the tip' }))
    expect(screen.queryByText('Tap Play to listen to the song.')).toBeNull()
  })
})
