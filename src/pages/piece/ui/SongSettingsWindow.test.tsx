import { screen, waitFor, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from '@/app/testing/render-app'

/** A song's Settings, opened from its More: a window over its page, the address the song's. */
async function openSettings(user: UserEvent): Promise<HTMLElement> {
  await user.click(await screen.findByRole('button', { name: 'More' }))
  await user.click(await screen.findByRole('menuitem', { name: 'Settings' }))
  return screen.findByRole('dialog', { name: 'Settings' })
}

describe('a song’s Settings (R29 B9)', () => {
  it('opens over the song’s page, the address staying the song’s', async () => {
    const user = userEvent.setup()
    const { router } = await renderApp('/songs/bz5')
    const settings = await openSettings(user)
    expect(within(settings).getByText('Still, my soul, be still')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/songs/bz5')
  })

  it('has no Reset progress: a song’s progress is its Learned, in its page’s bar (R31-S)', async () => {
    const user = userEvent.setup()
    await renderApp('/songs/bz5')
    const settings = await openSettings(user)
    expect(within(settings).queryByRole('button', { name: /^Reset progress/ })).toBeNull()
  })
})

describe('Duplicate (R29 B9)', () => {
  it('makes a copy of the song the learner’s own at once, and Undo in its toast takes it away', async () => {
    const user = userEvent.setup()
    const { piecesStore } = await renderApp('/songs/bz5')
    const before = piecesStore.getState().songs.length
    const settings = await openSettings(user)
    await user.click(within(settings).getByRole('button', { name: 'Duplicate' }))
    await waitFor(() => expect(piecesStore.getState().songs).toHaveLength(before + 1))
    expect(piecesStore.getState().songs.at(-1)?.title).toBe('Still, my soul, be still (copy)')
    await screen.findByText('Still, my soul, be still (copy) added to your songs')
    await user.click(screen.getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(piecesStore.getState().songs).toHaveLength(before))
  })
})
