import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'
import { createMemoryStorage } from '@/shared/lib'

type User = ReturnType<typeof userEvent.setup>

/** The Player's foot bar (R31-P). */
const footBar = () => screen.findByRole('toolbar', { name: 'Practice tools' })

/** Opens the foot's More: its menu. */
async function openMore(user: User) {
  await user.click(within(await footBar()).getByRole('button', { name: 'More' }))
  return screen.findByRole('menu')
}

describe('the Player’s bar, foot and More (R31-P)', () => {
  it('has no Tools button: its bar holds Close, Edit, the keys, MIDI and the one gear', async () => {
    await renderApp('/play/bz5')
    expect(await screen.findByRole('button', { name: 'Player settings' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tools' })).not.toBeInTheDocument()
    expect(screen.queryByRole('toolbar', { name: 'Tools' })).not.toBeInTheDocument()
  })

  it('lists in its Settings what the Player does while you play, no acts of the music', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    const sheet = await screen.findByRole('dialog', { name: 'Player settings' })
    const group = within(sheet).getByRole('region', { name: 'While you play' })
    expect(
      within(group)
        .getAllByRole('button')
        .map((page) => page.textContent),
    ).toEqual(['Audio playback', 'Playback', 'On-screen piano', 'Display'])
    for (const name of ['This song', 'Share'])
      expect(within(sheet).queryByRole('region', { name })).not.toBeInTheDocument()
  })

  it('opens the Player’s Settings at Display: one home', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(await screen.findByRole('button', { name: 'Player settings' }))
    const sheet = await screen.findByRole('dialog', { name: 'Player settings' })
    await user.click(within(sheet).getByRole('button', { name: 'Display' }))
    const settings = await screen.findByRole('dialog', { name: 'Display' })
    expect(within(settings).getByRole('radiogroup', { name: 'Cursor' })).toBeInTheDocument()
  })

  it('opens the Version sheet from the foot’s Version', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(within(await footBar()).getByRole('button', { name: /^Version/ }))
    expect(await screen.findByRole('dialog', { name: 'Choose your version' })).toBeInTheDocument()
  })

  it('opens Transpose’s popover from the foot’s Transpose', async () => {
    const user = userEvent.setup()
    await renderApp('/play/bz5')
    await user.click(within(await footBar()).getByRole('button', { name: /^Transpose/ }))
    expect(await screen.findByRole('button', { name: 'Down a semitone' })).toBeInTheDocument()
  })

  it('annotates the place the cursor is in, typed, saved with the song (R29 B8, D7)', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/play/bz5')
    await user.click(within(await openMore(user)).getByRole('menuitem', { name: 'Annotations' }))
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
    const voice = within(await openMore(user)).getByRole('menuitemcheckbox', {
      name: 'Voice commands',
    })
    expect(voice).toHaveAttribute('aria-disabled', 'true')
    expect(voice).toHaveAccessibleDescription('Not available in this browser')
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

  it('remembers a tip put away: it shows on no later visit (R31-P)', async () => {
    const user = userEvent.setup()
    const storage = createMemoryStorage()
    const { settingsStore, unmount } = await renderApp('/play/bz5', { storage })
    await user.click(await screen.findByRole('button', { name: 'Hide the tip' }))
    expect(settingsStore.getState().tipsSeen).toContain('coach.listen')
    unmount()
    await renderApp('/play/bz5', { storage })
    expect(await screen.findByRole('button', { name: 'Play' })).toBeInTheDocument()
    expect(screen.queryByText('Tap Play to listen to the song.')).toBeNull()
  })

  it('retires Listen’s tip once Play is pressed (R31-P)', async () => {
    const user = userEvent.setup()
    const { settingsStore } = await renderApp('/play/bz5')
    await screen.findByText('Tap Play to listen to the song.')
    await user.click(screen.getByRole('button', { name: 'Play' }))
    await waitFor(() => expect(settingsStore.getState().tipsSeen).toContain('coach.listen'))
  })
})
